import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { otpStore } from "@/lib/otpStore";
import { sendOtpMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Account already exists. Please login.", userExists: true },
        { status: 409 }
      );
    }

    const existingRecord = otpStore.get(email);
    if (existingRecord && Date.now() < existingRecord.expires - 4 * 60 * 1000) {
      return NextResponse.json(
        { error: "OTP already sent. Please wait before requesting again." },
        { status: 429 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendOtpMail(email, name, otp);

    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    return NextResponse.json({
      message: "OTP sent to your email.",
      userExists: false,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}
