import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'App';
  return resend.emails.send({
    from: params.from || `${appName} <noreply@${process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') || 'app.com'}>`,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'App';
  return sendEmail({
    to: email,
    subject: `Welcome to ${appName}!`,
    html: `
      <h1>Welcome to ${appName}, ${name}!</h1>
      <p>We're excited to have you on board. Here's how to get started:</p>
      <ol>
        <li>Complete your profile in Settings</li>
        <li>Explore the dashboard</li>
        <li>Create your first project</li>
      </ol>
      <p>If you have any questions, just reply to this email.</p>
    `,
  });
}
