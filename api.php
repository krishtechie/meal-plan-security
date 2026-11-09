<?php
// Person 1 & Person 2 Meal Planner – tiny JSON store. No database needed.
// GET  api.php?a=ping                -> {ok:true}
// GET  api.php?a=get&who=p1       -> stored JSON for that person (or {} if none)
// POST api.php?a=put&who=p1       -> body = JSON to store; returns {ok:true, rev:N}
// Every request needs header  X-App-Key: <password>
require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$key = $_SERVER['HTTP_X_APP_KEY'] ?? ($_GET['key'] ?? '');
$a = $_GET['a'] ?? '';
// Fix 2: rate limit failed logins per IP (5 tries, then 15 min lockout)
if (!is_dir(DATA_DIR)) { mkdir(DATA_DIR, 0755, true); }
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlFile = DATA_DIR . '/attempts.json';
$rl = file_exists($rlFile) ? (json_decode(file_get_contents($rlFile), true) ?: []) : [];
$now = time();
foreach ($rl as $k => $v) { if ($now - ($v['t'] ?? 0) > 900) unset($rl[$k]); }   
// forget entries older than 15 min
$fails = $rl[$ip]['n'] ?? 0;
if ($fails >= 5) {
  http_response_code(429);
  header('Retry-After: ' . max(1, 900 - ($now - $rl[$ip]['t'])));
  echo json_encode(['ok' => false, 'error' => 'too many attempts, try again in 15 minutes']); exit;
}

// Fix 1: compare against a bcrypt hash, never the plain password
$authed = ($key !== '') && password_verify($key, APP_PASSWORD_HASH);
if ($key !== '') {
  if ($authed) { unset($rl[$ip]); } else { $rl[$ip] = ['n' => $fails + 1, 't' => $now]; }
  file_put_contents($rlFile, json_encode($rl), LOCK_EX);
}
if ($a === 'ping') { echo json_encode(['ok' => true, 'auth' => $authed]); exit; }
if (!$authed) { http_response_code(401); echo json_encode(['ok' => false, 'error' => 'bad password']); exit; }

$who = preg_replace('/[^a-z0-9_-]/', '', strtolower($_GET['who'] ?? ''));
if ($who === '') { http_response_code(400); echo json_encode(['ok' => false, 'error' => 'who required']); exit; }
if (!is_dir(DATA_DIR)) { mkdir(DATA_DIR, 0755, true); }
$file = DATA_DIR . "/$who.json";

if ($a === 'get') {
  if (!file_exists($file)) { echo json_encode(['ok' => true, 'rev' => 0, 'data' => null]); exit; }
  $raw = file_get_contents($file); $obj = json_decode($raw, true);
  echo json_encode(['ok' => true, 'rev' => $obj['rev'] ?? 0, 'data' => $obj['data'] ?? null]); exit;
}
if ($a === 'put') {
  $body = file_get_contents('php://input'); $in = json_decode($body, true);
  if (!is_array($in) || !isset($in['data'])) { http_response_code(400); echo json_encode(['ok' => false, 'error' => 'bad body']); exit; }
  if (strlen($body) > 2000000) { http_response_code(413); echo json_encode(['ok' => false, 'error' => 'too large']); exit; }
  $fp = fopen($file, 'c+'); flock($fp, LOCK_EX);
  $cur = stream_get_contents($fp); $curObj = $cur ? json_decode($cur, true) : null; $rev = ($curObj['rev'] ?? 0) + 1;
  $out = json_encode(['rev' => $rev, 'updated' => gmdate('c'), 'data' => $in['data']]);
  ftruncate($fp, 0); rewind($fp); fwrite($fp, $out); fflush($fp); flock($fp, LOCK_UN); fclose($fp);
  // keep a daily backup copy
  $bk = DATA_DIR . "/backup-$who-" . gmdate('Y-m-d') . '.json'; if (!file_exists($bk)) { copy($file, $bk); }
  echo json_encode(['ok' => true, 'rev' => $rev]); exit;
}
http_response_code(404); echo json_encode(['ok' => false, 'error' => 'unknown action']);
