import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import FocusTimer from './FocusTimer';
import NetworkStatus from './NetworkStatus';
import TimerVisibilityWarning from './TimerVisibilityWarning';
import CanvasBreakAnimation from './CanvasBreakAnimation';
import PaintCanvas from './PaintCanvas';
import StudyWebsite from './StudyWebsite';

export default function App() {
  const timerSectionRef = useRef(null);
  return (
    <div className="container-fluid min-vh-100 bg-light d-flex flex-column p-0" style={{paddingLeft: 0, paddingRight: 0}}>
      
      <section ref={timerSectionRef} className="d-flex flex-row align-items-center justify-content-end px-2" style={{width: '100%', height: 44, background: 'transparent', zIndex: 2000, marginTop: 0, marginBottom: 0}}>
        <div className="d-flex align-items-center me-3">
          <FocusTimer />
          <TimerVisibilityWarning targetRef={timerSectionRef} />
        </div>
        <div className="d-flex align-items-center">
          <NetworkStatus />
        </div>
      </section>
      <header className="py-4 mb-2 text-center bg-white shadow-sm rounded-bottom" style={{marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0}}>
        <h1 className="mb-1">FocusBuddy Dashboard</h1>
        <p className="lead mb-0">All your focus tools in one place</p>
      </header>
      <main className="flex-grow-1 d-flex flex-row justify-content-center align-items-stretch position-relative" style={{minHeight: '0', marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0}}>
        <div className="col-lg-9 col-md-8 col-12 d-flex flex-column p-0" style={{maxWidth: '75vw', marginLeft: 8, marginRight: 8}}>
          <section className="card h-100 flex-grow-1" style={{margin: 0}}>
            <div className="card-body d-flex flex-column">
              <h2 className="card-title study-website-title">Study Website</h2>
              <StudyWebsite />
            </div>
          </section>
        </div>
        
        <div className="col-lg-3 col-md-4 col-12 d-flex flex-column p-0 right-col" style={{maxWidth: '25vw', minWidth: 160, marginLeft: 8}}>
          <section className="card mb-3 flex-grow-1 right-feature break-canvas-card d-flex flex-column justify-content-center align-items-center shadow-sm" style={{background: '#fff', border: '1px solid #e3eaf3', margin: 0}}>
            <div className="card-body p-3 d-flex flex-column align-items-center">
              <h2 className="card-title">Break Animation</h2>
              <CanvasBreakAnimation />
            </div>
          </section>
          <section className="card flex-grow-1 mb-3 right-feature paint-canvas-card d-flex flex-column justify-content-center align-items-center shadow-sm" style={{background: '#fff', border: '1px solid #e3eaf3', margin: 0}}>
            <div className="card-body p-3 d-flex flex-column align-items-center">
              <h2 className="card-title">Paint Canvas</h2>
              <PaintCanvas />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
