export const verifyEmailTemplate = (link) => `
  <div style="font-family:Arial">
    <h2>Verify your CineVerse account</h2>
    <p>Click the button below to verify your email:</p>
    <a href="${link}" style="
      display:inline-block;
      padding:12px 20px;
      background:#e50914;
      color:white;
      text-decoration:none;
      border-radius:4px;
    ">
      Verify Email
    </a>
    <p>This link expires in 1 hour.</p>
  </div>
`;

export const resetPasswordTemplate = (link) => `
  <div style="font-family:Arial">
    <h2>Reset your CineVerse password</h2>
    <p>Click below to reset your password:</p>
    <a href="${link}" style="
      display:inline-block;
      padding:12px 20px;
      background:#111;
      color:white;
      text-decoration:none;
      border-radius:4px;
    ">
      Reset Password
    </a>
    <p>This link expires in 1 hour.</p>
  </div>
`;
