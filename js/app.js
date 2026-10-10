/**
 * APLICAÇÃO PRINCIPAL - ROTEADOR SPA, TEMAS E CONTROLADORES DE INTERFACE
 * Plataforma Bíblia Online ACF — Bp. Emanuel
 * Lógica compatível com bibliaonline.com.br/acf
 */

// ==========================================================================
// TOAST NOTIFICATIONS & MODALS
// ==========================================================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

// ==========================================================================
// GERENCIADOR DE TEMAS (DARK, SEPIA, LIGHT)
// ==========================================================================
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('bp_theme') || 'dark';
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('bp_theme', theme);

    const iconMap = { dark: '🌙', sepia: '📜', light: '☀️' };
    const currentIcon = document.getElementById('current-theme-icon');
    if (currentIcon) currentIcon.textContent = iconMap[theme] || '🌙';

    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === theme);
    });
  }

  toggleDropdown() {
    const menu = document.getElementById('theme-dropdown-menu');
    if (menu) menu.classList.toggle('show');
  }
}

const themeManager = new ThemeManager();

// ==========================================================================
// ROTEADOR DE VISUALIZAÇÕES E ROTAS HASH (PADRÃO BIBLIAONLINE.COM.BR/ACF)
// ==========================================================================
class AppRouter {
  constructor() {
    this.currentView = 'home';
    this.init();
  }

  init() {
    // Clique nos botões do menu com data-route
    document.querySelectorAll('[data-route]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const route = btn.getAttribute('data-route');
        if (route === 'bible') {
          this.navigateToRoute(`/acf/${bibleReader.currentBookSlug}/${bibleReader.currentChapter}`);
        } else {
          this.navigateTo(route);
        }
      });
    });

    // Escuta mudanças de hash na URL
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });

    // Rota inicial ao carregar a página
    this.handleHashChange();
  }

  handleHashChange() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash || hash === 'acf' || hash === 'home') {
      this.navigateTo('home', false);
      return;
    }

    // Padrão 1: /acf/:slug/:chapter ou /nvi/:slug/:chapter (com versículo opcional)
    // Ex: acf/gn/1 ou acf/sl/23 ou acf/jo/3:16
    const bibleMatch = hash.match(/^(acf|nvi)\/([a-z0-9à-ÿ]+)\/(\d+)(?::(\d+))?$/i);
    if (bibleMatch) {
      const version = bibleMatch[1].toUpperCase();
      const slug = bibleMatch[2].toLowerCase();
      const chapter = parseInt(bibleMatch[3]);
      const verse = bibleMatch[4] ? parseInt(bibleMatch[4]) : null;

      bibleService.setVersion(version);
      this.navigateTo('bible', false);
      bibleReader.loadChapter(slug, chapter, verse);
      return;
    }

    // Padrão 2: busca?q=termo
    if (hash.startsWith('busca')) {
      const params = new URLSearchParams(hash.replace('busca', '').replace(/^\?/, ''));
      const q = params.get('q');
      this.navigateTo('search', false);
      if (q) {
        bibleSearchEngine.currentQuery = q;
        const input = document.getElementById('global-search-input');
        if (input) input.value = q;
        bibleSearchEngine.performSearch();
      }
      return;
    }

    // Padrão 3: rotas estáticas: estudos, planos, anotacoes, dicionario
    const cleanRoute = hash.split('/')[0];
    const knownRoutes = ['home', 'bible', 'studies', 'plans', 'notes', 'lexicon', 'search'];
    if (knownRoutes.includes(cleanRoute)) {
      this.navigateTo(cleanRoute, false);
    } else {
      this.navigateTo('home', false);
    }
  }

  navigateToRoute(path) {
    window.location.hash = path;
  }

  navigateTo(viewId, updateHash = true) {
    this.currentView = viewId;

    if (updateHash) {
      if (viewId === 'bible') {
        window.location.hash = `/acf/${bibleReader.currentBookSlug}/${bibleReader.currentChapter}`;
      } else {
        window.location.hash = `/${viewId}`;
      }
    }

    // Atualiza botões do header
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-route') === viewId);
    });

    // Alterna visibilidade das seções
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Inicializações de views específicas
    if (viewId === 'bible') {
      bibleReader.loadChapter(bibleReader.currentBookSlug, bibleReader.currentChapter);
    } else if (viewId === 'studies') {
      renderStudiesGrid();
    } else if (viewId === 'plans') {
      renderReadingPlansView();
    } else if (viewId === 'notes') {
      renderNotesView();
    } else if (viewId === 'lexicon') {
      renderLexiconView();
    } else if (viewId === 'home') {
      bibleReader.updateContinueReadingCard();
    }
  }
}

let appRouter;

// ==========================================================================
// MODAL DE SELEÇÃO DE LIVROS (BIBLIA ONLINE LOGIC: AT 39 / NT 27 COM BUSCA)
// ==========================================================================
let currentTestamentFilter = 'AT';

function openBookSelectorModal() {
  const searchInput = document.getElementById('book-modal-search');
  if (searchInput) searchInput.value = '';
  renderBookSelectorGrid();
  openModal('book-selector-modal');
  setTimeout(() => {
    if (searchInput) searchInput.focus();
  }, 100);
}

function filterTestament(testament, btn) {
  currentTestamentFilter = testament;
  document.querySelectorAll('.book-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderBookSelectorGrid();
}

function handleBookSearchFilter(query) {
  renderBookSelectorGrid(query.trim().toLowerCase());
}

function renderBookSelectorGrid(searchQuery = '') {
  const container = document.getElementById('book-selector-grid');
  if (!container) return;

  const allBooks = bibleService.getBooks();
  let filtered = allBooks;

  if (searchQuery) {
    const unaccent = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const cleanQ = unaccent(searchQuery);
    filtered = allBooks.filter(b => 
      unaccent(b.name).includes(cleanQ) || 
      unaccent(b.abbrev).includes(cleanQ) || 
      unaccent(b.slug).includes(cleanQ)
    );
  } else {
    filtered = allBooks.filter(b => b.testament === currentTestamentFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
        Nenhum livro encontrado para "${searchQuery}".
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(b => `
    <button class="book-select-item" onclick="openChapterSelectorModal('${b.slug}')">
      <div class="book-sel-top">
        <span class="book-sel-abbrev">${b.abbrev}</span>
        <span class="book-sel-chapters">${b.chapters} cap.</span>
      </div>
      <div class="book-sel-name">${b.name}</div>
    </button>
  `).join('');
}

// ==========================================================================
// MODAL DE SELEÇÃO DE CAPÍTULOS (GRADE NUMÉRICA DIRETA)
// ==========================================================================
let selectedBookForChapters = null;

function openChapterSelectorModal(bookSlug) {
  closeModal('book-selector-modal');
  const book = bibleService.getBook(bookSlug || bibleReader.currentBookSlug);
  selectedBookForChapters = book;

  const titleEl = document.getElementById('chapter-modal-book-title');
  const countEl = document.getElementById('chapter-modal-book-count');
  const gridEl = document.getElementById('chapter-selector-grid');

  if (titleEl) titleEl.textContent = book.name;
  if (countEl) countEl.textContent = `${book.chapters} capítulos`;

  if (gridEl) {
    let html = '';
    for (let c = 1; c <= book.chapters; c++) {
      const isCurrent = (book.slug === bibleReader.currentBookSlug && c === bibleReader.currentChapter);
      const activeClass = isCurrent ? 'active' : '';
      html += `
        <button class="chap-num-btn ${activeClass}" onclick="selectChapterFromModal(${c})">
          ${c}
        </button>
      `;
    }
    gridEl.innerHTML = html;
  }

  openModal('chapter-selector-modal');
}

function selectChapterFromModal(chapterNum) {
  closeModal('chapter-selector-modal');
  const slug = selectedBookForChapters ? selectedBookForChapters.slug : bibleReader.currentBookSlug;
  window.location.hash = `/acf/${slug}/${chapterNum}`;
}

// ==========================================================================
// MODAL DE OPÇÕES DE LEITURA (Aa)
// ==========================================================================
function openReadingOptionsModal() {
  // Sincroniza controles com o estado atual
  document.querySelectorAll('.view-mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === bibleReader.viewMode);
  });
  document.querySelectorAll('.font-family-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.family === bibleReader.fontFamily);
  });
  const fontLabel = document.getElementById('options-font-size-label');
  if (fontLabel) fontLabel.textContent = `${bibleReader.fontSize}px`;

  openModal('reading-options-modal');
}

// ==========================================================================
// VERSÍCULO DO DIA & CONTINUAR LEITURA
// ==========================================================================
function initDailyVerse() {
  const todayIndex = new Date().getDate() % DAILY_VERSES.length;
  const verse = DAILY_VERSES[todayIndex];

  const textEl = document.getElementById('daily-verse-text');
  const refEl = document.getElementById('daily-verse-ref');

  if (textEl) textEl.textContent = `"${verse.text}"`;
  if (refEl) refEl.textContent = `— ${verse.reference} (${bibleService.getVersion()}) —`;

  // Ouvir Versículo do Dia com TTS natural
  const audioBtn = document.getElementById('daily-verse-audio-btn');
  if (audioBtn) {
    audioBtn.onclick = () => {
      bibleSpeech.speak(`${verse.text}. ${verse.reference}.`, null, null);
      showToast('Ouvindo Versículo do Dia 🔊');
    };
  }

  // Copiar versículo
  const copyBtn = document.getElementById('daily-verse-copy-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(`"${verse.text}"\n— ${verse.reference} (${bibleService.getVersion()})`).then(() => {
        showToast("Versículo do Dia copiado!");
      });
    };
  }

  // Ler no contexto (vai direto para a passagem)
  const contextBtn = document.getElementById('daily-verse-context-btn');
  if (contextBtn) {
    contextBtn.onclick = () => {
      const book = bibleService.getBook(verse.bookId);
      window.location.hash = `/acf/${book.slug}/${verse.chapter}:${verse.verse}`;
    };
  }

  // Criar cartão do versículo do dia
  const cardBtn = document.getElementById('daily-verse-card-btn');
  if (cardBtn) {
    cardBtn.onclick = () => {
      const cardText = document.getElementById('card-generator-verse-text');
      const cardRef = document.getElementById('card-generator-verse-ref');
      if (cardText) cardText.textContent = `"${verse.text}"`;
      if (cardRef) cardRef.textContent = `— ${verse.reference} (${bibleService.getVersion()}) —`;
      openModal('verse-card-modal');
    };
  }
}

// ==========================================================================
// PRATELEIRA COMPLETA DE LIVROS NA HOME (ESTRUTURA CANÔNICA)
// ==========================================================================
function initCanonicalBooksShelf() {
  const atContainer = document.getElementById('home-at-books-grid');
  const ntContainer = document.getElementById('home-nt-books-grid');

  const allBooks = bibleService.getBooks();
  const atBooks = allBooks.filter(b => b.testament === 'AT');
  const ntBooks = allBooks.filter(b => b.testament === 'NT');

  if (atContainer) {
    atContainer.innerHTML = atBooks.map(b => `
      <div class="canonical-book-card" onclick="openChapterSelectorModal('${b.slug}')">
        <div class="book-card-abbrev">${b.abbrev}</div>
        <div class="book-card-name">${b.name}</div>
        <div class="book-card-meta">${b.chapters} cap. • <span class="group-tag">${b.group}</span></div>
      </div>
    `).join('');
  }

  if (ntContainer) {
    ntContainer.innerHTML = ntBooks.map(b => `
      <div class="canonical-book-card" onclick="openChapterSelectorModal('${b.slug}')">
        <div class="book-card-abbrev">${b.abbrev}</div>
        <div class="book-card-name">${b.name}</div>
        <div class="book-card-meta">${b.chapters} cap. • <span class="group-tag">${b.group}</span></div>
      </div>
    `).join('');
  }
}

// ==========================================================================
// SEÇÃO DE ESTUDOS BÍBLICOS
// ==========================================================================
let currentCategoryFilter = 'all';

function renderStudiesGrid() {
  const container = document.getElementById('studies-cards-grid');
  if (!container) return;

  const studies = studiesManager.getAllStudies();
  const filtered = currentCategoryFilter === 'all'
    ? studies
    : studies.filter(s => s.category.toLowerCase().includes(currentCategoryFilter.toLowerCase()));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>Nenhum estudo bíblico encontrado nesta categoria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(s => `
    <div class="study-card">
      <div>
        <div class="study-meta-header">
          <span class="study-category-badge">${s.category}</span>
          <span class="study-reading-time">⏱️ ${s.readingTime}</span>
        </div>
        <h3 class="study-title">${s.title}</h3>
        <p class="study-excerpt">${s.excerpt}</p>
        <div class="study-scripture-anchor">
          <span>📖</span> ${s.scriptureRef}
        </div>
      </div>
      <div class="study-footer-row">
        <span class="study-author">Por ${s.author} • ${s.date}</span>
        <button class="read-study-btn" onclick="openStudyReader('${s.id}')">
          Ler Estudo →
        </button>
      </div>
    </div>
  `).join('');
}

function filterStudiesByCategory(cat, btn) {
  currentCategoryFilter = cat;
  document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderStudiesGrid();
}

function openStudyReader(studyId) {
  const study = studiesManager.getStudyById(studyId);
  if (!study) return;

  const view = document.getElementById('view-study-view');
  if (!view) return;

  view.innerHTML = `
    <div class="study-article-container">
      <button class="back-to-studies-btn" onclick="appRouter.navigateTo('studies')">
        ← Voltar aos Estudos Bíblicos
      </button>

      <header class="study-article-header">
        <div class="study-meta-header" style="margin-bottom: 0.75rem;">
          <span class="study-category-badge">${study.category}</span>
          <span class="study-reading-time">⏱️ ${study.readingTime} de leitura</span>
        </div>
        <h1 class="study-article-title">${study.title}</h1>
        <div class="study-article-info">
          <span>✍️ <strong>${study.author}</strong></span>
          <span>📅 ${study.date}</span>
          <span>📖 Base: <strong>${study.scriptureRef}</strong></span>
        </div>
      </header>

      <div class="study-article-body">
        ${study.content}

        ${study.prayerPoints && study.prayerPoints.length > 0 ? `
          <div class="prayer-points-box">
            <h4>🙏 Pontos de Oração e Aplicação Prática</h4>
            <ul class="prayer-points-list">
              ${study.prayerPoints.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>

      <div style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-secondary" onclick="appRouter.navigateTo('studies')">
          ← Ver outros estudos
        </button>
        <button class="btn-primary" onclick="window.print()">
          🖨️ Imprimir / Salvar PDF
        </button>
      </div>
    </div>
  `;

  appRouter.navigateTo('study-view');
}

function handleCreateNewStudy(e) {
  e.preventDefault();
  const title = document.getElementById('new-study-title').value.trim();
  const author = document.getElementById('new-study-author').value.trim() || 'Bispo Emanuel';
  const category = document.getElementById('new-study-category').value;
  const scriptureRef = document.getElementById('new-study-ref').value.trim();
  const excerpt = document.getElementById('new-study-excerpt').value.trim();
  const content = document.getElementById('new-study-content').value.trim();

  if (!title || !content) {
    alert("Por favor preencha o título e o conteúdo do estudo.");
    return;
  }

  const newStudy = {
    title,
    author,
    category,
    readingTime: Math.max(3, Math.ceil(content.split(' ').length / 150)) + " min",
    scriptureRef: scriptureRef || "Escrituras Sagradas",
    excerpt: excerpt || content.substring(0, 140) + "...",
    content: `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`,
    prayerPoints: [
      "Aplicar com fidelidade o ensinamento bíblico desta mensagem no cotidiano.",
      "Interceder para que o fruto do Espírito se manifeste em todas as ações."
    ]
  };

  studiesManager.addStudy(newStudy);
  closeModal('new-study-modal');
  showToast("Novo estudo bíblico publicado com sucesso! 📜");
  renderStudiesGrid();
}

// ==========================================================================
// CONTROLADOR DOS PLANOS DE LEITURA
// ==========================================================================
function renderReadingPlansView() {
  const container = document.getElementById('plans-view-container');
  if (!container) return;

  container.innerHTML = READING_PLANS.map(plan => {
    const percent = readingPlansManager.getPlanProgressPercent(plan.id, plan.totalItems);
    return `
      <div class="plan-card active" style="margin-bottom: 2rem;">
        <div class="plan-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="study-category-badge">Plano de Leitura</span>
            <span style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700;">⏱️ ${plan.duration}</span>
          </div>
          <h3 class="plan-title">${plan.title}</h3>
          <p class="plan-desc">${plan.description}</p>
          
          <div class="progress-container">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
            <div class="progress-labels">
              <span>Progresso concluído</span>
              <strong>${percent}%</strong>
            </div>
          </div>
        </div>

        <div class="plan-checklist">
          ${plan.days.map(d => {
            const isDone = readingPlansManager.isDayCompleted(plan.id, d.day);
            return `
              <div class="plan-day-item">
                <div class="plan-day-left">
                  <input type="checkbox" class="custom-checkbox" 
                    ${isDone ? 'checked' : ''} 
                    onchange="togglePlanDayCheck('${plan.id}', ${d.day}, ${plan.totalItems})">
                  <div>
                    <span class="day-text">Dia ${d.day}: ${d.title}</span>
                  </div>
                </div>
                <button class="day-reference" onclick="jumpToBibleBook('${d.bookId}', ${d.chapter})">
                  📖 Ler ${d.ref} →
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function togglePlanDayCheck(planId, day, totalItems) {
  const isDone = readingPlansManager.toggleDay(planId, day);
  showToast(isDone ? `Dia ${day} concluído! Parabéns! 🕊️` : `Dia ${day} desmarcado.`);
  renderReadingPlansView();
}

function jumpToBibleBook(bookIdOrSlug, chapter, verse = null) {
  const book = bibleService.getBook(bookIdOrSlug);
  if (!book) return;
  if (verse) {
    window.location.hash = `/acf/${book.slug}/${chapter}:${verse}`;
  } else {
    window.location.hash = `/acf/${book.slug}/${chapter}`;
  }
}

// ==========================================================================
// CONTROLADOR DE ANOTAÇÕES & FAVORITOS
// ==========================================================================
function renderNotesView() {
  const container = document.getElementById('notes-grid-container');
  if (!container) return;

  const notesObj = bibleReader.notes;
  const notesKeys = Object.keys(notesObj);

  if (notesKeys.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Você ainda não possui anotações registradas.</p>
        <p style="font-size: 0.95rem;">Clique em qualquer versículo durante a leitura bíblica para destacar e registrar revelações e reflexões!</p>
        <button class="btn-primary" style="margin-top: 1.5rem;" onclick="appRouter.navigateTo('bible')">
          Ir para a Bíblia Sagrada
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = notesKeys.map(k => {
    const item = notesObj[k];
    const text = typeof item === 'string' ? item : item.text;
    const bookName = item.bookName || 'Escrituras';
    const chapter = item.chapter || 1;
    const verse = item.verse || 1;
    const date = item.date || '';

    return `
      <div class="note-card">
        <div>
          <div class="note-verse-header">
            <span class="note-verse-ref">${bookName} ${chapter}:${verse}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${date}</span>
          </div>
          ${item.verseText ? `<div class="note-verse-text">"${item.verseText}"</div>` : ''}
          <div class="note-body">${text}</div>
        </div>
        <div class="note-footer">
          <button class="read-study-btn" onclick="jumpToBibleBook('${item.bookSlug || 'gn'}', ${chapter}, ${verse})">
            Abrir Capítulo →
          </button>
          <button style="color: var(--text-muted); cursor: pointer;" onclick="deleteNoteEntry('${k}')" title="Excluir">
            🗑️ Excluir
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteNoteEntry(verseKey) {
  if (confirm("Deseja realmente remover esta anotação?")) {
    delete bibleReader.notes[verseKey];
    bibleReader.saveToStorage('bp_bible_notes', bibleReader.notes);
    renderNotesView();
    showToast("Anotação removida.");
  }
}

// ==========================================================================
// CONTROLADOR DO DICIONÁRIO TEOLÓGICO
// ==========================================================================
let currentAlphaFilter = 'all';

function renderLexiconView() {
  const container = document.getElementById('lexicon-list-container');
  const searchInput = document.getElementById('lexicon-search-input');
  if (!container) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = THEOLOGICAL_DICTIONARY;
  if (currentAlphaFilter !== 'all') {
    filtered = filtered.filter(item => item.term.toUpperCase().startsWith(currentAlphaFilter));
  }

  if (query) {
    filtered = filtered.filter(item => 
      item.term.toLowerCase().includes(query) || 
      item.definition.toLowerCase().includes(query) ||
      item.origin.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>Nenhum termo teológico encontrado para esta pesquisa.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="dict-term-card">
      <div class="dict-term-title">
        ${item.term}
        <span class="dict-origin">${item.origin}</span>
      </div>
      <p class="dict-definition">${item.definition}</p>
      <div class="dict-verses-ref">
        <strong>Passagens Bíblicas:</strong> ${item.references}
      </div>
    </div>
  `).join('');
}

function filterLexiconByLetter(letter, btn) {
  currentAlphaFilter = letter;
  document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderLexiconView();
}

// ==========================================================================
// INICIALIZAÇÃO GERAL AO CARREGAR
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  appRouter = new AppRouter();
  initDailyVerse();
  initCanonicalBooksShelf();

  // Botão de Áudio Ambiente (Web Audio API)
  const ambientBtn = document.getElementById('ambient-audio-toggle');
  if (ambientBtn) {
    ambientBtn.addEventListener('click', () => {
      const isPlaying = audioAmbience.toggleAmbience();
      ambientBtn.classList.toggle('playing', isPlaying);
      showToast(isPlaying ? "Música sacra ambiente iniciada 🕊️" : "Áudio ambiente pausado.");
    });
  }

  // Atalho de teclado Ctrl + K para Seletor de Livros
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openBookSelectorModal();
    }
  });

  // Fecha dropdown de tema ao clicar fora
  document.addEventListener('click', (e) => {
    const themeDropdown = document.querySelector('.theme-dropdown');
    const menu = document.getElementById('theme-dropdown-menu');
    if (themeDropdown && menu && !themeDropdown.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
});
