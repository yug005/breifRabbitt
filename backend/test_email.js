import nodemailer from 'nodemailer';
import 'dotenv/config';

console.log('Testing SMTP connection for:', process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
      to: 'yuga6627@gmail.com',
      subject: 'Test Email from BriefRabbit',
      text: 'This is a test email to verify your SMTP configuration is working correctly.',
      html: '<b>This is a test email</b> to verify your SMTP configuration is working correctly.',
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

main();
