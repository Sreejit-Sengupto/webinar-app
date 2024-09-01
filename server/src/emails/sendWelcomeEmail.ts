import { WELCOME_EMAIL } from "../constants/EmailTemplates";
import resend from "./resendConfig";

const sendWelcomeEmail = async (email: string, fullName: string) => {
    const { data, error } = await resend.emails.send({
        from: "Webinar-app <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome Aboard! Let's Get Started with Webinar-app",
        html: WELCOME_EMAIL.replace("{Name}", fullName)
    })

    if (error) {
        console.error(error);
    }
    return data;
}

export default sendWelcomeEmail