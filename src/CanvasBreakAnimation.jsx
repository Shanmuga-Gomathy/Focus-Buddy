import React, { useRef, useEffect } from 'react';

export default function CanvasBreakAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let start = null;
    const duration = 4000; // 4 seconds for a full breath in/out

    function drawBreathCircle(timestamp) {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) % duration;
      const progress = elapsed / duration;
      // Breathing: 0 -> 1 (inhale), 1 -> 0 (exhale)
      const breathVal = Math.sin(progress * Math.PI);
      const minRadius = 40;
      const maxRadius = 70;
      const radius = minRadius + (maxRadius - minRadius) * Math.abs(breathVal);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(100, 180, 255, 0.3)';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(80, 120, 200, 0.7)';
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(drawBreathCircle);
    }

    animationFrameId = requestAnimationFrame(drawBreathCircle);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="d-flex flex-column align-items-center">
      <canvas
        ref={canvasRef}
        width={180}
        height={150}
        style={{ background: '#f8fbff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      />
      <div className="mt-1 text-muted" style={{fontSize: '0.85em'}}>
        Relax and follow the animation during your break.
      </div>
    </div>
  );
} 