import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: false, // TLS
  auth: {
    user: env.emailUser,
    pass: env.emailPass,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    html,
  });
};
