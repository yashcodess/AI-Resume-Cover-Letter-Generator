import React from 'react';
import { AlertCircle, WifiOff, Key, RefreshCw, X, AlertTriangle } from 'lucide-react';

export default function ApiErrorNotification({ error, onRetry, onClose }) {
  if (!error) return null;

  const { message, type } = error;

  // Decide icon based on error type
  let Icon = AlertTriangle;
  if (type === 'NETWORK_ERROR') {
    Icon = WifiOff;
  } else if (type === 'INVALID_API_KEY') {
    Icon = Key;
  } else if (type === 'RATE_LIMIT') {
    Icon = AlertCircle;
  }

  return (
    <div className="api-error-card glass-panel" style={{
      display: 'flex',
      gap: '1.25rem',
      padding: '1.5rem',
      margin: '0.5rem 0 1.5rem 0',
      backgroundColor: 'var(--danger-light)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: 'var(--border-radius-md)',
      position: 'relative',
      alignItems: 'flex-start',
      boxShadow: '0 8px 30px rgba(239, 68, 68, 0.08)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '0.6rem',
        borderRadius: 'var(--border-radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--danger)'
      }}>
        <Icon size={24} />
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {type === 'NETWORK_ERROR' ? 'Connection Error' : 
             type === 'INVALID_API_KEY' ? 'Authentication Error' : 
             type === 'RATE_LIMIT' ? 'Rate Limit Exceeded' : 
             type === 'SERVICE_UNAVAILABLE' ? 'Service Temporarily Unavailable' :
             'AI Optimization Error'}
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: '1.5'
          }}>
            {message}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                borderColor: 'var(--danger)'
              }}
            >
              <RefreshCw size={14} />
              Retry
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--border-radius-full)',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
