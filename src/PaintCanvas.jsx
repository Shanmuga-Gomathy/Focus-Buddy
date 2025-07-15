import React, { useRef, useEffect, useState } from "react";

function CanvasArea({ width, height, canvasRef, drawing, setDrawing, lastPos, setLastPos }) {
  // Use pageX/pageY for mouse, touches[0].clientX/clientY for touch, minus canvas offset
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      return {
        x: e.changedTouches[0].clientX - rect.left,
        y: e.changedTouches[0].clientY - rect.top,
      };
    } else if (e.nativeEvent) {
      return {
        x: e.nativeEvent.clientX - rect.left,
        y: e.nativeEvent.clientY - rect.top,
      };
    } else {
      return { x: 0, y: 0 };
    }
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

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 0,
        cursor: "crosshair",
        width: width,
        height: height,
        maxWidth: '100%',
        maxHeight: '70vh',
        display: 'block',
        margin: 0,
        padding: 0,
        boxShadow: 'none',
        touchAction: 'none',
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
  );
}

export default function PaintCanvas() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#007bff";
  }, [fullscreen]); // reapply on fullscreen change

  const handleClear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Copy canvas content to dialog and back
  useEffect(() => {
    if (!fullscreen) return;
    // When entering dialog, copy the content from the small canvas
    const smallCanvas = document.querySelector('.paint-canvas-card canvas');
    if (smallCanvas && canvasRef.current && smallCanvas !== canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(smallCanvas, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [fullscreen]);

  // Responsive modal size
  const modalWidth = Math.min(700, window.innerWidth - 40);
  const modalHeight = Math.min(500, window.innerHeight - 120);

  return (
    <div className="d-flex flex-column align-items-center">
      {/* Normal canvas view */}
      {!fullscreen && (
        <>
          <CanvasArea
            width={260}
            height={260}
            canvasRef={canvasRef}
            drawing={drawing}
            setDrawing={setDrawing}
            lastPos={lastPos}
            setLastPos={setLastPos}
          />
          <div className="d-flex gap-2 mt-2">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setFullscreen(true)}
            >
              Expand
            </button>
          </div>
          <div className="mt-1 text-muted">Try drawing during your break!</div>
        </>
      )}
      {/* Centered modal dialog for canvas */}
      {fullscreen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              padding: 0,
              minWidth: 320,
              maxWidth: '95vw',
              width: modalWidth,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div style={{width: '100%', textAlign: 'center', margin: 0, padding: '1.5rem 0 0.5rem 0'}}>
              <h4 style={{margin: 0, fontWeight: 600}}>Paint Canvas</h4>
            </div>
            <div style={{width: '100%', margin: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <CanvasArea
                width={modalWidth}
                height={modalHeight - 70}
                canvasRef={canvasRef}
                drawing={drawing}
                setDrawing={setDrawing}
                lastPos={lastPos}
                setLastPos={setLastPos}
              />
            </div>
            <div className="d-flex gap-3 mt-4 mb-3" style={{justifyContent: 'center', width: '100%'}}>
              <button
                className="btn btn-outline-danger"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setFullscreen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
