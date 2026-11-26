<?php
// v16: SQLite store. One file, DATA_DIR/app.db, outside the web root. Opened lazily by api.php and setup.php.
// Tables: households, users, docs (one JSON document per person, same shape the app always used), sessions, tokens, attempts.
function db(): PDO {
  static $pdo = null;
  if ($pdo) return $pdo;
  if (!is_dir(DATA_DIR)) { mkdir(DATA_DIR, 0700, true); }
  $file = DATA_DIR . '/app.db';
  $fresh = !file_exists($file);
  $pdo = new PDO('sqlite:' . $file, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
  $pdo->exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=4000;');
  if ($fresh) { @chmod($file, 0600); }
  $pdo->exec('CREATE TABLE IF NOT EXISTS households (id INTEGER PRIMARY KEY, name TEXT NOT NULL, created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE, email TEXT NOT NULL UNIQUE, pass_hash TEXT NOT NULL DEFAULT "", name TEXT NOT NULL, role TEXT NOT NULL DEFAULT "member", verified INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL, profile TEXT NOT NULL DEFAULT "{}");
    CREATE INDEX IF NOT EXISTS users_hh ON users(household_id);
    CREATE TABLE IF NOT EXISTS docs (user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, rev INTEGER NOT NULL DEFAULT 0, updated TEXT, by_user INTEGER, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, created INTEGER NOT NULL, last INTEGER NOT NULL, ip TEXT, ua TEXT);
    CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
    CREATE TABLE IF NOT EXISTS tokens (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, kind TEXT NOT NULL, expires INTEGER NOT NULL, created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts (key TEXT PRIMARY KEY, n INTEGER NOT NULL, t INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS signup_codes (id TEXT PRIMARY KEY, code_hash TEXT NOT NULL UNIQUE, note TEXT NOT NULL DEFAULT "", created_by INTEGER NOT NULL, created INTEGER NOT NULL, expires INTEGER NOT NULL, used_by INTEGER, used_at INTEGER, used_hh TEXT, revoked INTEGER NOT NULL DEFAULT 0);');
  // v16.3: columns added after the first release (SQLite has no IF NOT EXISTS for columns)
  $cols = array_column($pdo->query('PRAGMA table_info(users)')->fetchAll(), 'name');
  if (!in_array('photo', $cols, true)) { $pdo->exec('ALTER TABLE users ADD COLUMN photo BLOB'); $pdo->exec('ALTER TABLE users ADD COLUMN photo_v INTEGER NOT NULL DEFAULT 0'); $pdo->exec('ALTER TABLE users ADD COLUMN pending_email TEXT'); $pdo->exec('ALTER TABLE users ADD COLUMN last_seen INTEGER NOT NULL DEFAULT 0'); }
  return $pdo;
}
function dbReady(): bool { return file_exists(DATA_DIR . '/app.db'); }
function q(string $sql, array $args = []): PDOStatement { $st = db()->prepare($sql); $st->execute($args); return $st; }
function row(string $sql, array $args = []) { $r = q($sql, $args)->fetch(); return $r === false ? null : $r; }
function rows(string $sql, array $args = []): array { return q($sql, $args)->fetchAll(); }

// Profile JSON stored per user: name lives in users.name; everything else (targets, veg days, notes, meals) in users.profile.
function userProfile(array $u): array { $p = json_decode($u['profile'] ?? '{}', true); if (!is_array($p)) $p = []; $p['name'] = $u['name']; $p['id'] = (int)$u['id']; $p['role'] = $u['role']; $p['verified'] = (int)$u['verified']; $p['email'] = $u['email']; $p['hasPassword'] = $u['pass_hash'] !== ''; $p['photo'] = (int)($u['photo_v'] ?? 0); $p['pendingEmail'] = $u['pending_email'] ?? ''; return $p; }
function members(int $hh): array { $out = []; foreach (rows('SELECT * FROM users WHERE household_id=? ORDER BY CASE role WHEN "owner" THEN 0 ELSE 1 END, created, id', [$hh]) as $u) { $out[] = userProfile($u); } return $out; }

// One-time tokens for e-mail links (verify, reset, invite). Only the SHA-256 is stored.
function makeToken(int $uid, string $kind, int $ttl): string {
  $t = bin2hex(random_bytes(24)); $now = time();
  q('DELETE FROM tokens WHERE user_id=? AND kind=?', [$uid, $kind]);
  q('DELETE FROM tokens WHERE expires<?', [$now]);
  q('INSERT INTO tokens(token_hash,user_id,kind,expires,created) VALUES(?,?,?,?,?)', [hash('sha256', $t), $uid, $kind, $now + $ttl, $now]);
  return $t;
}
function useToken(string $t, array $kinds) { if (!preg_match('/^[a-f0-9]{48}$/', $t)) return null; $r = row('SELECT * FROM tokens WHERE token_hash=?', [hash('sha256', $t)]); if (!$r || !in_array($r['kind'], $kinds, true) || $r['expires'] < time()) return null; return $r; }
function burnToken(string $t): void { q('DELETE FROM tokens WHERE token_hash=?', [hash('sha256', $t)]); }
