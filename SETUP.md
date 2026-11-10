MEAL PLANNER - hosting setup on cPanel shared hosting
=====================================================

WHAT THIS IS
A two-person meal, check-in and workout planner. Data is saved on your own
server as JSON files in the "data" folder. Both phones and any browser see
the same data after signing in once.

STEP 1 - create the config
  Copy config.example.php to config.php (on the server only; config.php is
  never committed to git).
  Choose one auth mode:
    a) one shared password:  define APP_PASSWORD_HASH
    b) one password each:    define APP_USERS with a hash for p1 and p2
  Generate the hash(es): upload gen.php, open
    https://yourdomain.com/mealplanner/gen.php?p1=PASSWORD
  (add &p2=PASSWORD2 for mode b), paste the printed line into config.php,
  then DELETE gen.php from the server immediately.
  Fill APP_PROFILES with the two people's names, targets and notes. These
  are only sent to the browser after a correct password.

STEP 2 - deploy
  Option A, cPanel Git Version Control: clone this repo into a folder,
  set the deploy path in .cpanel.yml, then "Update from Remote" and
  "Deploy HEAD Commit". The deploy copies app files only, never config.php
  or the data folder.
  Option B, File Manager: upload index.html, app.js, app.css, sw.js,
  api.php, .htaccess, manifest.json, the icons, fonts/, splash/ and
  data/.htaccess. If .htaccess files are hidden, turn on "Show Hidden
  Files" in File Manager settings.

STEP 3 - open it
  https://yourdomain.com/mealplanner/
  Enter the password. With a shared password you are asked once which
  person this device belongs to. The header shows "Synced".

STEP 4 - on each phone
  iPhone: open the link in Safari -> Share -> Add to Home Screen.
  Android: open in Chrome -> menu -> Add to Home screen / Install app.
  Sign in once on each phone.

REQUIREMENTS
  PHP 7.4 or newer. HTTPS (cPanel hosts give a free AutoSSL certificate).
  The "data" folder must be writable by PHP. If you see "Offline" after
  signing in, set the folder permissions to 755 in File Manager.

HOW DATA IS KEPT
  data/p1.json and data/p2.json          - current state
  data/backup-p1-YYYY-MM-DD.json         - automatic daily backup copies
  data/audit.log                         - one line per API request
  All are blocked from the web by .htaccess; only api.php reads them.
  Upgrading from an older install: set APP_LEGACY_FILES in config.php to
  map the old file names to p1 and p2; they are renamed on first request.
  To back up, download the data folder from File Manager, or use
  Settings -> Export in the app.

OFFLINE
  The app shell is cached by the service worker. Without signal, changes
  are kept on the phone and sent when it reconnects.

UPDATING THE APP LATER
  Deploy the new commit (or replace the app files). Never replace
  config.php or the data folder.
