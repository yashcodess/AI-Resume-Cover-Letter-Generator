import React, { useState, useEffect } from 'react';
import { Loader2, FileText, BarChart2, FileSignature, MailCheck } from 'lucide-react';

export default function LoadingProgress({ onCancel }) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Reading and parsing inputs', icon: FileText },
    { label: 'Analyzing keywords and matching skills', icon: BarChart2 },
    { label: 'Tailoring resume content and layout', icon: FileSignature },
    { label: 'Drafting customized cover letter', icon: MailCheck }
  ];

  useEffect(() => {
    // Increment progress and update active steps dynamically over ~15 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 98; // Hold at 98% until loading finishes
        }
        
        let increment = 1;
        // Faster at start, slower as it reaches limits
        if (prev < 20) {
          increment = 2.5;
        } else if (prev < 50) {
          increment = 1.8;
        } else if (prev < 75) {
          increment = 1.2;
        } else {
          increment = 0.5;
        }
        
        const nextProgress = Math.min(prev + increment, 98);
        
        // Update active step based on progress threshold
        if (nextProgress < 25) {
          setActiveStep(0);
        } else if (nextProgress < 50) {
          setActiveStep(1);
        } else if (nextProgress < 75) {
          setActiveStep(2);
        } else {
          setActiveStep(3);
        }
        
        return nextProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container glass-panel" style={{
      padding: '3rem 2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
      minHeight: '500px',
      justifyContent: 'center'
    }}>
      <div className="loader-scanner" style={{ position: 'relative' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--accent)', animation: 'spin 1.5s linear infinite' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '450px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>
          Optimizing with Gemini AI...
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          This may take a moment. We are analyzing documents and generating tailored assets.
        </p>

        {/* Progress Bar */}
        <div style={{
          height: '8px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius-full)',
          overflow: 'hidden',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--accent-gradient)',
            borderRadius: 'var(--border-radius-full)',
            transition: 'width 0.2s ease-out'
          }} />
        </div>

        {/* Step Checklists */}
        <div className="steps-list" style={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            let status = 'pending'; // pending, active, completed
            if (activeStep > index) status = 'completed';
            else if (activeStep === index) status = 'active';

            return (
              <div 
                key={index} 
                className={`step-item ${status}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  opacity: status === 'pending' ? 0.4 : 1,
                  transition: 'opacity var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--border-radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: status === 'completed' ? 'var(--success-light)' : status === 'active' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  border: `1px solid ${status === 'completed' ? 'var(--success)' : status === 'active' ? 'var(--accent)' : 'var(--border-color)'}`,
                  color: status === 'completed' ? 'var(--success)' : status === 'active' ? 'var(--accent)' : 'var(--text-muted)'
                }}>
                  {status === 'active' ? (
                    <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <StepIcon size={16} />
                  )}
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: status === 'active' ? '600' : '400',
                  color: status === 'completed' ? 'var(--text-secondary)' : status === 'active' ? 'var(--text-primary)' : 'var(--text-muted)'
                }}>
                  {step.label}
                  {status === 'completed' && ' ✓'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={onCancel}
        className="btn btn-ghost"
        style={{ fontSize: '0.85rem', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
      >
        Cancel Generation
      </button>
    </div>
  );
}
