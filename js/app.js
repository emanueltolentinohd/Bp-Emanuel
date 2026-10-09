/**
 * APLICAÇÃO PRINCIPAL - ROTEADOR, TEMAS E CONTROLADORES DE INTERFACE
 * Plataforma de Estudos Bíblicos Bp. Emanuel
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

    // Atualiza ícones e botões ativos no menu
    const iconMap = { dark: '🌙', sepia: '📜', light: '☀️' };
    const labelMap = { dark: 'Nobre Escuro', sepia: 'Papel Sépia', light: 'Claro' };

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
// ROTEADOR DE VISUALIZAÇÕES (SPA VIEWS)
// ==========================================================================
class AppRouter {
  constructor() {
    this.currentView = 'home';
    this.init();
  }

  init() {
    // Escuta cliques nos botões de navegação
    document.querySelectorAll('[data-route]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const route = btn.getAttribute('data-route');
        this.navigateTo(route);
      });
    });

    // Hash navigation
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) this.navigateTo(hash, false);
    });

    if (window.location.hash) {
      this.navigateTo(window.location.hash.replace('#', ''), false);
    }
  }

  navigateTo(viewId, updateHash = true) {
    this.currentView = viewId;
    if (updateHash) {
      window.location.hash = viewId;
    }

    // Atualiza botões do header
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-route') === viewId);
    });

    // Oculta todas as seções e exibe a selecionada
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Inicializações específicas de visualização
    if (viewId === 'bible') {
      bibleReader.loadChapter(bibleReader.currentBookId, bibleReader.currentChapter);
    } else if (viewId === 'studies') {
      renderStudiesGrid();
    } else if (viewId === 'plans') {
      renderReadingPlansView();
    } else if (viewId === 'notes') {
      renderNotesView();
    } else if (viewId === 'lexicon') {
      renderLexiconView();
    }
  }
}

let appRouter;

// ==========================================================================
// CONTROLADOR DA SEÇÃO DE ESTUDOS BÍBLICOS
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

  // Anexa ouvintes de clique para todas as referências bíblicas clicáveis
  view.querySelectorAll('.scripture-ref-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      const ref = badge.getAttribute('data-ref');
      previewScriptureReference(ref);
    });
  });

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
// PREVIEW FLUTUANTE DE VERSÍCULOS
// ==========================================================================
function previewScriptureReference(refString) {
  const modal = document.getElementById('verse-preview-modal');
  const titleEl = document.getElementById('preview-modal-title');
  const bodyEl = document.getElementById('preview-modal-content');

  if (titleEl) titleEl.textContent = `Referência: ${refString}`;

  // Procura se temos o versículo em nossa base
  let foundText = "O Senhor revelou Sua graciosa vontade através da Sua eterna Palavra.";
  
  if (refString.includes('ROM 5:1')) {
    foundText = "Sendo, pois, justificados pela fé, temos paz com Deus por nosso Senhor Jesus Cristo.";
  } else if (refString.includes('ROM 3:23')) {
    foundText = "Porque todos pecaram e destituídos estão da glória de Deus.";
  } else if (refString.includes('EPH 2:8')) {
    foundText = "Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus.";
  } else if (refString.includes('ROM 8:1')) {
    foundText = "Portanto, agora, nenhuma condenação há para os que estão em Cristo Jesus, que não andam segundo a carne, mas segundo o espírito.";
  } else if (refString.includes('EPH 6:12')) {
    foundText = "Porque não temos que lutar contra carne e sangue, mas, sim, contra os principados, contra as potestades, contra os príncipes das trevas deste século.";
  } else if (refString.includes('MAT 6:6')) {
    foundText = "Mas tu, quando orares, entra no teu aposento e, fechando a tua porta, ora a teu Pai, que vê o que está oculto; e teu Pai, que vê o que é oculto, te recompensará.";
  } else if (refString.includes('MAT 5:3')) {
    foundText = "Bem-aventurados os pobres de espírito, porque deles é o Reino dos céus.";
  } else if (refString.includes('1TH 4:16')) {
    foundText = "Porque o mesmo Senhor descerá do céu com alarido, e com voz de arcanjo, e com a trombeta de Deus; e os que morreram em Cristo ressuscitarão primeiro.";
  }

  if (bodyEl) {
    bodyEl.innerHTML = `
      <p style="font-family: 'Lora', serif; font-size: 1.25rem; line-height: 1.9; font-style: italic; color: var(--text-scripture); margin-bottom: 1.5rem;">
        "${foundText}"
      </p>
      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button class="btn-primary" onclick="closeModal('verse-preview-modal')">Amém</button>
      </div>
    `;
  }

  openModal('verse-preview-modal');
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
  showToast(isDone ? `Dia ${day} concluído! Parabéns pela perseverança! 🕊️` : `Dia ${day} desmarcado.`);
  renderReadingPlansView();
}

function jumpToBibleBook(bookId, chapter) {
  bibleReader.loadChapter(bookId, chapter);
  appRouter.navigateTo('bible');
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
        <p style="font-size: 0.95rem;">Clique em qualquer versículo durante a leitura da Bíblia para destacar e adicionar anotações teológicas pessoais!</p>
        <button class="btn-primary" style="margin-top: 1.5rem;" onclick="appRouter.navigateTo('bible')">
          Ir para a Bíblia Sagrada
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = notesKeys.map(k => {
    const item = notesObj[k];
    return `
      <div class="note-card">
        <div>
          <div class="note-verse-header">
            <span class="note-verse-ref">${item.bookName} ${item.chapter}:${item.verse}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${item.date}</span>
          </div>
          <div class="note-verse-text">
            "${item.verseText}"
          </div>
          <div class="note-body">
            ${item.text}
          </div>
        </div>
        <div class="note-footer">
          <button class="read-study-btn" onclick="jumpToBibleBook('${item.bookId}', ${item.chapter})">
            Abrir Capítulo →
          </button>
          <button style="color: var(--text-muted);" onclick="deleteNoteEntry('${k}')" title="Excluir">
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
// MODAL DE SELEÇÃO DE LIVROS DA BÍBLIA
// ==========================================================================
let currentTestamentFilter = 'AT';

function openBookSelectorModal() {
  renderBookSelectorGrid();
  openModal('book-selector-modal');
}

function filterTestament(testament, btn) {
  currentTestamentFilter = testament;
  document.querySelectorAll('.book-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderBookSelectorGrid();
}

function renderBookSelectorGrid() {
  const container = document.getElementById('book-selector-grid');
  if (!container) return;

  const filtered = BIBLE_BOOKS.filter(b => b.testament === currentTestamentFilter);
  container.innerHTML = filtered.map(b => `
    <button class="book-select-item" onclick="selectBookFromModal('${b.id}')">
      <div>${b.name}</div>
      <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">${b.chapters} cap.</div>
    </button>
  `).join('');
}

function selectBookFromModal(bookId) {
  closeModal('book-selector-modal');
  bibleReader.loadChapter(bookId, 1);
  appRouter.navigateTo('bible');
}

// ==========================================================================
// VERSÍCULO DO DIA & CONTINUAR LEITURA
// ==========================================================================
function initDailyVerse() {
  const todayIndex = new Date().getDate() % DAILY_VERSES.length;
  const verse = DAILY_VERSES[todayIndex];

  const textEl = document.getElementById('daily-verse-text');
  const refEl = document.getElementById('daily-verse-ref');

  if (textEl) textEl.textContent = verse.text;
  if (refEl) refEl.textContent = `— ${verse.reference} (ARC) —`;

  // Botão copiar versículo do dia
  const copyBtn = document.getElementById('daily-verse-copy-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(`"${verse.text}"\n— ${verse.reference} (ARC)`).then(() => {
        showToast("Versículo do Dia copiado!");
      });
    };
  }

  // Botão ler no contexto
  const contextBtn = document.getElementById('daily-verse-context-btn');
  if (contextBtn) {
    contextBtn.onclick = () => {
      jumpToBibleBook(verse.bookId, verse.chapter);
    };
  }
}

function initQuickBooksGrid() {
  const atContainer = document.getElementById('home-at-books-grid');
  const ntContainer = document.getElementById('home-nt-books-grid');

  if (atContainer) {
    const at = BIBLE_BOOKS.filter(b => b.testament === 'AT').slice(0, 10);
    atContainer.innerHTML = at.map(b => `
      <div class="book-pill-card" onclick="jumpToBibleBook('${b.id}', 1)">
        <span class="book-name">${b.name}</span>
        <span class="book-meta">${b.chapters} capítulos</span>
      </div>
    `).join('') + `
      <div class="book-pill-card" onclick="openBookSelectorModal()" style="border-style: dashed; justify-content: center; align-items: center; cursor: pointer;">
        <span style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700;">Ver Todos (+29) →</span>
      </div>
    `;
  }

  if (ntContainer) {
    const nt = BIBLE_BOOKS.filter(b => b.testament === 'NT').slice(0, 10);
    ntContainer.innerHTML = nt.map(b => `
      <div class="book-pill-card" onclick="jumpToBibleBook('${b.id}', 1)">
        <span class="book-name">${b.name}</span>
        <span class="book-meta">${b.chapters} capítulos</span>
      </div>
    `).join('') + `
      <div class="book-pill-card" onclick="openBookSelectorModal()" style="border-style: dashed; justify-content: center; align-items: center; cursor: pointer;">
        <span style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700;">Ver Todos (+17) →</span>
      </div>
    `;
  }
}

// ==========================================================================
// INICIALIZAÇÃO GERAL AO CARREGAR
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  appRouter = new AppRouter();
  initDailyVerse();
  initQuickBooksGrid();

  // Botão de Áudio Ambiente
  const ambientBtn = document.getElementById('ambient-audio-toggle');
  if (ambientBtn) {
    ambientBtn.addEventListener('click', () => {
      const isPlaying = audioAmbience.toggleAmbience();
      ambientBtn.classList.toggle('playing', isPlaying);
      showToast(isPlaying ? "Música sacra ambiente iniciada 🕊️" : "Áudio ambiente pausado.");
    });
  }

  // Atalho de teclado Ctrl + K para pesquisa rápida
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
