import { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, RotateCcw } from 'lucide-react';
import { getSubjects } from '../services/api';
import { CardSkeleton, ListItemSkeleton } from './Skeleton';

function SubjectsList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      <div className="flex items-center mb-6">
        <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subjects</h2>
      </div>

      {error && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
          <button
            onClick={loadSubjects}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {!error && subjects.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No subjects yet.</p>
      )}

      {!error && subjects.length > 0 && (
        <ul className="space-y-3">
          {subjects.map((subject) => (
            <li
              key={subject.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-white">{subject.name}</div>
              {subject.description && (
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">{subject.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SubjectsList;
