// /app/api/user/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { Note } from "@/models/note";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notes = await Note.find({ userId: user._id }).lean();
  return NextResponse.json({ user, notes });
}
