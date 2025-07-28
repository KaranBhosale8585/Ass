import nodemailer from "nodemailer";

export async function sendOtpMail(email: string, name: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Hello ${name},<br>Your OTP is <b>${otp}</b></p>`,
  });
}
