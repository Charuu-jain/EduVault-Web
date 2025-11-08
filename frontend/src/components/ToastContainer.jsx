import { useEffect, useState } from 'react';
import Toast from './Toast';

const toastEmitter = new EventTarget();

export const showToast = (message, type = 'info', duration = 4000) => {
  const event = new CustomEvent('toast', {
    detail: { message, type, duration, id: Math.random() }
  });
  toastEmitter.dispatchEvent(event);
};

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type, duration, id } = e.detail;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    };

    toastEmitter.addEventListener('toast', handleToast);
    return () => toastEmitter.removeEventListener('toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 pointer-events-none z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
