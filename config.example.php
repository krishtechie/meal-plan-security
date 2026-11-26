<?php
// Structure of config.php (v16). The real file lives only on the server, is written by setup.php and is never committed.
define('DATA_DIR', dirname(__DIR__) . '/meal-data');   // outside the web root: app.db (SQLite) and audit.log live here
define('SIGNUP_CLOSED', true);                           // true: sign-up only with an invite link from an admin. false: public sign-up page
define('ADMIN_EMAILS', ['you@example.com']);              // accounts that can hand out sign-up invites (Settings → App admin)
// Optional e-mail branding and delivery
// define('BRAND_NAME', 'Meal Planner');
// define('BRAND_COLOR', '#0a84ff');
// define('BRAND_LOGO', 'https://meal.example.com/icon-192.png');
// define('MAIL_FROM', 'noreply@meal.example.com');
// define('MAIL_REPLY', 'you@example.com');
// define('APP_URL', 'https://meal.example.com/');       // used in e-mail links; derived from the request when unset
// define('MAIL_SINK', '/path/to/mail.log');             // test installs only: write e-mails to a file instead of sending
// define('BREVO_API_KEY', 'xkeysib-...');                 // send through Brevo's API instead of the host's mail relay (MAIL_FROM must be a sender verified in Brevo)
// Left over from v15 (one shared password, profiles in profiles.json). setup.php reads these once to upgrade, then they are unused:
// define('APP_PASSWORD_HASH', '$2y$10$...');
// define('APP_USERS', ['p1' => '$2y$10$...', 'p2' => '$2y$10$...']);
// define('APP_PROFILES', [...]);
