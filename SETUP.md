MEAL PLANNER - hosting setup 
====================================================================

WHAT THIS IS
The same app, but running on your own domain with the data saved on your
server (plain JSON files in the "data" folder). Both phones and any browser
see the same data after signing in once with a password you choose.

STEP 1 - set your password
  Open config.php in a text editor and change   'change-me-now'   to your
  own password. Keep the quotes. Save.

STEP 2 - upload
  cPanel -> File Manager -> public_html -> create a folder, e.g.  mealplanner
  Upload everything in this zip into it (keep the folder structure):
     index.html, api.php, config.php, .htaccess, manifest.json,
     icon-192.png, icon-512.png, apple-touch-icon.png, data/.htaccess
  Tip: upload the zip itself and use "Extract" in File Manager.
  If .htaccess files are hidden, turn on "Show Hidden Files" in File Manager
  settings (top right) and check they are there.

STEP 3 - open it
  https://yourdomain.com/mealplanner/
  Enter the password. Status pill in the header shows "Synced".
  Settings (gear) -> Sync shows where data is saved.

STEP 4 - on each phone
  iPhone: open the link in Safari -> Share -> Add to Home Screen.
  Android: open in Chrome -> menu -> Add to Home screen / Install app.
  The K-L icon and name now show correctly because it is your own domain.
  Sign in once with the password on each phone.

REQUIREMENTS
  PHP 7.4 or newer (any shared host has it). HTTPS (cPanel hosts give a free
  AutoSSL certificate; use the https:// link).
  The "data" folder must be writable by PHP. It usually is. If you see
  "Offline" after signing in, set permissions of the mealplanner folder
  to 755 in File Manager (right click -> Change Permissions).

HOW DATA IS KEPT
  data/p1.json and data/p2.json  - current state
  data/backup-p1-YYYY-MM-DD.json    - automatic daily backup copies
  Both are blocked from the web by .htaccess; only api.php reads them.
  To back up, download the data folder from File Manager.

OFFLINE
  If the phone has no signal, changes are kept on the phone and sent when
  it reconnects. The header pill shows "Offline, will retry".

UPDATING THE APP LATER
  Replace index.html only. Never replace config.php or the data folder.
