import { useEffect } from 'react';

export default function Alert({ type = 'success', message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className={`alert alert--${type}`}>{message}</div>;
}
