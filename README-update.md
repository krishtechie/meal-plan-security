## Fix 5: input validation on the API (done)

**Problem.** `api.php` accepted any JSON body up to 2 MB and wrote it to disk unchanged. A valid password holder (or a stolen key) could store arbitrary content, oversized documents, or malformed records that would break the client for the other person.

**Fix.** Every `put` now passes two checks before anything is written:
- `validateDoc()` walks the whole document: max depth 7, max 5,000 entries per object, strings capped at 400 UTF-8 characters, numbers must be finite and under 10 million, no other types.
- `validateShape()` enforces the schema: only known top-level fields; day keys must be `YYYY-MM-DD` plus the veg and egg flags; item ids `^[a-z0-9_]{1,40}$`; quantities 0 to 50; weights 20 to 300 kg with a valid date; custom food macros 0 to 5,000.
- `who` and the action are matched against an allow-list; anything else is a 400 or 404 before any file path is built. Body limit lowered to 1 MB.

Rejections return `422` with the reason and are written to the audit log as `rejected`. The client shows "Not saved: server rejected the data" instead of silently dropping the write.

**OWASP:** A03 Injection, A04 Insecure Design, A08 Software and Data Integrity.

## Fix 7: one password per person, per-account lockout (done)

**Problem.** One shared password meant one credential to leak, no way to revoke one person without resetting both, and the per-IP lockout could be bypassed by rotating IPs (observed during fix 2 testing).

**Fix.**
- `config.php` now holds `APP_USERS`, a bcrypt hash per account (`p1`, `p2`). The old `APP_PASSWORD_HASH` is still honoured if `APP_USERS` is absent, so the upgrade can be done in either order.
- Requests send `X-App-User` and `X-App-Key`; the hash looked up is the one for that user. A wrong user/password pair never reveals which part was wrong.
- Lockout is now two-layered: 5 failures per IP (as before) **and** 20 failures per account across all IPs, both for 15 minutes. Rotating IPs no longer gives unlimited guesses at one account.
- Each stored record carries `by`, the account that wrote it, which the audit log also records.
- `gen.php` creates both hashes in one call and is deleted after use, as with fix 1.

**OWASP:** A07 Identification and Authentication Failures, A01 Broken Access Control.

## Also in this release (not security fixes)

Service worker for offline use (shell assets cached, `api.php` always live), `worker-src 'self'` added to the CSP. Excel export now includes workout logs. Per-date food log, weight trend chart, weekly scorecard.

## Status

Fixes 1 to 7 done. Open: fix 6 (move `data/` outside the web root; currently protected by `.htaccess` only) and optional fix 8 (GitHub Actions deploy).
