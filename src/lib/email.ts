// Backend: Nodemailer Configuration
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Define the validation schema for the contact form data
const emailSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Set up the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'job.automationtest@gmail.com', // Replace with your Gmail account
    pass: 'your-app-password', // Replace with your Gmail App Password
  },
});

// Function to send email using Nodemailer
export async function sendEmail(data: z.infer<typeof emailSchema>) {
  try {
    // Validate the input data
    const validatedData = emailSchema.parse(data);

    // Send the email to 'info@muntasirelagami.com'
    await transporter.sendMail({
      from: 'job.automationtest@gmail.com', // Replace with your Gmail address
      to: 'info@muntasirelagami.com', // Send email to this address
      subject: `New Contact Form Submission from ${validatedData.name}`,
      text: `
Name: ${validatedData.name}
Email: ${validatedData.email}
Message: ${validatedData.message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${validatedData.name}</p>
<p><strong>Email:</strong> ${validatedData.email}</p>
<p><strong>Message:</strong> ${validatedData.message}</p>
      `,
    });

    // Return success message
    return { success: true };
  } catch (error) {
    // Log the error and return failure message
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}
