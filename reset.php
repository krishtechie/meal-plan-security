<?php
// One-shot clean slate. Upload next to api.php, open once, it deletes itself.
// Clears for both people: logged days, check-ins (water, steps, sleep), workout logs, manual markers, and the
// old backup copies in the data folder.  Keeps: custom foods, saved templates, weigh-ins, settings, profiles, audit log.
header('Content-Type: text/plain; charset=utf-8'); header('Cache-Control: no-store');
if (($_GET['t'] ?? '') !== 'cf2ae09ba0a83b0ca2967804') { http_response_code(404); exit; }
if (!file_exists(__DIR__ . '/config.php')) { echo "config.php missing"; exit; }
require __DIR__ . '/config.php';
$dir = DATA_DIR; $out = [];
foreach (['p1', 'p2'] as $who) {
  $f = "$dir/$who.json"; if (!file_exists($f)) { $out[] = "$who: no file, nothing to clear"; continue; }
  $C = json_decode(file_get_contents($f), true); if (!is_array($C['data'] ?? null)) { $out[] = "$who: unreadable, skipped"; continue; }
  $n = count($C['data']['days'] ?? []);
  $C['data']['days'] = new stdClass(); $C['data']['log'] = new stdClass(); $C['data']['wlog'] = new stdClass(); $C['data']['manual'] = new stdClass();
  $C['data']['gen'] = max(2, (int)($C['data']['gen'] ?? 0) + 1); $C['rev'] = ($C['rev'] ?? 0) + 1; $C['updated'] = gmdate('c');
  file_put_contents("$f.tmp", json_encode($C), LOCK_EX); rename("$f.tmp", $f);
  $out[] = "$who: cleared $n logged days, check-ins and workout logs; kept " . count($C['data']['customs'] ?? []) . " custom foods, " . count($C['data']['templates'] ?? []) . " templates, " . count($C['data']['weights'] ?? []) . " weigh-ins";
}
$removed = 0; foreach (glob("$dir/backup-*.json") as $b) { if (@unlink($b)) $removed++; }
$out[] = "removed $removed old backup files";
@unlink(__FILE__);
echo implode("\n", $out) . "\n\nreset.php has deleted itself. Open the app on each phone; today starts empty with suggestions.\n";
