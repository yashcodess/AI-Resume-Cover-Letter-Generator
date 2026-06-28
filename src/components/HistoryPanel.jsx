import React from 'react';
import { History, Trash2, Calendar, FileText } from 'lucide-react';

export default function HistoryPanel({ sessions, activeId, onSelectSession, onDeleteSession, onClearHistory }) {
  
  const getSessionTitle = (jobDesc) => {
    if (!jobDesc) return 'Untitled Session';
    const lines = jobDesc.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length > 0) {
      const title = lines[0].replace(/^[#*\-\s]+/, ''); // Strip markdown bullet indicators
      return title.length > 26 ? title.substring(0, 24) + '...' : title;
    }
    return 'Untitled Session';
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return 'Recent Session';
    }
  };

  const handleConfirmClear = () => {
    if (window.confirm('Are you sure you want to clear your entire analysis history? This cannot be undone.')) {
      onClearHistory();
    }
  };

  return (
    <div className="history-panel glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '500px',
      borderRadius: 'var(--border-radius-lg)',
      padding: '1.25rem',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)'
    }}>
      {/* Sidebar Header */}
      <div className="history-header" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1rem'
      }}>
        <History size={18} style={{ color: 'var(--accent)' }} />
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0' }}>Past Optimizations</h3>
        <span className="badge badge-neutral" style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', marginLeft: 'auto' }}>
          {sessions.length}
        </span>
      </div>

      {/* History List */}
      <div className="history-list" style={{
        flexGrow: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginRight: '-0.5rem',
        paddingRight: '0.5rem',
        maxHeight: '450px'
      }}>
        {sessions.length === 0 ? (
          <div style={{
            padding: '2rem 1rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FileText size={24} style={{ opacity: 0.5 }} />
            <p style={{ margin: '0' }}>No history items yet.</p>
            <p style={{ margin: '0', fontSize: '0.75rem', opacity: 0.8 }}>Optimize your resume above to save a session.</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`history-item ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--border-radius-sm)',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                  backgroundColor: isActive ? 'var(--accent-light)' : 'rgba(0,0,0,0.1)',
                  borderColor: isActive ? 'var(--accent)' : 'transparent',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', overflow: 'hidden', flexGrow: 1, paddingRight: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {getSessionTitle(session.jobDescription)}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Calendar size={10} />
                    {formatDate(session.timestamp)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="delete-item-btn"
                  aria-label="Delete history session"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Clear Action */}
      {sessions.length > 0 && (
        <div style={{ 
          paddingTop: '1rem', 
          borderTop: '1px solid var(--border-color)', 
          marginTop: '1rem',
          display: 'flex'
        }}>
          <button
            onClick={handleConfirmClear}
            className="btn btn-ghost btn-sm"
            style={{ 
              width: '100%', 
              fontSize: '0.8rem', 
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              padding: '0.4rem'
            }}
          >
            <Trash2 size={12} />
            Clear All History
          </button>
        </div>
      )}

      <style>{`
        .history-item:hover {
          background-color: var(--accent-light) !important;
          border-color: rgba(99, 102, 241, 0.4) !important;
        }
        .history-item .delete-item-btn:hover {
          color: var(--danger) !important;
          background-color: var(--danger-light);
        }
        .history-list::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
    </div>
  );
}
