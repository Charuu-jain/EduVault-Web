// src/components/AddReminder.tsx
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function AddReminder({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE}/reminders`, { title, dueDate });
      setTitle("");
      setDueDate("");
      onAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-3">
      <input
        type="text"
        className="border rounded px-3 py-2"
        placeholder="Reminder title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="datetime-local"
        className="border rounded px-3 py-2"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Reminder"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}