import React, { useState, useRef } from 'react';

const FOCUS_MINUTES = 10; // Changed to 10 minutes
const BREAK_MINUTES = 5;

function pad(num) {
  return num.toString().padStart(2, '0');
}

export default function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsFocus((prevFocus) => !prevFocus);
            setSecondsLeft(isFocus ? BREAK_MINUTES * 60 : FOCUS_MINUTES * 60);
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setIsFocus(true);
    setSecondsLeft(FOCUS_MINUTES * 60);
  };

  React.useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontWeight: 600, letterSpacing: 1 }}>{pad(minutes)}:{pad(seconds)}</span>
      <button className="btn btn-sm btn-success px-2 py-1 me-1" style={{fontSize: '0.9rem'}} onClick={startTimer} disabled={isRunning}>
        ▶
      </button>
      <button className="btn btn-sm btn-warning px-2 py-1 me-1" style={{fontSize: '0.9rem'}} onClick={pauseTimer} disabled={!isRunning}>
        ❚❚
      </button>
      <button className="btn btn-sm btn-danger px-2 py-1" style={{fontSize: '0.9rem'}} onClick={resetTimer}>
        ⟳
      </button>
    </div>
  );
} 