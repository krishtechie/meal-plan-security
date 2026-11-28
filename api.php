<?php
// Meal Planner API, v16 (accounts). JSON in, JSON out.
// Sign-up and sign-in are by e-mail + password. Every other request carries header X-App-Token: <session token>.
// Who you are acting for is ?who=<member id>; it must be a member of your own household.
// Data per person is still one JSON document (same shape as before), now in SQLite at DATA_DIR/app.db.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if (!file_exists(__DIR__ . '/config.php')) { http_response_code(503); echo json_encode(['ok' => false, 'error' => 'setup', 'hint' => 'open setup.php once']); exit; }
require __DIR__ . '/config.php';
require __DIR__ . '/db.php';
require __DIR__ . '/mail.php';
if (!is_dir(DATA_DIR)) { mkdir(DATA_DIR, 0700, true); }
if (!dbReady()) { http_response_code(503); echo json_encode(['ok' => false, 'error' => 'setup', 'hint' => 'open setup.php once to create the database']); exit; }

$ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua   = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 80);
$a    = $_GET['a'] ?? '';
$who  = (int)($_GET['who'] ?? 0);
$tok  = $_SERVER['HTTP_X_APP_TOKEN'] ?? '';
$now  = time();
$method = $_SERVER['REQUEST_METHOD'];
$ACTIONS = ['ping','member_move','join_info','join_accept','signup','login','logout','forgot','reset','verify','resend','sessions','revoke','get','put','rev','profile_put','household_put','invite','member_remove','audit','account_delete','codes','code_new','code_revoke','joincheck','photo','photo_put','photo_del','account_put','email_change','password_change','logout_all','security','households'];
$ADMINS = defined('ADMIN_EMAILS') && is_array(ADMIN_EMAILS) ? array_map('strtolower', ADMIN_EMAILS) : [];   // app admins: hand out sign-up invites, set in config.php only
if (!in_array($a, $ACTIONS, true)) { $a = 'unknown'; }
if (!preg_match('/^[a-f0-9]{64}$/', $tok)) { $tok = ''; }
$body = [];
if ($method === 'POST') { $raw = file_get_contents('php://input'); if (strlen($raw) > 1000000) { http_response_code(413); echo json_encode(['ok' => false, 'error' => 'too large']); exit; } $body = json_decode($raw, true, 12); if (!is_array($body)) $body = []; }
$user = null;   // the signed-in user row

// Fix 4: audit log. One JSON line per request. Never logs passwords, tokens or data.
function audit(string $outcome, array $extra = []): void {
  global $ip, $ua, $a, $who, $user;
  $line = ['ts' => gmdate('c'), 'ip' => $ip, 'user' => $user ? (int)$user['id'] : '', 'action' => $a, 'who' => $who ?: '', 'outcome' => $outcome, 'ua' => $ua] + $extra;
  @file_put_contents(DATA_DIR . '/audit.log', json_encode($line) . "\n", FILE_APPEND | LOCK_EX);
}
function fail(int $code, string $outcome, string $msg): void { audit($outcome); http_response_code($code); echo json_encode(['ok' => false, 'error' => $msg, 'code' => $outcome]); exit; }
function ok(array $o = []): void { echo json_encode(['ok' => true] + $o); exit; }
function needPost(): void { global $method; if ($method !== 'POST') fail(405, 'method', 'POST required'); }

// Fix 2: lockout. 5 failures per IP, 20 per account, 15 minutes. Stored in the attempts table.
q('DELETE FROM attempts WHERE t<?', [$now - 900]);
$emailIn = strtolower(trim((string)($body['email'] ?? '')));
if (strlen($emailIn) > 120 || ($emailIn !== '' && !filter_var($emailIn, FILTER_VALIDATE_EMAIL))) { $emailIn = ''; }
$ipKey = 'ip:' . $ip; $acKey = $emailIn !== '' ? 'acct:' . $emailIn : '';
$fails = fn($k) => $k === '' ? 0 : (int)(row('SELECT n FROM attempts WHERE key=?', [$k])['n'] ?? 0);
function bump(string $k): void { global $now; if ($k === '') return; q('INSERT INTO attempts(key,n,t) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET n=n+1, t=excluded.t', [$k, $now]); }
function clearAttempts(array $ks): void { foreach ($ks as $k) { if ($k !== '') q('DELETE FROM attempts WHERE key=?', [$k]); } }
// v16.5.7: a signed-in person re-entering their password (change e-mail or password, delete a member) gets its own counter:
// five wrong tries block those actions for 15 minutes but never lock the whole app or the IP, which the sign-in gate does.
function confirmPw(array $user, string $pw): void { global $fails; $k = 'pw:' . $user['id'];
  if ($fails($k) >= 5) { header('Retry-After: 900'); fail(429, 'pw_locked', 'Too many wrong passwords. Wait 15 minutes before trying this again.'); }
  if (!password_verify($pw, $user['pass_hash'])) { bump($k); $left = 5 - $fails($k); fail(403, 'bad_password', $left > 0 ? "Wrong password. $left " . ($left === 1 ? 'try' : 'tries') . ' left before a 15-minute wait.' : 'Wrong password. Wait 15 minutes before trying this again.'); }
  clearAttempts([$k]); }
if ($fails($ipKey) >= 5 || $fails($acKey) >= 20) { header('Retry-After: 900'); fail(429, 'locked', 'too many attempts, try again in 15 minutes'); }

// ---- sessions (fix 10) ----
q('DELETE FROM sessions WHERE last<? OR created<?', [$now - 30 * 86400, $now - 180 * 86400]);
$sess = null;
if ($tok !== '') {
  $sess = row('SELECT s.*, u.household_id FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?', [hash('sha256', $tok)]);
  if (!$sess) { bump($ipKey); }
  else { $user = row('SELECT * FROM users WHERE id=?', [$sess['user_id']]); if ($now - (int)$sess['last'] > 3600) { q('UPDATE sessions SET last=?, ip=? WHERE id=?', [$now, $ip, $sess['id']]); q('UPDATE users SET last_seen=? WHERE id=?', [$now, $user['id']]); } }
}
function newSession(int $uid): array { global $now, $ip, $ua; $t = bin2hex(random_bytes(32)); $id = substr(bin2hex(random_bytes(4)), 0, 8);
  q('INSERT INTO sessions(id,user_id,token_hash,created,last,ip,ua) VALUES(?,?,?,?,?,?,?)', [$id, $uid, hash('sha256', $t), $now, $now, $ip, $ua]);
  $n = (int)row('SELECT COUNT(*) c FROM sessions WHERE user_id=?', [$uid])['c']; if ($n > 20) { q('DELETE FROM sessions WHERE user_id=? AND id IN (SELECT id FROM sessions WHERE user_id=? ORDER BY last ASC LIMIT ?)', [$uid, $uid, $n - 20]); }
  return ['token' => $t, 'sid' => $id]; }
function meOut(array $u): array { global $ADMINS; $hh = row('SELECT * FROM households WHERE id=?', [$u['household_id']]); $me = userProfile($u); $me['admin'] = in_array(strtolower($u['email']), $ADMINS, true); return ['user' => $me, 'household' => ['id' => (int)$hh['id'], 'name' => $hh['name']], 'members' => members((int)$u['household_id'])]; }
function validPassword(string $p, string $email = ''): ?string { if (strlen($p) < 10) return 'Password must be at least 10 characters.'; if (strlen($p) > 200) return 'Password too long.';
  $l = strtolower($p); $common = ['password12','password123','1234567890','qwertyuiop','12345678910','passw0rd12','iloveyou12','welcome123','admin12345','letmein123','abcdefghij','1q2w3e4r5t','qwerty1234','password1234','mealplanner','krishdesigns'];
  if (in_array($l, $common, true) || preg_match('/^(.)\1{9,}$/', $l) || preg_match('/^(0123456789|1234567890|abcdefghij)/', $l)) return 'That password is too common. Pick something only you would think of.';
  $local = strtolower(strstr($email, '@', true) ?: ''); if (strlen($local) >= 4 && str_contains($l, $local)) return 'The password must not contain your e-mail name.';
  return null; }
function cleanName($n): string { $n = trim(strip_tags((string)$n)); return mb_substr($n, 0, 40); }

// ---- public actions ----
if ($a === 'ping') {
  audit($user ? 'ok' : ($tok === '' ? 'no_key' : 'bad_token'));
  if (!$user) ok(['auth' => false, 'signup' => !(defined('SIGNUP_CLOSED') && SIGNUP_CLOSED), 'invites' => true]);
  ok(['auth' => true] + meOut($user));
}
function codeRow(string $code) { if (!preg_match('/^[a-f0-9]{32}$/', $code)) return null; $r = row('SELECT * FROM signup_codes WHERE code_hash=?', [hash('sha256', $code)]); if (!$r || $r['revoked'] || $r['used_by'] || $r['expires'] < time()) return null; return $r; }
if ($a === 'joincheck') { $c = (string)($_GET['code'] ?? ''); $r = codeRow($c); if (!$r) bump($ipKey); audit($r ? 'ok' : 'bad_code'); ok(['valid' => (bool)$r, 'note' => $r ? $r['note'] : '']); }
if ($a === 'signup') {
  needPost();
  $closed = defined('SIGNUP_CLOSED') && SIGNUP_CLOSED; $code = (string)($body['code'] ?? ''); $cr = $code !== '' ? codeRow($code) : null;
  if ($closed && !$cr) { bump($ipKey); fail(403, 'closed', $code !== '' ? 'This invite link is no longer valid. Ask for a new one.' : 'Sign-up is by invitation on this server.'); }
  $name = cleanName($body['name'] ?? ''); $hhName = cleanName($body['household'] ?? '') ?: 'Home'; $pw = (string)($body['password'] ?? '');
  if ($emailIn === '') fail(422, 'rejected', 'Enter a valid e-mail address.');
  if ($name === '') fail(422, 'rejected', 'Enter your name.');
  if ($e = validPassword($pw, $emailIn)) fail(422, 'rejected', $e);
  if (row('SELECT id FROM users WHERE email=?', [$emailIn])) { bump($ipKey); fail(409, 'exists', 'That e-mail already has an account. Sign in or reset the password.'); }
  db()->beginTransaction();
  q('INSERT INTO households(name,created) VALUES(?,?)', [$hhName, $now]); $hh = (int)db()->lastInsertId();
  q('INSERT INTO users(household_id,email,pass_hash,name,role,verified,created,profile) VALUES(?,?,?,?,"owner",0,?,?)', [$hh, $emailIn, password_hash($pw, PASSWORD_BCRYPT), $name, $now, json_encode(defaultProfile())]);
  $uid = (int)db()->lastInsertId();
  if ($cr) { q('UPDATE signup_codes SET used_by=?, used_at=?, used_hh=? WHERE id=?', [$uid, $now, $hhName, $cr['id']]); }
  db()->commit();
  $user = row('SELECT * FROM users WHERE id=?', [$uid]);
  $vt = makeToken($uid, 'verify', 86400); $sent = mailVerify($emailIn, $name, $vt);
  $s = newSession($uid); audit('ok', ['sid' => $s['sid'], 'mail' => $sent ? 'sent' : 'failed']);
  ok($s + meOut($user) + ['mail' => $sent]);
}
if ($a === 'login') {
  needPost();
  $pw = (string)($body['password'] ?? '');
  $u = $emailIn !== '' ? row('SELECT * FROM users WHERE email=?', [$emailIn]) : null;
  $okp = $u && $u['pass_hash'] !== '' && password_verify($pw, $u['pass_hash']);
  if (!$okp) { bump($ipKey); bump($acKey); fail(401, 'bad_password', 'Wrong e-mail or password.'); }
  clearAttempts([$ipKey, $acKey]);
  if (password_needs_rehash($u['pass_hash'], PASSWORD_BCRYPT)) { q('UPDATE users SET pass_hash=? WHERE id=?', [password_hash($pw, PASSWORD_BCRYPT), $u['id']]); }
  $user = $u; $s = newSession((int)$u['id']); audit('ok', ['sid' => $s['sid']]);
  ok($s + meOut($u));
}
if ($a === 'forgot') {
  needPost();
  if ($emailIn === '') fail(422, 'rejected', 'Enter a valid e-mail address.');
  bump($ipKey);   // forgot counts toward the IP limit so it cannot be used to spam a mailbox
  $u = row('SELECT * FROM users WHERE email=?', [$emailIn]);
  if ($u) { $t = makeToken((int)$u['id'], 'reset', 3600); mailReset($emailIn, $u['name'], $t); }
  audit('ok', ['known' => $u ? 1 : 0]);
  ok(['sent' => true]);   // same answer whether or not the address exists
}
if ($a === 'reset') {   // also completes an invite: the token sets the first password
  needPost();
  $t = (string)($body['token'] ?? ''); $pw = (string)($body['password'] ?? '');
  $r = useToken($t, ['reset', 'invite']);
  if (!$r) { bump($ipKey); fail(400, 'bad_token', 'This link is no longer valid. Ask for a new one.'); }
  if ($e = validPassword($pw, (string)(row('SELECT email FROM users WHERE id=?', [$r['user_id']])['email'] ?? ''))) fail(422, 'rejected', $e);
  q('UPDATE users SET pass_hash=?, verified=1 WHERE id=?', [password_hash($pw, PASSWORD_BCRYPT), $r['user_id']]);
  q('DELETE FROM sessions WHERE user_id=?', [$r['user_id']]);   // every other device has to sign in again
  burnToken($t);
  $user = row('SELECT * FROM users WHERE id=?', [$r['user_id']]); clearAttempts(['acct:' . $user['email']]);
  $s = newSession((int)$user['id']); audit('ok', ['sid' => $s['sid'], 'kind' => $r['kind']]);
  ok($s + meOut($user));
}
if ($a === 'verify') {   // the app posts the token from the e-mail link
  $t = (string)($body['token'] ?? $_GET['t'] ?? ''); $r = useToken($t, ['verify']);
  if (!$r) { bump($ipKey); fail(400, 'bad_token', 'This confirmation link is no longer valid. Tap Resend confirmation in Settings.'); }
  $tu = row('SELECT * FROM users WHERE id=?', [$r['user_id']]);
  if ($r['kind'] === 'verify' && $tu && $tu['pending_email']) { if (row('SELECT id FROM users WHERE email=? AND id<>?', [$tu['pending_email'], $tu['id']])) { burnToken($t); fail(409, 'exists', 'That e-mail now belongs to another account.'); } q('UPDATE users SET email=?, pending_email=NULL, verified=1 WHERE id=?', [$tu['pending_email'], $tu['id']]); }
  else { q('UPDATE users SET verified=1 WHERE id=?', [$r['user_id']]); }
  burnToken($t); audit('ok');
  if ($user && (int)$user['id'] === (int)$r['user_id']) { $user = row('SELECT * FROM users WHERE id=?', [$user['id']]); ok(meOut($user)); }
  ok();
}

// ---- everything below needs a session ----
if (!$user) { fail(401, $tok === '' ? 'no_key' : 'bad_token', 'not signed in'); }
if ($a === 'unknown') { fail(404, 'unknown_action', 'unknown action'); }
$hhId = (int)$user['household_id']; $isOwner = $user['role'] === 'owner'; $isAdmin = in_array(strtolower($user['email']), $ADMINS, true);
if ($a === 'logout') { q('DELETE FROM sessions WHERE id=?', [$sess['id']]); audit('ok', ['sid' => $sess['id']]); ok(); }
if ($a === 'resend') { if ((int)$user['verified']) ok(['sent' => false]); bump($ipKey); $t = makeToken((int)$user['id'], 'verify', 86400); $sent = mailVerify($user['email'], $user['name'], $t); audit('ok'); ok(['sent' => $sent]); }
if ($a === 'account_put') { needPost(); $name = cleanName($body['name'] ?? ''); if ($name === '') fail(422, 'rejected', 'Enter your name.'); q('UPDATE users SET name=? WHERE id=?', [$name, $user['id']]); audit('ok'); ok(meOut(row('SELECT * FROM users WHERE id=?', [$user['id']]))); }
if ($a === 'email_change') {
  needPost(); $pw = (string)($body['password'] ?? '');
  confirmPw($user, $pw);
  if ($emailIn === '') fail(422, 'rejected', 'Enter a valid e-mail address.');
  if ($emailIn === strtolower($user['email'])) fail(422, 'rejected', 'That is already your e-mail.');
  if (row('SELECT id FROM users WHERE email=? OR pending_email=?', [$emailIn, $emailIn])) fail(409, 'exists', 'That e-mail is already in use.');
  q('UPDATE users SET pending_email=? WHERE id=?', [$emailIn, $user['id']]);
  $t = makeToken((int)$user['id'], 'verify', 86400); $sent = mailVerify($emailIn, $user['name'], $t);
  audit('ok', ['mail' => $sent ? 'sent' : 'failed']); ok(['sent' => $sent] + meOut(row('SELECT * FROM users WHERE id=?', [$user['id']])));
}
if ($a === 'password_change') {
  needPost(); $pw = (string)($body['password'] ?? ''); $new = (string)($body['newPassword'] ?? '');
  confirmPw($user, $pw);
  if ($e = validPassword($new, $user['email'])) fail(422, 'rejected', $e);
  q('UPDATE users SET pass_hash=? WHERE id=?', [password_hash($new, PASSWORD_BCRYPT), $user['id']]);
  q('DELETE FROM sessions WHERE user_id=? AND id<>?', [$user['id'], $sess['id']]);   // every other device signs in again
  audit('ok'); ok();
}
if ($a === 'logout_all') { needPost(); $n = q('DELETE FROM sessions WHERE user_id=? AND id<>?', [$user['id'], $sess['id']])->rowCount(); audit('ok', ['removed' => $n]); ok(['removed' => $n]); }
if ($a === 'photo') {   // GET ?who=: a member's photo, household only
  $t2 = $who ? row('SELECT photo, photo_v FROM users WHERE id=? AND household_id=?', [$who, $hhId]) : null;
  if (!$t2 || !$t2['photo']) { http_response_code(404); header('Content-Type: text/plain'); echo 'no photo'; exit; }
  header('Content-Type: image/jpeg'); header('Cache-Control: private, max-age=86400'); header('X-Content-Type-Options: nosniff'); echo $t2['photo']; exit;
}
if ($a === 'photo_put' || $a === 'photo_del') {
  needPost(); $tgt = $who ? row('SELECT * FROM users WHERE id=? AND household_id=?', [$who, $hhId]) : $user; if (!$tgt) fail(400, 'bad_request', 'who must be a member of your household');
  if (!$isOwner && (int)$tgt['id'] !== (int)$user['id']) fail(403, 'forbidden', 'You can only change your own photo.');
  if ($a === 'photo_del') { q('UPDATE users SET photo=NULL, photo_v=photo_v+1 WHERE id=?', [$tgt['id']]); audit('ok'); ok(meOut(row('SELECT * FROM users WHERE id=?', [$user['id']]))); }
  // The photo arrives as base64 in the JSON body (the phone already cropped and shrunk it), so no raw binary POST that a host firewall might block.
  $b64 = (string)($body['jpeg'] ?? ''); $bin = base64_decode(preg_replace('#^data:image/jpeg;base64,#', '', $b64), true); $len = $bin === false ? 0 : strlen($bin);
  if ($len < 200 || $len > 300000) fail(422, 'rejected', 'Photo must be a JPEG under 300 KB.');
  if (substr($bin, 0, 3) !== "\xFF\xD8\xFF" || substr($bin, -2) !== "\xFF\xD9") fail(422, 'rejected', 'Photo must be a JPEG.');
  if (function_exists('getimagesizefromstring')) { $info = @getimagesizefromstring($bin); if (!$info || $info[2] !== IMAGETYPE_JPEG || $info[0] > 1024 || $info[1] > 1024) fail(422, 'rejected', 'Photo must be a JPEG up to 1024 px.'); }
  $st = db()->prepare('UPDATE users SET photo=?, photo_v=photo_v+1 WHERE id=?'); $st->bindValue(1, $bin, PDO::PARAM_LOB); $st->bindValue(2, $tgt['id'], PDO::PARAM_INT); $st->execute();
  audit('ok', ['bytes' => $len]); ok(meOut(row('SELECT * FROM users WHERE id=?', [$user['id']])));
}
if ($a === 'security' || $a === 'households') {
  if (!$isAdmin) fail(403, 'forbidden', 'Admin only.');
  if ($a === 'households') {
    $list = []; foreach (rows('SELECT h.id, h.name, h.created, (SELECT COUNT(*) FROM users u WHERE u.household_id=h.id) AS n, (SELECT MAX(last_seen) FROM users u WHERE u.household_id=h.id) AS seen, (SELECT email FROM users u WHERE u.household_id=h.id AND u.role="owner" LIMIT 1) AS owner FROM households h ORDER BY h.created DESC LIMIT 200') as $h) { $list[] = ['id' => (int)$h['id'], 'name' => $h['name'], 'members' => (int)$h['n'], 'created' => (int)$h['created'], 'seen' => (int)$h['seen'], 'owner' => $h['owner']]; }
    audit('ok'); ok(['households' => $list, 'sessions' => (int)row('SELECT COUNT(*) c FROM sessions')['c']]);
  }
  // Security: counts and suspicious events from the audit log (never food data or passwords). Scans the last 2 MB.
  $lf = DATA_DIR . '/audit.log'; $events = []; $day = $now - 86400; $week = $now - 7 * 86400;
  $c = ['bad_password' => [0, 0], 'locked' => [0, 0], 'bad_token' => [0, 0], 'bad_code' => [0, 0], 'signup' => [0, 0], 'rejected' => [0, 0]]; $byIp = [];
  if (file_exists($lf)) { $size = filesize($lf); $fh = fopen($lf, 'r'); if ($size > 2000000) { fseek($fh, $size - 2000000); fgets($fh); }
    while (($l = fgets($fh)) !== false) { $j = json_decode($l, true); if (!is_array($j) || empty($j['ts'])) continue; $ts = strtotime($j['ts']); if ($ts < $week) continue;
      $o = $j['outcome'] ?? ''; $act = $j['action'] ?? ''; $key = $act === 'signup' && $o === 'ok' ? 'signup' : (isset($c[$o]) ? $o : '');
      if ($key !== '') { $c[$key][1]++; if ($ts >= $day) $c[$key][0]++; }
      if (in_array($o, ['bad_password', 'locked', 'bad_token', 'bad_code'], true)) { $ipk = $j['ip'] ?? '?'; $byIp[$ipk] = ($byIp[$ipk] ?? 0) + 1; if (count($events) < 400) $events[] = ['ts' => $j['ts'], 'ip' => $ipk, 'action' => $act, 'outcome' => $o, 'ua' => substr($j['ua'] ?? '', 0, 40)]; } }
    fclose($fh); }
  arsort($byIp); $events = array_slice(array_reverse($events), 0, 60);
  $bk = glob(DATA_DIR . '/backups/app-*.db.gz') ?: []; rsort($bk); $last = $bk ? filemtime($bk[0]) : 0;
  audit('ok'); ok(['backups' => ['count' => count($bk), 'last' => $last, 'bytes' => $bk ? filesize($bk[0]) : 0], 'counts' => $c, 'topIps' => array_slice($byIp, 0, 10, true), 'events' => $events, 'sessions' => (int)row('SELECT COUNT(*) c FROM sessions')['c'], 'users' => (int)row('SELECT COUNT(*) c FROM users')['c'], 'households' => (int)row('SELECT COUNT(*) c FROM households')['c']]);
}
if ($a === 'sessions') {
  $list = []; foreach (rows('SELECT s.*, u.name FROM sessions s JOIN users u ON u.id=s.user_id WHERE u.household_id=? ORDER BY s.last DESC', [$hhId]) as $v) {
    if (!$isOwner && (int)$v['user_id'] !== (int)$user['id']) continue;   // members see their own devices, the owner sees the household's
    $list[] = ['id' => $v['id'], 'user' => (int)$v['user_id'], 'name' => $v['name'], 'created' => (int)$v['created'], 'last' => (int)$v['last'], 'ip' => $v['ip'], 'ua' => $v['ua'], 'current' => $v['id'] === $sess['id']]; }
  audit('ok'); ok(['sessions' => $list]);
}
if ($a === 'revoke') {
  needPost(); $id = (string)($body['id'] ?? ''); if (!preg_match('/^[a-f0-9]{8}$/', $id)) fail(400, 'bad_request', 'bad id');
  $n = $isOwner ? q('DELETE FROM sessions WHERE id=? AND user_id IN (SELECT id FROM users WHERE household_id=?)', [$id, $hhId])->rowCount() : q('DELETE FROM sessions WHERE id=? AND user_id=?', [$id, $user['id']])->rowCount();
  audit('ok', ['sid' => $id, 'removed' => $n]); ok(['removed' => $n]);
}
if ($a === 'household_put') {
  needPost(); if (!$isOwner) fail(403, 'forbidden', 'Only the household owner can do that.');
  $n = cleanName($body['name'] ?? ''); if ($n === '') fail(422, 'rejected', 'Enter a household name.');
  q('UPDATE households SET name=? WHERE id=?', [$n, $hhId]); audit('ok'); ok(meOut($user));
}
if ($a === 'codes' || $a === 'code_new' || $a === 'code_revoke') {
  if (!$isAdmin) fail(403, 'forbidden', 'Admin only.');
  if ($a === 'code_new') { needPost(); $note = cleanName($body['note'] ?? ''); $days = max(1, min(60, (int)($body['days'] ?? 14)));
    $c = bin2hex(random_bytes(16)); $id = substr(bin2hex(random_bytes(4)), 0, 8);
    q('INSERT INTO signup_codes(id,code_hash,note,created_by,created,expires) VALUES(?,?,?,?,?,?)', [$id, hash('sha256', $c), $note, $user['id'], $now, $now + $days * 86400]);
    audit('ok', ['code' => $id]); $link = appUrl() . '#join=' . $c; }
  if ($a === 'code_revoke') { needPost(); $id = (string)($body['id'] ?? ''); if (!preg_match('/^[a-f0-9]{8}$/', $id)) fail(400, 'bad_request', 'bad id'); q('UPDATE signup_codes SET revoked=1 WHERE id=? AND used_by IS NULL', [$id]); audit('ok', ['code' => $id]); }
  $list = []; foreach (rows('SELECT c.*, u.name AS uname FROM signup_codes c LEFT JOIN users u ON u.id=c.used_by ORDER BY c.created DESC LIMIT 100') as $r) {
    $list[] = ['id' => $r['id'], 'note' => $r['note'], 'created' => (int)$r['created'], 'expires' => (int)$r['expires'], 'status' => $r['used_by'] ? 'used' : ($r['revoked'] ? 'revoked' : ($r['expires'] < $now ? 'expired' : 'pending')), 'usedBy' => $r['uname'] ?? '', 'usedHh' => $r['used_hh'] ?? '', 'usedAt' => (int)($r['used_at'] ?? 0)]; }
  if ($a !== 'codes') audit('ok');
  ok(['codes' => $list] + (isset($link) ? ['link' => $link, 'id' => $id] : []));
}
if ($a === 'invite') {
  needPost(); if (!$isOwner) fail(403, 'forbidden', 'Only the household owner can add members.');
  if (!(int)$user['verified']) fail(403, 'unverified', 'Confirm your own e-mail first (Settings).');
  $name = cleanName($body['name'] ?? ''); if ($emailIn === '') fail(422, 'rejected', 'Enter a valid e-mail address.'); if ($name === '') fail(422, 'rejected', 'Enter their name.');
  if ((int)row('SELECT COUNT(*) c FROM users WHERE household_id=?', [$hhId])['c'] >= 8) fail(422, 'rejected', 'A household can have up to 8 members.');
  $ex = row('SELECT * FROM users WHERE email=?', [$emailIn]);
  if ($ex && (int)$ex['household_id'] === $hhId && $ex['pass_hash'] !== '') fail(409, 'exists', 'They are already in this household.');
  if ($ex && (int)$ex['household_id'] !== $hhId) {   // v16.5: an existing account is asked to join, bringing their data; nothing changes until they accept
    if ($ex['pass_hash'] === '') fail(409, 'exists', 'That e-mail has a pending invite from another household.');
    $hh = row('SELECT name FROM households WHERE id=?', [$hhId]); $t = makeToken((int)$ex['id'], 'joinhh:' . $hhId, 7 * 86400); $sent = mailJoin($emailIn, $ex['name'], $user['name'], $hh['name'], $t);
    audit('ok', ['member' => (int)$ex['id'], 'join' => 'asked', 'mail' => $sent ? 'sent' : 'failed']); ok(['sent' => $sent, 'link' => appUrl() . '#joinhh=' . $t, 'existing' => true] + meOut($user));
  }
  if ($ex) { $uid = (int)$ex['id']; q('UPDATE users SET name=? WHERE id=?', [$name, $uid]); }   // re-invite: same row, new link
  else { q('INSERT INTO users(household_id,email,pass_hash,name,role,verified,created,profile) VALUES(?,?,"",?,"member",0,?,?)', [$hhId, $emailIn, $name, $now, json_encode(defaultProfile())]); $uid = (int)db()->lastInsertId(); }
  $hh = row('SELECT name FROM households WHERE id=?', [$hhId]);
  $t = makeToken($uid, 'invite', 7 * 86400); $sent = mailInvite($emailIn, $name, $user['name'], $hh['name'], $t);
  audit('ok', ['member' => $uid, 'mail' => $sent ? 'sent' : 'failed']); ok(['sent' => $sent, 'link' => appUrl() . '#invite=' . $t] + meOut($user));   // the owner may pass the link on directly (WhatsApp, iMessage) when e-mail does not arrive
}
if ($a === 'member_move') {   // v16.5: a member leaves to a household of their own; account, logs, weights, profile and photo all stay with them
  needPost(); if (!$isOwner) fail(403, 'forbidden', 'Only the household owner can do this.');
  $id = (int)($body['id'] ?? 0); $m = row('SELECT * FROM users WHERE id=? AND household_id=?', [$id, $hhId]); if (!$m || $id === (int)$user['id']) fail(422, 'rejected', 'Not a member of this household.');
  if ($m['pass_hash'] === '') fail(422, 'rejected', 'They have not set up their account yet; remove the invite instead.');
  q('INSERT INTO households(name,created) VALUES(?,?)', [$m['name'] . "'s household", $now]); $nh = (int)db()->lastInsertId();
  q('UPDATE users SET household_id=?, role="owner" WHERE id=?', [$nh, $id]); q('DELETE FROM tokens WHERE user_id=? AND kind LIKE "joinhh:%"', [$id]);
  $oh = row('SELECT name FROM households WHERE id=?', [$hhId]); $sent = mailMoved($m['email'], $m['name'], $user['name'], $oh['name']);
  audit('ok', ['member' => $id, 'moved_to' => $nh, 'mail' => $sent ? 'sent' : 'failed']); ok(meOut($user));
}
if ($a === 'join_info' || $a === 'join_accept') {   // v16.5: accept an invitation to join another household, keeping all data
  needPost(); $t = (string)($body['token'] ?? ''); $r = preg_match('/^[a-f0-9]{48}$/', $t) ? row('SELECT * FROM tokens WHERE token_hash=? AND kind LIKE "joinhh:%"', [hash('sha256', $t)]) : null;
  if (!$r || $r['expires'] < $now) { bump($ipKey); fail(400, 'bad_token', 'This invitation is no longer valid. Ask for a new one.'); }
  if ((int)$r['user_id'] !== (int)$user['id']) fail(403, 'forbidden', 'This invitation was sent to a different account. Sign in with the e-mail it was sent to.');
  $target = (int)substr($r['kind'], 7); $th = row('SELECT * FROM households WHERE id=?', [$target]); if (!$th) { burnToken($t); fail(400, 'bad_token', 'That household no longer exists.'); }
  $by = row('SELECT name FROM users WHERE household_id=? AND role="owner"', [$target]);
  if ($a === 'join_info') { audit('ok'); ok(['household' => $th['name'], 'by' => $by['name'] ?? '', 'same' => $target === $hhId]); }
  if ($target === $hhId) { burnToken($t); fail(422, 'rejected', 'You are already in this household.'); }
  $others = (int)row('SELECT COUNT(*) c FROM users WHERE household_id=? AND id<>?', [$hhId, $user['id']])['c'];
  if ($isOwner && $others > 0) fail(422, 'rejected', 'Your household still has other members. Move them out or remove them first.');
  if ((int)row('SELECT COUNT(*) c FROM users WHERE household_id=?', [$target])['c'] >= 8) fail(422, 'rejected', 'That household is full (8 people).');
  q('UPDATE users SET household_id=?, role="member" WHERE id=?', [$target, $user['id']]); if ($others === 0) q('DELETE FROM households WHERE id=?', [$hhId]);
  burnToken($t); $fresh = row('SELECT * FROM users WHERE id=?', [$user['id']]);
  audit('ok', ['joined' => $target, 'left' => $hhId]); ok(meOut($fresh));
}
if ($a === 'member_remove') {
  needPost(); if (!$isOwner) fail(403, 'forbidden', 'Only the household owner can remove members.');
  $id = (int)($body['id'] ?? 0); if ($id === (int)$user['id']) fail(422, 'rejected', 'The owner cannot remove themselves. Delete the account instead.');
  $m = row('SELECT pass_hash FROM users WHERE id=? AND household_id=?', [$id, $hhId]); if (!$m) fail(422, 'rejected', 'Not a member of this household.');
  if ($m['pass_hash'] !== '') { $pw = (string)($body['password'] ?? ''); if ($pw === '') fail(403, 'bad_password', 'Enter your own password to delete a member.'); confirmPw($user, $pw); }   // v16.5: deleting someone's data needs the owner's password (403, not 401: a wrong re-entered password must not end the session); cancelling an unused invite does not
  $n = q('DELETE FROM users WHERE id=? AND household_id=?', [$id, $hhId])->rowCount();   // cascades to docs, sessions, tokens
  audit('ok', ['member' => $id, 'removed' => $n]); ok(meOut($user));
}
if ($a === 'account_delete') {   // owner: whole household. member: just themselves.
  needPost(); $pw = (string)($body['password'] ?? '');
  confirmPw($user, $pw);
  if ($isOwner) q('DELETE FROM households WHERE id=?', [$hhId]); else q('DELETE FROM users WHERE id=?', [$user['id']]);
  audit('ok', ['household' => $isOwner ? $hhId : '']); ok();
}
if ($a === 'audit') {
  if (!$isOwner) fail(403, 'forbidden', 'Only the household owner can read the log.');
  $n = max(20, min(500, (int)($_GET['n'] ?? 300)));
  $lf = DATA_DIR . '/audit.log'; $lines = [];
  if (file_exists($lf)) {
    $fh = fopen($lf, 'r'); $pos = filesize($lf); $buf = ''; $chunk = 8192;
    while ($pos > 0 && substr_count($buf, "\n") <= $n * 3) { $rd = min($chunk, $pos); $pos -= $rd; fseek($fh, $pos); $buf = fread($fh, $rd) . $buf; }
    fclose($fh);
    $ids = array_map(fn($m) => $m['id'], members($hhId));
    foreach (array_filter(explode("\n", $buf)) as $l) { $j = json_decode($l, true); if (is_array($j) && ($j['user'] === '' || in_array((int)$j['user'], $ids, true))) { $lines[] = $j; } }   // only this household's lines (and anonymous attempts)
    $lines = array_slice($lines, -$n);
  }
  audit('ok'); ok(['you' => $ip, 'size' => file_exists($lf) ? filesize($lf) : 0, 'lines' => $lines]);
}

// ---- per-member actions: ?who= must be in my household; members may only write their own data, the owner anyone's ----
$target = $who ? row('SELECT * FROM users WHERE id=? AND household_id=?', [$who, $hhId]) : null;
if (!$target) fail(400, 'bad_request', 'who must be a member of your household');
$canWrite = $isOwner || (int)$target['id'] === (int)$user['id'];

function defaultProfile(): array { return ['kcal' => 1900, 'protein' => 150, 'floor' => 1700, 'fatMax' => 75, 'carbMax' => 230, 'maint' => 2500, 'pMin' => 130, 'kg' => 80, 'goal' => 75, 'steps' => 8000, 'restCut' => 100]; }
function validateProfile($p): ?string {
  if (!is_array($p)) return 'profile must be an object';
  $num = ['kcal' => [800, 6000], 'protein' => [30, 400], 'floor' => [600, 6000], 'fatMax' => [10, 300], 'carbMax' => [20, 800], 'maint' => [1000, 7000], 'pMin' => [20, 400], 'kg' => [20, 300], 'goal' => [20, 300], 'steps' => [0, 50000], 'restCut' => [0, 500], 'age' => [18, 110], 'height' => [100, 250], 'pace' => [0, 1], 'onboarded' => [0, 1], 'mealsPerDay' => [3, 6], 'wkDays' => [0, 7]];
  foreach ($p as $f => $v) {
    if ($f === 'name') { if (!is_string($v) || trim($v) === '' || mb_strlen($v) > 40) return 'bad name'; continue; }
    if ($f === 'notesTitle') { if (!is_string($v) || mb_strlen($v) > 60) return 'bad notes title'; continue; }
    if ($f === 'notes') { if (!is_array($v) || count($v) > 12) return 'too many notes'; foreach ($v as $n) { if (!is_string($n) || mb_strlen($n) > 200) return 'bad note'; } continue; }
    if ($f === 'vegDays') { if (!is_array($v) || count($v) > 7) return 'bad veg days'; foreach ($v as $d) { if (!is_int($d) || $d < 0 || $d > 6) return 'bad veg day'; } continue; }
    if ($f === 'sex') { if (!in_array($v, ['m', 'f', 'x'], true)) return 'bad sex'; continue; }
    if ($f === 'activity') { if (!in_array($v, ['desk', 'light', 'active', 'athlete'], true)) return 'bad activity'; continue; }
    if ($f === 'goalType') { if (!in_array($v, ['lose', 'maintain', 'gain'], true)) return 'bad goal'; continue; }
    if ($f === 'diet') { if (!in_array($v, ['veg', 'nonveg', 'eggs'], true)) return 'bad diet'; continue; }
    if ($f === 'cuisines') { if (!is_array($v) || count($v) > 6) return 'bad cuisines'; foreach ($v as $c) { if (!in_array($c, ['in', 'ca', 'med', 'ea', 'mx'], true)) return 'bad cuisine'; } continue; }
    if ($f === 'avoid') { if (!is_array($v) || count($v) > 10) return 'bad avoid'; foreach ($v as $c) { if (!in_array($c, ['beef', 'pork', 'seafood', 'eggs', 'dairy', 'nuts', 'gluten', 'soy'], true)) return 'bad avoid item'; } continue; }
    // v16.5 onboarding: diet rules, fasting days, meals a day, workouts, the reason behind the goal
    if ($f === 'rules') { if (!is_array($v) || count($v) > 6) return 'bad rules'; foreach ($v as $c) { if (!in_array($c, ['halal', 'jain', 'vegan', 'lowcarb', 'diabetic'], true)) return 'bad rule'; } continue; }
    if ($f === 'fastDays') { if (!is_array($v) || count($v) > 7) return 'bad fast days'; foreach ($v as $d) { if (!is_int($d) || $d < 0 || $d > 6) return 'bad fast day'; } continue; }
    if ($f === 'why') { if (!in_array($v, ['fat', 'muscle', 'health', 'event', 'habit'], true)) return 'bad why'; continue; }
    if ($f === 'wkType') { if (!in_array($v, ['gym', 'home', 'walk', 'yoga', 'sport', 'none'], true)) return 'bad workout'; continue; }
    if ($f === 'wkTime') { if (!in_array($v, ['am', 'pm'], true)) return 'bad workout time'; continue; }
    if ($f === 'level') { if (!in_array($v, ['new', 'some', 'regular'], true)) return 'bad level'; continue; }
    if ($f === 'equip') { if (!in_array($v, ['gym', 'dumbbells', 'bands', 'body'], true)) return 'bad equipment'; continue; }
    if ($f === 'meals') { if (!is_array($v) || count($v) > 12) return 'bad meals'; foreach ($v as $m) { if (!is_array($m) || !isset($m['name'], $m['time']) || !is_string($m['name']) || mb_strlen($m['name']) > 40 || !is_string($m['time']) || mb_strlen($m['time']) > 30) return 'bad meal'; foreach (['nv', 'v', 'vNoEgg'] as $l) { if (isset($m[$l])) { if (!is_array($m[$l]) || count($m[$l]) > 20) return 'bad meal list'; foreach ($m[$l] as $it) { $id = is_array($it) ? ($it[0] ?? '') : $it; if (!is_string($id) || !preg_match('/^[a-z0-9_]{1,40}$/', $id)) return 'bad meal item'; } } } } continue; }
    if (in_array($f, ['id', 'role', 'verified', 'email', 'hasPassword'], true)) continue;   // read-only echoes from the app
    if (isset($num[$f])) { if (!is_numeric($v) || $v < $num[$f][0] || $v > $num[$f][1]) return "$f out of range"; continue; }
    return "unknown profile field $f";
  }
  return null;
}
if ($a === 'profile_put') {
  needPost(); if (!$canWrite) fail(403, 'forbidden', 'You can only edit your own profile.');
  $p = $body['profile'] ?? null; $err = validateProfile($p); if ($err) { fail(422, 'rejected', $err); }
  $clean = []; $name = $target['name'];
  foreach ($p as $f => $v) {
    if (in_array($f, ['id', 'role', 'verified', 'email', 'hasPassword'], true)) continue;
    if ($f === 'name') { $name = cleanName($v); continue; }
    if ($f === 'notes') { $clean[$f] = array_values(array_map(fn($n) => trim(strip_tags($n)), $v)); }
    elseif ($f === 'meals') { $clean[$f] = array_values(array_map(fn($m) => ['name' => trim(strip_tags($m['name'])), 'time' => trim(strip_tags($m['time'])), 'nv' => array_values($m['nv'] ?? []), 'v' => array_values($m['v'] ?? []), 'vNoEgg' => array_values($m['vNoEgg'] ?? [])], $v)); }
    elseif (is_string($v)) { $clean[$f] = trim(strip_tags($v)); }
    elseif (in_array($f, ['vegDays', 'cuisines', 'avoid', 'rules', 'fastDays'], true)) { $clean[$f] = array_values(array_unique($v)); }
    else { $clean[$f] = +$v; }
  }
  if ($name === '') fail(422, 'rejected', 'name required');
  q('UPDATE users SET name=?, profile=? WHERE id=?', [$name, json_encode($clean, JSON_UNESCAPED_UNICODE), $target['id']]);
  audit('ok'); ok(meOut(row('SELECT * FROM users WHERE id=?', [$user['id']])));
}
$doc = row('SELECT rev, updated, data FROM docs WHERE user_id=?', [$target['id']]);
if ($a === 'rev') { ok(['rev' => (int)($doc['rev'] ?? 0), 'updated' => $doc['updated'] ?? null]); }
if ($a === 'get') { audit('ok', ['rev' => (int)($doc['rev'] ?? 0)]); echo '{"ok":true,"rev":' . (int)($doc['rev'] ?? 0) . ',"data":' . ($doc ? $doc['data'] : 'null') . '}'; exit; }   // stored JSON goes out untouched, so {} stays {}

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
  $allowed = ['days','log','weights','customs','wlog','vegDays','eggsVeg','seafood','allVeg','allNonVeg','manual','templates','vegPrev','gen','m3','m4','m5','m6','name','savedAt','favs','wsess'];   // wsess = finished workout sessions by date   // v17: favs = favourite food ids
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
  $ws = $d['wsess'] ?? []; if (!is_array($ws) || count($ws) > 2000) return 'too many sessions'; foreach ($ws as $k => $v) { if (!preg_match('/^\d{4}-\d\d-\d\d$/', (string)$k) || !is_array($v) || !isset($v['n']) || !is_string($v['n']) || mb_strlen($v['n']) > 60) return 'bad session'; }
  $fv = $d['favs'] ?? []; if (!is_array($fv) || count($fv) > 60) return 'too many favourites'; foreach ($fv as $f) { if (!is_string($f) || !preg_match('/^[a-z0-9_]{1,40}$/', $f)) return 'bad favourite'; }
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
  needPost(); if (!$canWrite) fail(403, 'forbidden', 'You can only change your own data.');
  if (!isset($body['data']) || !is_array($body['data'])) { fail(400, 'bad_body', 'bad body'); }
  $err = validateDoc($body['data']) ?: validateShape($body['data']);
  if ($err) { audit('rejected', ['why' => $err]); http_response_code(422); echo json_encode(['ok' => false, 'error' => 'rejected: ' . $err]); exit; }
  // PHP decodes an empty JSON object as an empty array and would write it back as []; keep maps as maps.
  foreach (['days', 'log', 'wlog', 'manual', 'wsess'] as $mapField) { if (isset($body['data'][$mapField]) && $body['data'][$mapField] === []) { $body['data'][$mapField] = new stdClass(); } }
  db()->beginTransaction();
  $cur = row('SELECT rev FROM docs WHERE user_id=?', [$target['id']]); $rev = (int)($cur['rev'] ?? 0) + 1; $upd = gmdate('c');
  q('INSERT INTO docs(user_id,rev,updated,by_user,data) VALUES(?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET rev=excluded.rev, updated=excluded.updated, by_user=excluded.by_user, data=excluded.data', [$target['id'], $rev, $upd, $user['id'], json_encode($body['data'], JSON_UNESCAPED_UNICODE)]);
  db()->commit();
  audit('ok', ['rev' => $rev]); ok(['rev' => $rev, 'updated' => $upd]);
}
fail(404, 'unknown_action', 'unknown action');
