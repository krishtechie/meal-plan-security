MEAL PLANNER - hosting setup on cPanel shared hosting
=====================================================

WHAT THIS IS
A two-person meal, check-in and workout planner. Data is saved on your own
server as JSON files in the "data" folder. Both phones and any browser see
the same data after signing in once.

STEP 1 - deploy the files (see step 2), then open setup.php once
  https://yourdomain.com/mealplanner/setup.php
  It asks for one shared password (10+ characters), two names and starting
  targets, writes config.php and the profiles, and deletes itself.
  Everything it asks for can be changed later in Settings -> Profiles.

  Manual alternative: copy config.example.php to config.php, generate the
  hash with gen.php (delete gen.php afterwards) and fill APP_PROFILES.

STEP 2 - deploy
  Option A, cPanel Git Version Control: clone this repo into a folder,
  set the deploy path in .cpanel.yml, then "Update from Remote" and
  "Deploy HEAD Commit". The deploy copies app files only, never config.php
  or the data folder. Upload setup.php by hand for the first run.
  Option B, File Manager: upload index.html, app.js, app.css, sw.js,
  api.php, .htaccess, manifest.json, the icons, fonts/, splash/ and
  data/.htaccess. If .htaccess files are hidden, turn on "Show Hidden
  Files" in File Manager settings.

STEP 3 - open it
  https://yourdomain.com/mealplanner/
  Enter the password. You are asked once which person this device
  belongs to. Either person can still view and edit the other's log. The header shows "Synced".

STEP 4 - on each phone
  iPhone: open the link in Safari -> Share -> Add to Home Screen.
  Android: open in Chrome -> menu -> Add to Home screen / Install app.
  Sign in once on each phone.

REQUIREMENTS
  PHP 7.4 or newer. HTTPS (cPanel hosts give a free AutoSSL certificate).
  The "data" folder must be writable by PHP. If you see "Offline" after
  signing in, set the folder permissions to 755 in File Manager.

HOW DATA IS KEPT
  DATA_DIR in config.php, by default /home/USER/meal-data, OUTSIDE the
  site folder so no URL can reach it:
    profiles.json                        - names, targets, notes
    p1.json and p2.json                  - current state
    backup-p1-YYYY-MM-DD.json            - automatic daily backup copies
    audit.log                            - one line per API request
  If you upgrade from an install that used ./data, the files are moved
  over automatically on the first request. Only api.php reads them.
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
