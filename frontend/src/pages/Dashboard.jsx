import { useState, useEffect } from 'react';
import { api } from "../services/api";
import SubjectsList from '../components/SubjectsList';
import RemindersDashboard from '../components/RemindersDashboard';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
import {motion} from "framer-motion";
// Inline AddSubject form
function AddSubjectInline({ onAdded }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/subjects', { name: name.trim() });
      setName('');
      onAdded?.(res?.data ?? { id: Date.now(), name: name.trim() });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add subject';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-3 flex gap-2">
      <input
        type="text"
        placeholder="New subject..."
        className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 transition"
        aria-label="Add subject"
      >
        {loading ? 'Adding…' : 'Add'}
      </button>
      {error && <span className="text-red-600 text-sm self-center">{error}</span>}
    </form>
  );
}

// Inline AddReminder form
function AddReminderInline({ onAdded }) {
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [desc, setDesc] = useState('');

  const toLocalDateTimeString = (v) => {
    if (!v) return '';
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(v)) return v;
    return `${v}:00`;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !due) return;
    setLoading(true);
    setError('');
    try {
      const dueDate = toLocalDateTimeString(due);
      const res = await api.post('/reminders', {
        title: title.trim(),
        dueDate,
        description: desc.trim() || null,
      });
      setTitle('');
      setDue('');
      setDesc('');
      onAdded?.(res?.data ?? { id: Date.now(), title: title.trim(), dueDate, description: desc.trim() || null });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add reminder';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-3 grid grid-cols-1 gap-2">
      <input
        type="text"
        placeholder="Reminder title"
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="datetime-local"
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
        value={due}
        onChange={(e) => setDue(e.target.value)}
      />
      <textarea
        className="border rounded px-3 py-2 min-h-[84px] focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
        placeholder="Description (optional)"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 active:scale-[0.99] disabled:opacity-50 transition"
        aria-label="Add reminder"
      >
        {loading ? 'Adding…' : 'Add Reminder'}
      </button>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </form>
  );
}

function Dashboard() {
  const [fileRefresh, setFileRefresh] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [reminders, setReminders] = useState([]);

  const [subjectCount, setSubjectCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [nextReminder, setNextReminder] = useState(null);

  const fmtDateTime = (s) => s ? new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  const handleFileUploaded = () => {
    setFileRefresh(prev => prev + 1);
    loadCounts();
  };

  const loadSubjects = async () => {
    const res = await api.get('/subjects');
    setSubjects(res.data);
  };

  const loadReminders = async () => {
    const res = await api.get('/reminders');
    setReminders(res.data);
  };

  const loadCounts = async () => {
    try {
      const [sc, fc] = await Promise.all([
        api.get('/subjects/count'),
        api.get('/files/count'),
      ]);
      setSubjectCount(Number(sc.data ?? 0));
      setFileCount(Number(fc.data ?? 0));
    } catch (e) {
      // no-op for minor dashboard; counts will show as 0 on error
    }
  };

  const loadNextReminder = async () => {
    try {
      const res = await api.get('/reminders/next');
      if (res && res.status === 204) {
        setNextReminder(null);
      } else {
        setNextReminder(res?.data || null);
      }
    } catch (e) {
      setNextReminder(null);
    }
  };

  useEffect(() => {
    loadSubjects();
    loadReminders();
    loadCounts();
    loadNextReminder();
  }, []);

  useEffect(() => {
    // whenever subjects/reminders length or files refresh key changes, update stats
    loadCounts();
    loadNextReminder();
  }, [subjects.length, reminders.length, fileRefresh]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">Subjects</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{subjectCount}</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">Files</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{fileCount}</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">Next reminder</div>
          {nextReminder ? (
            <div>
              <div className="font-medium text-gray-900 dark:text-white truncate" title={nextReminder.title}>{nextReminder.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{fmtDateTime(nextReminder.dueDate)}</div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">None</div>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.section
          whileHover={{ scale: 1.005 }}
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <AddSubjectInline onAdded={(newSubj) => {
            if (newSubj) setSubjects(prev => [...prev, newSubj]); else loadSubjects();
            loadCounts();
          }} />
          <div>
            <SubjectsList subjects={subjects} />
          </div>
        </motion.section>

        <motion.section
          whileHover={{ scale: 1.005 }}
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <AddReminderInline onAdded={(newRem) => {
            if (newRem) setReminders(prev => [...prev, newRem].sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate))); else loadReminders();
            loadNextReminder();
          }} />
          <RemindersDashboard reminders={reminders} />
        </motion.section>

        <motion.section
          whileHover={{ scale: 1.005 }}
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <FileUploader onUploaded={handleFileUploaded} />
          <FileList refresh={fileRefresh} />
        </motion.section>
      </motion.div>
    </div>
  );
}

export default Dashboard;
