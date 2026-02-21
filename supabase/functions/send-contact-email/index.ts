import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  recipientEmail: string;
}

const GMAIL_USER = Deno.env.get("GMAIL_USER") || "job.automationtest@gmail.com";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD") || "dinv ghvk kmpr ewpi";

async function sendSMTP(
  user: string,
  password: string,
  to: string,
  replyTo: string,
  subject: string,
  body: string
): Promise<void> {
  console.log(`Starting SMTP session with smtp.gmail.com:465 for ${to}`);
  const conn = await Deno.connectTls({ hostname: "smtp.gmail.com", port: 465 });
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  async function read(): Promise<string> {
    const buf = new Uint8Array(4096);
    const n = await conn.read(buf);
    const resp = decoder.decode(buf.subarray(0, n ?? 0));
    console.log("SMTP <<", resp.trim());
    return resp;
  }

  async function write(cmd: string, mask: boolean = false): Promise<void> {
    console.log("SMTP >>", mask ? "****" : cmd.trim());
    await conn.write(encoder.encode(cmd + "\r\n"));
  }

  try {
    await read();
    await write("EHLO smtp.gmail.com");
    await read();
    await write("AUTH LOGIN");
    await read();
    await write(btoa(user), true);
    await read();
    await write(btoa(password), true);
    const authResp = await read();
    if (!authResp.startsWith("235")) {
      throw new Error(`SMTP AUTH failed: ${authResp.trim()}`);
    }
    await write(`MAIL FROM:<${user}>`);
    await read();
    await write(`RCPT TO:<${to}>`);
    await read();
    await write("DATA");
    await read();

    const message = [
      `From: Portfolio Contact Form <${user}>`,
      `To: ${to}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=UTF-8`,
      ``,
      body,
      `.`,
    ].join("\r\n");

    await write(message, true); // Mask body for security in logs
    const dataResp = await read();
    if (!dataResp.startsWith("250")) {
      throw new Error(`SMTP DATA failed: ${dataResp.trim()}`);
    }
    await write("QUIT");
    await read();
  } catch (err) {
    console.error("SMTP Error during session:", err);
    throw err;
  } finally {
    conn.close();
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: ContactEmailPayload = await req.json();
    console.log("Received contact email request for recipient:", payload.recipientEmail);

    const { name, email, phone, message, recipientEmail } = payload;

    if (!name || !email || !message || !recipientEmail) {
      console.error("Validation failed: Missing required fields", { name, email, hasMessage: !!message, recipientEmail });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailBody = [
      "New Contact Form Submission",
      "",
      `From: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      "",
      "Message:",
      message,
      "",
      "---",
      "This email was sent from your portfolio contact form.",
    ].filter(Boolean).join("\r\n");

    console.log("Attempting to send email via SMTP...");
    await sendSMTP(
      GMAIL_USER,
      GMAIL_APP_PASSWORD,
      recipientEmail,
      email,
      `New Contact Form Message from ${name}`,
      emailBody
    );
    console.log("Email sent successfully!");

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Critical error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
