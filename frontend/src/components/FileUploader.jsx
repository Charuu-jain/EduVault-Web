import { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, CheckCircle, X } from 'lucide-react';
import { uploadFile, api, getSubjects } from '../services/api';
import { showToast } from './ToastContainer';

function FileUploader({ onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('');

  useEffect(() => {
    let ignore = false;
    getSubjects()
      .then((res) => { if (!ignore) setSubjects(res || []); })
      .catch(() => setSubjects([]));
    return () => { ignore = true; };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('Please select a file first', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      await uploadFile(selectedFile, {
        subjectId,
        onUploadProgress: (e) => {
          if (e.total) {
            const pct = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(pct);
          }
        }
      });

      showToast('File uploaded successfully!', 'success');
      setSelectedFile(null);
      setSubjectId('');
      setUploadProgress(0);

      if (onUploaded) {
        onUploaded();
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      <div className="flex items-center mb-6">
        <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload File</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <select
            className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 flex-1"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={uploading}
          >
            <option value="">Select subject (optional)</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="pointer-events-none">
            <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Drag and drop your file here, or click to select
            </p>
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!uploading && (
              <button
                onClick={clearFile}
                className="ml-2 p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default FileUploader;
