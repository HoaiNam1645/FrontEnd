import React, { createContext, useState, useContext, ReactNode } from 'react';
import Toast, { ToastType } from './Toast';

interface Notification {
  id: string;
  message: string;
  type: ToastType;
}

interface NotificationContextProps {
  showNotification: (message: string, type: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const closeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => closeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
