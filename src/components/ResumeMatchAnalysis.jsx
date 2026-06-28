import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, Check, X } from 'lucide-react';

export default function ResumeMatchAnalysis({ analysis }) {
  if (!analysis) return null;

  const {
    matchingSkills = [],
    missingSkills = [],
    strengths = [],
    weaknesses = [],
    improvementSuggestions = [],
    resumeMatchScore = 0,
    atsScore = 0,
    atsExplanation = '',
    scoreBefore = 0,
    scoreAfter = 0
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

      {/* Score Cards Grid */}
      <div className="scores-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '0.5rem'
      }}>
        {/* Resume Match Score Card */}
        <div className="score-card glass-panel" style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', marginTop: '0' }}>
            Resume Match Score
          </h4>
          <div style={{
            fontSize: '3rem',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)',
            lineHeight: '1',
            color: resumeMatchScore >= 90 ? 'var(--success)' : resumeMatchScore >= 70 ? 'var(--warning)' : 'var(--danger)',
            transition: 'color var(--transition-normal)'
          }}>
            {resumeMatchScore}%
          </div>
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--border-radius-full)',
            backgroundColor: resumeMatchScore >= 90 ? 'var(--success-light)' : resumeMatchScore >= 70 ? 'rgba(245, 158, 11, 0.12)' : 'var(--danger-light)',
            color: resumeMatchScore >= 90 ? 'var(--success)' : resumeMatchScore >= 70 ? 'var(--warning)' : 'var(--danger)'
          }}>
            {resumeMatchScore >= 90 ? 'Excellent Match' : resumeMatchScore >= 70 ? 'Good Match' : 'Low Match'}
          </div>
        </div>

        {/* ATS Compatibility Card */}
        <div className="score-card glass-panel" style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', marginTop: '0' }}>
            ATS Compatibility
          </h4>
          <div style={{
            fontSize: '3rem',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)',
            lineHeight: '1',
            color: atsScore >= 90 ? 'var(--success)' : atsScore >= 70 ? 'var(--warning)' : 'var(--danger)',
            marginBottom: '0.5rem'
          }}>
            {atsScore}%
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0', maxWidth: '300px', lineHeight: '1.4' }}>
            {atsExplanation || 'Assesses layout readability, formatting structure, and keyword parsing compatibility.'}
          </p>
        </div>

        {/* Resume Improvement Comparative Card */}
        <div className="score-card glass-panel" style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '0.5rem'
        }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', marginTop: '0' }}>
            Optimization Impact
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Before</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{scoreBefore}%</span>
            </div>
            <div style={{
              fontSize: '1.25rem',
              color: 'var(--accent)',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}>
              ➔
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: '700' }}>After AI</span>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)' }}>{scoreAfter}%</span>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0', lineHeight: '1.4', marginTop: '0.25rem' }}>
            Potential alignment improvement by applying suggestions.
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
