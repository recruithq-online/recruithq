export interface WaitlistDetails {
  alias: string;
  email: string;
  expertise: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export function createWaitlistEmail({
  alias,
  email,
  expertise,
}: WaitlistDetails) {
  const name = escapeHtml(alias);
  const address = escapeHtml(email);
  const skill = escapeHtml(expertise);
  const replyUrl = `mailto:${encodeURIComponent(email).replace(/%40/g, "@")}?subject=${encodeURIComponent("Your rEcruit waitlist signup")}`;
  const brand = "#2864F0";
  const paper = "#FFFFFF";
  const ink = "#101828";

  return {
    subject: "New rEcruit expert waitlist submission",
    text: [
      "A new expert joined the rEcruit waitlist.",
      "",
      `Public alias: ${alias}`,
      `Email address: ${email}`,
      `Main area of expertise: ${expertise}`,
    ].join("\n"),
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>A new expert joined rEcruit</title>
  <style>
    @media only screen and (max-width: 600px) {
      .outer { padding: 20px 12px !important; }
      .content { padding: 28px 24px !important; }
      .headline { font-size: 32px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${paper};color:${ink};font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">A new expert has joined the rEcruit waitlist. Their details are ready to review.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:${paper};">
    <tr><td class="outer" align="center" style="padding:48px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border:1px solid ${brand};border-radius:16px;border-spacing:0;overflow:hidden;">
        <tr><td class="content" style="padding:36px 40px 40px;background-color:${brand};color:${paper};border-radius:15px 15px 0 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-size:27px;font-weight:700;letter-spacing:-1.2px;color:${paper};">rEcruit<span style="font-size:15px;font-weight:400;letter-spacing:0;">.</span></td>
            <td align="right" style="font-size:10px;font-weight:600;letter-spacing:1.5px;color:${paper};">EXPERT WAITLIST</td>
          </tr></table>
          <p style="margin:40px 0 12px;font-size:11px;letter-spacing:2px;color:${paper};">WAITLIST SIGNUP</p>
          <h1 class="headline" style="margin:0;font-size:40px;line-height:1.15;letter-spacing:-1.2px;font-weight:500;color:${paper};">A new expert<br>is on the list.</h1>
          <p style="margin:18px 0 0;font-size:15px;line-height:1.7;color:${paper};">Someone new has joined rEcruit.<br>Their details are ready below.</p>
        </td></tr>
        <tr><td class="content" style="padding:36px 40px;background-color:${paper};">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:${ink};">NEW EXPERT</p>
          <h2 style="margin:0 0 28px;font-size:28px;line-height:1.3;letter-spacing:-0.6px;font-weight:600;color:${ink};overflow-wrap:anywhere;">Meet ${name}.</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed;">
            <tr><td style="padding:18px 0;border-top:1px solid ${brand};">
              <p style="margin:0 0 7px;font-size:11px;letter-spacing:1px;font-weight:600;color:${ink};">PUBLIC ALIAS</p>
              <p style="margin:0;font-size:17px;line-height:1.6;color:${ink};word-wrap:break-word;overflow-wrap:anywhere;">${name}</p>
            </td></tr>
            <tr><td style="padding:18px 0;border-top:1px solid ${brand}26;">
              <p style="margin:0 0 7px;font-size:11px;letter-spacing:1px;font-weight:600;color:${ink};">EMAIL ADDRESS</p>
              <a href="${escapeHtml(replyUrl)}" style="font-size:17px;line-height:1.6;color:${ink};text-decoration:underline;text-underline-offset:3px;word-wrap:break-word;overflow-wrap:anywhere;">${address}</a>
            </td></tr>
            <tr><td style="padding:18px 0 25px;border-top:1px solid ${brand}26;border-bottom:1px solid ${brand};">
              <p style="margin:0 0 7px;font-size:11px;letter-spacing:1px;font-weight:600;color:${ink};">AREA OF EXPERTISE</p>
              <p style="margin:0;font-size:17px;line-height:1.6;color:${ink};word-wrap:break-word;overflow-wrap:anywhere;">${skill}</p>
            </td></tr>
          </table>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 16px;"><tr><td bgcolor="${brand}" style="background-color:${brand};border-radius:8px;">
            <a href="${escapeHtml(replyUrl)}" style="display:inline-block;padding:16px 24px;border:1px solid ${brand};border-radius:8px;font-size:14px;line-height:1.3;font-weight:600;text-decoration:none;color:${paper};">Reply to this expert &nbsp; &#8599;</a>
          </td></tr></table>
          <p style="margin:0;font-size:12px;line-height:1.7;color:${ink};">You can also reply directly to this email to reach ${name}.</p>
        </td></tr>
        <tr><td class="content" style="padding:24px 40px;background-color:${paper};border-top:1px solid ${brand}26;border-radius:0 0 15px 15px;">
          <p style="margin:0 0 5px;font-size:13px;font-weight:600;color:${ink};">rEcruit — reputation, built on work.</p>
          <p style="margin:0;font-size:11px;line-height:1.7;color:${ink};">Admin notification · Expert waitlist</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}
