/**
 * Professional notification service
 * Replaces alert() with elegant toasts
 */

import toast from 'react-hot-toast';

const notificationService = {
  success: (message) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#52B788',
        color: '#fff',
      },
    });
  },

  error: (message) => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: '#fff',
      },
    });
  },

  info: (message) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#0077B6',
        color: '#fff',
      },
    });
  },

  warning: (message) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
    });
  },

  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Operation successful',
      error: messages.error || 'An error occurred',
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
  },
};

export default notificationService;
