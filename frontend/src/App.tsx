import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ToastContainer from './components/ToastContainer';
import { api } from './services/api';

export default function App() {
  const [ok, setOk] = useState<null | boolean>(null);

  useEffect(() => {
    let ignore = false;
    api.get('/auth/me')
      .then(() => { if (!ignore) setOk(true); })
      .catch(() => { if (!ignore) setOk(false); })
    return () => { ignore = true; };
  }, []);

  if (ok === null) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-700 dark:text-gray-200">Checking session…</div>
      </div>
    );
  }

  if (!ok) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center space-y-3">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Session required</h1>
          <p className="text-gray-600 dark:text-gray-300">Please log in to access your EduVault dashboard.</p>
          <a href="/login" className="inline-block px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <Dashboard />
      <ToastContainer />
    </div>
  );
}
