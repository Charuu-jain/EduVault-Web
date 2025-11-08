import { useState } from "react";
import { signup } from "../services/api";
import { motion } from 'framer-motion';

export default function Signup(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [fullName,setFullName]=useState("");
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);

  const submit=async(e)=>{
    e.preventDefault();
    setLoading(true); setMsg("");
    try{
      await signup(email,password,fullName);
      setMsg("Account created! You can now log in.");
    }catch(e){
      setMsg("Signup failed (maybe email already used).");
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
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Sign Up</h1>
        <input
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
          placeholder="Full name"
          aria-label="Full name"
          autoComplete="name"
          value={fullName}
          onChange={e=>setFullName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={e=>setEmail(e.target.value.toLowerCase())}
        />
        <input
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
          type="password"
          placeholder="Password"
          aria-label="Password"
          autoComplete="new-password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 active:scale-[0.99] text-white py-2 rounded transition"
        >
          {loading ? "Creating…" : "Sign up"}
        </button>
        {msg && <p className="text-sm text-gray-700 dark:text-gray-200">{msg}</p>}
        <a className="text-sm text-blue-600 text-center block" href="/login">Back to login</a>
      </motion.form>
    </motion.div>
  );
}