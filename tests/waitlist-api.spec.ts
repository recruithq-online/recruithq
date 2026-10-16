import { test, expect } from "@playwright/test";
import { POST } from "../app/api/waitlist/route";

const validSubmission = {
  alias: "Atlas",
  email: "atlas@example.com",
  expertise: "Design",
  "bot-field": "",
};
const envNames = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "ADMIN_EMAIL",
] as const;
let savedEnv: (string | undefined)[];
let originalFetch: typeof fetch;

function request(
  fields = validSubmission,
  headers: Record<string, string> = {},
) {
  return new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...headers,
    },
    body: new URLSearchParams(fields).toString(),
  });
}

test.beforeEach(() => {
  savedEnv = envNames.map((name) => process.env[name]);
  originalFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = "re_test_placeholder";
  process.env.RESEND_FROM_EMAIL = "rEcruithq <waitlist@example.com>";
  process.env.ADMIN_EMAIL = "admin@example.com";
  // Any unexpected outgoing request fails locally; no test sends live email.
  globalThis.fetch = async () => {
    throw new Error("Unexpected outgoing request");
  };
});

test.afterEach(() => {
  globalThis.fetch = originalFetch;
  envNames.forEach((name, index) => {
    if (savedEnv[index] === undefined) delete process.env[name];
    else process.env[name] = savedEnv[index];
  });
});

test("emails submitted details to the configured admin, with the submitter as reply-to", async () => {
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls += 1;
    expect(url).toBe("https://api.resend.com/emails");
    expect(options?.method).toBe("POST");
    expect(options?.headers).toEqual({
      Authorization: "Bearer re_test_placeholder",
      "Content-Type": "application/json",
    });
    const message = JSON.parse(String(options?.body));
    expect(message).toMatchObject({
      from: "rEcruithq <waitlist@example.com>",
      to: ["admin@example.com"],
      reply_to: "atlas@example.com",
      subject: "New rEcruit expert waitlist submission",
      text: "A new expert joined the rEcruit waitlist.\n\nPublic alias: <Atlas>\nEmail address: atlas@example.com\nMain area of expertise: Design",
    });
    expect(message.html).toContain("#2864F0");
    expect(message.html).toContain("#FFFFFF");
    expect(message.html).toContain("Meet &lt;Atlas&gt;.");
    expect(message.html).not.toContain("<Atlas>");
    expect(message.html).toContain("mailto:atlas@example.com");
    return Response.json({ id: "test-email-id" });
  };
  // A client-supplied recipient must never override the server configuration.
  const fields = {
    ...validSubmission,
    alias: " <Atlas> ",
    to: "attacker@example.com",
  };
  const response = await POST(request(fields));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    success: true,
    emailId: "test-email-id",
  });
  expect(calls).toBe(1);
});

test("rejects invalid submissions before sending email", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return Response.json({ id: "unexpected" });
  };
  for (const fields of [
    { ...validSubmission, alias: " " },
    { ...validSubmission, alias: "a".repeat(33) },
    { ...validSubmission, alias: "Atlas\nInjected" },
    { ...validSubmission, email: "not-an-email" },
    {
      ...validSubmission,
      email: "atlas@example.com\r\nBcc: attacker@example.com",
    },
    { ...validSubmission, expertise: "Unknown expertise" },
  ]) {
    expect((await POST(request(fields))).status).toBe(400);
  }
  expect(
    (await POST(request({ ...validSubmission, alias: "x".repeat(5000) })))
      .status,
  ).toBe(413);
  expect(
    (
      await POST(
        request(validSubmission, { origin: "https://other.example.com" }),
      )
    ).status,
  ).toBe(403);
  expect(
    (
      await POST(
        request(validSubmission, { "Content-Type": "application/json" }),
      )
    ).status,
  ).toBe(415);
  expect(calls).toBe(0);
});

test("rejects honeypot submissions without falsely confirming an email was sent", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return Response.json({ id: "unexpected" });
  };
  const response = await POST(
    request({ ...validSubmission, "bot-field": "spam" }),
  );
  expect(response.status).toBe(400);
  expect(await response.json()).not.toHaveProperty("success", true);
  expect(calls).toBe(0);
});

test("reports missing email configuration instead of claiming success", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return Response.json({ id: "unexpected" });
  };
  for (const name of envNames) {
    const value = process.env[name];
    delete process.env[name];
    expect((await POST(request())).status).toBe(503);
    process.env[name] = value;
  }
  expect(calls).toBe(0);
});

test("reports Resend rejection, malformed responses, and network failures", async () => {
  for (const response of [
    Response.json({ message: "Rejected" }, { status: 403 }),
    Response.json({}),
    new Response("not json"),
  ]) {
    globalThis.fetch = async () => response;
    expect((await POST(request())).status).toBe(502);
  }
  globalThis.fetch = async () => {
    throw new Error("Connection failed");
  };
  const response = await POST(request());
  expect(response.status).toBe(502);
  expect(await response.json()).toEqual({
    error: "We couldn’t submit your details just now. Please try again.",
  });
});

test("logs the reason for a Resend test-recipient rejection without exposing addresses or the API key", async () => {
  const originalError = console.error;
  const logs: unknown[][] = [];
  console.error = (...args: unknown[]) => { logs.push(args); };
  globalThis.fetch = async () => Response.json({
    name: "validation_error",
    message: "You can only send testing emails to your own email address (owner@example.com). To send emails to other recipients, please verify a domain at resend.com/domains. re_test_placeholder",
  }, { status: 403 });
  try {
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "We couldn’t submit your details just now. Please try again.",
    });
    expect(logs).toEqual([["[waitlist] Resend rejected the email.", {
      status: 403,
      code: "validation_error",
      message: "You can only send testing emails to your own email address ([redacted email]). To send emails to other recipients, please verify a domain at resend.com/domains. [redacted key]",
    }]]);
  } finally {
    console.error = originalError;
  }
});
