import React, { useState, useEffect } from 'react';
import { Briefcase, AlertTriangle, RotateCcw, Settings } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import ResumeUpload from './components/ResumeUpload';
import HistoryPanel from './components/HistoryPanel';
import LoadingProgress from './components/LoadingProgress';
import ResumeMatchAnalysis from './components/ResumeMatchAnalysis';
import ResumeTailor from './components/ResumeTailor';
import CoverLetterTailor from './components/CoverLetterTailor';
import EmptyState from './components/EmptyState';
import ApiKeyModal from './components/ApiKeyModal';
import ApiErrorNotification from './components/ApiErrorNotification';

import { SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION } from './utils/sampleData';
import { getHistory, saveSession, deleteSession, clearAllHistory } from './services/historyService';
import { analyzeResumeMatch, generateTailoredResume, generateCoverLetter, parseGeminiError } from './services/geminiService';

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeTab, setActiveTab] = useState('inputs');
  const [apiKey, setApiKey] = useState('');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Analysis result states
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [tailoredResume, setTailoredResume] = useState('');
  const [tailoredCoverLetter, setTailoredCoverLetter] = useState('');
  const [apiError, setApiError] = useState(null);

  // History state
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Check for API key on load
  useEffect(() => {
    const localKey = localStorage.getItem('gemini_api_key');
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const key = localKey || envKey;

    if (key && key !== 'your_gemini_api_key_here') {
      setApiKey(key);
    } else {
      setApiKey('');
      // Trigger modal pop-up on first launch if no key exists
      setTimeout(() => setIsApiModalOpen(true), 800);
    }
    // Load history
    setSessions(getHistory());
  }, []);

  const handleClearAllData = () => {
    handleClearAll();
    setSessions([]);
    setApiKey('');
  };

  const handleTextExtracted = (text) => {
    setResumeText(text);
  };

  const handleLoadSampleResume = () => {
    setResumeText(SAMPLE_RESUME);
  };

  const handleLoadSampleJob = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
  };

  const handleClearAll = () => {
    setResumeText('');
    setJobDescription('');
    setMatchAnalysis(null);
    setTailoredResume('');
    setTailoredCoverLetter('');
    setActiveSessionId(null);
    setActiveTab('inputs');
  };

  const handleSelectSession = (session) => {
    setResumeText(session.resumeText);
    setJobDescription(session.jobDescription);
    setMatchAnalysis(session.matchAnalysis);
    setTailoredResume(session.tailoredResume);
    setTailoredCoverLetter(session.tailoredCoverLetter);
    setActiveSessionId(session.id);
    setActiveTab('match');
  };

  const handleDeleteSession = (id) => {
    const updated = deleteSession(id);
    setSessions(updated);
    if (activeSessionId === id) {
      handleClearAll();
    }
  };

  const handleClearHistory = () => {
    clearAllHistory();
    setSessions([]);
    handleClearAll();
  };

  const handleCoverLetterUpdated = (newLetter) => {
    setTailoredCoverLetter(newLetter);
    if (activeSessionId) {
      const history = getHistory();
      const updated = history.map((session) => {
        if (session.id === activeSessionId) {
          return { ...session, tailoredCoverLetter: newLetter };
        }
        return session;
      });
      localStorage.setItem('ai_resume_optimizer_history', JSON.stringify(updated));
      setSessions(updated);
    }
  };

  const triggerOptimization = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Please provide both your resume and the target job description.');
      return;
    }
    setIsGenerating(true);
    setApiError(null);
    try {
      const [matchRes, resumeRes, coverRes] = await Promise.all([
        analyzeResumeMatch(resumeText, jobDescription),
        generateTailoredResume(resumeText, jobDescription),
        generateCoverLetter(resumeText, jobDescription, 'Professional', 'Standard')
      ]);

      const updatedHistory = saveSession({
        resumeText,
        jobDescription,
        matchAnalysis: matchRes,
        tailoredResume: resumeRes,
        tailoredCoverLetter: coverRes
      });

      setMatchAnalysis(matchRes);
      setTailoredResume(resumeRes);
      setTailoredCoverLetter(coverRes);
      setSessions(updatedHistory);
      
      if (updatedHistory && updatedHistory.length > 0) {
        setActiveSessionId(updatedHistory[0].id);
      }
      
      setActiveTab('match');
    } catch (err) {
      const parsed = parseGeminiError(err);
      setApiError(parsed);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <header className="navbar glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 2rem',
        marginBottom: '2rem',
        borderRadius: '0 0 var(--border-radius-lg) var(--border-radius-lg)',
        borderTop: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase size={28} style={{ color: 'var(--accent)' }} />
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0' }} className="gradient-text">
              AI Resume Optimizer
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0' }}>
              Portfolio Showcase Edition
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />
          <button 
            onClick={() => setIsApiModalOpen(true)}
            className="btn btn-ghost"
            aria-label="Settings"
            style={{
              width: '40px',
              height: '40px',
              padding: '0',
              borderRadius: 'var(--border-radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
              transition: 'transform var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(45deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
          >
            <Settings size={18} style={{ color: 'var(--text-secondary)', display: 'block' }} />
          </button>
        </div>
      </header>

      <div className="container">

        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '1.5rem',
          alignItems: 'start',
          marginBottom: '3rem'
        }}>
          {/* History Sidebar */}
          <aside className="sidebar-section">
            <HistoryPanel 
              sessions={sessions}
              activeId={activeSessionId}
              onSelectSession={handleSelectSession}
              onDeleteSession={handleDeleteSession}
              onClearHistory={handleClearHistory}
            />
          </aside>

          {/* Main Workspace */}
          <main className="workspace-section">
            {isGenerating ? (
              <LoadingProgress 
                currentStep={loadingStep} 
                onCancel={() => setIsGenerating(false)} 
              />
            ) : (
              <div className="workspace-card glass-panel" style={{ padding: '1.5rem 2rem', minHeight: '600px' }}>
                {/* Navigation Tabs */}
                <nav className="workspace-tabs" style={{
                  display: 'flex',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '1.5rem',
                  gap: '1.5rem'
                }}>
                  <button 
                    onClick={() => setActiveTab('inputs')}
                    className={`tab-btn ${activeTab === 'inputs' ? 'active' : ''}`}
                  >
                    Inputs Workspace
                  </button>
                  <button 
                    onClick={() => setActiveTab('match')}
                    className={`tab-btn ${activeTab === 'match' ? 'active' : ''}`}
                  >
                    Match Analysis
                  </button>
                  <button 
                    onClick={() => setActiveTab('resume')}
                    className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
                  >
                    Tailored Resume
                  </button>
                  <button 
                    onClick={() => setActiveTab('cover_letter')}
                    className={`tab-btn ${activeTab === 'cover_letter' ? 'active' : ''}`}
                  >
                    Tailored Cover Letter
                  </button>
                </nav>

                {/* Tab Contents */}
                {activeTab === 'inputs' && (
                  <div className="inputs-tab-content">
                    {/* Toolbar */}
                    <div className="toolbar" style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button 
                          onClick={handleLoadSampleResume}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                          Load Sample Resume
                        </button>
                        <button 
                          onClick={handleLoadSampleJob}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                          Load Sample Job Description
                        </button>
                      </div>
                      
                      {(resumeText || jobDescription) && (
                        <button 
                          onClick={handleClearAll}
                          className="btn btn-ghost btn-sm text-danger-hover"
                          style={{ 
                            padding: '0.4rem 0.8rem', 
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <RotateCcw size={14} />
                          Clear All Inputs
                        </button>
                      )}
                    </div>

                    {apiError && (
                      <ApiErrorNotification 
                        error={apiError} 
                        onRetry={triggerOptimization} 
                        onClose={() => setApiError(null)} 
                      />
                    )}

                    <div className="inputs-layout" style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1.5rem',
                      marginBottom: '1.5rem'
                    }}>
                      {/* Left Input: Resume */}
                      <div className="input-card flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>1. Your Resume</h2>
                        <ResumeUpload 
                          onTextExtracted={handleTextExtracted} 
                          textPresent={!!resumeText} 
                        />
                        <div className="form-group" style={{ flexGrow: 1 }}>
                          <label className="form-label">Or Paste Resume Text Below:</label>
                          <textarea 
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            className="form-textarea"
                            placeholder="Paste the full text of your resume here..."
                            style={{ minHeight: '300px', flexGrow: 1 }}
                          />
                        </div>
                      </div>

                      {/* Right Input: Job Description */}
                      <div className="input-card flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>2. Job Description</h2>
                        <div className="form-group" style={{ flexGrow: 1, marginTop: '2px' }}>
                          <label className="form-label">Paste Target Job Description:</label>
                          <textarea 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="form-textarea"
                            placeholder="Paste the target job description or requirements list here..."
                            style={{ minHeight: '400px', flexGrow: 1 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Optimize CTA */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center', 
                      marginTop: '2rem',
                      gap: '1rem'
                    }}>
                      <button 
                        onClick={triggerOptimization}
                        disabled={!resumeText.trim() || !jobDescription.trim() || !apiKey}
                        className="btn btn-primary btn-lg"
                        style={{ 
                          padding: '1rem 3rem', 
                          fontSize: '1.1rem', 
                          width: '100%', 
                          maxWidth: '350px',
                          opacity: (!resumeText.trim() || !jobDescription.trim() || !apiKey) ? 0.5 : 1
                        }}
                      >
                        Optimize Resume & Letter
                      </button>
                      
                      {!apiKey && (
                        <div className="warning-banner glass-panel animate-fade-in" style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '1.25rem 1.5rem',
                          width: '100%',
                          maxWidth: '450px',
                          backgroundColor: 'rgba(245, 158, 11, 0.05)',
                          border: '1px dashed rgba(245, 158, 11, 0.3)',
                          borderRadius: 'var(--border-radius-md)',
                          textAlign: 'center',
                          animation: 'fadeIn 0.3s ease-out'
                        }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0' }}>
                            Please connect your Gemini API key to use AI features.
                          </p>
                          <button 
                            onClick={() => setIsApiModalOpen(true)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem' }}
                          >
                            Connect Gemini API Key
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'match' && (
                  matchAnalysis ? (
                    <ResumeMatchAnalysis analysis={matchAnalysis} />
                  ) : (
                    <EmptyState tabName="Match Analysis" onNavigateToInputs={() => setActiveTab('inputs')} />
                  )
                )}

                {activeTab === 'resume' && (
                  tailoredResume ? (
                    <ResumeTailor originalText={resumeText} tailoredText={tailoredResume} />
                  ) : (
                    <EmptyState tabName="Tailored Resume" onNavigateToInputs={() => setActiveTab('inputs')} />
                  )
                )}

                {activeTab === 'cover_letter' && (
                  tailoredCoverLetter ? (
                    <CoverLetterTailor 
                      resumeText={resumeText}
                      jobDescription={jobDescription}
                      coverLetter={tailoredCoverLetter} 
                      onCoverLetterUpdated={handleCoverLetterUpdated}
                    />
                  ) : (
                    <EmptyState tabName="Tailored Cover Letter" onNavigateToInputs={() => setActiveTab('inputs')} />
                  )
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <ApiKeyModal 
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onKeySaved={(newKey) => setApiKey(newKey)}
        onClearAllData={handleClearAllData}
      />
      
      {/* Styles for Tabs and app-specific utilities */}
      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .tab-btn {
          font-family: var(--font-heading);
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0.75rem 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          transition: color var(--transition-fast);
        }
        .tab-btn:hover:not(:disabled) {
          color: var(--text-primary);
        }
        .tab-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .tab-btn.active {
          color: var(--accent);
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent-gradient);
        }
        .text-danger-hover:hover {
          color: var(--danger) !important;
        }
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .inputs-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
