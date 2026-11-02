import nodemailer from "nodemailer";

/**
 * Creates a Nodemailer transporter from environment variables.
 * Supports Gmail, SMTP, or any nodemailer-compatible provider.
 * Required env vars:
 *   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
 * Optional:
 *   EMAIL_FROM  (defaults to EMAIL_USER)
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const FROM = () => process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@photostudio.app";
const BASE_URL = () => process.env.FRONTEND_URL || "http://localhost:5173";

export async function sendPasswordResetEmail({ to, name, token }) {
  const transporter = createTransporter();
  const link = `${BASE_URL()}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Photo Studio" <${FROM()}>`,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #3d4a2e;">Reset your password</h2>
        <p>Hi ${name || "there"},</p>
        <p>We received a request to reset the password for your Photo Studio account.</p>
        <p style="margin: 24px 0;">
          <a href="${link}"
             style="background:#6b7c4d;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
            Reset password
          </a>
        </p>
        <p style="color:#666;font-size:13px;">
          This link expires in <strong>1 hour</strong>.<br/>
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#999;font-size:12px;">Photo Studio &mdash; Every moment, beautifully preserved.</p>
      </div>
    `,
  });
}

export async function sendEmailVerification({ to, name, token }) {
  const transporter = createTransporter();
  const link = `${BASE_URL()}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Photo Studio" <${FROM()}>`,
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #3d4a2e;">Verify your email</h2>
        <p>Hi ${name || "there"},</p>
        <p>Click the button below to verify your email address for Photo Studio.</p>
        <p style="margin: 24px 0;">
          <a href="${link}"
             style="background:#6b7c4d;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
            Verify email
          </a>
        </p>
        <p style="color:#666;font-size:13px;">
          This link expires in <strong>24 hours</strong>.<br/>
          If you didn't create a Photo Studio account, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#999;font-size:12px;">Photo Studio &mdash; Every moment, beautifully preserved.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail({ to, name }) {
  const transporter = createTransporter();
  const link = `${BASE_URL()}/dashboard`;

  await transporter.sendMail({
    from: `"Photo Studio" <${FROM()}>`,
    to,
    subject: "Welcome to Photo Studio! 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #2b2b2b;">
        <h2 style="color: #3d4a2e; margin-bottom: 8px;">Welcome to Photo Studio!</h2>
        <p>Hi ${name || "there"},</p>
        <p>Your photographer account has been successfully created. You can now start creating client galleries, uploading photos, and delivering proofing seamlessly.</p>
        <p style="margin: 24px 0;">
          <a href="${link}"
             style="background:#6b7c4d;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">
            Go to Your Dashboard
          </a>
        </p>
        <p style="color:#666;font-size:13px;">
          Need help getting started? Visit your account settings to customize your studio branding and client access preferences.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#999;font-size:12px;">Photo Studio &mdash; Every moment, beautifully preserved.</p>
      </div>
    `,
  });
}

export async function sendLoginNotificationEmail({ to, name, ip, time }) {
  const transporter = createTransporter();
  const resetLink = `${BASE_URL()}/forgot-password`;
  const formattedTime = time || new Date().toUTCString();

  await transporter.sendMail({
    from: `"Photo Studio Security" <${FROM()}>`,
    to,
    subject: "Security Alert: New login to your Photo Studio account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #2b2b2b;">
        <h2 style="color: #3d4a2e; margin-bottom: 8px;">New Login Detected</h2>
        <p>Hi ${name || "there"},</p>
        <p>We noticed a successful sign-in to your Photo Studio account:</p>
        <div style="background: #f7f7f5; border: 1px solid #e5e5e0; border-radius: 6px; padding: 14px 18px; margin: 16px 0; font-size: 14px;">
          <p style="margin: 4px 0;"><strong>Time:</strong> ${formattedTime}</p>
          ${ip ? `<p style="margin: 4px 0;"><strong>IP Address:</strong> ${ip}</p>` : ""}
        </div>
        <p style="color:#666;font-size:13px;">
          If this was you, you can safely ignore this email.
        </p>
        <p style="color:#c53030;font-size:13px;margin-top:12px;">
          If you didn't sign in, someone else might have accessed your account. We recommend resetting your password immediately:
        </p>
        <p style="margin: 16px 0;">
          <a href="${resetLink}"
             style="background:#c53030;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;font-size:13px;">
            Secure Your Account
          </a>
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#999;font-size:12px;">Photo Studio &mdash; Every moment, beautifully preserved.</p>
      </div>
    `,
  });
}
