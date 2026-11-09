# Meal Planner Security Hardening

A real web app I built and use daily, a meal and workout planner with a small PHP JSON API on shared hosting, used as a hands-on security project. Version 1 works but was written for function, not defence. This repo documents taking it from an unhardened baseline to a reasonably secure deployment, one change at a time, with evidence.

## What's here

- `index.html`, `api.php`, `.htaccess`, `manifest.json`, icons: the application
- `reports/`: OWASP ZAP, Nikto and securityheaders.com results, before and after each phase
- `docs/threat-model.md`: assets, attackers, attack paths, mapped to OWASP Top 10 (2021)
- `SETUP.md`: how to deploy on cPanel shared hosting
- One commit per fix, so the diff is the explanation

## The app

- Front end: single HTML file, vanilla JS, installable as a PWA
- Back end: `api.php`, three actions (ping, get, put), JSON file storage per user
- Auth: shared password sent as a request header
- Hosting: Apache/LiteSpeed on cPanel shared hosting, HTTPS via AutoSSL

## Fixes, in order

| # | Fix | OWASP 2021 | Status |
|---|-----|-----------|--------|
| 1 | Password stored as bcrypt hash | A02 Cryptographic Failures | done |
| 2 | Rate limiting and lockout on the API | A07 Identification and Authentication Failures | done |
| 3 | Security headers: HSTS, CSP, nosniff, frame deny, referrer policy, permissions policy | A05 Security Misconfiguration | done |
| 3b | Move inline script and styles to files, remove `unsafe-inline` from CSP, add SRI to fonts | A05 Security Misconfiguration | planned |
| 4 | Audit log of every read and write | A09 Security Logging and Monitoring Failures | planned |
| 5 | Strict validation of the request body | A03 Injection | planned |
| 6 | Backups and logs moved outside the web root | A05 Security Misconfiguration | planned |
| 7 | Per-user credentials with per-account lockout | A01 Broken Access Control | planned |

## Results

| Check | Before | After fix 3 | Final |
|-------|--------|-------------|-------|
| securityheaders.com grade | **F** (6 headers missing) | **A** | |
| OWASP ZAP alerts (high / medium / low / info) | **0 / 3 / 2 / 3** | **0 / 3 / 0 / 3** | |
| Nikto findings | | | |

### Baseline findings (09 Nov 2026)

**securityheaders.com: F.** Missing: Strict-Transport-Security, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Screenshot: `reports/headers-before.png`.

**OWASP ZAP 2.17.0, automated scan, Dev Standard policy.** Report: `reports/zap-before.html`.

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

**What the scanners cannot see.** Neither tool reports the plain-text password in `config.php`, the absence of rate limiting on `api.php`, the lack of an audit log, or the unvalidated JSON body. These come from the threat model (`docs/threat-model.md`), not from scanning. Fixes 1, 2, 4 and 5 address them.

### After fix 3 (09 Nov 2026)

All six headers are now sent by the server (`reports/headers-zap-response-after-fix3.png`, `reports/headers-after-fix3.png`). securityheaders.com grade F to A. ZAP report: `reports/zap-after-fix3.html`.

Remaining Medium alerts are all about the CSP being present but permissive: `script-src` and `style-src` allow `unsafe-inline`, and the Google Fonts stylesheet has no Subresource Integrity hash. The headers exist; they are not yet strict. Fix 3b moves the inline script and styles into separate files so `unsafe-inline` can be removed.

### Fix 2 observation

Testing the per-IP lockout (`reports/attempts-after-fix2.json`): my own browser was locked out after 5 failures as designed, but six probes from a tester spread over four IP addresses counted once each and never triggered the limit. Per-IP limiting is bypassed by distributed attempts. Fix 7 adds per-account lockout so the limit follows the credential, not the address.

## Status

Fixes 1 to 3 done. Headers F to A, ZAP Low cleared. Next: fix 3b (strict CSP), then fix 4 (audit log).

## Author

Person 1, based in Canada. 10 years in enterprise product design, now building and securing my own systems end to end. Every fix here is documented, tested and mapped to OWASP so the work speaks for itself.
