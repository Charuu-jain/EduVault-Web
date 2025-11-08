import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { login, signup, me } from './services/api';

// ---- Inline minimal pages so we don't depend on extra files ----
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      // verify session
      await me();
      window.location.href = '/';
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-80 space-y-3">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">EduVault Login</h1>
        <input className="border rounded px-3 py-2 w-full" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">{loading? 'Logging in…':'Login'}</button>
        <a className="text-sm text-blue-600 text-center block" href="/signup">Create account</a>
      </form>
    </div>
  );
}

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      await signup(email, password, fullName);
      setMsg('Account created! You can now log in.');
    } catch (err) {
      setMsg('Signup failed (maybe email already used).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-80 space-y-3">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Sign Up</h1>
        <input className="border rounded px-3 py-2 w-full" placeholder="Full name" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">{loading? 'Creating…':'Sign up'}</button>
        {msg && <p className="text-sm text-gray-700 dark:text-gray-200">{msg}</p>}
        <a className="text-sm text-blue-600 text-center block" href="/login">Back to login</a>
      </form>
    </div>
  );
}

function Guard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<null | boolean>(null);
  useEffect(() => { me().then(() => setOk(true)).catch(() => setOk(false)); }, []);
  if (ok === null) return <div className="p-6">Loading…</div>;
  return ok ? <>{children}</> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: '/', element: <Guard><App /></Guard> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
