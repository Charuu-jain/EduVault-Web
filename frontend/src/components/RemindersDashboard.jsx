import { useState, useEffect } from 'react';
import { Bell, AlertCircle, RotateCcw } from 'lucide-react';
import { getReminders } from '../services/api';
import { CardSkeleton } from './Skeleton';

function RemindersDashboard() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReminders();
      setReminders((data || []).slice().sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusOf = (dateString) => {
    if (!dateString) return { label: '—', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
    const now = new Date();
    const d = new Date(dateString);
    const sameDay = d.toDateString() === now.toDateString();
    if (d < now && !sameDay) return { label: 'Overdue', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
    if (sameDay) return { label: 'Today', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' };
    return { label: 'Upcoming', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300' };
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      <div className="flex items-center mb-6">
        <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reminders</h2>
      </div>

      {error && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
          <button
            onClick={loadReminders}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {!error && reminders.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reminders yet.</p>
      )}

      {!error && reminders.length > 0 && (
        <ul className="space-y-3">
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-medium text-gray-900 dark:text-white">{reminder.title}</div>
                <span className={`text-xs px-2 py-1 rounded ${statusOf(reminder.dueDate).cls}`}>
                  {statusOf(reminder.dueDate).label}
                </span>
              </div>
              {reminder.dueDate && (
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Due: {formatDateTime(reminder.dueDate)}
                </div>
              )}
              {reminder.description && (
                <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">{reminder.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RemindersDashboard;
