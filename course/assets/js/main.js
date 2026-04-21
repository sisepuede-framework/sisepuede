(function() {
  const app = document.getElementById('app');

  function qs(sel, root=document) { return root.querySelector(sel); }

  function renderHome() {
    const modules = window.COURSE_DATA.modules;
    const featured = modules.slice(0, 6);
    const lang = window.CURRENT_LANG;
    const tracks = window.COURSE_DATA.tracks[lang];

    app.innerHTML = `
      <section class="hero">
        <div class="container hero-inner">
          <div>
            <span class="complete-badge" data-i18n="hero.eyebrow">${t('hero.eyebrow')}</span>
            <h1>
              <span data-i18n="hero.title1">${t('hero.title1')}</span>
              <span class="grad"> SISEPUEDE </span>
              <span data-i18n="hero.title3">${t('hero.title3')}</span>
            </h1>
            <p class="lead" data-i18n="hero.lead">${t('hero.lead')}</p>
            <div class="cta">
              <a href="#/modules" class="btn btn-primary" data-i18n="hero.cta1">${t('hero.cta1')}</a>
              <a href="#/about" class="btn btn-ghost" data-i18n="hero.cta2">${t('hero.cta2')}</a>
            </div>
          </div>
          <div class="hero-card">
            <img src="assets/img/sisepuede_dag_color.png" alt="SISEPUEDE DAG">
            <div class="caption" data-i18n="hero.caption">${t('hero.caption')}</div>
          </div>
        </div>
      </section>

      <section class="section alt">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow" data-i18n="features.eyebrow">${t('features.eyebrow')}</span>
            <h2 data-i18n="features.title">${t('features.title')}</h2>
            <p data-i18n="features.sub">${t('features.sub')}</p>
          </div>
          <div class="feature-grid">
            ${[
              ['🧠','features.f1.t','features.f1.d'],
              ['🌍','features.f2.t','features.f2.d'],
              ['📐','features.f3.t','features.f3.d'],
              ['🎯','features.f4.t','features.f4.d'],
              ['🎲','features.f5.t','features.f5.d'],
              ['∑','features.f6.t','features.f6.d']
            ].map(([icon, kt, kd]) => `
              <div class="feature">
                <div class="icon">${icon}</div>
                <h3 data-i18n="${kt}">${t(kt)}</h3>
                <p data-i18n="${kd}">${t(kd)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow" data-i18n="catalog.eyebrow">${t('catalog.eyebrow')}</span>
            <h2 data-i18n="catalog.title">${t('catalog.title')}</h2>
            <p data-i18n="catalog.sub">${t('catalog.sub')}</p>
          </div>
          <div class="module-grid">
            ${featured.map((m,i) => renderModuleCard(m, i)).join('')}
          </div>
          <div style="text-align:center; margin-top:36px">
            <a href="#/modules" class="btn btn-primary">${t('hero.cta2')}</a>
          </div>
        </div>
      </section>
    `;
    window.setLang(window.CURRENT_LANG);
  }

  function renderModuleCard(m, idx) {
    const lang = window.CURRENT_LANG;
    const title = (m.title && m.title[lang]) || m.title.en;
    const summary = (m.summary && m.summary[lang]) || m.summary.en;
    const tracks = window.COURSE_DATA.tracks[lang] || window.COURSE_DATA.tracks.en;
    const trackLabel = tracks[m.track] || m.track;
    const duration = m.duration || 20;
    const durationLabel = lang === 'es' ? 'min de lectura' : 'min read';
    return `
      <a class="module-card" href="#/module/${m.id}">
        <div class="meta">
          <span class="tag">${trackLabel}</span>
          <span>#${String(idx+1).padStart(2,'0')}</span>
        </div>
        <h3>${title}</h3>
        <p>${summary}</p>
        <div class="footer">
          <span>${duration} ${durationLabel}</span>
          <span class="open">${lang === 'es' ? 'Abrir módulo →' : 'Open module →'}</span>
        </div>
      </a>
    `;
  }

  function renderModulesCatalog() {
    const lang = window.CURRENT_LANG;
    const modules = window.COURSE_DATA.modules;
    const tracks = window.COURSE_DATA.tracks[lang];
    const chips = Object.entries(tracks).map(([k,v]) =>
      `<button class="chip" data-track="${k}">${v}</button>`
    ).join('');

    app.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${t('catalog.eyebrow')}</span>
            <h2>${t('catalog.title')}</h2>
            <p>${t('catalog.sub')}</p>
          </div>
          <div class="modules-toolbar">
            <input type="search" id="module-search" placeholder="${t('catalog.search')}">
            <div class="chip-row" id="track-chips">
              <button class="chip active" data-track="all">${t('catalog.all')}</button>
              ${chips}
            </div>
          </div>
          <div class="module-grid" id="module-grid">
            ${modules.map((m,i) => renderModuleCard(m, i)).join('')}
          </div>
        </div>
      </section>
    `;

    const grid = qs('#module-grid');
    const chipsRow = qs('#track-chips');
    const search = qs('#module-search');
    let activeTrack = 'all';
    let query = '';

    function update() {
      const filtered = modules.filter(m => {
        const title = (m.title[lang] || m.title.en).toLowerCase();
        const summary = (m.summary[lang] || m.summary.en).toLowerCase();
        const trackOk = activeTrack === 'all' || m.track === activeTrack;
        const qOk = !query || title.includes(query) || summary.includes(query);
        return trackOk && qOk;
      });
      grid.innerHTML = filtered.length
        ? filtered.map((m, i) => renderModuleCard(m, modules.indexOf(m))).join('')
        : `<p style="color:var(--ink-500)">${lang === 'es' ? 'Sin resultados.' : 'No results.'}</p>`;
    }

    chipsRow.addEventListener('click', e => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      chipsRow.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      activeTrack = btn.dataset.track;
      update();
    });
    search.addEventListener('input', e => {
      query = e.target.value.toLowerCase();
      update();
    });
  }

  function renderModule(id) {
    const lang = window.CURRENT_LANG;
    const modules = window.COURSE_DATA.modules;
    const idx = modules.findIndex(m => m.id === id);
    if (idx < 0) { renderNotFound(); return; }
    const m = modules[idx];
    const content = (m.content && m.content[lang]) || m.content.en;
    const title = (m.title[lang] || m.title.en);
    const subtitle = (m.summary[lang] || m.summary.en);
    const prev = modules[idx-1];
    const next = modules[idx+1];

    const sidebar = `
      <aside class="module-sidebar">
        <h4>${t('module.syllabus')}</h4>
        <ol>
          ${modules.map((mi, i) => `
            <li>
              <a href="#/module/${mi.id}" class="${mi.id===id?'active':''}">
                <span class="num">${String(i+1).padStart(2,'0')}</span>
                <span>${(mi.title[lang] || mi.title.en)}</span>
              </a>
            </li>
          `).join('')}
        </ol>
        <p style="font-size:12px;color:var(--ink-500);padding:0 12px">${lang === 'es' ? '12 módulos · ~4 h total' : '12 modules · ~4 h total'}</p>
      </aside>
    `;

    app.innerHTML = `
      <div class="container module-layout">
        ${sidebar}
        <article class="module-content">
          <div class="crumbs">
            <a href="#/modules">${t('module.backToModules')}</a>
            <span>/</span>
            <span>${lang === 'es' ? 'Módulo' : 'Module'} ${String(idx+1).padStart(2,'0')}</span>
          </div>
          <h1>${title}</h1>
          <p class="subtitle">${subtitle}</p>
          ${content}
          <div class="prev-next">
            ${prev ? `<a href="#/module/${prev.id}" class="prev"><span>← ${t('module.prev')}</span><strong>${(prev.title[lang] || prev.title.en)}</strong></a>` : '<span></span>'}
            ${next ? `<a href="#/module/${next.id}" class="next"><span>${t('module.next')} →</span><strong>${(next.title[lang] || next.title.en)}</strong></a>` : '<span></span>'}
          </div>
        </article>
        <aside class="module-toc" id="module-toc">
          <h4>${t('module.toc')}</h4>
          <ol id="toc-list"></ol>
        </aside>
      </div>
    `;

    // Build TOC from h2/h3
    const tocList = qs('#toc-list');
    const headings = qs('.module-content').querySelectorAll('h2, h3');
    headings.forEach((h, i) => {
      if (!h.id) h.id = 'sec-' + i + '-' + (h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));
      const li = document.createElement('li');
      if (h.tagName === 'H3') li.classList.add('h3');
      li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
      tocList.appendChild(li);
    });

    if (window.Prism) Prism.highlightAllUnder(qs('.module-content'));
    if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([qs('.module-content')]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function renderGlossary() {
    const lang = window.CURRENT_LANG;
    const items = window.COURSE_DATA.glossary[lang] || window.COURSE_DATA.glossary.en;
    app.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${t('glossary.eyebrow')}</span>
            <h2>${t('glossary.title')}</h2>
            <p>${t('glossary.sub')}</p>
          </div>
          <dl class="glossary-grid">
            ${items.map(it => `
              <div class="glossary-item">
                <dt>${it.term}</dt>
                <dd>${it.def}</dd>
              </div>
            `).join('')}
          </dl>
        </div>
      </section>
    `;
  }

  function renderAbout() {
    const lang = window.CURRENT_LANG;
    app.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-head" style="text-align:left; margin-bottom: 32px">
            <span class="eyebrow">${t('about.eyebrow')}</span>
            <h2>${t('about.title')}</h2>
          </div>
          <div class="about-grid">
            <div>
              <p>${t('about.p1')}</p>
              <p>${t('about.p2')}</p>
              <p>${t('about.p3')}</p>
              <h3>${t('about.what')}</h3>
              <ul>${t('about.whatList')}</ul>
            </div>
            <div>
              <img src="assets/img/diagram_integrated.jpg" alt="SISEPUEDE integrated diagram">
              <p style="font-size:13px;color:var(--ink-500);margin-top:12px">${lang === 'es' ? 'Diagrama integrado de SISEPUEDE.' : 'SISEPUEDE integrated diagram.'}</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderNotFound() {
    app.innerHTML = `
      <section class="section">
        <div class="container" style="text-align:center">
          <h2>404</h2>
          <p>${window.CURRENT_LANG === 'es' ? 'Página no encontrada.' : 'Page not found.'}</p>
          <a href="#/" class="btn btn-primary">${window.CURRENT_LANG === 'es' ? 'Ir al inicio' : 'Go home'}</a>
        </div>
      </section>
    `;
  }

  function router() {
    const hash = location.hash.replace(/^#/, '') || '/';
    const parts = hash.split('/').filter(Boolean);
    // parts: [] = home; ['modules']; ['module', id]; ['glossary']; ['about']
    if (parts.length === 0) { renderHome(); markActiveNav('#/'); return; }
    if (parts[0] === 'modules') { renderModulesCatalog(); markActiveNav('#/modules'); return; }
    if (parts[0] === 'module' && parts[1]) { renderModule(parts[1]); markActiveNav('#/modules'); return; }
    if (parts[0] === 'glossary') { renderGlossary(); markActiveNav('#/glossary'); return; }
    if (parts[0] === 'about') { renderAbout(); markActiveNav('#/about'); return; }
    renderNotFound();
  }

  function markActiveNav(href) {
    document.querySelectorAll('.site-nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === href);
    });
  }

  // Language switcher
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-set-lang]');
    if (btn) {
      window.setLang(btn.getAttribute('data-set-lang'));
      router(); // re-render with new language
      return;
    }
    const toggle = e.target.closest('.menu-toggle');
    if (toggle) {
      document.querySelector('.site-nav').classList.toggle('open');
    }
  });

  window.addEventListener('hashchange', router);
  window.setLang(window.CURRENT_LANG);
  router();
})();
