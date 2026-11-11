<?php
// Meal Planner first-run setup. Works only while config.php does not exist, then deletes itself.
$cfg = __DIR__ . '/config.php';
if (file_exists($cfg)) { @unlink(__FILE__); header('Content-Type: text/plain'); echo "Already set up. setup.php has removed itself. Open index.html."; exit; }
$err = ''; $done = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $pw = (string)($_POST['pw'] ?? ''); $pw2 = (string)($_POST['pw2'] ?? '');
  $n1 = trim(strip_tags($_POST['n1'] ?? '')); $n2 = trim(strip_tags($_POST['n2'] ?? ''));
  $num = fn($k, $d) => max(0, (int)($_POST[$k] ?? $d));
  if (strlen($pw) < 10) $err = 'Password must be at least 10 characters.';
  elseif ($pw !== $pw2) $err = 'Passwords do not match.';
  elseif ($n1 === '' || $n2 === '' || mb_strlen($n1) > 40 || mb_strlen($n2) > 40) $err = 'Both names are required (up to 40 characters).';
  else {
    $dataDir = dirname(__DIR__) . '/meal-data';
    if (!is_dir($dataDir) && !@mkdir($dataDir, 0700, true)) { $dataDir = __DIR__ . '/data'; if (!is_dir($dataDir)) @mkdir($dataDir, 0700, true); }
    $profiles = [
      'p1' => ['name' => $n1, 'kcal' => $num('k1', 1900), 'protein' => $num('p1', 150), 'floor' => max(600, $num('k1', 1900) - 200), 'fatMax' => 75, 'carbMax' => 230, 'maint' => $num('k1', 1900) + 600, 'pMin' => max(20, $num('p1', 150) - 20), 'kg' => $num('w1', 80), 'goal' => $num('g1', 75), 'steps' => $num('s1', 8000)],
      'p2' => ['name' => $n2, 'kcal' => $num('k2', 1550), 'protein' => $num('p2', 120), 'floor' => max(600, $num('k2', 1550) - 200), 'fatMax' => 60, 'carbMax' => 170, 'maint' => $num('k2', 1550) + 600, 'pMin' => max(20, $num('p2', 120) - 20), 'kg' => $num('w2', 70), 'goal' => $num('g2', 65), 'steps' => $num('s2', 8000)],
    ];
    $hash = password_hash($pw, PASSWORD_BCRYPT);
    $php = "<?php\n// Private server config, created by setup.php on " . date('Y-m-d') . ". Never commit this file.\n"
         . "define('APP_PASSWORD_HASH', '" . $hash . "');\n"
         . "define('DATA_DIR', '" . addslashes($dataDir) . "');\n";
    if (file_put_contents($cfg, $php, LOCK_EX) === false) $err = 'Could not write config.php. Check folder permissions.';
    else {
      file_put_contents($dataDir . '/profiles.json', json_encode($profiles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
      if (!file_exists($dataDir . '/.htaccess')) @file_put_contents($dataDir . '/.htaccess', "Require all denied\nDeny from all\n");
      @unlink(__FILE__); $done = true;
    }
  }
}
header('Content-Type: text/html; charset=utf-8'); header('Cache-Control: no-store');
?><!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meal Planner setup</title>
<style>body{font-family:-apple-system,system-ui,sans-serif;background:#f2f2f7;color:#1c1c1e;margin:0;padding:24px}main{max-width:520px;margin:0 auto;background:#fff;border-radius:18px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.08)}h1{font-size:22px;margin:0 0 6px}p{color:#6e6e73;line-height:1.5;margin:0 0 18px}label{display:block;font-size:13px;font-weight:600;margin:12px 0 4px}input{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:11px 12px;border:1px solid #d1d1d6;border-radius:10px;background:#fff}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}h2{font-size:15px;margin:22px 0 0;padding-top:16px;border-top:1px solid #e5e5ea}button{width:100%;margin-top:22px;font:inherit;font-size:16px;font-weight:600;padding:13px;border:0;border-radius:12px;background:#0a84ff;color:#fff}.err{background:#ffe5e3;color:#c0392b;padding:10px 12px;border-radius:10px;margin-bottom:12px}.ok{background:#e3f8e9;color:#1e7a3a;padding:14px;border-radius:12px;line-height:1.5}</style></head><body><main>
<h1>Meal Planner setup</h1>
<?php if ($done): ?>
<div class="ok"><b>Done.</b> config.php and the profiles are created and this page has deleted itself.<br><br><a href="./">Open the app</a>, sign in with the password, and pick who you are on each phone. Names and targets can be changed any time in Settings → Profiles.</div>
<?php else: ?>
<p>One minute, once. This creates the private config on the server and then removes itself. Everything here can be edited later inside the app.</p>
<?php if ($err): ?><div class="err"><?= htmlspecialchars($err) ?></div><?php endif; ?>
<form method="post" autocomplete="off">
<label>Shared password (both people use it, 10+ characters)</label><input type="password" name="pw" required minlength="10">
<label>Repeat password</label><input type="password" name="pw2" required minlength="10">
<h2>Person 1</h2>
<label>Name</label><input name="n1" required maxlength="40" placeholder="First name">
<div class="two"><div><label>Daily calories</label><input type="number" name="k1" value="1900" min="800" max="6000"></div><div><label>Protein g</label><input type="number" name="p1" value="150" min="30" max="400"></div></div>
<div class="two"><div><label>Current kg</label><input type="number" name="w1" value="80" min="20" max="300"></div><div><label>Goal kg</label><input type="number" name="g1" value="75" min="20" max="300"></div></div>
<label>Steps goal</label><input type="number" name="s1" value="8000" min="0" max="50000">
<h2>Person 2</h2>
<label>Name</label><input name="n2" required maxlength="40" placeholder="First name">
<div class="two"><div><label>Daily calories</label><input type="number" name="k2" value="1550" min="800" max="6000"></div><div><label>Protein g</label><input type="number" name="p2" value="120" min="30" max="400"></div></div>
<div class="two"><div><label>Current kg</label><input type="number" name="w2" value="70" min="20" max="300"></div><div><label>Goal kg</label><input type="number" name="g2" value="65" min="20" max="300"></div></div>
<label>Steps goal</label><input type="number" name="s2" value="8000" min="0" max="50000">
<button type="submit">Create config and finish</button>
</form>
<?php endif; ?>
</main></body></html>
