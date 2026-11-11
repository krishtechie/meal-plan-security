<?php
// Structure of config.php. The real file lives only on the server and is never committed.
// Accounts are p1 and p2. Two different passwords: the password identifies the person.
// One shared password for both: leave APP_USERS out and set APP_PASSWORD_HASH only; the app then asks who is signing in.
define('APP_USERS', [
  'p1' => '$2y$10$REPLACE_WITH_P1_HASH',
  'p2' => '$2y$10$REPLACE_WITH_P2_HASH',
]);
// Names and personal targets, sent to the app only after a successful sign-in. Everything optional except name.
define('APP_PROFILES', [
  'p1' => ['name' => 'Person 1', 'kcal' => 1900, 'protein' => 165, 'floor' => 1700, 'fatMax' => 75, 'carbMax' => 230, 'maint' => 2550, 'pMin' => 150, 'kg' => 88, 'goal' => 80, 'steps' => 9000],
  'p2' => ['name' => 'Person 2', 'kcal' => 1550, 'protein' => 130, 'floor' => 1350, 'fatMax' => 60, 'carbMax' => 170, 'maint' => 2200, 'pMin' => 115, 'kg' => 85, 'goal' => 75, 'steps' => 8000,
           'notesTitle' => 'Personal notes', 'notes' => ['Shown as a card under the plan. One string per bullet. Keep medical details here, not in the code.']],
]);
// If your data folder still has files from an older build named after the person, map them here once; they are renamed on first request.
// define('APP_LEGACY_FILES', ['p1' => 'oldname1', 'p2' => 'oldname2']);
// Old single shared password; still honoured if APP_USERS is not defined.
define('APP_PASSWORD_HASH', '$2y$10$REPLACE_WITH_OUTPUT_OF_password_hash');
// Fix 6: keep the data OUTSIDE the web root so no URL can ever reach it, even if .htaccess is lost.
// On cPanel the site folder is e.g. /home/USER/meal.example.com, so this puts data in /home/USER/meal-data.
// Existing files in the old ./data folder are moved over automatically on the first request.
define('DATA_DIR', dirname(__DIR__) . '/meal-data');
// Old location, if you prefer to keep it inside the site (protected by data/.htaccess only):
// define('DATA_DIR', __DIR__ . '/data');
