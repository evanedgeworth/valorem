"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}


interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div
      style={{
        top: 12, right: toasts.length > 0 ? 12 : -200,
      }}
      className="fixed space-y-2 z-50 duration-200">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 space-x-4 rounded-lg shadow-lg text-white`}
          style={{
            backgroundColor:
            toast.type === 'success'
              ? '#0e9f6e'
              : toast.type === 'error'
              ? '#f05252'
              : '#faca15',
          }}
        >
          <div className="text-sm">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
