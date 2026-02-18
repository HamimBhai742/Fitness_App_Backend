import sendEmail from "./nodemailerTransport";

export const forgetPasswordResetLinkTemplate = async (
  userName: string,
  subject: string,
  email: string,
  resetLink: string
) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f6f9;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        .email-header {
            padding: 40px 40px 20px;
            text-align: center;
        }

        .company-logo img {
            width: 120px;
            height: auto;
        }

        .email-content {
            padding: 0 40px 30px;
        }

        .greeting {
            font-size: 16px;
            color: #1f2937;
            margin-bottom: 16px;
            font-weight: 500;
        }

        .main-text {
            font-size: 15px;
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 16px;
        }

        .action-button {
            display: inline-block;
            margin-top: 20px;
            padding: 14px 28px;
            background-color: #ef4444;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
        }

        .security-note {
            font-size: 13px;
            color: #6b7280;
            margin-top: 25px;
            line-height: 1.5;
        }

        .footer {
            padding: 24px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 13px;
        }

        @media only screen and (max-width: 600px) {
            .email-header,
            .email-content,
            .footer {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td style="padding: 20px 0;">
                <div class="email-container">

                    <!-- Header -->
                    <div class="email-header">
                        <div class="company-logo">
                            <img src="https://i.postimg.cc/d3GFX2Nn/logo.png" alt="Company Logo" />
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="email-content">
                        <p class="greeting">Hello ${userName},</p>

                        <p class="main-text">
                            We received a request to reset your password. Click the button below to set a new password.
                        </p>

                        <a href="${resetLink}" class="action-button">
                            Reset Password
                        </a>

                        <p class="security-note">
                            This link will expire in <strong>10 minutes</strong> for security reasons.
                            If you did not request a password reset, you can safely ignore this email.
                        </p>

                        <p class="security-note">
                            For your protection, never share this link with anyone.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        Need help? Contact our support team.<br />
                        Regards,<br />
                        Team <strong>Your Company Name</strong>
                    </div>

                </div>
            </td>
        </tr>
    </table>
</body>
</html>`;

  await sendEmail(email, subject, html);
};
