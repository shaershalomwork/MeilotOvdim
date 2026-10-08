// Apply the saved theme before the first paint. Keep the key in sync with ThemeService.
(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('meilot-ovdim.theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') preference = saved;
  } catch {
    // Theme selection also works when browser storage is unavailable.
  }
  const dark =
    preference === 'dark' ||
    (preference === 'system' &&
      (window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false));
  const root = document.documentElement;
  root.dataset.theme = dark ? 'dark' : 'light';
  root.classList.toggle('app-dark', dark);
})();
