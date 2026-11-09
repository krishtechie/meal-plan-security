# Meal Planner Security Hardening

A real web app I built and use daily, a meal and workout planner with a small PHP JSON API on shared hosting, used as a hands-on security project. Version 1 works but was written for function, not defence. This repo documents taking it from an unhardened baseline to a reasonably secure deployment, one change at a time, with evidence.

## What's here

- `index.html`, `app.js`, `app.css`, `api.php`, `.htaccess`, `manifest.json`, `fonts/`, icons: the application
- `config.example.php`: structure of the server config (the real one holds a password hash and is never committed)
- `reports/`: OWASP ZAP and securityheaders.com results, before and after each phase
- `docs/threat-model.md`: assets, attackers, attack paths, mapped to OWASP Top 10 (2021)
- `SETUP.md`: how to deploy on cPanel shared hosting
- One commit per fix, so the diff is the explanation

## The app

- Front end: HTML, vanilla JS, self-hosted fonts, installable as a PWA
- Back end: `api.php`, three actions (ping, get, put), JSON file storage per user
- Auth: shared password sent as a request header, verified against a bcrypt hash
- Hosting: LiteSpeed on cPanel shared hosting, HTTPS via AutoSSL

## Fixes, in order

| # | Fix | OWASP 2021 | Status |
|---|-----|-----------|--------|
| 1 | Password stored as bcrypt hash | A02 Cryptographic Failures | done |
| 2 | Rate limiting and lockout on the API | A07 Identification and Authentication Failures | done |
| 3 | Security headers: HSTS, CSP, nosniff, frame deny, referrer policy, permissions policy | A05 Security Misconfiguration | done |
| 3b | Strict CSP: inline script and styles moved to files, `unsafe-inline` removed, fonts self-hosted, COOP/CORP added | A05 Security Misconfiguration | done |
| 3c | Forced HTTPS redirect so HSTS has a secure first visit | A02 Cryptographic Failures | done |
| 4 | Audit log of every read and write | A09 Security Logging and Monitoring Failures | planned |
| 5 | Strict validation of the request body | A03 Injection | planned |
| 6 | Backups and logs moved outside the web root | A05 Security Misconfiguration | planned |
| 7 | Per-user credentials with per-account lockout | A01 Broken Access Control | planned |

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

**What the scanners cannot see.** Neither tool reports the plain-text password in `config.php`, the absence of rate limiting on `api.php`, the lack of an audit log, or the unvalidated JSON body. These come from the threat model, not from scanning. Fixes 1, 2, 4 and 5 address them.

### After fix 3

All six headers sent. Grade F to A. ZAP's three "header not set" Mediums and the nosniff Low cleared. Three new Mediums appeared: the CSP existed but allowed `unsafe-inline` for scripts and styles, and the Google Fonts stylesheet had no integrity hash. Having a header is not the same as having a strict one.

### After fix 3b

Inline `<script>` moved to `app.js`, `<style>` to `app.css`, 36 inline `style=""` attributes converted to CSS rules, Google Fonts replaced by self-hosted woff2 files. CSP is now `script-src 'self'; style-src 'self'; font-src 'self'` with no `unsafe-inline`, plus `object-src 'none'`, COOP and CORP. Grade A+. ZAP: zero High, Medium or Low. Three Informational notes remain (suspicious comments in JS, "modern web application", cache-control review), none a vulnerability.

### Fix 2 observation

Testing the per-IP lockout (`reports/attempts-after-fix2.json`): my own browser was locked out after 5 failures as designed, but six probes from one tester spread across four IP addresses counted once each and never triggered the limit. Per-IP limiting is bypassed by distributed attempts. Fix 7 adds per-account lockout so the limit follows the credential, not the address.

### Lessons so far

- A scanner tells you what the server sends, not what the code does. Half the fixes came from reading the code with an attacker's questions.
- The first CSP was a false sense of security: present, graded A, and still allowing inline scripts. Strictness is the point, not presence.
- Removing the third-party font dependency fixed a security finding and made the app work offline. Fewer origins, fewer problems.
- Testing the lockout revealed its own bypass. Every control should be attacked after it is built.

## Status

Fixes 1 to 3c done. securityheaders.com F to A+. ZAP 8 alerts to 3 informational. Next: fix 4, audit log.

## Author

Person 1, based in Canada. 10 years in enterprise product design, now building and securing my own systems end to end. Every fix here is documented, tested and mapped to OWASP so the work speaks for itself.
