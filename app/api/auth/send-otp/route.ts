// /api/auth/send-otp.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { otpStore } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });

    //  User not found — return early and prompt client to redirect to signup
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found. Redirecting to signup.", userExists: false },
        { status: 404 }
      );
    }

    //  Cooldown check (1 min before allowing resend)
    const existingRecord = otpStore.get(email);
    if (existingRecord && Date.now() < existingRecord.expires - 4 * 60 * 1000) {
      return NextResponse.json(
        { error: "OTP already sent. Please wait before requesting again." },
        { status: 429 }
      );
    }

    //  Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

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
      html: `<p>Hello ${existingUser.name},<br>Your OTP is <b>${otp}</b></p>`,
    });

    //  Store OTP in memory for 5 mins
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    console.log("OTP stored:", otpStore.get(email));

    return NextResponse.json({
      message: "OTP sent to your email.",
      userExists: true,
    });
  } catch (error) {
    console.error("OTP Send Error:", error);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
