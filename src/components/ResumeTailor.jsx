import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Printer, Edit2, Eye, Split } from 'lucide-react';

export default function ResumeTailor({ originalText, tailoredText }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'tailored', 'edit'
  const [editedText, setEditedText] = useState(tailoredText);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedText : tailoredText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    // Retrieve the pre-rendered HTML content directly from the hidden preview element
    const renderedContent = document.getElementById('tailored-resume-markdown-preview')?.innerHTML || '';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Tailored Resume</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #111827;
              line-height: 1.5;
              padding: 2.5rem;
              margin: 0;
              font-size: 14px;
            }
            h1, h2, h3, h4 {
              margin-top: 1.25rem;
              margin-bottom: 0.5rem;
              color: #111827;
              font-weight: 700;
            }
            h1 {
              font-size: 24px;
              text-align: center;
              margin-bottom: 0.25rem;
            }
            h2 {
              font-size: 16px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 3px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            h3 {
              font-size: 14px;
            }
            p {
              margin: 0 0 0.5rem 0;
            }
            ul, ol {
              margin: 0 0 0.75rem 0;
              padding-left: 1.5rem;
            }
            li {
              margin-bottom: 0.25rem;
            }
            a {
              color: #111827;
              text-decoration: none;
            }
            @media print {
              body {
                padding: 0;
              }
              @page {
                margin: 2cm;
              }
            }
          </style>
        </head>
        <body>
          <div>${renderedContent}</div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="resume-tailor-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Action Toolbar */}
      <div className="tailor-toolbar glass-panel" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--border-radius-md)',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* View Toggles */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => { setViewMode('split'); setIsEditing(false); }}
            className={`btn btn-sm ${viewMode === 'split' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <Split size={14} />
            Side-by-Side
          </button>
          <button 
            onClick={() => { setViewMode('tailored'); setIsEditing(false); }}
            className={`btn btn-sm ${viewMode === 'tailored' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <Eye size={14} />
            Preview Only
          </button>
          <button 
            onClick={() => { setViewMode('edit'); setIsEditing(true); }}
            className={`btn btn-sm ${viewMode === 'edit' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <Edit2 size={14} />
            Edit Text
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleCopy} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            {copied ? (
              <>
                <Check size={14} style={{ color: 'var(--success)' }} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy Markdown
              </>
            )}
          </button>
          
          <button onClick={handlePrint} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <Printer size={14} />
            Export to PDF / Print
          </button>
        </div>
      </div>

      {/* Editor & Viewer Panels */}
      <div className="panels-workspace" style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
        gap: '1.5rem',
        alignItems: 'stretch'
      }}>
        {/* Original Resume Panel (only in split view) */}
        {viewMode === 'split' && (
          <div className="panel-container glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '650px' }}>
            <div style={{
              padding: '0.75rem 1.25rem',
              borderBottom: '1px solid var(--border-color)',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              Original Resume
            </div>
            <textarea 
              readOnly 
              value={originalText}
              className="panel-textarea"
              style={{
                flexGrow: 1,
                border: 'none',
                background: 'transparent',
                resize: 'none',
                padding: '1.25rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                outline: 'none',
                overflowY: 'auto'
              }}
            />
          </div>
        )}

        {/* Tailored Output Panel */}
        <div className="panel-container glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '650px' }}>
          <div style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Optimized Resume</span>
            {isEditing && (
              <span className="badge badge-neutral" style={{ fontSize: '0.75rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                Editing Mode
              </span>
            )}
          </div>
          
          {isEditing ? (
            <textarea 
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="panel-textarea"
              style={{
                flexGrow: 1,
                border: 'none',
                background: 'transparent',
                resize: 'none',
                padding: '1.25rem',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                outline: 'none',
                overflowY: 'auto'
              }}
            />
          ) : (
            <div 
              id="tailored-resume-markdown-preview"
              className="markdown-body"
              style={{
                flexGrow: 1,
                padding: '1.25rem',
                overflowY: 'auto',
                color: 'var(--text-primary)'
              }}
            >
              <ReactMarkdown>{editedText}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .panel-textarea::-webkit-scrollbar {
          width: 6px;
        }
        .markdown-body::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>

    </div>
  );
}
