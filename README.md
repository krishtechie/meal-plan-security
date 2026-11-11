# Meal Planner Security Hardening

A real web app I built and use daily, a two-person meal, check-in and workout planner with a small PHP JSON API on shared hosting, used as a hands-on security project. Version 1 worked but was written for function, not defence. This repo documents taking it from an unhardened baseline to a reasonably secure deployment, one change at a time, with evidence.

Live instance: private. The code is public; the people, targets and data are not.

## What's here

- `index.html`, `app.js`, `app.css`, `sw.js`, `api.php`, `.htaccess`, `manifest.json`, `fonts/`, `splash/`, icons: the application
- `config.example.php`: structure of the server config. The real `config.php` holds the password hash and the two people's profiles and is never committed
- `gen.php`: one-shot bcrypt hash generator. Uploaded, run once, deleted. Not deployed by `.cpanel.yml`
- `data/.htaccess`: blocks web access to the data folder. The data files themselves are git-ignored
- `reports/`: OWASP ZAP and securityheaders.com results, before and after each phase. Embedded response bodies have been removed from the HTML reports because they contained application source (see fix 9)
- `SETUP.md`: how to deploy on cPanel shared hosting
- `.cpanel.yml`: cPanel Git deploy task. Copies the app files only, never `config.php` or `data/`
- One commit per fix, so the diff is the explanation

## The app

- Front end: HTML, vanilla JS, self-hosted fonts, installable PWA with service worker, offline shell, iOS splash screens, light and dark theme
- Back end: `api.php`, four actions (`ping`, `get`, `put`, `rev`), one JSON file per person, revision-checked merges so two phones never overwrite each other
- Auth: password sent as a request header, verified against a bcrypt hash. One shared password or one per person, both supported
- Identity: the code knows only `p1` and `p2`. Names, calorie and protein targets and personal notes live in `config.php` and are returned by `ping` only after a correct password
- Hosting: LiteSpeed on cPanel shared hosting, HTTPS via AutoSSL, deployed from this repo with cPanel Git Version Control

## Fixes, in order

| # | Fix | OWASP 2021 | Status |
|---|-----|-----------|--------|
| 1 | Password stored as bcrypt hash | A02 Cryptographic Failures | done |
| 2 | Rate limiting and lockout on the API | A07 Identification and Authentication Failures | done |
| 3 | Security headers: HSTS, CSP, nosniff, frame deny, referrer policy, permissions policy | A05 Security Misconfiguration | done |
| 3b | Strict CSP: inline script and styles moved to files, `unsafe-inline` removed, fonts self-hosted, COOP/CORP added | A05 Security Misconfiguration | done |
| 3c | Forced HTTPS redirect so HSTS has a secure first visit | A02 Cryptographic Failures | done |
| 4 | Audit log of every read and write | A09 Security Logging and Monitoring Failures | done |
| 4b | Activity screen in the app: the audit log readable after sign-in, file still blocked from the web | A09 Security Logging and Monitoring Failures | done |
| 5 | Strict validation of the request body | A03 Injection | done |
| 6 | Data, backups and logs moved outside the web root | A05 Security Misconfiguration | done |
| 7 | Per-account credentials and per-account lockout | A01 Broken Access Control | done |
| 8 | Service worker never caches the API; `worker-src 'self'` in CSP | A05 Security Misconfiguration | done |
| 9 | Personal data removed from the public code and reports; served from server config after sign-in | A01 Broken Access Control, A04 Insecure Design | done |

## Results

| Check | Before | After fix 3 | After fix 3b |
|-------|--------|-------------|--------------|
| securityheaders.com grade | **F** (6 headers missing) | **A** | **A+** |
| OWASP ZAP alerts (high / medium / low / info) | **0 / 3 / 2 / 3** | **0 / 3 / 0 / 3** | **0 / 0 / 0 / 3** |

Evidence: `reports/headers-before.png`, `reports/headers-after-fix3.png`, `reports/headers-after-fix3b.png`, `reports/zap-before.html`, `reports/zap-after-fix3.html`, `reports/zap-after-fix3b.html`.

### Baseline (09 Nov 2026)

**securityheaders.com: F.** Missing: Strict-Transport-Security, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

**OWASP ZAP 2.17.0, automated scan, Dev Standard policy.**

| Risk | Alert | Addressed in |
|------|-------|--------------|
| Medium | Content Security Policy (CSP) header not set | Fix 3 |
| Medium | Missing anti-clickjacking header (X-Frame-Options) | Fix 3 |
| Medium | Strict-Transport-Security header not set | Fix 3 |
| Low | X-Content-Type-Options header missing | Fix 3 |
| Low | Sub Resource Integrity attribute missing (Google Fonts) | Fix 3b |
| Info | Information disclosure: suspicious comments in JS | Fix 5 |
| Info | Modern web application (JS-driven) | n/a |
| Info | Re-examine cache-control directives | Fix 3 |

**What the scanners cannot see.** Neither tool reports the plain-text password in `config.php`, the absence of rate limiting on `api.php`, the lack of an audit log, the unvalidated JSON body, or the personal information hard-coded in the client. These come from the threat model, not from scanning. Fixes 1, 2, 4, 5 and 9 address them.

### After fix 3

All six headers sent. Grade F to A. ZAP's three "header not set" Mediums and the nosniff Low cleared. Three new Mediums appeared: the CSP existed but allowed `unsafe-inline` for scripts and styles, and the Google Fonts stylesheet had no integrity hash. Having a header is not the same as having a strict one.

### After fix 3b

Inline `<script>` moved to `app.js`, `<style>` to `app.css`, 36 inline `style=""` attributes converted to CSS rules, Google Fonts replaced by self-hosted woff2 files. CSP is now `script-src 'self'; style-src 'self'; font-src 'self'` with no `unsafe-inline`, plus `object-src 'none'`, COOP and CORP. Grade A+. ZAP: zero High, Medium or Low. Three Informational notes remain (suspicious comments in JS, "modern web application", cache-control review), none a vulnerability.

### Fix 4: audit log

Every API request appends one JSON line to the audit log: timestamp, IP, action, account, outcome (`ok`, `bad_password`, `no_key`, `locked`, `bad_body`, `too_large`, `rejected`, `unknown_action`), revision and payload size for writes, truncated user agent. Passwords and data content are never written. The log currently lives beside the data it protects, inside the web-blocked `data/` folder; fix 6 moves both outside the web root.

### Fix 4b: making the log readable

A log nobody reads is not monitoring. `api.php` gained an `audit` action, allowed only with a valid password, that returns the last 300 lines. The app's Settings has an Activity screen that shows them in plain language: time, what happened (opened the app, saved changes, wrong password, locked out), which account, which device type and IP, with 24-hour counts of saves, wrong passwords, lockouts and distinct IPs, filters, and a CSV download. The file itself stays blocked by `.htaccess`; the only path to it is the authenticated API, and reading it is itself logged.

This paid off immediately: after a password change, the log showed each device retrying its stored old password every 20 seconds and tripping the IP lockout on its own. The client was fixed to forget a rejected password after one failure and to pause while locked out.

### Fix 2 observation

Testing the per-IP lockout (`reports/attempts-after-fix2.json`): my own browser was locked out after 5 failures as designed, but six probes from one tester spread across four IP addresses counted once each and never triggered the limit. Per-IP limiting is bypassed by distributed attempts. Fix 7 adds per-account lockout so the limit follows the credential, not the address.

### Fix 5: input validation on the API

**Problem.** `api.php` accepted any JSON body up to 2 MB and wrote it to disk unchanged. A valid password holder, or a stolen key, could store arbitrary content, oversized documents, or malformed records that would break the client for the other person.

**Fix.** Every `put` passes two checks before anything is written:
- `validateDoc()` walks the whole document: max depth 7, max 5,000 entries per object, strings capped at 400 UTF-8 characters, numbers must be finite and under 10 million, no other types.
- `validateShape()` enforces the schema: only known top-level fields; day keys must be `YYYY-MM-DD` plus the veg and egg flags; item ids `^[a-z0-9_]{1,40}$`; quantities 0 to 50; weights 20 to 300 kg with a valid date; custom food macros 0 to 5,000; migration flags `^m\d{1,2}$`.
- Account and action are matched against an allow-list; anything else is a 400 or 404 before any file path is built. Body limit lowered to 1 MB.

Rejections return `422` with the reason and are logged as `rejected`. The client shows "Not saved: server rejected the data" instead of silently dropping the write.

**Lesson.** The first deploy of fix 5 rejected real writes: a client-side migration flag was not on the allow-list. Strict validation needs a test run against live data before it is trusted.

### Fix 6: data outside the web root

**Problem.** `data/` sat inside the site folder, protected only by `data/.htaccess`. One mis-deploy, a server switch that ignores `.htaccess`, or a hosting change and every JSON file is one URL away.

**Fix.** `DATA_DIR` in `config.php` now points above the web root (`/home/USER/meal-data`), created with mode 0700 on first request. No URL can reach it whatever the server config. `api.php` moves the existing JSON and log files from the old folder on the first request after the change, so nothing is lost and no manual step is needed. `data/.htaccess` stays as a second layer in case someone keeps the old path.

**Also in this release.** Future dates are read-only (the plan is shown, nothing can be logged, check-in and weigh-in are closed), so a stray tap can never create a record for a day that has not happened. Weigh-in dates are capped at today on both client and server validation paths.

### Fix 7: per-account credentials and per-account lockout

**Problem.** One shared password meant one credential to leak, no way to revoke one person without resetting both, and the per-IP lockout could be bypassed by rotating IPs.

**Fix.**
- `config.php` can hold `APP_USERS`, a bcrypt hash per account (`p1`, `p2`), or a single `APP_PASSWORD_HASH` shared by both. The server reports which mode is active and the client adapts.
- Requests send `X-App-User` and `X-App-Key`. In per-account mode the hash looked up is the one for that account. A wrong pair never reveals which part was wrong.
- Lockout is two-layered: 5 failures per IP **and** 20 failures per account across all IPs, both for 15 minutes.
- Each stored record carries `by`, the account that wrote it, which the audit log also records.
- `gen.php` creates the hashes in one call and is deleted after use, as with fix 1.

### Fix 8: service worker

The app shell (HTML, JS, CSS, fonts, icons, splash images) is cached for offline use. `api.php` is excluded from the cache so authentication and data are always live and never stored in the browser's cache storage. CSP gained `worker-src 'self'`.

### Fix 9: personal data out of the public code

**Problem.** The repo is public as a portfolio. Until v13 the client source contained both users' first names, body weights, calorie and protein targets and personal dietary notes. Anyone cloning the repo got them, and so did the ZAP reports, which embed the scanned response bodies.

**Fix.**
- The code refers only to `p1` and `p2`. Title, manifest, workout cues and sign-in screen are generic ("Meal Planner", "Person 1", "Person 2").
- `config.php` holds `APP_PROFILES`: names, targets and notes. `ping` returns them only after a correct password. Unauthenticated `ping` returns nothing personal.
- Old data files are renamed to the generic account ids on first request (`APP_LEGACY_FILES`), so no history is lost.
- Embedded response bodies and oversized evidence cells were stripped from the three ZAP HTML reports and replaced with a note. Alert tables and header evidence are unchanged.
- Caveat: earlier commits in this repo's history still contain the pre-v13 source. Rewriting history is the only way to remove that; for now the exposure is first names and nutrition targets, not credentials or data.

**OWASP:** A01 Broken Access Control (data exposed without authentication), A04 Insecure Design (secrets in client code).

### Lessons so far

- A scanner tells you what the server sends, not what the code does. Half the fixes came from reading the code with an attacker's questions.
- The first CSP was a false sense of security: present, graded A, and still allowing inline scripts. Strictness is the point, not presence.
- Removing the third-party font dependency fixed a security finding and made the app work offline. Fewer origins, fewer problems.
- Testing the lockout revealed its own bypass. Every control should be attacked after it is built.
- Strict validation broke a legitimate write on day one. Allow-lists need a test against real traffic.
- Evidence can leak too. The scan reports that proved the fixes also carried the source they scanned.

## Status

All nine fixes done. securityheaders.com F to A+. ZAP 8 alerts to 3 informational. Audit log live and readable in the app. Personal data served only after sign-in. Data stored outside the web root. Next: short-lived session tokens instead of the stored password, and removal of the one-time migration code.

## Author

Krish, based in Canada. Enterprise product designer, now building and securing my own systems end to end. Every fix here is documented, tested and mapped to OWASP so the work speaks for itself.
