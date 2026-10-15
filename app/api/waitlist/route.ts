import { expertiseAreas } from "@/lib/waitlist";
import { createWaitlistEmail } from "@/lib/waitlist-email";

export const runtime = "nodejs";

const emailPattern = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const controlCharacters = /[\u0000-\u001f\u007f]/;
const errorMessage =
  "We couldn’t submit your details just now. Please try again.";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (
    !request.headers
      .get("content-type")
      ?.startsWith("application/x-www-form-urlencoded")
  ) {
    return Response.json(
      { error: "Unsupported form format." },
      { status: 415 },
    );
  }
  if (Number(request.headers.get("content-length")) > 4096) {
    return Response.json(
      { error: "Submission is too large." },
      { status: 413 },
    );
  }

  let payload: URLSearchParams;
  try {
    const body = await request.text();
    if (body.length > 4096) {
      return Response.json(
        { error: "Submission is too large." },
        { status: 413 },
      );
    }
    payload = new URLSearchParams(body);
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  // Never report a successful email when the spam trap prevents sending.
  if (payload.get("bot-field")?.trim()) {
    console.warn("[waitlist] Submission blocked by the honeypot field.");
    return Response.json(
      {
        error:
          "We couldn’t verify this submission. Refresh the page and try again.",
      },
      { status: 400 },
    );
  }

  const alias = payload.get("alias")?.trim() ?? "";
  const email = payload.get("email")?.trim() ?? "";
  const expertise = payload.get("expertise")?.trim() ?? "";
  if (
    !alias ||
    alias.length > 32 ||
    controlCharacters.test(alias) ||
    email.length > 254 ||
    !emailPattern.test(email) ||
    controlCharacters.test(email) ||
    !expertiseAreas.some((area) => area === expertise)
  ) {
    return Response.json(
      { error: "Enter a valid alias, email address, and expertise." },
      { status: 400 },
    );
  }

  // These variables are read only on the server and never sent to the browser.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!apiKey || !from || !adminEmail || !emailPattern.test(adminEmail)) {
    console.error("[waitlist] Email configuration is missing or invalid.", {
      apiKeyConfigured: Boolean(apiKey),
      senderConfigured: Boolean(from),
      adminConfigured: Boolean(adminEmail && emailPattern.test(adminEmail)),
    });
    return Response.json({ error: errorMessage }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [adminEmail],
        reply_to: email,
        ...createWaitlistEmail({ alias, email, expertise }),
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!response.ok) {
      const details: unknown = await response.json().catch(() => null);
      console.error("[waitlist] Resend rejected the email.", {
        status: response.status,
        code:
          typeof details === "object" &&
          details &&
          "name" in details &&
          typeof details.name === "string"
            ? details.name
            : "unknown",
      });
      return Response.json({ error: errorMessage }, { status: 502 });
    }
    const result: unknown = await response.json();
    if (
      typeof result !== "object" ||
      !result ||
      !("id" in result) ||
      typeof result.id !== "string" ||
      !result.id
    ) {
      console.error("[waitlist] Resend response did not contain an email ID.");
      return Response.json({ error: errorMessage }, { status: 502 });
    }
    console.info("[waitlist] Email accepted by Resend.", {
      emailId: result.id,
    });
    return Response.json({ success: true, emailId: result.id });
  } catch (error) {
    console.error("[waitlist] Resend request failed.", {
      type: error instanceof Error ? error.name : "UnknownError",
    });
    return Response.json({ error: errorMessage }, { status: 502 });
  }
}
