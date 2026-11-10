<?php
// Copy of the structure of config.php. Your real config.php on the server holds the real hashes. DO NOT overwrite it.
// One password per person (fix 7). Make each hash with gen.php once, then delete gen.php.
define('APP_USERS', [
  'p1' => '$2y$10$REPLACE_WITH_P1_HASH',
  'p2' => '$2y$10$REPLACE_WITH_P2_HASH',
]);
// Older single shared password. Still honoured if APP_USERS is not defined.
define('APP_PASSWORD_HASH', '$2y$10$REPLACE_WITH_OUTPUT_OF_password_hash');
define('DATA_DIR', __DIR__ . '/data');
