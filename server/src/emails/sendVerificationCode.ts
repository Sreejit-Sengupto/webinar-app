import { VERIFICATION_EMAIL_TEMPLATE } from "../constants/EmailTemplates";
import resend from "./resendConfig";

const sendVerificationCode = async (email: string, verificationCode: string) => {
    const { data, error } = await resend.emails.send({
        from: "Webinar-app <onboarding@resend.dev>",
        to: [email],
        subject: "Your Verification Code for Account Verification",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode)
    })

    if (error) {
        console.error(error);
    }
    return data;
}

export default sendVerificationCode