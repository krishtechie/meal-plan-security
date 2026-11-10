<?php
// One-time helper: open https://meal.krishdesigns.com/gen.php?p1=PASSWORD1&p2=PASSWORD2 in a private window,
// paste the printed block into config.php, then DELETE this file from the server immediately.
header('Content-Type: text/plain'); header('Cache-Control: no-store');
if (empty($_GET['p1']) || empty($_GET['p2'])) { echo "add ?p1=...&p2=... to the URL"; exit; }
echo "define('APP_USERS', [\n  'p1' => '" . password_hash($_GET['p1'], PASSWORD_BCRYPT) . "',\n  'p2' => '" . password_hash($_GET['p2'], PASSWORD_BCRYPT) . "',\n]);\n";
