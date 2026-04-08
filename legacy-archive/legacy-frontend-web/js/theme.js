// ============================================
// Theme — Dark/Light Toggle + System Preference
// ============================================
(function() {
  const root = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('sgroup-theme', theme);
    // Re-init mermaid on theme change
    if (window.initMermaid) window.initMermaid();
  }

  // Initialize
  const saved = localStorage.getItem('sgroup-theme');
  applyTheme(saved || getSystemTheme());

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', e => {
      if (!localStorage.getItem('sgroup-theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });

  // Expose toggle
  window.toggleTheme = function() {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  };
})();
