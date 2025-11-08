import { useState } from "react";
import { login, me } from "../services/api";
import { motion } from 'framer-motion';

export default function Login({ onAuthed }) {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const submit = async (e)=>{
    e.preventDefault();
    setLoading(true); setError("");
    try{
      await login(email,password);
      const u = await me();
      onAuthed?.(u);
    }catch(e){
      setError("Invalid credentials");
    }finally{ setLoading(false); }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.form
        onSubmit={submit}
        whileHover={{ scale: 1.005 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-80 space-y-3"
      >
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">EduVault Login</h1>
        <input
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={e => setEmail(e.target.value.toLowerCase())}
        />
        <input
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
          type="password"
          placeholder="Password"
          aria-label="Password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-[0.99] text-white py-2 rounded transition"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
        <a className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-center block transition" href="/signup">
          Create account
        </a>
      </motion.form>
    </motion.div>
  );
}