import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/note";
import { getCurrentUser } from "@/utils/getCurrentUser";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "Note ID required" }, { status: 400 });

    await Note.deleteOne({ _id: id, userId: user._id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
