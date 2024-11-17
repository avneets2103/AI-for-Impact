import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_MAILER_API_KEY);

export const sendResendMail = async (email, subject, content) => {
  try {
    console.log(email, subject);
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject,
      html: content,
    });
  } catch (error) {
    console.log(error);
  }
};