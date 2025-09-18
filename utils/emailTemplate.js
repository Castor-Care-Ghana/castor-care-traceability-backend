export const registerEmailTemplate = (content) => `
  <div style="font-family: Arial, sans-serif; color: #d6cbd1; padding: 20px;">

    <div style="; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">

    <h1 style="color: #800020; font-size: 30px; line-height: 1.5; text-align: center;">Welcome to Castor Care Ghana!</h1>

      <div style="color:#000000; font-size: 18px; line-height: 1.5; text-align: start;">
        ${content}
      </div>

      <div style="color:#000000; font-size: 15px; margin-top: 50px; line-height: 1; text-align: start;">
      <p>Best regards</p>
      <p>Castor Care Ghana</p>
      
      </div>
      <footer style="margin-top: 30px; font-size: 12px; color: #777; text-align: start; line-height: 0.75;">
      <p style="font-size: 12px; color: gray;">This is an automated message. Please do not reply to this email.</p>
        <p style="font-size: 12px; color: gray;">If you have any questions or concerns, please contact us at <a href="mailto:info@castorcareghana.com">info@castorcareghana.com</a></p>
        <p>&copy; ${new Date().getFullYear()} Castor Care Ghana. All rights reserved.</p>
      </footer>

    </div>
  </div>
`;


export const forgotPasswordTemplate = (resetLink, firstName = 'User') => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #28a745; text-align: center;">Reset Your Password</h2>

    <p>Hi ${firstName},</p>

    <p>We received a request to reset your password. To proceed, please click the button below:</p>

    <div style="text-align: center; margin: 20px 0;">
      <a href="${resetLink}" 
         style="background-color: #28a745; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
         Reset Password
      </a>
    </div>

    <p>If the button above doesn't work, you can copy and paste the link below into your browser:</p>

    <p style="word-break: break-all; background-color: #f8f8f8; padding: 10px; border-left: 4px solid #28a745;">
      ${resetLink}
    </p>

    <p>This link will expire in <strong>30 minutes</strong> for your security.</p>

    <p>If you did not request a password reset, you can safely ignore this email. Your account will remain secure.</p>

    <p>Warm regards,<br/>Team <strong>Castor Care Ghana</strong></p>

    <hr style="margin-top: 40px; border: none; border-top: 1px solid #ccc;" />

    <p style="font-size: 12px; color: #999; text-align: center;">
      Need help? Contact our support team at <a href="mailto:info@castorcareghana.com">info@castorcareghana.com</a>
    </p>
  </div>
`;

export const resetPasswordTemplate = (firstName = 'User') => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #28a745; text-align: center;">Password Successfully Reset</h2>

    <p>Hi ${firstName},</p>

    <p>Your password has been successfully reset.</p>

    <p>Warm regards,<br/>Team <strong>Castor Care Ghana</strong></p>

    <hr style="margin-top: 40px; border: none; border-top: 1px solid #ccc;" />

    <p style="font-size: 12px; color: #999; text-align: center;">
      Need help? Contact our support team at <a href="mailto:info@castorcareghana.com">info@castorcareghana.com</a>
    </p>
  </div>
`;  

