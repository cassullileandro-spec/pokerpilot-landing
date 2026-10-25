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
    dashboard: { title: 'Dashboard', heading: 'Sua operação, em uma visão.', file: 'dashboard-light-retina.png', mobile: 'dashboard-mobile-retina.png', note: 'Conta de teste · indicadores sem histórico', alt: 'Dashboard real do PokerPilot: indicadores da conta de teste e tarefa em execução. A conta ainda não tem jogadores ou histórico financeiro.' },
    tasks: { title: 'Tarefas', heading: 'O próximo passo tem lugar certo.', file: 'tasks-light-retina.png', note: 'Kanban real · tarefa demonstrativa em execução', alt: 'Kanban real da conta de teste, com a tarefa DEMO LP — Conferir fechamento mensal na coluna Executando.' },
    deals: { title: 'Deals', heading: 'Acordos claros para os dois lados.', file: 'deals-light-retina.png', note: 'Acordo demonstrativo · divisão 50% / 50%', alt: 'Listagem real de deals com acordo demonstrativo ativo: 50% para o time e 50% para o jogador.' },
    profit: { title: 'Lançamentos', heading: 'Da origem ao destino, tudo registrado.', file: 'profit-light-retina.png', note: 'Formulário real · operação não enviada', alt: 'Formulário real de novo lançamento Profit Chop com campos de origem, destinos, valor e data, sem operação enviada.' },
  };
  const captureTabs = $$('.capture-tabs [data-capture]');
  const themeButtons = $$('[data-theme-choice]');
  function captureFile(capture, mobile = false) {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (mobile && capture.mobile) return dark ? 'dashboard-dark-mobile-retina.png' : capture.mobile;
    return dark ? capture.file.replace('-light-', '-dark-') : capture.file;
  }
  let activeCapture = 'dashboard';
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
