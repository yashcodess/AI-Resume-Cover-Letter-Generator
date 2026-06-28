const STORAGE_KEY = 'ai_resume_optimizer_history';

/**
 * Retrieves all saved history sessions.
 * @returns {Array} Array of saved session objects.
 */
export function getHistory() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : [];
  } catch (error) {
    console.error('Failed to parse history from localStorage:', error);
    return [];
  }
}

/**
 * Saves a new analysis session to the history list.
 * Keeps the list sorted with the newest sessions first.
 * @param {Object} session - The session to save.
 * @returns {Array} The updated array of sessions.
 */
export function saveSession({ resumeText, jobDescription, matchAnalysis, tailoredResume, tailoredCoverLetter }) {
  try {
    const history = getHistory();
    const newSession = {
      id: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      resumeText,
      jobDescription,
      matchAnalysis,
      tailoredResume,
      tailoredCoverLetter
    };
    
    // Put the newest session at the beginning of the list
    const updatedHistory = [newSession, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
    return getHistory();
  }
}

/**
 * Deletes a session by ID from the history.
 * @param {string} id - The ID of the session to delete.
 * @returns {Array} The updated array of sessions.
 */
export function deleteSession(id) {
  try {
    const history = getHistory();
    const updatedHistory = history.filter((session) => session.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Failed to delete session from localStorage:', error);
    return getHistory();
  }
}

/**
 * Clears all sessions from the history.
 */
export function clearAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history from localStorage:', error);
  }
}
