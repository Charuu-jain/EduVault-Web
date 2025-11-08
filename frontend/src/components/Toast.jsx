import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

function Toast({ type = 'info', message, onClose, duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle,
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm border rounded-lg shadow-lg p-4 ${bgColor} animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${textColor}`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className={`flex-shrink-0 ${textColor} hover:opacity-75 transition-opacity`}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
