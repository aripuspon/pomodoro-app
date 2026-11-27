(function initLegalTheme() {
  const htmlDoc = document.documentElement;
  const toggleBtn = document.getElementById('legal-theme-toggle');
  const toggleLabel = document.getElementById('legal-theme-label');

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSet(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch {
      // Ignore storage errors in strict privacy mode
    }
  }

  function applyStoredVisuals() {
    const savedTheme = safeGet('theme') === 'dark' ? 'dark' : 'light';
    htmlDoc.setAttribute('data-theme', savedTheme);
    if (toggleLabel) {
      toggleLabel.textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    try {
      const rawSettings = safeGet('appSettings');
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings);
        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.visualPalette === 'string') {
            htmlDoc.setAttribute('data-palette', parsed.visualPalette);
          }
          if (typeof parsed.backdropStyle === 'string') {
            htmlDoc.setAttribute('data-backdrop', parsed.backdropStyle);
          }
        }
      }
    } catch {
      // Fall back to default palette/backdrop
    }
  }

  applyStoredVisuals();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = htmlDoc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      safeSet('theme', next);
      applyStoredVisuals();
    });
  }
})();
