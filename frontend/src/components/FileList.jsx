import { useState, useEffect } from 'react';
import { FileText, Download, AlertCircle, RotateCcw } from 'lucide-react';
import { listFiles } from '../services/api';
import { CardSkeleton, TableRowSkeleton } from './Skeleton';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function FileList({ refresh }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    loadFiles();
  }, [refresh, selectedSubject]);

  useEffect(() => {
    axios.get(`${API_BASE}/subjects`).then(res => setSubjects(res.data || [])).catch(() => setSubjects([]));
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/files`, {
        params: selectedSubject ? { subjectId: selectedSubject } : {}
      });
      setFiles(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6 transition-colors">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Files</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6 transition-colors">
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Files</h2>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-300">Filter by subject:</label>
        <select
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">All</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
          <button
            onClick={loadFiles}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {!error && files.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No files uploaded yet.</p>
      )}

      {!error && files.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">File Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Subject</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Size</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Uploaded</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                      {file.fileName || file.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {file.subject?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {file.fileSize ? formatFileSize(file.fileSize) : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {file.uploadedAt ? formatDate(file.uploadedAt) : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a
                      href={`${API_BASE}/files/${file.id}/download`}
                      download
                      className="inline-flex items-center justify-center p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FileList;
