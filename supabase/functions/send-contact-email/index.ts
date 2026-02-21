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

async function sendSMTP(
  user: string,
  password: string,
  to: string,
  replyTo: string,
  subject: string,
  body: string
): Promise<void> {
  const conn = await Deno.connectTls({
    hostname: "smtp.gmail.com",
    port: 465,
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  async function read(): Promise<string> {
    const buf = new Uint8Array(4096);
    const n = await conn.read(buf);
    const text = decoder.decode(buf.subarray(0, n ?? 0));
    console.log("SMTP <", text.trim());
    return text;
  }

  async function write(cmd: string): Promise<void> {
    await conn.write(encoder.encode(cmd + "\r\n"));
  }

  try {
    await read(); // server greeting

    await write(`EHLO smtp.gmail.com`);
    await read();

    await write(`AUTH LOGIN`);
    await read();

    await write(btoa(user));
    await read();

    await write(btoa(password));
    const authResp = await read();
    if (!authResp.startsWith("235")) {
      throw new Error(`SMTP AUTH failed: ${authResp.trim()}`);
    }

    await write(`MAIL FROM:<${user}>`);
    await read();

    await write(`RCPT TO:<${to}>`);
    await read();

    await write(`DATA`);
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

    await write(message);
    const dataResp = await read();
    if (!dataResp.startsWith("250")) {
      throw new Error(`SMTP DATA failed: ${dataResp.trim()}`);
    }

    await write(`QUIT`);
    await read();
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
    const { name, email, phone, message, recipientEmail } = payload;

    if (!name || !email || !message || !recipientEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GMAIL_USER = Deno.env.get("GMAIL_USER");
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error("Gmail credentials not configured");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Message saved but email notification disabled (Gmail credentials not configured)",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailBody = [
      "New Contact Form Submission",
      "",
      `From: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      "",
      "Message:",
      message,
      "",
      "---",
      "This email was sent from your portfolio contact form.",
    ].filter(line => line !== undefined).join("\r\n");

    await sendSMTP(
      GMAIL_USER,
      GMAIL_APP_PASSWORD,
      recipientEmail,
      email,
      `New Contact Form Message from ${name}`,
      emailBody
    );

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});