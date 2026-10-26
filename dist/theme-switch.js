(() => {
  const buttons = [...document.querySelectorAll('[data-theme-choice]')];
  const select = (theme) => {
    document.body.dataset.theme = theme;
    buttons.forEach((button) => {
      const active = button.dataset.themeChoice === theme;
      button.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('prototype-theme-' + location.pathname, theme); } catch {}
  };
  let initial = 'one';
  try { initial = localStorage.getItem('prototype-theme-' + location.pathname) || initial; } catch {}
  select(initial);
  buttons.forEach((button) => button.addEventListener('click', () => select(button.dataset.themeChoice)));
})();
