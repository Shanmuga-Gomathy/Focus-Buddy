import React, { useEffect, useState } from 'react';

export default function TabSwitchWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    function handleVisibilityChange() {
      setShowWarning(document.hidden);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!showWarning) return null;

  return (
    <div className="alert alert-danger" role="alert">
      <strong>Stay Focused!</strong> You switched tabs or minimized the window. Please return to your study session.
    </div>
  );
} 