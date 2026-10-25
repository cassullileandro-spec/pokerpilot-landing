(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const config = window.POKERPILOT_CONFIG || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('.site-header');
  const menuButton = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  const demoDialog = $('#demo-dialog');
  const form = $('#demo-form');
  const formStatus = $('#form-status');
  let lastFocused;

  function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; menuButton.setAttribute('aria-label', 'Abrir menu'); }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobileNav.hidden = !open;
  });
  $$('#mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  const desktopMedia = window.matchMedia('(min-width: 641px)');
  desktopMedia.addEventListener('change', e => { if (e.matches) closeMenu(); });
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  function openDialog(dialog) { lastFocused = document.activeElement; closeMenu(); dialog.showModal(); }
  function safeUrl(value) { if (!value) return null; try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; } }
  $$('[data-demo]').forEach(button => button.addEventListener('click', () => {
    const url = safeUrl(config.schedulingUrl);
    if (url) { window.location.assign(url); return; }
    formStatus.hidden = true;
    openDialog(demoDialog);
  }));
  $$('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => { if (lastFocused?.isConnected) lastFocused.focus({ preventScroll: true }); });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  $('#review-open').addEventListener('click', () => openDialog($('#review-dialog')));
  $$('[data-info]').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.info;
    const url = safeUrl(config[type === 'privacy' ? 'privacyUrl' : 'termsUrl']);
    if (url) { window.location.assign(url); return; }
    $('#info-title').textContent = type === 'privacy' ? 'Política de privacidade' : 'Termos de uso';
    $('#info-text').textContent = 'O documento oficial será vinculado antes da publicação. Esta versão é uma prévia local da landing page.';
    openDialog($('#info-dialog'));
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    // Preview only: no API, no storage, no logging of form contents.
    formStatus.textContent = 'Prévia concluída. Na versão final, o próximo passo será escolher um horário na agenda do PokerPilot. Nenhum dado foi enviado e nenhum agendamento foi realizado.';
    formStatus.hidden = false;
    formStatus.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });

  const captures = {
    performance: { title: 'Desempenho', heading: 'Os resultados, por inteiro.', file: 'performance-20261025-light-retina.png', note: 'Indicadores e gráficos reais · role para explorar', alt: 'Tela real de Desempenho do PokerPilot com indicadores financeiros, resumo por jogador e gráficos do período.' },
    dashboard: { title: 'Dashboard', heading: 'Sua operação, em uma visão.', file: 'dashboard-20261025-light-retina.png', mobile: 'dashboard-20261025-light-mobile-retina.png', note: 'Visão geral · conta atualizada em outubro de 2026', alt: 'Dashboard real do PokerPilot com jogadores ativos, Profit Chop, banca atual e lançamentos recentes.' },
    bankroll: { title: 'Bankroll', heading: 'A banca, dia após dia.', file: 'bankroll-20261025-light-retina.png', note: 'Histórico diário · saldos por jogador e site', alt: 'Histórico real de bankroll diário do PokerPilot, organizado por data, jogador e site de poker.' },
    transactions: { title: 'Lançamentos', heading: 'Da origem ao destino, tudo registrado.', file: 'transactions-20261025-light-retina.png', note: 'Lançamentos reais · valores, datas e fluxo', alt: 'Listagem real de lançamentos do PokerPilot com Profit Chop, retiradas, valores, jogadores e destinos.' },
  };
  const captureTabs = $$('.capture-tabs [data-capture]');
  const themeButtons = $$('[data-theme-choice]');
  function captureFile(capture, mobile = false) {
    const dark = document.documentElement.dataset.theme === 'dark';
    const file = mobile && capture.mobile ? capture.mobile : capture.file;
    return dark ? file.replace('-light-', '-dark-') : file;
  }
  let activeCapture = 'performance';
  function selectCapture(key) {
    const capture = captures[key];
    activeCapture = key;
    $('#capture-panel').scrollTo(0, 0);
    captureTabs.forEach(button => {
      const selected = button.dataset.capture === key;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    $('#capture-panel').setAttribute('aria-labelledby', `tab-${key}`);
    $('#capture-panel').dataset.capture = key;
    $('#capture-mobile').srcset = `./assets/${captureFile(capture, true)}`;
    $('#capture-image').src = `./assets/${captureFile(capture)}`;
    $('#capture-image').alt = capture.alt;
    $('#capture-title').textContent = capture.heading;
    $('#capture-note').textContent = capture.note;
  }
  captureTabs.forEach((button, index) => {
    button.addEventListener('click', () => selectCapture(button.dataset.capture));
    button.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % captureTabs.length;
      if (event.key === 'ArrowLeft') target = (index - 1 + captureTabs.length) % captureTabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = captureTabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      captureTabs[target].focus();
      selectCapture(captureTabs[target].dataset.capture);
    });
  });
  function openCapture(key) {
    const capture = captures[key];
    $('#capture-dialog-title').textContent = capture.title;
    $('#capture-dialog-note').textContent = capture.note;
    $('#capture-full-image').src = `./assets/${captureFile(capture)}`;
    $('#capture-full-image').alt = capture.alt;
    openDialog($('#capture-dialog'));
    $('.capture-dialog-scroll').scrollTo(0, 0);
  }
  $('#capture-expand').addEventListener('click', () => openCapture(activeCapture));

  function applyTheme(theme, remember = false) {
    document.documentElement.dataset.theme = theme;
    $('meta[name="theme-color"]').content = theme === 'dark' ? '#10161e' : '#f3f4f6';
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
    $$('.brand img, .footer-brand img').forEach(img => { img.src = theme === 'dark' ? './assets/logo.svg?v=20261025' : './assets/logo-light.svg?v=20261025'; });
    $$('[data-brand-symbol]').forEach(img => { img.src = `./assets/symbol-${theme}.svg`; });
    $('#theme-label').textContent = theme === 'dark' ? 'Dark mode' : 'Light mode';
    $('.version-link').href = theme === 'dark' ? './light.html' : './dark.html';
    $('.version-link').textContent = theme === 'dark' ? 'Abrir versão clara ↗' : 'Abrir versão escura ↗';
    selectCapture(activeCapture);
    if ($('#capture-dialog').open) $('#capture-full-image').src = `./assets/${captureFile(captures[activeCapture])}`;
    if (remember) { try { localStorage.setItem('pokerpilot-theme', theme); } catch {} }
  }
  themeButtons.forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.themeChoice, true)));
  applyTheme(document.documentElement.dataset.theme || 'dark');


  let taskRunning = false;
  const task = $('#moving-task');
  const pendingColumn = task.parentElement;
  const taskButton = $('#task-demo-button');
  taskButton.addEventListener('click', () => {
    const before = task.getBoundingClientRect();
    taskRunning = !taskRunning;
    (taskRunning ? $('#executing-column') : pendingColumn).appendChild(task);
    $('#kanban-empty').hidden = taskRunning;
    $('#pending-count').textContent = taskRunning ? '0' : '1';
    $('#executing-count').textContent = taskRunning ? '1' : '0';
    taskButton.innerHTML = `${taskRunning ? 'Reiniciar demonstração' : 'Iniciar tarefa'} <svg><use href="#i-arrow"/></svg>`;
    const after = task.getBoundingClientRect();
    if (!reducedMotion.matches) task.animate([{ transform: `translate(${before.x - after.x}px,${before.y - after.y}px)` }, { transform: 'translate(0,0)' }], { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)' });
  });

  // Progressive enhancement: content is visible without JS or IntersectionObserver.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }), { threshold: .07, rootMargin: '0px 0px -25px 0px' });
    $$('.reveal').forEach(element => observer.observe(element));
    reducedMotion.addEventListener('change', event => { if (event.matches) { document.documentElement.classList.remove('js-motion'); observer.disconnect(); } });
  }
})();
