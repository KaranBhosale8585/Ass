import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/lib/otpStore";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { generateToken } from "@/utils/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, otp, name } = await req.json();
  const record = otpStore.get(email);

  if (!record) {
    return NextResponse.json(
      { error: "No OTP found for this email." },
      { status: 400 }
    );
  }

  if (record.otp !== otp) {
    return NextResponse.json({ error: "Invalid OTP." }, { status: 400 });
  }

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return NextResponse.json({ error: "OTP expired." }, { status: 400 });
  }

  try {
    await connectDB();

    let user = await User.findOne({ email });

    // If user doesn't exist, create one
    if (!user) {
      user = await User.create({ name, email });
    }

    otpStore.delete(email); // Clean up used OTP

    const token = await generateToken(user);

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
