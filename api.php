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
if ($a === 'ping') { echo json_encode(['ok' => true, 'auth' => hash_equals(APP_PASSWORD, $key)]); exit; }
if (!hash_equals(APP_PASSWORD, $key)) { http_response_code(401); echo json_encode(['ok' => false, 'error' => 'bad password']); exit; }

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
