import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Check local storage or default to dark
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    // Set theme attribute on root html element
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      style={{
        width: '40px',
        height: '40px',
        padding: '0',
        borderRadius: 'var(--border-radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        background: 'var(--bg-secondary)',
        transition: 'transform var(--transition-fast)'
      }}
    >
      {theme === 'dark' ? (
        <Sun size={18} style={{ color: '#fbbf24', display: 'block' }} />
      ) : (
        <Moon size={18} style={{ color: '#6366f1', display: 'block' }} />
      )}
    </button>
  );
}
