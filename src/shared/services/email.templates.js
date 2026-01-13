export const verifyEmailTemplate = (link) => `
  <div style="font-family:Arial,sans-serif">
    <h2>Verify your Cinevraix account 🎬</h2>
    <p>Click the button below to verify your email:</p>
    <a href="${link}" style="
      display:inline-block;
      padding:12px 20px;
      background:#e50914;
      color:white;
      text-decoration:none;
      border-radius:4px;
      font-weight:bold;
    ">
      Verify Email
    </a>
    <p style="margin-top:16px;">This link expires in 1 hour.</p>
  </div>
`;

export const resetPasswordTemplate = (link) => `
  <div style="font-family:Arial,sans-serif">
    <h2>Reset your Cinevraix password</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${link}" style="
      display:inline-block;
      padding:12px 20px;
      background:#111;
      color:white;
      text-decoration:none;
      border-radius:4px;
      font-weight:bold;
    ">
      Reset Password
    </a>
    <p style="margin-top:16px;">This link expires in 1 hour.</p>
  </div>
`;
