import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: mongoose.Schema.Types.ObjectId,
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);
