"use client";

import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  tag: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes?perPage=12&page=1", {
          credentials: "include",
        });
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>All Notes</h1>
      {notes.map((note) => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}
