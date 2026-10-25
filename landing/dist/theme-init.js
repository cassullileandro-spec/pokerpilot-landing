// Apply the remembered theme before the first paint. Explicit comparison URLs
// always open their named theme; the main route remembers the visitor's choice.
(() => {
  let theme = document.documentElement.dataset.theme || 'dark';
  if (!/\/(light|dark)\.html$/.test(location.pathname)) {
    try { const saved = localStorage.getItem('pokerpilot-theme'); if (saved === 'light' || saved === 'dark') theme = saved; } catch {}
  }
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#10161e' : '#f3f4f6';
})();
