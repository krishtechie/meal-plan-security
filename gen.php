<?php
// One-time helper. Upload, open in a private window, paste the printed line into config.php,
// then DELETE this file from the server immediately.
//
//   Shared password (one for both):  gen.php?p=PASSWORD
//   One password each:               gen.php?p1=PASSWORD1&p2=PASSWORD2
header('Content-Type: text/plain'); header('Cache-Control: no-store');

if (!empty($_GET['p'])) {
  echo "define('APP_PASSWORD_HASH', '" . password_hash($_GET['p'], PASSWORD_BCRYPT) . "');\n";
  echo "\nNow delete gen.php from the server.\n"; exit;
}
if (!empty($_GET['p1']) && !empty($_GET['p2'])) {
  if ($_GET['p1'] === $_GET['p2']) { echo "use two different passwords, or use ?p= for one shared password"; exit; }
  echo "define('APP_USERS', [\n  'p1' => '" . password_hash($_GET['p1'], PASSWORD_BCRYPT) . "',\n  'p2' => '" . password_hash($_GET['p2'], PASSWORD_BCRYPT) . "',\n]);\n";
  echo "\nNow delete gen.php from the server.\n"; exit;
}
echo "add ?p=PASSWORD (shared) or ?p1=...&p2=... (one each) to the URL";
