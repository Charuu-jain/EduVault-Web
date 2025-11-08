// src/components/AddSubject.tsx
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function AddSubject({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE}/subjects`, { name });
      setName("");
      onAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
      <input
        type="text"
        className="border rounded px-3 py-2 flex-1"
        placeholder="New subject..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
}