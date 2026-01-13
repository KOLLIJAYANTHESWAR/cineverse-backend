import { Resend } from "resend";
import { env } from "../../config/env.js";

/* ===============================
   RESEND CLIENT
   =============================== */
const resend = new Resend(env.resendApiKey);

/* ===============================
   SEND EMAIL (PRODUCTION SAFE)
   =============================== */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: env.emailFrom,
      to,
      subject,
      html,
    });

    console.log(`📨 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }
};
