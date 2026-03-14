// ============================================
// Mermaid — Theme-Aware Initialization
// ============================================
(function() {
  function getMermaidConfig() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    
    return {
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: isDark ? {
        primaryColor: '#6366f1',
        primaryTextColor: '#f5f5f7',
        primaryBorderColor: '#818cf8',
        lineColor: '#6e7590',
        secondaryColor: '#1e2336',
        tertiaryColor: '#181c28',
        background: '#181c28',
        mainBkg: '#1e2336',
        nodeBorder: '#818cf8',
        clusterBkg: '#13161f',
        clusterBorder: '#2a2d3e',
        titleColor: '#f5f5f7',
        edgeLabelBackground: '#181c28',
        fontSize: '14px'
      } : {
        primaryColor: '#4f46e5',
        primaryTextColor: '#1d1d1f',
        primaryBorderColor: '#6366f1',
        lineColor: '#86899c',
        secondaryColor: '#ececf0',
        tertiaryColor: '#f5f5f7',
        background: '#ffffff',
        mainBkg: '#f8f8fc',
        nodeBorder: '#6366f1',
        clusterBkg: '#f5f5f7',
        clusterBorder: '#d1d5e4',
        titleColor: '#1d1d1f',
        edgeLabelBackground: '#ffffff',
        fontSize: '14px'
      }
    };
  }

  window.initMermaid = function() {
    mermaid.initialize(getMermaidConfig());
    
    // Re-render existing diagrams
    document.querySelectorAll('.mermaid[data-processed]').forEach(el => {
      el.removeAttribute('data-processed');
      el.innerHTML = el.getAttribute('data-original');
    });
    
    mermaid.run();
  };

  // Save original content and initialize
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mermaid').forEach(el => {
      el.setAttribute('data-original', el.textContent);
    });
    window.initMermaid();
  });
})();
