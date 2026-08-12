import { Resend } from "resend";
import { ENV } from "../../infrastructure/env.js";
import { verificationEmailTemplate, resetPasswordEmailTemplate } from "./email.template.js";

const resend = new Resend(ENV.RESEND_API_KEY);

export class EmailService {

    static async sendVerificationLink(
        to: string,
        name: string,
        verificationToken: string
    ) {
        const verificationLink =
            `${ENV.FRONTEND_URL}/verify-email/${verificationToken}`;


        const { data, error } = await resend.emails.send({
            from: ENV.EMAIL_FROM,
            to: [to],
            subject: "Confirm your Bytherix Registration",
            html: verificationEmailTemplate(
                name,
                verificationLink
            ),
        });


        if (error) {
            console.error(
                "Resend email failed:",
                error
            );

            return false;
        }


        console.log("Email sent:", data?.id);

        return true;
    }

    static async sendResetPasswordLink(
        to: string,
        name: string,
        resetToken: string
    ) {
        const resetLink =
            `${ENV.FRONTEND_URL}/reset-password/${resetToken}`;

        const { data, error } = await resend.emails.send({
            from: ENV.EMAIL_FROM,
            to: [to],
            subject: "Reset your Bytherix Password",
            html: resetPasswordEmailTemplate(
                name,
                resetLink
            ),
        });

        if (error) {
            console.error(
                "Resend reset email failed:",
                error
            );
            return false;
        }

        console.log("Reset email sent:", data?.id);
        return true;
    }
}

