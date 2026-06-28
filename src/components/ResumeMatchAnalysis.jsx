import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, Check, X } from 'lucide-react';

export default function ResumeMatchAnalysis({ analysis }) {
  if (!analysis) return null;

  const {
    matchingSkills = [],
    missingSkills = [],
    strengths = [],
    weaknesses = [],
    improvementSuggestions = []
  } = analysis;

  return (
    <div className="match-analysis-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Overview Banner */}
      <div className="overview-header" style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--border-radius-md)',
        background: 'var(--accent-light)',
        border: '1px solid var(--accent)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <Lightbulb size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0' }}>Resume Match Analysis Loaded</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0' }}>
            We compared your resume with the job requirements. See below for gaps, strengths, and recommendations.
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="skills-comparison-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }}>
        {/* Matching Skills */}
        <div className="skills-card glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              padding: '0.35rem',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)'
            }}>
              <Check size={18} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Matching Skills ({matchingSkills.length})</h3>
          </div>
          
          {matchingSkills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {matchingSkills.map((skill, idx) => (
                <span key={idx} className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '0' }}>
              No matching keywords identified.
            </p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="skills-card glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              padding: '0.35rem',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)'
            }}>
              <X size={18} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Missing / Gaps ({missingSkills.length})</h3>
          </div>

          {missingSkills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {missingSkills.map((skill, idx) => (
                <span key={idx} className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '0' }}>
              Excellent alignment! No missing core skills detected.
            </p>
          )}
        </div>
      </div>

      {/* Strengths and Weaknesses Grid */}
      <div className="strengths-weaknesses-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }}>
        {/* Strengths */}
        <div className="analysis-list-card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Key Strengths</h3>
          </div>
          
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '0' }}>
            {strengths.map((strength, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="analysis-list-card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Gaps / Weaknesses</h3>
          </div>

          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '0' }}>
            {weaknesses.map((weakness, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Improvement Suggestions */}
      <div className="suggestions-section glass-panel" style={{ padding: '1.5rem 2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb size={20} style={{ color: 'var(--warning)' }} />
          Actionable Resume Improvements
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {improvementSuggestions.map((item, idx) => (
            <div 
              key={idx} 
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <span className="badge badge-neutral" style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.2rem 0.5rem',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)'
                }}>
                  {item.section}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0', lineHeight: '1.5' }}>
                {item.suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Media Query Handling Style tag */}
      <style>{`
        @media (max-width: 768px) {
          .skills-comparison-grid, .strengths-weaknesses-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
