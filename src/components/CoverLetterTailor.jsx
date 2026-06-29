import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, RefreshCw, Loader2, Download } from 'lucide-react';
import { generateCoverLetter, parseGeminiError } from '../services/geminiService';
import ApiErrorNotification from './ApiErrorNotification';

export default function CoverLetterTailor({ resumeText, jobDescription, coverLetter, onCoverLetterUpdated }) {
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Standard');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiError, setApiError] = useState(null);

  const tones = ['Professional', 'Bold', 'Enthusiastic', 'Creative'];
  const lengths = ['Short', 'Standard', 'Detailed'];

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailored_cover_letter.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setApiError(null);
    try {
      const updatedLetter = await generateCoverLetter(resumeText, jobDescription, tone, length);
      onCoverLetterUpdated(updatedLetter);
    } catch (err) {
      const parsed = parseGeminiError(err);
      setApiError(parsed);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="cover-letter-tailor-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Settings & Controls Panel */}
      <div className="toolbar-controls glass-panel" style={{
        padding: '1.25rem',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', flexGrow: 1 }}>
          {/* Tone Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Letter Tone
            </span>
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-primary)', padding: '0.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`btn-toggle-pill ${tone === t ? 'active' : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Length Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Letter Length
            </span>
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-primary)', padding: '0.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
              {lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  className={`btn-toggle-pill ${length === l ? 'active' : ''}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            {isRegenerating ? (
              <Loader2 className="animate-spin" size={14} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <RefreshCw size={14} />
            )}
            Regenerate Letter
          </button>
          
          <button 
            onClick={handleDownload}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Download size={14} />
            Download Cover Letter (.txt)
          </button>
          
          <button onClick={handleCopy} className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            {copied ? (
              <>
                <Check size={14} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy Text
              </>
            )}
          </button>
        </div>
      </div>

      {apiError && (
        <ApiErrorNotification 
          error={apiError} 
          onRetry={handleRegenerate} 
          onClose={() => setApiError(null)} 
        />
      )}

      {/* Cover Letter Document Layout */}
      <div className="letter-wrapper" style={{ position: 'relative' }}>
        {isRegenerating && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: '600',
            gap: '0.5rem'
          }}>
            <Loader2 className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            <span>Regenerating Cover Letter...</span>
          </div>
        )}

        <div className="letter-page" style={{
          backgroundColor: '#ffffff',
          color: '#111827',
          padding: '3rem',
          borderRadius: 'var(--border-radius-md)',
          boxShadow: 'var(--shadow-lg)',
          minHeight: '600px',
          border: '1px solid #e5e7eb',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.95rem',
          lineHeight: '1.6'
        }}>
          {/* Letterhead mock decoration */}
          <div className="letter-head" style={{
            borderBottom: '2px solid #374151',
            paddingBottom: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>
                Cover Letter
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
                Tailored for applicant alignment
              </p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#4b5563' }}>
              <p style={{ margin: 0 }}>Date: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style={{ margin: 0 }}>Generated via AI Resume Optimizer</p>
            </div>
          </div>

          {/* Letter Content */}
          <div className="letter-markdown-body" style={{ color: '#374151' }}>
            <ReactMarkdown>{coverLetter}</ReactMarkdown>
          </div>
        </div>
      </div>

      <style>{`
        .btn-toggle-pill {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.35rem 0.75rem;
          border-radius: calc(var(--border-radius-sm) - 2px);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-toggle-pill:hover {
          color: var(--text-primary);
        }
        .btn-toggle-pill.active {
          background: var(--bg-secondary);
          color: var(--accent);
          box-shadow: var(--shadow-sm);
        }
        .letter-markdown-body h1, .letter-markdown-body h2, .letter-markdown-body h3 {
          color: #111827 !important;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .letter-markdown-body p {
          margin-bottom: 1.25rem;
        }
      `}</style>
      
    </div>
  );
}
