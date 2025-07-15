import React, { useEffect, useRef, useState } from 'react';

export default function TimerVisibilityWarning({ targetRef }) {
  const [notVisible, setNotVisible] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!targetRef?.current) return;
    observerRef.current = new window.IntersectionObserver(
      ([entry]) => {
        setNotVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(targetRef.current);
    return () => {
      if (observerRef.current && targetRef.current) {
        observerRef.current.unobserve(targetRef.current);
      }
    };
  }, [targetRef]);

  if (!notVisible) return null;

  return (
    <div className="alert alert-warning" role="alert">
      <strong>Focus Timer is not visible!</strong> Scroll back to the timer to stay on track.
    </div>
  );
} 