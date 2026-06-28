import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, X, AlertCircle, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved, onClearAllData }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [storedKeyExists, setStoredKeyExists] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    if (key && key.trim() !== '') {
      setStoredKeyExists(true);
      setMaskedKey(key.substring(0, 8) + '•'.repeat(Math.max(key.length - 8, 12)));
      setApiKeyInput(key);
      setIsEditing(false);
    } else {
      setStoredKeyExists(false);
      setMaskedKey('');
      setApiKeyInput('');
      setIsEditing(true); // Default to entry mode if no key exists
    }
    setValidationError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKeyInput.trim()) {
      setValidationError('API key cannot be empty.');
      return;
    }

    // Standard Google API keys start with AIzaSy
    if (!apiKeyInput.trim().startsWith('AIzaSy')) {
      if (!window.confirm('Gemini API keys typically start with "AIzaSy". The key you entered does not match this pattern. Are you sure you want to save it?')) {
        return;
      }
    }

    localStorage.setItem('gemini_api_key', apiKeyInput.trim());
    setStoredKeyExists(true);
    setMaskedKey(apiKeyInput.trim().substring(0, 8) + '•'.repeat(Math.max(apiKeyInput.trim().length - 8, 12)));
    setIsEditing(false);
    setValidationError('');
    
    if (onKeySaved) {
      onKeySaved(apiKeyInput.trim());
    }
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to disconnect your Gemini API key? AI optimizations will be disabled.')) {
      localStorage.removeItem('gemini_api_key');
      setStoredKeyExists(false);
      setApiKeyInput('');
      setMaskedKey('');
      setIsEditing(true);
      if (onKeySaved) {
        onKeySaved('');
      }
    }
  };

  const handlePurge = () => {
    if (window.confirm('WARNING: This will remove your API Key and clear ALL saved optimization history. Are you sure?')) {
      localStorage.removeItem('gemini_api_key');
      localStorage.removeItem('ai_resume_optimizer_history');
      setStoredKeyExists(false);
      setApiKeyInput('');
      setMaskedKey('');
      setIsEditing(true);
      if (onClearAllData) {
        onClearAllData();
      }
      onClose();
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="modal-card glass-panel animate-scale-up" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2rem',
        position: 'relative',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Close Button (only allowed if there is already a key stored, otherwise must configure first) */}
        {storedKeyExists && (
          <button 
            onClick={onClose}
            className="modal-close-btn"
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '50%'
            }}
          >
            <X size={18} />
          </button>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Key size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0' }}>
                {storedKeyExists && !isEditing ? 'Gemini API Settings' : 'Connect Your Gemini API'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0' }}>
                Direct client-to-API secure connector
              </p>
            </div>
          </div>

          {/* Description */}
          {!storedKeyExists || isEditing ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0', lineHeight: '1.5' }}>
              This application uses Google's Gemini API to generate resume analysis and cover letters. 
              For privacy and security, your API key is stored <strong>locally</strong> in your browser and is never sent to any external server.
            </p>
          ) : null}

          {/* Body Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {storedKeyExists && !isEditing ? (
              /* Status View */
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <CheckCircle size={16} />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>API Key Connected</span>
                </div>
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.85rem', 
                  color: 'var(--text-secondary)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  wordBreak: 'break-all'
                }}>
                  {maskedKey}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ flexGrow: 1, padding: '0.4rem', fontSize: '0.8rem' }}
                  >
                    Replace API Key
                  </button>
                  <button 
                    onClick={handleRemove}
                    className="btn btn-danger btn-sm"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              /* Entry Form */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => {
                      setApiKeyInput(e.target.value);
                      setValidationError('');
                    }}
                    placeholder="Enter Google Gemini API Key (starts with AIzaSy...)"
                    className="form-input"
                    style={{ width: '100%', paddingRight: '2.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {validationError && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem', 
                    color: 'var(--danger)', 
                    fontSize: '0.8rem',
                    marginTop: '-0.25rem'
                  }}>
                    <AlertCircle size={14} />
                    <span>{validationError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--accent)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontWeight: '500'
                    }}
                  >
                    Get a free Gemini API Key
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: '0.75rem', 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '1.25rem',
            alignItems: 'center'
          }}>
            {/* Purge Button (Left aligned) */}
            <button 
              onClick={handlePurge}
              className="btn btn-ghost btn-sm text-danger-hover"
              style={{ fontSize: '0.8rem', padding: '0.4rem', color: 'var(--text-muted)' }}
            >
              Clear All App Data
            </button>

            {/* Cancel/Save Buttons (Right aligned) */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {storedKeyExists && (
                <button 
                  onClick={() => {
                    if (isEditing) {
                      // Revert back to status view
                      const k = localStorage.getItem('gemini_api_key');
                      setApiKeyInput(k || '');
                      setIsEditing(false);
                      setValidationError('');
                    } else {
                      onClose();
                    }
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
              )}
              {(!storedKeyExists || isEditing) && (
                <button 
                  onClick={handleSave}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Save Key
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-close-btn:hover {
          background-color: var(--bg-tertiary) !important;
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
}
