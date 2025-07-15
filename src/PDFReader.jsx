import React, { useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Always use the local worker to avoid CORS issues
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

async function uploadPDFToCloud(file) {
  if (!file) return null;
  const storageRef = ref(storage, `pdfs/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export default function PDFReader() {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState('');
  const [cloudUrl, setCloudUrl] = useState('');
  const fileInputRef = useRef();
  const canvasRef = useRef();
  const [page, setPage] = useState(1);

  const handleFile = async (e) => {
    setError('');
    setPdf(null);
    setNumPages(0);
    setPage(1);
    setCloudUrl('');
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    // Upload to Firebase Storage
    try {
      const url = await uploadPDFToCloud(file);
      setCloudUrl(url);
    } catch (err) {
      setError('Cloud upload failed.');
    }
    // Local rendering
    const reader = new FileReader();
    reader.onload = async function (ev) {
      try {
        const typedarray = new Uint8Array(ev.target.result);
        const loadedPdf = await pdfjs.getDocument({ data: typedarray }).promise;
        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
        renderPage(loadedPdf, 1);
      } catch (err) {
        setError('Failed to load PDF.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const renderPage = async (pdfDoc, pageNum) => {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: ctx, viewport }).promise;
  };

  const goToPage = (newPage) => {
    if (pdf && newPage >= 1 && newPage <= numPages) {
      setPage(newPage);
      renderPage(pdf, newPage);
    }
  };

  return (
    <div className="text-center">
      <input
        type="file"
        accept="application/pdf"
        className="form-control mb-3"
        ref={fileInputRef}
        onChange={handleFile}
      />
      {cloudUrl && (
        <div className="alert alert-success">
          PDF uploaded to cloud! <a href={cloudUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {!pdf && !error && <div className="text-muted">Upload a PDF to start reading.</div>}
      {pdf && (
        <div>
          <canvas ref={canvasRef} style={{ border: '1px solid #eee', borderRadius: 8, maxWidth: '100%' }} />
          <div className="d-flex justify-content-center align-items-center mt-2">
            <button className="btn btn-outline-primary btn-sm me-2" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
              Previous
            </button>
            <span className="mx-2">Page {page} of {numPages}</span>
            <button className="btn btn-outline-primary btn-sm ms-2" onClick={() => goToPage(page + 1)} disabled={page >= numPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 