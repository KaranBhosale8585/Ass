"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Header from "@/components/Header";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setNotes(data.notes || []);
        setLoading(false);
      });
  }, []);

  const createNote = async () => {
    if (!newTitle.trim()) return toast.error("Title is required");
    if (!newDescription.trim()) return toast.error("Description is required");

    const res = await fetch("/api/notes/create", {
      method: "POST",
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed to create note");

    setNotes((prev) => [...prev, data]);
    setNewTitle("");
    setNewDescription("");
    toast.success("Note created");
  };

  const deleteNote = async (id: string) => {
    const res = await fetch("/api/notes/delete", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed to delete");

    setNotes((prev) => prev.filter((n) => n._id !== id));
    toast.success("Note deleted");
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-sm mt-10 animate-pulse">
        Loading...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-red-600 font-medium mt-10">
        Unauthorized access
      </p>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white px-4 py-10 text-black">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* User Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Welcome, {user.name} 👋</h2>
            <p className="text-sm text-gray-600 mt-1">Email: {user.email}</p>
          </div>

          {/* Create Note Form */}
          <div className="bg-white border rounded-2xl p-6 shadow space-y-4">
            <h3 className="text-xl font-semibold mb-2">Create a New Note</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
            <button
              onClick={createNote}
              className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition font-medium"
            >
              Create Note
            </button>
          </div>

          {/* Notes Grid */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Your Notes</h3>
            {notes.length === 0 ? (
              <p className="text-sm text-gray-500">No notes yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-gray-100 rounded-xl p-4 flex flex-col justify-between shadow border"
                  >
                    <div className="flex-1">
                      <h4 className="text-md font-semibold">{note.title}</h4>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                        {note.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                      <button onClick={() => deleteNote(note._id)}>
                        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
