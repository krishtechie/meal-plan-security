<?php
// Meal Planner – tiny JSON store. No database needed.
// GET  api.php?a=ping                -> {ok:true, auth:bool, user:string}
// GET  api.php?a=get&who=p1          -> stored JSON for that person
// POST api.php?a=put&who=p1          -> body = {data:{...}}; returns {ok:true, rev:N}
// Every request needs header X-App-Key: <that person's password> (optionally X-App-User: p1|p2)
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if (!file_exists(__DIR__ . '/config.php')) { http_response_code(503); echo json_encode(['ok' => false, 'error' => 'setup', 'hint' => 'open setup.php once to create config.php']); exit; }
require __DIR__ . '/config.php';

if (!is_dir(DATA_DIR)) { mkdir(DATA_DIR, 0700, true); }
// Fix 6: data lives outside the web root. If DATA_DIR was moved, carry the old files over once (never the .htaccess).
$oldDir = __DIR__ . '/data';
if (is_dir($oldDir) && realpath($oldDir) !== realpath(DATA_DIR)) {
  foreach (glob($oldDir . '/*.{json,log}', GLOB_BRACE) as $f) { $b = basename($f); if (is_file($f) && !file_exists(DATA_DIR . "/$b")) { @rename($f, DATA_DIR . "/$b"); } }
}

// Fix 7: one password per person. Accounts are p1 and p2; names and targets live in config.php (APP_PROFILES), never in this repo.
$USERS = defined('APP_USERS') && is_array(APP_USERS) ? APP_USERS
       : ['p1' => APP_PASSWORD_HASH, 'p2' => APP_PASSWORD_HASH];
// Data files from older builds were named after the person; move them once (mapping is private, in config.php).
if (defined('APP_LEGACY_FILES') && is_array(APP_LEGACY_FILES)) {
  foreach (APP_LEGACY_FILES as $acct => $old) { $o = DATA_DIR . "/$old.json"; $n = DATA_DIR . "/$acct.json"; if (file_exists($o) && !file_exists($n)) { @rename($o, $n); } }
}

$ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua   = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 80);
$a    = $_GET['a'] ?? '';
$who  = strtolower($_GET['who'] ?? '');
$key  = $_SERVER['HTTP_X_APP_KEY'] ?? '';
$user = strtolower($_SERVER['HTTP_X_APP_USER'] ?? '');
// No user header: the password itself identifies the person (each account has its own hash).
if ($user === '' && $key !== '') { foreach ($USERS as $acct => $hash) { if (password_verify($key, $hash)) { $user = $acct; break; } } if ($user === '') { $user = 'invalid'; } }

// Fix 5: strict input validation. Only known actions and known accounts.
if (!in_array($a, ['ping', 'get', 'put', 'rev', 'audit', 'profiles_put'], true)) { $a = 'unknown'; }
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
if ($a === 'ping') {
  audit($authed ? 'ok' : ($key === '' ? 'no_key' : 'bad_password'));
  $shared = count(array_unique(array_values($USERS))) === 1;   // one password for both: the app asks who is signing in
  $out = ['ok' => true, 'auth' => $authed, 'user' => $authed ? $user : null, 'shared' => $shared];
  if ($authed) { $pr = loadProfiles(); if ($pr) { $out['profiles'] = $pr; } }   // names and targets only after sign-in
  echo json_encode($out); exit;
}
if (!$authed) { fail(401, $key === '' ? 'no_key' : 'bad_password', 'bad password'); }
if ($a === 'unknown') { fail(404, 'unknown_action', 'unknown action'); }
// v15: profiles (names, targets, notes) live in DATA_DIR/profiles.json and are editable in the app after sign-in.
// APP_PROFILES in config.php is only the starting point for installs that predate this.
function profilesFile() { return DATA_DIR . '/profiles.json'; }
function loadProfiles() {
  $f = profilesFile();
  if (file_exists($f)) { $j = json_decode(file_get_contents($f), true); if (is_array($j)) return $j; }
  if (defined('APP_PROFILES') && is_array(APP_PROFILES)) return APP_PROFILES;
  return null;
}
function validateProfiles($p) {
  if (!is_array($p)) return 'profiles must be an object';
  $num = ['kcal' => [800, 6000], 'protein' => [30, 400], 'floor' => [600, 6000], 'fatMax' => [10, 300], 'carbMax' => [20, 800], 'maint' => [1000, 7000], 'pMin' => [20, 400], 'kg' => [20, 300], 'goal' => [20, 300], 'steps' => [0, 50000], 'restCut' => [0, 500]];
  foreach (['p1', 'p2'] as $k) {
    if (!isset($p[$k]) || !is_array($p[$k])) return "missing $k";
    foreach ($p[$k] as $f => $v) {
      if ($f === 'name') { if (!is_string($v) || trim($v) === '' || mb_strlen($v) > 40) return "bad name for $k"; continue; }
      if ($f === 'notesTitle') { if (!is_string($v) || mb_strlen($v) > 60) return "bad notes title for $k"; continue; }
      if ($f === 'notes') { if (!is_array($v) || count($v) > 12) return "too many notes for $k"; foreach ($v as $n) { if (!is_string($n) || mb_strlen($n) > 200) return "bad note for $k"; } continue; }
      if ($f === 'vegDays') { if (!is_array($v) || count($v) > 7) return "bad veg days for $k"; foreach ($v as $d) { if (!is_int($d) || $d < 0 || $d > 6) return "bad veg day for $k"; } continue; }
      if ($f === 'sex') { if (!in_array($v, ['m', 'f', 'x'], true)) return "bad sex for $k"; continue; }
      if (isset($num[$f])) { if (!is_numeric($v) || $v < $num[$f][0] || $v > $num[$f][1]) return "$f out of range for $k"; continue; }
      return "unknown profile field $f";
    }
    if (!isset($p[$k]['name'])) return "name required for $k";
  }
  return null;
}
if ($a === 'profiles_put') {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'method', 'POST required');
  $body = json_decode(file_get_contents('php://input'), true);
  $p = $body['profiles'] ?? null;
  $err = validateProfiles($p);
  if ($err) { audit('rejected'); fail(422, 'rejected', $err); }
  $clean = [];
  foreach (['p1', 'p2'] as $k) { $clean[$k] = []; foreach ($p[$k] as $f => $v) { if ($f === 'notes') { $clean[$k][$f] = array_values(array_map(fn($n) => trim(strip_tags($n)), $v)); } elseif (is_string($v)) { $clean[$k][$f] = trim(strip_tags($v)); } elseif ($f === 'vegDays') { $clean[$k][$f] = array_values($v); } else { $clean[$k][$f] = +$v; } } }
  $tmp = profilesFile() . '.tmp'; file_put_contents($tmp, json_encode($clean, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX); rename($tmp, profilesFile());
  audit('ok');
  echo json_encode(['ok' => true, 'profiles' => $clean]); exit;
}
// Fix 4b: read the audit log through the API (signed in only). The file itself stays blocked from the web.
if ($a === 'audit') {
  $n = max(20, min(500, (int)($_GET['n'] ?? 300)));
  $lf = DATA_DIR . '/audit.log'; $lines = [];
  if (file_exists($lf)) {
    $fh = fopen($lf, 'r'); $pos = filesize($lf); $buf = ''; $chunk = 8192;   // read from the end, only as much as needed
    while ($pos > 0 && substr_count($buf, "\n") <= $n) { $rd = min($chunk, $pos); $pos -= $rd; fseek($fh, $pos); $buf = fread($fh, $rd) . $buf; }
    fclose($fh);
    foreach (array_slice(array_filter(explode("\n", $buf)), -$n) as $l) { $j = json_decode($l, true); if (is_array($j)) { unset($j['ua_full']); $lines[] = $j; } }
  }
  audit('ok');
  echo json_encode(['ok' => true, 'you' => $ip, 'size' => file_exists($lf) ? filesize($lf) : 0, 'lines' => $lines]); exit;
}
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
  $allowed = ['days','log','weights','customs','wlog','vegDays','eggsVeg','seafood','allVeg','allNonVeg','manual','templates','vegPrev','gen','m3','m4','m5','m6','name','savedAt'];
  foreach (array_keys($d) as $k) { if (!in_array($k, $allowed, true) && !preg_match('/^m\d{1,2}$/', (string)$k)) return "unknown field $k"; }
  foreach (($d['weights'] ?? []) as $w) {
    if (!is_array($w) || !isset($w['d'], $w['w'])) return 'bad weight entry';
    if (!preg_match('/^\d{4}-\d\d-\d\d$/', (string)$w['d'])) return 'bad weight date';
    if (!is_numeric($w['w']) || $w['w'] < 20 || $w['w'] > 300) return 'weight out of range';
  }
  foreach (($d['days'] ?? []) as $k => $plan) {
    if (!preg_match('/^\d{4}-\d\d-\d\d([vn][ex])?$/', (string)$k)) return 'bad day key';
    if (!is_array($plan) || count($plan) > 12) return 'bad day';
    foreach ($plan as $m) {
      if (!is_array($m) || !isset($m['items']) || !is_array($m['items']) || count($m['items']) > 40) return 'bad meal';
      foreach ($m['items'] as $it) {
        if (!is_array($it) || !isset($it['id']) || !preg_match('/^[a-z0-9_]{1,40}$/', (string)$it['id'])) return 'bad item id';
        if (isset($it['q']) && (!is_numeric($it['q']) || $it['q'] < 0 || $it['q'] > 50)) return 'bad quantity';
      }
    }
  }
  $tp = $d['templates'] ?? [];
  if (!is_array($tp) || count($tp) > 50) return 'too many templates';
  foreach ($tp as $t) {
    if (!is_array($t) || !isset($t['id'], $t['name'], $t['meal'], $t['items']) || !preg_match('/^[a-z0-9_]{1,40}$/', (string)$t['id'])) return 'bad template';
    if (!is_string($t['name']) || mb_strlen($t['name']) > 60 || !is_string($t['meal']) || mb_strlen($t['meal']) > 40) return 'bad template name';
    if (!is_array($t['items']) || count($t['items']) > 40) return 'bad template items';
    foreach ($t['items'] as $it) {
      if (!is_array($it) || !isset($it['id']) || !preg_match('/^[a-z0-9_]{1,40}$/', (string)$it['id'])) return 'bad template item';
      if (isset($it['q']) && (!is_numeric($it['q']) || $it['q'] < 0 || $it['q'] > 50)) return 'bad template quantity';
    }
  }
  if (isset($d['vegPrev'])) { if (!is_array($d['vegPrev']) || count($d['vegPrev']) > 7) return 'bad vegPrev'; foreach ($d['vegPrev'] as $v) { if (!is_int($v) || $v < 0 || $v > 6) return 'bad vegPrev'; } }
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
