<?php
// Person 1 & Person 2 Meal Planner – tiny JSON store. No database needed.
// GET  api.php?a=ping                -> {ok:true, auth:bool}
// GET  api.php?a=get&who=p1       -> stored JSON for that person
// POST api.php?a=put&who=p1       -> body = {data:{...}}; returns {ok:true, rev:N}
// Every request needs header  X-App-Key: <password>
require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (!is_dir(DATA_DIR)) { mkdir(DATA_DIR, 0755, true); }
$ip  = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua  = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 80);
$a   = $_GET['a'] ?? '';
$who = preg_replace('/[^a-z0-9_-]/', '', strtolower($_GET['who'] ?? ''));
$key = $_SERVER['HTTP_X_APP_KEY'] ?? ($_GET['key'] ?? '');

// Fix 4: audit log. One JSON line per request. Never logs passwords or data.
function audit(string $outcome, array $extra = []): void {
  global $ip, $ua, $a, $who;
  $line = ['ts' => gmdate('c'), 'ip' => $ip, 'action' => $a, 'who' => $who, 'outcome' => $outcome, 'ua' => $ua] + $extra;
  @file_put_contents(DATA_DIR . '/audit.log', json_encode($line) . "\n", FILE_APPEND | LOCK_EX);
}
function fail(int $code, string $outcome, string $msg): void {
  audit($outcome); http_response_code($code);
  echo json_encode(['ok' => false, 'error' => $msg]); exit;
}

// Fix 2: rate limit failed logins per IP (5 tries, then 15 min lockout)
$rlFile = DATA_DIR . '/attempts.json';
$rl = file_exists($rlFile) ? (json_decode(file_get_contents($rlFile), true) ?: []) : [];
$now = time();
foreach ($rl as $k => $v) { if ($now - ($v['t'] ?? 0) > 900) unset($rl[$k]); }
$fails = $rl[$ip]['n'] ?? 0;
if ($fails >= 5) {
  header('Retry-After: ' . max(1, 900 - ($now - $rl[$ip]['t'])));
  fail(429, 'locked', 'too many attempts, try again in 15 minutes');
}

// Fix 1: compare against a bcrypt hash, never the plain password
$authed = ($key !== '') && password_verify($key, APP_PASSWORD_HASH);
if ($key !== '') {
  if ($authed) { unset($rl[$ip]); } else { $rl[$ip] = ['n' => $fails + 1, 't' => $now]; }
  file_put_contents($rlFile, json_encode($rl), LOCK_EX);
}
if ($a === 'ping') { audit($authed ? 'ok' : ($key === '' ? 'no_key' : 'bad_password')); echo json_encode(['ok' => true, 'auth' => $authed]); exit; }
if (!$authed) { fail(401, $key === '' ? 'no_key' : 'bad_password', 'bad password'); }
if ($who === '') { fail(400, 'bad_request', 'who required'); }
$file = DATA_DIR . "/$who.json";

if ($a === 'get') {
  if (!file_exists($file)) { audit('ok', ['rev' => 0]); echo json_encode(['ok' => true, 'rev' => 0, 'data' => null]); exit; }
  $obj = json_decode(file_get_contents($file), true);
  audit('ok', ['rev' => $obj['rev'] ?? 0]);
  echo json_encode(['ok' => true, 'rev' => $obj['rev'] ?? 0, 'data' => $obj['data'] ?? null]); exit;
}
if ($a === 'put') {
  $body = file_get_contents('php://input');
  if (strlen($body) > 2000000) { fail(413, 'too_large', 'too large'); }
  $in = json_decode($body, true);
  if (!is_array($in) || !isset($in['data'])) { fail(400, 'bad_body', 'bad body'); }
  $fp = fopen($file, 'c+'); flock($fp, LOCK_EX);
  $cur = stream_get_contents($fp); $curObj = $cur ? json_decode($cur, true) : null; $rev = ($curObj['rev'] ?? 0) + 1;
  $out = json_encode(['rev' => $rev, 'updated' => gmdate('c'), 'data' => $in['data']]);
  ftruncate($fp, 0); rewind($fp); fwrite($fp, $out); fflush($fp); flock($fp, LOCK_UN); fclose($fp);
  $bk = DATA_DIR . "/backup-$who-" . gmdate('Y-m-d') . '.json'; if (!file_exists($bk)) { copy($file, $bk); }
  audit('ok', ['rev' => $rev, 'bytes' => strlen($body)]);
  echo json_encode(['ok' => true, 'rev' => $rev]); exit;
}
fail(404, 'unknown_action', 'unknown action');
