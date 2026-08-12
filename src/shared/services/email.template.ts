const escapeHtml = (value: string) => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};


export const verificationEmailTemplate = (
    name: string,
    verificationLink: string
) => {

    const safeName = escapeHtml(name);

    return `
    <div style="background-color: #F8F9FC; font-family: Inter, system-ui, -apple-system, sans-serif; padding: 40px 20px;">
        <div style="max-width: 560px; margin: 0 auto;">
            
            <div style="text-align: center; margin-bottom: 28px;">
                <h1 style="color: #111111; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.3px;">
                    Bytherix
                </h1>
            </div>
            
            <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);">
                
                <h2 style="margin-top: 0; color: #111111; font-size: 20px; font-weight: 700; margin-bottom: 20px;">
                    Verify your email address
                </h2>
                
                <p style="color: #0F172A; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
                    Hi ${safeName},
                </p>
                
                <p style="color: #0F172A; font-size: 15px; line-height: 1.6;">
                    Welcome to Bytherix. To complete your registration and secure your account, please verify your email address by clicking the button below.
                </p>
                
                <div style="text-align: center; margin: 36px 0;">
                    <a href="${verificationLink}"
                       style="background-color: #111111; color: #FFFFFF; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                
                <p style="font-size: 13px; color: #64748B; line-height: 1.5;">
                    If the button does not work, copy and paste this link into your browser:
                    <br />
                    <a href="${verificationLink}"
                       style="color: #111111; text-decoration: underline; word-break: break-all; display: inline-block; margin-top: 6px;">
                        ${verificationLink}
                    </a>
                </p>
                
                <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
                
                <p style="font-size: 12px; color: #64748B; line-height: 1.5; margin-bottom: 0;">
                    This verification link will expire in 24 hours. If you did not create a Bytherix account, you can safely ignore this email.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #64748B; letter-spacing: 0.5px;">
                &copy; 2026 Bytherix. All rights reserved.
            </div>

        </div>
    </div>
    `;
};


export const resetPasswordEmailTemplate = (
    name: string,
    resetLink: string
) => {
    const safeName = escapeHtml(name);

    return `
    <div style="background-color: #F8F9FC; font-family: Inter, system-ui, -apple-system, sans-serif; padding: 40px 20px;">
        <div style="max-width: 560px; margin: 0 auto;">
            
            <div style="text-align: center; margin-bottom: 28px;">
                <h1 style="color: #111111; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.3px;">
                    Bytherix
                </h1>
            </div>
            
            <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);">
                
                <h2 style="margin-top: 0; color: #111111; font-size: 20px; font-weight: 700; margin-bottom: 20px;">
                    Reset your password
                </h2>
                
                <p style="color: #0F172A; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
                    Hi ${safeName},
                </p>
                
                <p style="color: #0F172A; font-size: 15px; line-height: 1.6;">
                    You recently requested to reset your password for your Bytherix account. Click the button below to reset it. This password reset link is only valid for 15 minutes.
                </p>
                
                <div style="text-align: center; margin: 36px 0;">
                    <a href="${resetLink}"
                       style="background-color: #111111; color: #FFFFFF; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p style="font-size: 13px; color: #64748B; line-height: 1.5;">
                    If the button does not work, copy and paste this link into your browser:
                    <br />
                    <a href="${resetLink}"
                       style="color: #111111; text-decoration: underline; word-break: break-all; display: inline-block; margin-top: 6px;">
                        ${resetLink}
                    </a>
                </p>
                
                <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
                
                <p style="font-size: 12px; color: #64748B; line-height: 1.5; margin-bottom: 0;">
                    If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #64748B; letter-spacing: 0.5px;">
                &copy; 2026 Bytherix. All rights reserved.
            </div>

        </div>
    </div>
    `;
};

