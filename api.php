<?php
// Person 1 & Person 2 Meal Planner – tiny JSON store. No database needed.
// GET  api.php?a=ping                -> {ok:true, auth:bool, user:string}
// GET  api.php?a=get&who=p1       -> stored JSON for that person
// POST api.php?a=put&who=p1       -> body = {data:{...}}; returns {ok:true, rev:N}
// Every request needs headers  X-App-User: p1|p2   X-App-Key: <that person's password>
require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (!is_dir(DATA_DIR)) { mkdir(DATA_DIR, 0755, true); }

// Fix 7: one password per person. APP_USERS wins; APP_PASSWORD_HASH alone keeps the old shared password working.
$USERS = defined('APP_USERS') && is_array(APP_USERS) ? APP_USERS
       : ['p1' => APP_PASSWORD_HASH, 'p2' => APP_PASSWORD_HASH];

$ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua   = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 80);
$a    = $_GET['a'] ?? '';
$who  = strtolower($_GET['who'] ?? '');
$key  = $_SERVER['HTTP_X_APP_KEY'] ?? '';
$user = strtolower($_SERVER['HTTP_X_APP_USER'] ?? '');
if ($user === '' && $key !== '') { $user = 'p1'; }   // older client: shared password, treat as first account

// Fix 5: strict input validation. Only known actions and known accounts.
if (!in_array($a, ['ping', 'get', 'put', 'rev'], true)) { $a = 'unknown'; }
if ($who !== '' && !array_key_exists($who, $USERS)) { $who = 'invalid'; }
if ($user !== '' && !array_key_exists($user, $USERS)) { $user = 'invalid'; }
if (strlen($key) > 200) { $key = ''; }

// Fix 4: audit log. One JSON line per request. Never logs passwords or data.
function audit(string $outcome, array $extra = []): void {
  global $ip, $ua, $a, $who, $user;
  $line = ['ts' => gmdate('c'), 'ip' => $ip, 'user' => $user, 'action' => $a, 'who' => $who, 'outcome' => $outcome, 'ua' => $ua] + $extra;
  @file_put_contents(DATA_DIR . '/audit.log', json_encode($line) . "\n", FILE_APPEND | LOCK_EX);
}
function fail(int $code, string $outcome, string $msg): void {
  audit($outcome); http_response_code($code);
  echo json_encode(['ok' => false, 'error' => $msg]); exit;
}

// Fix 2 + 7: lockout per IP (5 tries) AND per account (20 tries across all IPs), 15 minutes.
$rlFile = DATA_DIR . '/attempts.json';
$rl = file_exists($rlFile) ? (json_decode(file_get_contents($rlFile), true) ?: []) : [];
$now = time();
foreach ($rl as $k => $v) { if ($now - ($v['t'] ?? 0) > 900) unset($rl[$k]); }
$ipKey = 'ip:' . $ip; $acKey = 'acct:' . $user;
$ipFails = $rl[$ipKey]['n'] ?? 0; $acFails = $rl[$acKey]['n'] ?? 0;
if ($ipFails >= 5 || ($user !== '' && $acFails >= 20)) {
  header('Retry-After: 900');
  fail(429, 'locked', 'too many attempts, try again in 15 minutes');
}

// Fix 1: compare against a bcrypt hash, never the plain password
$authed = ($key !== '') && $user !== '' && $user !== 'invalid' && password_verify($key, $USERS[$user]);
if ($key !== '') {
  if ($authed) { unset($rl[$ipKey], $rl[$acKey]); }
  else { $rl[$ipKey] = ['n' => $ipFails + 1, 't' => $now]; if ($user !== '') { $rl[$acKey] = ['n' => $acFails + 1, 't' => $now]; } }
  file_put_contents($rlFile, json_encode($rl), LOCK_EX);
}
if ($a === 'ping') { audit($authed ? 'ok' : ($key === '' ? 'no_key' : 'bad_password')); echo json_encode(['ok' => true, 'auth' => $authed, 'user' => $authed ? $user : null, 'users' => array_keys($USERS)]); exit; }
if (!$authed) { fail(401, $key === '' ? 'no_key' : 'bad_password', 'bad password'); }
if ($a === 'unknown') { fail(404, 'unknown_action', 'unknown action'); }
if ($who === '' || $who === 'invalid') { fail(400, 'bad_request', 'who required'); }
$file = DATA_DIR . "/$who.json";

if ($a === 'rev') {
  $obj = file_exists($file) ? json_decode(file_get_contents($file), true) : null;
  echo json_encode(['ok' => true, 'rev' => $obj['rev'] ?? 0, 'updated' => $obj['updated'] ?? null]); exit;
}
if ($a === 'get') {
  if (!file_exists($file)) { audit('ok', ['rev' => 0]); echo json_encode(['ok' => true, 'rev' => 0, 'data' => null]); exit; }
  $obj = json_decode(file_get_contents($file), true);
  audit('ok', ['rev' => $obj['rev'] ?? 0]);
  echo json_encode(['ok' => true, 'rev' => $obj['rev'] ?? 0, 'data' => $obj['data'] ?? null]); exit;
}

// Fix 5: validate the stored document before writing it. Shape, sizes, depth, value ranges.
function validateDoc($d, int $depth = 0): ?string {
  if ($depth > 7) return 'too deep';
  if (is_array($d)) {
    if (count($d) > 5000) return 'too many entries';
    foreach ($d as $k => $v) {
      if (is_string($k) && strlen($k) > 60) return 'key too long';
      $e = validateDoc($v, $depth + 1); if ($e) return $e;
    }
    return null;
  }
  if (is_string($d)) { return (strlen($d) > 400 || !mb_check_encoding($d, 'UTF-8')) ? 'string too long' : null; }
  if (is_int($d) || is_float($d)) { return (!is_finite($d) || abs($d) > 1e7) ? 'number out of range' : null; }
  if (is_bool($d) || is_null($d)) return null;
  return 'bad type';
}
function validateShape(array $d): ?string {
  $allowed = ['days','log','weights','customs','wlog','vegDays','eggsVeg','seafood','allVeg','allNonVeg','manual','m3','m4','m5','m6','name','savedAt'];
  foreach (array_keys($d) as $k) { if (!in_array($k, $allowed, true) && !preg_match('/^m\d{1,2}$/', (string)$k)) return "unknown field $k"; }
  foreach (($d['weights'] ?? []) as $w) {
    if (!is_array($w) || !isset($w['d'], $w['w'])) return 'bad weight entry';
    if (!preg_match('/^\d{4}-\d\d-\d\d$/', (string)$w['d'])) return 'bad weight date';
    if (!is_numeric($w['w']) || $w['w'] < 20 || $w['w'] > 300) return 'weight out of range';
  }
  foreach (($d['days'] ?? []) as $k => $plan) {
    if (!preg_match('/^\d{4}-\d\d-\d\d[vn][ex]$/', (string)$k)) return 'bad day key';
    if (!is_array($plan) || count($plan) > 12) return 'bad day';
    foreach ($plan as $m) {
      if (!is_array($m) || !isset($m['items']) || !is_array($m['items']) || count($m['items']) > 40) return 'bad meal';
      foreach ($m['items'] as $it) {
        if (!is_array($it) || !isset($it['id']) || !preg_match('/^[a-z0-9_]{1,40}$/', (string)$it['id'])) return 'bad item id';
        if (isset($it['q']) && (!is_numeric($it['q']) || $it['q'] < 0 || $it['q'] > 50)) return 'bad quantity';
      }
    }
  }
  foreach (($d['customs'] ?? []) as $c) {
    if (!is_array($c) || !isset($c['id'], $c['n'])) return 'bad custom food';
    foreach (['k','p','c','f'] as $f) { if (isset($c[$f]) && (!is_numeric($c[$f]) || $c[$f] < 0 || $c[$f] > 5000)) return 'bad custom macro'; }
  }
  if (isset($d['vegDays']) && (!is_array($d['vegDays']) || count($d['vegDays']) > 7)) return 'bad vegDays';
  return null;
}

if ($a === 'put') {
  $body = file_get_contents('php://input');
  if (strlen($body) > 1000000) { fail(413, 'too_large', 'too large'); }
  $in = json_decode($body, true, 12);
  if (!is_array($in) || !isset($in['data']) || !is_array($in['data'])) { fail(400, 'bad_body', 'bad body'); }
  $err = validateDoc($in['data']) ?: validateShape($in['data']);
  if ($err) { audit('rejected', ['why' => $err]); http_response_code(422); echo json_encode(['ok' => false, 'error' => 'rejected: ' . $err]); exit; }
  $fp = fopen($file, 'c+'); flock($fp, LOCK_EX);
  $cur = stream_get_contents($fp); $curObj = $cur ? json_decode($cur, true) : null; $rev = ($curObj['rev'] ?? 0) + 1;
  $out = json_encode(['rev' => $rev, 'updated' => gmdate('c'), 'by' => $user, 'data' => $in['data']]);
  ftruncate($fp, 0); rewind($fp); fwrite($fp, $out); fflush($fp); flock($fp, LOCK_UN); fclose($fp);
  $bk = DATA_DIR . "/backup-$who-" . gmdate('Y-m-d') . '.json'; if (!file_exists($bk)) { copy($file, $bk); }
  audit('ok', ['rev' => $rev, 'bytes' => strlen($body)]);
  echo json_encode(['ok' => true, 'rev' => $rev]); exit;
}
fail(404, 'unknown_action', 'unknown action');
