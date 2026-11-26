<?php
// Meal Planner setup (v16). Two jobs, then it deletes itself:
//  1. Fresh install: no config.php yet. Creates config.php, the database and the first account (household owner).
//  2. Upgrade from v15: config.php exists but there is no database yet. Moves the two JSON records into the database as
//     two accounts in one household. Guarded by the existing app password.
$cfg = __DIR__ . '/config.php';
$hasCfg = file_exists($cfg);
if ($hasCfg) { require $cfg; }
require __DIR__ . '/db.php';
$dbFile = $hasCfg && defined('DATA_DIR') ? DATA_DIR . '/app.db' : '';
if ($hasCfg && $dbFile && file_exists($dbFile)) { @unlink(__FILE__); header('Content-Type: text/plain'); echo "Already set up. setup.php has removed itself. Open index.html."; exit; }
$mode = $hasCfg ? 'upgrade' : 'install';
$checks = ['PDO SQLite' => extension_loaded('pdo_sqlite'), 'mail()' => function_exists('mail'), 'random_bytes' => function_exists('random_bytes')];
$err = ''; $done = false; $notes = [];
$legacy = [];
if ($mode === 'upgrade') { foreach (['p1', 'p2'] as $k) { $f = DATA_DIR . "/$k.json"; if (file_exists($f)) { $j = json_decode(file_get_contents($f), true); if (is_array($j)) $legacy[$k] = $j; } }
  $prof = file_exists(DATA_DIR . '/profiles.json') ? json_decode(file_get_contents(DATA_DIR . '/profiles.json'), true) : (defined('APP_PROFILES') ? APP_PROFILES : []); if (!is_array($prof)) $prof = []; }

function writeConfig(string $cfg, string $dataDir, bool $closed): bool {
  $php = "<?php\n// Private server config, created by setup.php on " . date('Y-m-d') . ". Never commit this file.\n"
       . "define('DATA_DIR', '" . addslashes($dataDir) . "');\n"
       . "define('SIGNUP_CLOSED', " . ($closed ? 'true' : 'false') . ");   // true: only the owner can add people (by invite). false: public sign-up page.\n"
       . "// Optional branding for e-mails: define('BRAND_NAME', 'Meal Planner'); define('BRAND_COLOR', '#0a84ff'); define('BRAND_LOGO', 'https://.../icon-192.png');\n"
       . "// Optional mail settings: define('MAIL_FROM', 'noreply@example.com'); define('MAIL_REPLY', 'you@example.com'); define('APP_URL', 'https://meal.example.com/');\n";
  return file_put_contents($cfg, $php, LOCK_EX) !== false;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$checks['PDO SQLite']) { $err = 'PDO SQLite is not enabled in PHP. Enable it in cPanel → Select PHP Version → Extensions (pdo_sqlite), then reload.'; }
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = strtolower(trim((string)($_POST['email'] ?? ''))); $pw = (string)($_POST['pw'] ?? ''); $pw2 = (string)($_POST['pw2'] ?? '');
  $name = trim(strip_tags($_POST['name'] ?? '')); $hh = trim(strip_tags($_POST['hh'] ?? '')) ?: 'Home';
  $closed = !empty($_POST['closed']);
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $err = 'Enter a valid e-mail address.';
  elseif ($name === '' || mb_strlen($name) > 40) $err = 'Name is required (up to 40 characters).';
  elseif ($mode === 'install' && (strlen($pw) < 10)) $err = 'Password must be at least 10 characters.';
  elseif ($mode === 'install' && $pw !== $pw2) $err = 'Passwords do not match.';
  if (!$err && $mode === 'upgrade') {
    $old = (string)($_POST['oldpw'] ?? ''); $hashes = defined('APP_USERS') && is_array(APP_USERS) ? array_values(APP_USERS) : [defined('APP_PASSWORD_HASH') ? APP_PASSWORD_HASH : ''];
    $okOld = false; foreach ($hashes as $h) { if ($h && password_verify($old, $h)) $okOld = true; }
    if (!$okOld) $err = 'The current app password is wrong.';
    $email2 = strtolower(trim((string)($_POST['email2'] ?? ''))); $name2 = trim(strip_tags($_POST['name2'] ?? ''));
    if (!$err && $email2 !== '' && (!filter_var($email2, FILTER_VALIDATE_EMAIL) || $email2 === $email)) $err = 'Person 2 needs a different, valid e-mail (or leave it blank to invite later).';
    if (!$err && $email2 !== '' && $name2 === '') $err = 'Enter person 2\'s name.';
    if (!$err && $pw !== '' && (strlen($pw) < 10 || $pw !== $pw2)) $err = 'New password must be at least 10 characters and match.';
    if (!$err && $pw === '') $pw = $old;   // keep the current password for the owner unless a new one is given
  }
  if (!$err) {
    if ($mode === 'install') {
      $dataDir = dirname(__DIR__) . '/meal-data';
      if (!is_dir($dataDir) && !@mkdir($dataDir, 0700, true)) { $dataDir = __DIR__ . '/data'; if (!is_dir($dataDir)) @mkdir($dataDir, 0700, true); }
      if (!defined('DATA_DIR')) define('DATA_DIR', $dataDir);
      if (!writeConfig($cfg, $dataDir, $closed)) $err = 'Could not write config.php. Check folder permissions.';
    }
    if (!$err) {
      try {
        $pdo = db(); $now = time();
        $pdo->beginTransaction();
        q('INSERT INTO households(name,created) VALUES(?,?)', [$hh, $now]); $hhId = (int)$pdo->lastInsertId();
        $defaults = ['kcal' => 1900, 'protein' => 150, 'floor' => 1700, 'fatMax' => 75, 'carbMax' => 230, 'maint' => 2500, 'pMin' => 130, 'kg' => 80, 'goal' => 75, 'steps' => 8000, 'restCut' => 100];
        $fixMaps = function(array $d) { foreach (['days', 'log', 'wlog', 'manual'] as $k) { if (isset($d[$k]) && $d[$k] === []) { $d[$k] = new stdClass(); } } return $d; };   // PHP reads {} as [], keep maps as maps
        $mkProfile = function(array $src) use ($defaults) { $p = $defaults; foreach ($src as $k => $v) { if ($k === 'name') continue; $p[$k] = $v; } return $p; };
        $p1 = $mode === 'upgrade' ? $mkProfile($prof['p1'] ?? []) : $defaults;
        q('INSERT INTO users(household_id,email,pass_hash,name,role,verified,created,profile) VALUES(?,?,?,?,"owner",1,?,?)', [$hhId, $email, password_hash($pw, PASSWORD_BCRYPT), $name, $now, json_encode($p1, JSON_UNESCAPED_UNICODE)]);
        $u1 = (int)$pdo->lastInsertId();
        if ($mode === 'upgrade') {
          if (!empty($legacy['p1']['data'])) { q('INSERT INTO docs(user_id,rev,updated,by_user,data) VALUES(?,?,?,?,?)', [$u1, (int)($legacy['p1']['rev'] ?? 1), $legacy['p1']['updated'] ?? gmdate('c'), $u1, json_encode($fixMaps($legacy['p1']['data']), JSON_UNESCAPED_UNICODE)]); $notes[] = 'Person 1 records moved.'; }
          if ($email2 !== '') {
            $p2 = $mkProfile($prof['p2'] ?? []);
            $p2['meals'] = [['name' => 'On waking (tablet)', 'time' => '7:00 am', 'nv' => ['d_tablet'], 'v' => ['d_tablet']], ['name' => 'Breakfast', 'time' => '8:00 am', 'nv' => ['b_eggs2', ['b_oatsmilkchia', 0.5]], 'v' => ['b_oatswheychia'], 'vNoEgg' => ['b_oatswheychia']], ['name' => 'Mid-morning', 'time' => '11:00 am', 'nv' => ['k_gychia'], 'v' => ['k_gychia']], ['name' => 'Lunch', 'time' => '1:00 pm', 'nv' => ['c_rice100', 'p_chkveg120'], 'v' => ['c_rice100', 'p_soyaveg']], ['name' => 'Pre-gym', 'time' => '4:00 pm', 'nv' => ['k_whey', 'f_hbanana'], 'v' => ['k_whey', 'f_hbanana']], ['name' => 'Gym', 'time' => '5:00 to 6:00 pm', 'nv' => ['g_gym'], 'v' => ['g_gym']], ['name' => 'Dinner (post-gym)', 'time' => '7:00 pm', 'nv' => ['c_rice100', 'p_chkmush'], 'v' => ['p_tofuveg', 'v_bigsalad']]];
            q('INSERT INTO users(household_id,email,pass_hash,name,role,verified,created,profile) VALUES(?,?,"",?,"member",0,?,?)', [$hhId, $email2, $name2, $now, json_encode($p2, JSON_UNESCAPED_UNICODE)]);
            $u2 = (int)$pdo->lastInsertId();
            if (!empty($legacy['p2']['data'])) { q('INSERT INTO docs(user_id,rev,updated,by_user,data) VALUES(?,?,?,?,?)', [$u2, (int)($legacy['p2']['rev'] ?? 1), $legacy['p2']['updated'] ?? gmdate('c'), $u2, json_encode($fixMaps($legacy['p2']['data']), JSON_UNESCAPED_UNICODE)]); $notes[] = 'Person 2 records moved.'; }
          }
        }
        $pdo->commit();
        if ($mode === 'upgrade') {
          require __DIR__ . '/mail.php';
          if ($email2 !== '') { $t = makeToken($u2, 'invite', 7 * 86400); $sent = mailInvite($email2, $name2, $name, $hh, $t); $notes[] = $sent ? "Invite e-mail sent to $email2." : "Could not send the invite e-mail to $email2 (mail() failed). After signing in, use Settings → Household → Resend invite."; }
          foreach (['p1.json', 'p2.json', 'profiles.json', 'sessions.json', 'attempts.json'] as $f) { if (file_exists(DATA_DIR . "/$f")) @rename(DATA_DIR . "/$f", DATA_DIR . "/$f.v15-backup"); }
          $notes[] = 'Old files kept as *.v15-backup in the data folder; delete them once you are happy.';
          $add = "\n// v16 upgrade on " . date('Y-m-d') . "\ndefine('SIGNUP_CLOSED', " . ($closed ? 'true' : 'false') . ");\n";
          if (!defined('SIGNUP_CLOSED') && @file_put_contents($cfg, $add, FILE_APPEND | LOCK_EX) === false) $notes[] = 'Could not append SIGNUP_CLOSED to config.php; add it by hand if you want sign-up closed.';
        }
        if (!file_exists(DATA_DIR . '/.htaccess')) @file_put_contents(DATA_DIR . '/.htaccess', "Require all denied\nDeny from all\n");
        @unlink(__FILE__); $done = true;
      } catch (Throwable $e) { if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack(); $err = 'Database error: ' . htmlspecialchars($e->getMessage()); }
    }
  }
}
header('Content-Type: text/html; charset=utf-8'); header('Cache-Control: no-store');
?><!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meal Planner setup</title>
<style>body{font-family:-apple-system,system-ui,sans-serif;background:#f2f2f7;color:#1c1c1e;margin:0;padding:24px}main{max-width:520px;margin:0 auto;background:#fff;border-radius:18px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.08)}h1{font-size:22px;margin:0 0 6px}p{color:#6e6e73;line-height:1.5;margin:0 0 18px}label{display:block;font-size:13px;font-weight:600;margin:12px 0 4px}input[type=text],input[type=email],input[type=password]{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:11px 12px;border:1px solid #d1d1d6;border-radius:10px;background:#fff}h2{font-size:15px;margin:22px 0 0;padding-top:16px;border-top:1px solid #e5e5ea}button{width:100%;margin-top:22px;font:inherit;font-size:16px;font-weight:600;padding:13px;border:0;border-radius:12px;background:#0a84ff;color:#fff}.err{background:#ffe5e3;color:#c0392b;padding:10px 12px;border-radius:10px;margin-bottom:12px}.ok{background:#e3f8e9;color:#1e7a3a;padding:14px;border-radius:12px;line-height:1.5}.chk{display:flex;gap:8px;align-items:center;font-size:14px;margin:8px 0}.chk input{width:18px;height:18px}.sys{font-size:13px;color:#6e6e73;margin:0 0 14px}.sys b{color:#1e7a3a}.sys i{color:#c0392b;font-style:normal}</style></head><body><main>
<h1>Meal Planner <?= $mode === 'upgrade' ? 'upgrade to accounts' : 'setup' ?></h1>
<?php if ($done): ?>
<div class="ok"><b>Done.</b> <?= $mode === 'upgrade' ? 'Your records are in the database and this page has deleted itself.' : 'Your account and the database are created and this page has deleted itself.' ?><br><br><?php foreach ($notes as $n) echo htmlspecialchars($n) . '<br>'; ?><br><a href="./">Open the app</a> and sign in with your e-mail.</div>
<?php else: ?>
<p class="sys"><?php foreach ($checks as $k => $v) echo htmlspecialchars($k) . ': ' . ($v ? '<b>ok</b>' : '<i>missing</i>') . ' &nbsp; '; ?></p>
<?php if ($mode === 'upgrade'): ?>
<p>This moves the two existing records into accounts: person 1 becomes the household owner, person 2 gets an e-mail invite to set their own password. Nothing is deleted; the old files are kept as backups.</p>
<?php else: ?>
<p>One minute, once. This creates the private config, the database and your account, then removes itself.</p>
<?php endif; ?>
<?php if ($err): ?><div class="err"><?= $err ?></div><?php endif; ?>
<form method="post" autocomplete="off">
<?php if ($mode === 'upgrade'): ?>
<label>Current app password</label><input type="password" name="oldpw" required>
<h2>Person 1 (becomes the owner)</h2>
<label>Name</label><input type="text" name="name" required maxlength="40" value="<?= htmlspecialchars($prof['p1']['name'] ?? '') ?>">
<label>E-mail (used to sign in)</label><input type="email" name="email" required>
<label>New password (optional, leave blank to keep the current one)</label><input type="password" name="pw" minlength="10">
<label>Repeat new password</label><input type="password" name="pw2" minlength="10">
<h2>Person 2 (gets an invite e-mail)</h2>
<label>Name</label><input type="text" name="name2" maxlength="40" value="<?= htmlspecialchars($prof['p2']['name'] ?? '') ?>">
<label>E-mail (leave blank to invite later from Settings)</label><input type="email" name="email2">
<?php else: ?>
<label>Your name</label><input type="text" name="name" required maxlength="40">
<label>E-mail (used to sign in)</label><input type="email" name="email" required>
<label>Password (10+ characters)</label><input type="password" name="pw" required minlength="10">
<label>Repeat password</label><input type="password" name="pw2" required minlength="10">
<label>Household name</label><input type="text" name="hh" maxlength="40" value="Home">
<?php endif; ?>
<label class="chk"><input type="checkbox" name="closed" value="1" checked> Private server: no public sign-up, only invites from the owner</label>
<button type="submit"><?= $mode === 'upgrade' ? 'Upgrade' : 'Create account and finish' ?></button>
</form>
<?php endif; ?>
</main></body></html>
