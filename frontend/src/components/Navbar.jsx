import { BookOpen, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { me, logout as apiLogout } from '../services/api';

function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = savedMode ? JSON.parse(savedMode) : prefersDark;
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      // Only auto-sync if user hasn't explicitly chosen a mode
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return;
      const dark = e.matches;
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else if (mq.removeListener) mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    me().then((u) => { if (!ignore) setUser(u); })
       .catch(() => { if (!ignore) setUser(null); })
       .finally(() => { if (!ignore) setChecking(false); });
    return () => { ignore = true; };
  }, []);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('darkMode', JSON.stringify(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
      setUser(null);
      window.location.href = '/login';
    } catch (e) {
      // no-op
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/90 supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/60 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduVault</h1>
          </div>
          <div className="flex items-center gap-3">
            {!checking && user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="truncate max-w-[180px]" title={user.email}>Signed in as {user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
                >Logout</button>
              </div>
            )}
            {!checking && !user && (
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <a href="/login" className="text-blue-600 hover:underline">Login</a>
                <a href="/signup" className="text-gray-700 dark:text-gray-300 hover:underline">Sign up</a>
              </div>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
              title="Toggle dark mode"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
