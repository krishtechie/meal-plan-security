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
  $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
  $text = "$title\n\n$intro\n\n$btnText:\n$btnUrl\n\n$outro\n\n$name, $host";
  $html = emailHtml($title, $intro, $btnText, $btnUrl, $outro);
  $b = 'b' . bin2hex(random_bytes(8));
  $safeName = preg_replace('/[^\w .\-]/u', '', $name);
  // Plain 8-bit parts and ordinary headers: base64 bodies and missing Message-ID/Date are classic spam signals on shared-host relays.
  $headers = "From: $safeName <$from>\r\nReply-To: $reply\r\nDate: " . date('r') . "\r\nMessage-ID: <" . bin2hex(random_bytes(12)) . "@$host>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary=\"$b\"\r\nX-Mailer: MealPlanner\r\nAuto-Submitted: auto-generated\r\nPrecedence: bulk";
  $body = "--$b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$text\r\n\r\n" .
          "--$b\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$html\r\n\r\n--$b--";
  if (defined('MAIL_SINK') && MAIL_SINK !== '') { @file_put_contents(MAIL_SINK, json_encode(['to' => $to, 'subject' => $subject, 'url' => $btnUrl, 'html' => $html]) . "\n", FILE_APPEND); return true; }   // test installs: write instead of send
  return @mail($to, $subject, $body, $headers, '-f' . $from);
}
function mailVerify(string $to, string $name, string $token): bool {
  return sendMail($to, 'Confirm your e-mail address', "Hi $name, please confirm your e-mail", "This confirms that $to belongs to you. The link works for 24 hours.", 'Confirm e-mail address', appUrl() . 'api.php?a=verify&t=' . $token);
}
function mailReset(string $to, string $name, string $token): bool {
  return sendMail($to, 'Your sign-in reset link', "Hi $name, here is your reset link", "You asked for a reset link for your account. Open it to choose a new sign-in. The link works for one hour and once only.", 'Open reset link', appUrl() . '?reset=' . $token, "If you did not ask for this, nothing changes and you can ignore this message.");
}
function mailInvite(string $to, string $name, string $byName, string $household, string $token): bool {
  return sendMail($to, "$byName invited you to $household on " . brand('BRAND_NAME', 'Meal Planner'), "Hi $name, $byName added you", "$byName added you to the household \"$household\". Open the link to finish setting up your account and start logging meals, water, sleep and weight on your own phone. The link works for 7 days.", 'Finish setting up', appUrl() . '?invite=' . $token, "Your meals and targets are your own; $byName can see them as the household owner.");
}
