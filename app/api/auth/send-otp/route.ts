import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { otpStore } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });

    // Use DB name if exists, otherwise use provided name or fallback to 'User'
    const displayName = existingUser?.name || name || "User";

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
      html: `<p>Hello ${displayName},<br>Your OTP is <b>${otp}</b></p>`,
    });

    // Save OTP to memory store
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    return NextResponse.json({
      message: existingUser ? "Login OTP sent." : "Signup OTP sent.",
      userExists: !!existingUser,
    });
  } catch (error) {
    console.error("OTP Send Error:", error);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}

export { otpStore };
