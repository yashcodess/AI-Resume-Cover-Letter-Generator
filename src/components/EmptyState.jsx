import React from 'react';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';

export default function EmptyState({ tabName, onNavigateToInputs }) {
  const getIcon = () => {
    switch (tabName) {
      case 'Match Analysis':
        return <Sparkles size={36} style={{ color: 'var(--accent)' }} />;
      default:
        return <FileText size={36} style={{ color: 'var(--accent)' }} />;
    }
  };

  return (
    <div className="empty-state-card flex-col-center animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 2rem',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      border: '1px dashed var(--border-color)',
      borderRadius: 'var(--border-radius-lg)',
      minHeight: '400px',
      gap: '1.5rem',
      animation: 'fadeIn 0.4s ease-out'
    }}>
      {/* Icon Wrapper with glowing aura */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: 'var(--border-radius-full)',
        backgroundColor: 'var(--accent-light)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-accent)',
        position: 'relative'
      }}>
        {getIcon()}
      </div>

      <div style={{ maxWidth: '380px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          No {tabName} Yet
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0' }}>
          Upload your resume and paste a job description to begin the optimization process.
        </p>
      </div>

      <button 
        onClick={onNavigateToInputs}
        className="btn btn-primary btn-sm"
        style={{
          padding: '0.5rem 1.25rem',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        Go to Inputs Workspace
        <ArrowRight size={14} />
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
