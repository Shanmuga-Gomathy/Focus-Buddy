import React, { useState, useRef } from 'react';

const FOCUS_MINUTES = 10; // 10 minutes focus
const BREAK_MINUTES = 5;  // 5 minutes break
const MOTIVATIONAL_QUOTES = [
  'Great job! Take a deep breath and enjoy your break.',
  'You deserve this break! Come back refreshed.',
  'Awesome focus! Rest up and return stronger.',
  'Breaks boost productivity. Enjoy yours!',
  'You are doing amazing. See you in 5 minutes!',
  'Rest, recharge, and get ready to conquer more!'
];

function pad(num) {
  return num.toString().padStart(2, '0');
}

export default function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [quote, setQuote] = useState('');
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (isFocus) {
              // End of focus: show break modal
              setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
              setShowBreakModal(true);
              setTimeout(() => {
                setShowBreakModal(false);
                setSecondsLeft(BREAK_MINUTES * 60);
                setIsFocus(false);
                setIsRunning(true);
                intervalRef.current = setInterval(() => {
                  setSecondsLeft((prevBreak) => {
                    if (prevBreak <= 1) {
                      clearInterval(intervalRef.current);
                      setIsRunning(false);
                      setShowReturnModal(true);
                      setSecondsLeft(FOCUS_MINUTES * 60);
                      setIsFocus(true);
                      return prevBreak;
                    }
                    return prevBreak - 1;
                  });
                }, 1000);
              }, 5000); // Show break modal for 5 seconds
            } else {
              // End of break: show return modal
              setShowReturnModal(true);
              setSecondsLeft(FOCUS_MINUTES * 60);
              setIsFocus(true);
            }
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
    setShowBreakModal(false);
    setShowReturnModal(false);
  };

  React.useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <>
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
      {/* Break Modal */}
      {showBreakModal && (
        <div className="modal fade show" style={{display: 'block', background: 'rgba(0,0,0,0.3)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Break Time!</h5>
              </div>
              <div className="modal-body text-center">
                <p style={{fontSize: '1.1em'}}>{quote}</p>
                <p className="text-muted">Take a 5-minute break. Relax and recharge!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Return to Study Modal */}
      {showReturnModal && (
        <div className="modal fade show" style={{display: 'block', background: 'rgba(0,0,0,0.3)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Break Over!</h5>
              </div>
              <div className="modal-body text-center">
                <p>Break is over. Ready to focus again?</p>
                <button className="btn btn-primary mt-2" onClick={() => setShowReturnModal(false)}>Yes, I'm back!</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 