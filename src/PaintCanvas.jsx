import React, { useRef, useEffect, useState } from "react";

export default function PaintCanvas() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#007bff";
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.touches ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX,
      y: e.touches ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY,
    };
  };

  const handleDown = (e) => {
    setDrawing(true);
    setLastPos(getPos(e));
  };

  const handleUp = () => {
    setDrawing(false);
  };

  const handleMove = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setLastPos(pos);
  };

  const handleClear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <canvas
        ref={canvasRef}
        width={260}
        height={260}
        style={{
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #eee",
          cursor: "crosshair",
        }}
        onMouseDown={handleDown}
        onMouseUp={handleUp}
        onMouseOut={handleUp}
        onMouseMove={handleMove}
        onTouchStart={handleDown}
        onTouchEnd={handleUp}
        onTouchCancel={handleUp}
        onTouchMove={handleMove}
      />
      <button
        className="btn btn-sm btn-outline-danger mt-2"
        onClick={handleClear}
      >
        Clear
      </button>
      <div className="mt-1 text-muted">Try drawing during your break!</div>
    </div>
  );
}
