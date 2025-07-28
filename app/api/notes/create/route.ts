import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/note";
import { getCurrentUser } from "@/utils/getCurrentUser";

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title } = await req.json();
    if (!title)
      return NextResponse.json({ error: "Title required" }, { status: 400 });

    const newNote = await Note.create({ title, userId: user._id });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
