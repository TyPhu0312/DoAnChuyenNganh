'use client';
import { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../../../public/css/toast.css'
interface Toast {
  id: string;
  message: string;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  type: 'success' | 'error'; // Thêm type để phân biệt success và error
}

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, position: Toast['position'] = 'top-right', type: Toast['type'] = 'success') => {
    const newToast = { id: uuidv4(), message, position, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Tự động xóa toast sau 5 giây
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.position} ${toast.type}`} // Thêm lớp `type` để sử dụng CSS
            style={{
              position: 'fixed',
              [toast.position.includes('top') ? 'top' : 'bottom']: '20px',
              [toast.position.includes('left') ? 'left' : 'right']: '20px',
              zIndex: 9999,
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
