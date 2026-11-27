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
  "Private server" is ticked by default: nobody can sign up on their own.
  Your account becomes the app admin (ADMIN_EMAILS in config.php) and
  hands out sign-up invite links from Settings -> App admin; each lets one
  person create their own separate household. Untick it for public sign-up.
  If the admin later changes their sign-in e-mail, update ADMIN_EMAILS too.

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

STEP 4 - let other households in (optional)
  Settings -> App admin -> Sign-up invites -> Create invite link. Send it
  by message; it works once and expires in 14 days. Their household is
  separate: you cannot see their data. New people run a 6-step wizard:
  body stats, goal and the reason behind it, diet and rules (halal, Jain,
  vegan, low carb, diabetic-friendly), fasting days, meals a day,
  cuisines, workouts (type, days, morning or evening) and the targets
  that follow. The plan's meal slots follow these answers; custom slots
  from Profiles are never changed. The landing page offers a demo
  with made-up data that stores nothing.

STEP 5 - add family
  Settings -> People and invites -> Add someone. They get an e-mail with
  a link to set their own password (valid 7 days). Up to 8 per household.
  Members edit only their own data; the owner can edit everyone's and
  remove people.

STEP 5b - someone leaves or joins with their data
  People and invites -> "Move out" gives a member a household of their
  own: account, logs, weights, targets and photo all go with them and you
  stop seeing them. "Delete" removes their account and data for good and
  asks for your password. Inviting an e-mail that already has an account
  sends a join invitation instead: they accept it from the e-mail (or a
  link you share) and move in with all their data. An owner whose
  household still has members cannot join another until they are moved.

STEP 6 - account
  Settings -> the card at the top: photo (shrunk to 256 px on the phone,
  stored in the database, visible only to the household), name, e-mail
  change with confirmation, password change, sign out of other devices.
  Admins also get Settings -> App admin -> Security and households:
  failed sign-ins, lockouts, bad tokens and invite links, sign-ups,
  suspicious events by IP, and a households overview. Never food data.

STEP 6b - nightly backups
  backup.php copies the database safely while the app is in use, checks
  the copy, gzips it to <DATA_DIR>/backups/app-YYYY-MM-DD-HHMM.db.gz and
  keeps the newest 30 (BACKUP_KEEP in config.php). It only runs from the
  command line; the web server refuses it. cPanel -> Cron Jobs -> add:
    minute 10, hour 3, every day, command:
    /usr/local/bin/php /home/<account>/<site-folder>/backup.php
  Settings -> App admin -> Security shows the newest copy ("ok" if it is
  under two days old, "stale" otherwise). Restore: gunzip the file and
  replace <DATA_DIR>/app.db with it (delete app.db-wal and app.db-shm).
  Download a copy off the server now and then; a backup next to the data
  does not survive a lost hosting account.

STEP 7 - on each phone
  iPhone: open the link in Safari -> Share -> Add to Home Screen.
  Android: open in Chrome -> menu -> Add to Home screen / Install app.
  Sign in once on each phone. Settings -> Signed-in devices lists them.

REQUIREMENTS
  PHP 8.0 or newer with pdo_sqlite (on by default on cPanel; check
  Select PHP Version -> Extensions). HTTPS. PHP mail() for the e-mails
  (cPanel sends from noreply@yourdomain by default; set MAIL_FROM in
  config.php to use a real mailbox, and add an SPF record if mail lands
  in spam).

E-MAIL DELIVERY
  By default PHP mail() through the host. Shared hosts often reject or
  spam-folder account e-mails; the reliable option is Brevo (free tier):
    1. brevo.com -> Senders & Domains -> add and authenticate your domain
       (add the DKIM and DMARC records it shows in cPanel Zone Editor).
    2. SMTP & API -> API Keys -> create a key.
    3. In config.php:
         define('BREVO_API_KEY', 'xkeysib-...');
         define('MAIL_FROM', 'noreply@yourdomain.com');
  Every e-mail then goes over HTTPS to Brevo from your own domain.

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
