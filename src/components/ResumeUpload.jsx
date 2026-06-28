import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { parsePdfText } from '../services/pdfParser';

export default function ResumeUpload({ onTextExtracted, textPresent }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;

    // Check file type
    const fileType = file.type;
    const isPDF = fileType === 'application/pdf' || file.name.endsWith('.pdf');
    const isTXT = fileType === 'text/plain' || file.name.endsWith('.txt');

    if (!isPDF && !isTXT) {
      setError('Unsupported file type. Please upload a PDF or TXT file.');
      return;
    }

    setIsLoading(true);
    setError('');
    setFileName(file.name);

    try {
      let text = '';
      if (isPDF) {
        text = await parsePdfText(file);
      } else {
        // Parse plain text file
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsText(file);
        });
      }

      if (!text || text.trim().length === 0) {
        throw new Error('The file seems to be empty.');
      }

      onTextExtracted(text);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to read file. Please try copy-pasting instead.');
      setFileName('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="resume-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden-file-input"
        accept=".pdf,.txt"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      
      <div
        className={`upload-zone glass-panel ${isDragActive ? 'drag-active' : ''} ${isLoading ? 'upload-loading' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        style={{
          border: '2px dashed var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          backgroundColor: isDragActive ? 'var(--accent-light)' : 'rgba(0, 0, 0, 0.05)',
          position: 'relative'
        }}
      >
        {isLoading ? (
          <div className="flex-col-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
            <p className="form-label" style={{ margin: '0' }}>Extracting text from resume PDF...</p>
          </div>
        ) : fileName ? (
          <div className="flex-col-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={32} style={{ color: 'var(--success)' }} />
            <p style={{ fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>{fileName}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0' }}>Successfully parsed. You can edit the text in the editor below if needed.</p>
          </div>
        ) : (
          <div className="flex-col-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <UploadCloud size={32} style={{ color: 'var(--text-secondary)', opacity: 0.8 }} />
            <div>
              <p style={{ fontWeight: '500', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                Drag & drop your resume PDF or TXT
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0' }}>
                or <span style={{ color: 'var(--accent)', fontWeight: '600' }}>browse files</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div 
          className="error-banner"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'var(--danger-light)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            fontSize: '0.85rem'
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}
      
      {/* CSS injection for simple spin animation if not present */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .upload-zone:hover {
          border-color: var(--accent) !important;
          background-color: var(--accent-light) !important;
        }
        .drag-active {
          border-color: var(--accent) !important;
          background-color: var(--accent-light) !important;
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
