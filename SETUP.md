MEAL PLANNER - hosting setup on cPanel shared hosting
=====================================================

WHAT THIS IS
A meal, check-in and workout planner for a household. Everyone signs in
with their own e-mail and password; the household owner adds people by
e-mail invite and can see and edit their logs. Data lives in one SQLite
file on your own server, outside the web root.

STEP 1 - deploy the files (see step 2), then open setup.php once
  https://yourdomain.com/mealplanner/setup.php
  Fresh install: it asks for your name, e-mail, a password (10+ characters)
  and a household name, creates config.php, the database and your account
  (you are the owner), then deletes itself.
  Upgrade from v15 (two people, one shared password): it recognises the
  old config.php, asks for the current app password, person 1's e-mail
  (becomes the owner) and person 2's e-mail (gets an invite), moves both
  records into the database and keeps the old files as *.v15-backup.
  "Private server" is ticked by default: no public sign-up page, only
  invites from the owner. Untick it to let anyone create a household.

STEP 2 - deploy
  Option A, cPanel Git Version Control: clone this repo into a folder,
  set the deploy path in .cpanel.yml, then "Update from Remote" and
  "Deploy HEAD Commit". The deploy copies app files only, never config.php
  or the data folder. Upload setup.php by hand for the first run.
  Option B, File Manager: upload index.html, app.js, app.css, sw.js,
  api.php, db.php, mail.php, .htaccess, manifest.json, the icons, fonts/,
  splash/ and data/.htaccess. If .htaccess files are hidden, turn on
  "Show Hidden Files" in File Manager settings.

STEP 3 - open it
  https://yourdomain.com/mealplanner/
  Sign in with your e-mail and password. The header shows "Synced" and
  one button per household member; tap a person to see their log.

STEP 4 - add family
  Settings -> People and invites -> Add someone. They get an e-mail with
  a link to set their own password (valid 7 days). Up to 8 per household.
  Members edit only their own data; the owner can edit everyone's and
  remove people.

STEP 5 - on each phone
  iPhone: open the link in Safari -> Share -> Add to Home Screen.
  Android: open in Chrome -> menu -> Add to Home screen / Install app.
  Sign in once on each phone. Settings -> Signed-in devices lists them.

REQUIREMENTS
  PHP 8.0 or newer with pdo_sqlite (on by default on cPanel; check
  Select PHP Version -> Extensions). HTTPS. PHP mail() for the e-mails
  (cPanel sends from noreply@yourdomain by default; set MAIL_FROM in
  config.php to use a real mailbox, and add an SPF record if mail lands
  in spam).

E-MAIL BRANDING
  Optional in config.php:
    define('BRAND_NAME', 'Meal Planner');
    define('BRAND_COLOR', '#0a84ff');
    define('BRAND_LOGO', 'https://yourdomain.com/mealplanner/icon-192.png');
    define('MAIL_FROM', 'noreply@yourdomain.com');
    define('MAIL_REPLY', 'you@yourdomain.com');
    define('APP_URL', 'https://yourdomain.com/mealplanner/');

HOW DATA IS KEPT
  DATA_DIR in config.php, by default /home/USER/meal-data, OUTSIDE the
  site folder so no URL can reach it:
    app.db        - SQLite: households, users, one JSON document per
                    person, sessions (token hashes only), e-mail tokens
    audit.log     - one line per API request, never passwords or data
  To back up, download app.db from File Manager (it is one file), or use
  Settings -> Export in the app. To move to another server, copy app.db
  and config.php.

OFFLINE
  The app shell is cached by the service worker. Without signal, changes
  are kept on the phone and sent when it reconnects.
