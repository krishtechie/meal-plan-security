<?php
// v16.4: nightly backup of DATA_DIR/app.db, run by a cPanel cron job (command line only).
// Safe while the app is live: uses SQLite's online backup API, so readers and writers are not blocked.
// Each copy is integrity-checked, gzipped into DATA_DIR/backups/app-YYYY-MM-DD-HHMM.db.gz, and the newest KEEP are kept.
// Never reachable over the web: .htaccess denies backup.php and the script exits unless PHP_SAPI is cli.
// Cron line (daily 03:10 server time):  10 3 * * * /usr/local/bin/php /home/<account>/<site>/backup.php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/config.php';
$keep = defined('BACKUP_KEEP') ? max(3, (int)BACKUP_KEEP) : 30;
$src = DATA_DIR . '/app.db'; $dir = DATA_DIR . '/backups';
$log = function (string $s): void { fwrite(STDOUT, date('c') . ' ' . $s . "\n"); };
if (!file_exists($src)) { $log('nothing to back up: ' . $src . ' missing'); exit(1); }
if (!is_dir($dir) && !mkdir($dir, 0700, true)) { $log('cannot create ' . $dir); exit(1); }
$stamp = date('Y-m-d-Hi'); $tmp = $dir . '/app-' . $stamp . '.db'; $out = $tmp . '.gz';
try {
  // SQLite's online backup API (sqlite3_backup): consistent copy, works on every SQLite version, readers and writers keep going.
  if (class_exists('SQLite3')) {
    $from = new SQLite3($src, SQLITE3_OPEN_READONLY); $from->busyTimeout(10000);
    $to = new SQLite3($tmp);
    if (!$from->backup($to)) { throw new RuntimeException('sqlite backup failed: ' . $from->lastErrorMsg()); }
    $to->close(); $from->close();
  } else {
    $pdo = new PDO('sqlite:' . $src, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->exec('PRAGMA busy_timeout=10000');
    $pdo->exec("VACUUM INTO " . $pdo->quote($tmp));   // SQLite 3.27+ only; used when the SQLite3 class is missing
  }
  $chk = new PDO('sqlite:' . $tmp, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
  $r = $chk->query('PRAGMA integrity_check')->fetchColumn();
  $users = (int)$chk->query('SELECT COUNT(*) FROM users')->fetchColumn();
  $chk = null;
  if ($r !== 'ok') { @unlink($tmp); $log('integrity check failed: ' . $r); exit(1); }
  $in = fopen($tmp, 'rb'); $gz = gzopen($out, 'wb6');
  while (!feof($in)) { gzwrite($gz, fread($in, 1 << 20)); }
  fclose($in); gzclose($gz); unlink($tmp); @chmod($out, 0600);
} catch (Throwable $e) { @unlink($tmp); @unlink($out); $log('backup failed: ' . $e->getMessage()); exit(1); }
// Rotation: keep the newest $keep copies.
$all = glob($dir . '/app-*.db.gz') ?: []; rsort($all);
foreach (array_slice($all, $keep) as $old) { @unlink($old); }
$log('ok ' . basename($out) . ' ' . filesize($out) . ' bytes, ' . $users . ' users, ' . min(count($all), $keep) . ' copies kept');
