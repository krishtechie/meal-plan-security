<?php
// v16: transactional e-mail (verify address, reset password, invite to household). Plain PHP mail(), multipart text + HTML.
// Branding comes from config.php: BRAND_NAME, BRAND_COLOR, BRAND_LOGO (absolute URL), MAIL_FROM, MAIL_REPLY. All optional.
function brand(string $k, string $d): string { return defined($k) && is_string(constant($k)) && constant($k) !== '' ? constant($k) : $d; }
function appUrl(): string {
  if (defined('APP_URL') && APP_URL !== '') return rtrim(APP_URL, '/') . '/';
  $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
  $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
  $dir = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? '/'), '/');
  return ($https ? 'https' : 'http') . '://' . $host . $dir . '/';
}
function mailFrom(): string { $host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'localhost'); $host = preg_replace('/:\d+$/', '', $host); return brand('MAIL_FROM', 'noreply@' . $host); }

// Renders the branded shell around a short message with one button.
function emailHtml(string $title, string $intro, string $btnText, string $btnUrl, string $outro = ''): string {
  $name = htmlspecialchars(brand('BRAND_NAME', 'Meal Planner')); $color = brand('BRAND_COLOR', '#0a84ff'); $logo = brand('BRAND_LOGO', appUrl() . 'icon-192.png');
  $t = htmlspecialchars($title); $i = nl2br(htmlspecialchars($intro)); $b = htmlspecialchars($btnText); $u = htmlspecialchars($btnUrl); $o = nl2br(htmlspecialchars($outro));
  $host = htmlspecialchars(preg_replace('#^https?://#', '', rtrim(appUrl(), '/')));
  return <<<HTML
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>$t</title></head>
<body style="margin:0;padding:0;background:#f2f2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1c1e">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f2f7"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden">
<tr><td style="padding:28px 28px 8px"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
<td style="padding-right:12px"><img src="$logo" width="40" height="40" alt="" style="display:block;border-radius:10px"></td>
<td style="font-size:17px;font-weight:700;color:#1c1c1e">$name</td></tr></table></td></tr>
<tr><td style="padding:16px 28px 0;font-size:22px;font-weight:700;line-height:1.3">$t</td></tr>
<tr><td style="padding:12px 28px 0;font-size:16px;line-height:1.55;color:#3a3a3c">$i</td></tr>
<tr><td style="padding:24px 28px 8px"><a href="$u" style="display:inline-block;background:$color;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 22px;border-radius:14px">$b</a></td></tr>
<tr><td style="padding:12px 28px 0;font-size:13px;line-height:1.5;color:#8e8e93">If the button does not work, copy this link into your browser:<br><a href="$u" style="color:$color;word-break:break-all">$u</a></td></tr>
<tr><td style="padding:20px 28px 28px;font-size:14px;line-height:1.55;color:#6e6e73">$o</td></tr>
</table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px"><tr><td style="padding:18px 8px 0;font-size:12px;line-height:1.5;color:#8e8e93;text-align:center">Sent by $name · $host<br>You received this because an account on $name uses this e-mail address. If that was not you, you can ignore this message.</td></tr></table>
</td></tr></table></body></html>
HTML;
}
function sendMail(string $to, string $subject, string $title, string $intro, string $btnText, string $btnUrl, string $outro = ''): bool {
  $name = brand('BRAND_NAME', 'Meal Planner'); $from = mailFrom(); $reply = brand('MAIL_REPLY', $from);
  $text = "$title\n\n$intro\n\n$btnText: $btnUrl\n\n$outro\n\nSent by $name";
  $html = emailHtml($title, $intro, $btnText, $btnUrl, $outro);
  $b = 'b' . bin2hex(random_bytes(8));
  $enc = fn($s) => '=?UTF-8?B?' . base64_encode($s) . '?=';
  $headers = "From: " . $enc($name) . " <$from>\r\nReply-To: $reply\r\nMIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary=\"$b\"\r\nX-Mailer: MealPlanner\r\nAuto-Submitted: auto-generated";
  $body = "--$b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($text)) .
          "--$b\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($html)) . "--$b--";
  if (defined('MAIL_SINK') && MAIL_SINK !== '') { @file_put_contents(MAIL_SINK, json_encode(['to' => $to, 'subject' => $subject, 'url' => $btnUrl, 'html' => $html]) . "\n", FILE_APPEND); return true; }   // test installs: write instead of send
  return @mail($to, $enc($subject), $body, $headers, '-f' . $from);
}
function mailVerify(string $to, string $name, string $token): bool {
  return sendMail($to, 'Confirm your e-mail', "Hi $name, confirm your e-mail", "One tap and your account is confirmed. The link works for 24 hours.", 'Confirm e-mail', appUrl() . 'api.php?a=verify&t=' . $token);
}
function mailReset(string $to, string $name, string $token): bool {
  return sendMail($to, 'Reset your password', "Hi $name, reset your password", "Someone asked to reset the password for this account. If it was you, choose a new one with the button below. The link works for one hour and once only.", 'Choose a new password', appUrl() . '?reset=' . $token, "If you did not ask for this, nothing changes; your current password still works.");
}
function mailInvite(string $to, string $name, string $byName, string $household, string $token): bool {
  return sendMail($to, "$byName added you to $household", "Hi $name, you are in", "$byName added you to the household \"$household\". Set a password to start logging your meals, water, sleep and weight on your own phone. The link works for 7 days.", 'Set my password', appUrl() . '?invite=' . $token, "Your meals and targets are yours; $byName can see and edit them as the household owner.");
}
