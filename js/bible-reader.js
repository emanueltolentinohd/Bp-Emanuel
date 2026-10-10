/**
 * MOTOR DO LEITOR BÍBLICO INTERATIVO (LÓGICA BÍBLIA ONLINE ACF)
 * Plataforma Bp. Emanuel
 * Suporte a Seleção Múltipla, Marca-texto, Texto Corrido vs Versículo a Versículo,
 * Player de Áudio Dock Sincronizado, e Comparador de Versões
 */

class BibleReaderEngine {
  constructor() {
    this.currentBookSlug = 'gn';
    this.currentChapter = 1;
    this.currentVerses = [];
    this.selectedVerses = new Set();
    this.targetScrollVerse = null;

    // Configurações de Leitura
    this.viewMode = localStorage.getItem('bp_bible_viewmode') || 'verseByVerse'; // 'verseByVerse' | 'runningText'
    this.fontFamily = localStorage.getItem('bp_bible_fontfamily') || 'serif';     // 'serif' | 'sans'
    this.fontSize = parseInt(localStorage.getItem('bp_bible_fontsize') || '19');
    this.lineHeight = localStorage.getItem('bp_bible_lineheight') || 'normal';   // 'normal' | 'comfortable'

    // Dados persistidos pelo usuário
    this.highlights = this.loadFromStorage('bp_bible_highlights', {});
    this.notes = this.loadFromStorage('bp_bible_notes', {});
    this.favorites = this.loadFromStorage('bp_bible_favorites', []);

    // Estado do Áudio Dock
    this.audioPlaying = false;
    this.audioVerseIndex = 0;
    this.audioSpeed = parseFloat(localStorage.getItem('bp_audio_speed') || '1.0');

    this.init();
  }

  loadFromStorage(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  init() {
    this.bindKeyboardEvents();
    this.bindClickOutside();
    this.applyReaderStyles();
  }

  bindKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      // Ignora se estiver digitando em input ou textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const bibleView = document.getElementById('view-bible');
      if (bibleView && bibleView.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.previousChapter();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextChapter();
        } else if (e.key === 'Escape') {
          this.clearSelection();
          closeModal('reading-options-modal');
          closeModal('book-selector-modal');
          closeModal('chapter-selector-modal');
        }
      }
    });
  }

  bindClickOutside() {
    document.addEventListener('click', (e) => {
      const isVerse = e.target.closest('.verse-row') || e.target.closest('.verse-inline');
      const isDock = e.target.closest('#floating-verse-dock');
      const isModal = e.target.closest('.modal-overlay');
      const isOptionsBtn = e.target.closest('[data-action="open-options"]');

      if (!isVerse && !isDock && !isModal && !isOptionsBtn && this.selectedVerses.size > 0) {
        // Não desmarca se clicou em botões de ação do próprio leitor
        if (!e.target.closest('.reader-toolbar')) {
          this.clearSelection();
        }
      }
    });
  }

  applyReaderStyles() {
    const sheet = document.getElementById('reading-sheet');
    if (!sheet) return;

    sheet.setAttribute('data-view-mode', this.viewMode);
    sheet.setAttribute('data-font-family', this.fontFamily);
    sheet.setAttribute('data-line-height', this.lineHeight);
    sheet.style.setProperty('--reader-font-size', `${this.fontSize}px`);
  }

  getCurrentBook() {
    return bibleService.getBook(this.currentBookSlug);
  }

  // ==========================================================================
  // CARREGAMENTO DE CAPÍTULO
  // ==========================================================================
  async loadChapter(bookSlug, chapterNum, scrollToVerse = null) {
    const book = bibleService.getBook(bookSlug);
    this.currentBookSlug = book.slug;
    this.currentChapter = Math.max(1, Math.min(parseInt(chapterNum) || 1, book.chapters));
    this.targetScrollVerse = scrollToVerse ? parseInt(scrollToVerse) : null;
    this.clearSelection();

    // Atualiza cabeçalhos da Toolbar do Leitor
    this.updateToolbarHeader(book);

    // Salva última leitura no histórico
    localStorage.setItem('bp_last_reading', JSON.stringify({
      slug: book.slug,
      bookName: book.name,
      chapter: this.currentChapter,
      version: bibleService.getVersion(),
      date: new Date().toLocaleDateString('pt-BR')
    }));

    // Atualiza componente da Home "Continuar Leitura"
    this.updateContinueReadingCard();

    // Renderiza pills horizontais de capítulos
    this.renderChapterPills(book.chapters);

    // Carrega os versículos do BibleService
    const verses = bibleService.getChapter(book.slug, this.currentChapter, bibleService.getVersion());
    if (verses && verses.length > 0) {
      this.currentVerses = verses;
      this.renderChapterContent();
    } else {
      this.renderFallbackContent(book);
    }

    // Se houver versículo de destino na URL, rola suavemente até ele
    if (this.targetScrollVerse) {
      setTimeout(() => {
        this.scrollToVerse(this.targetScrollVerse);
      }, 150);
    }
  }

  updateToolbarHeader(book) {
    const bookBtnText = document.getElementById('reader-book-btn-text');
    const chapBtnText = document.getElementById('reader-chap-btn-text');
    const versionBtnText = document.getElementById('reader-version-btn-text');
    const sheetTitle = document.getElementById('reader-sheet-title');
    const breadcrumbBook = document.getElementById('reader-breadcrumb-book');
    const breadcrumbChap = document.getElementById('reader-breadcrumb-chap');
    const breadcrumbVer = document.getElementById('reader-breadcrumb-version');

    if (bookBtnText) bookBtnText.textContent = book.name;
    if (chapBtnText) chapBtnText.textContent = this.currentChapter;
    if (versionBtnText) versionBtnText.textContent = bibleService.getVersion();
    if (sheetTitle) sheetTitle.textContent = `${book.name} ${this.currentChapter}`;
    if (breadcrumbBook) breadcrumbBook.textContent = book.name;
    if (breadcrumbChap) breadcrumbChap.textContent = `Capítulo ${this.currentChapter}`;
    if (breadcrumbVer) breadcrumbVer.textContent = bibleService.getVersion();
  }

  updateContinueReadingCard() {
    const card = document.getElementById('continue-reading-banner');
    if (!card) return;

    const last = this.loadFromStorage('bp_last_reading', null);
    if (!last) {
      card.style.display = 'none';
      return;
    }

    card.style.display = 'flex';
    const textEl = document.getElementById('continue-reading-text');
    if (textEl) {
      textEl.textContent = `${last.bookName} ${last.chapter} (${last.version})`;
    }
  }

  renderChapterPills(totalChapters) {
    const container = document.getElementById('chapter-pills-bar');
    if (!container) return;

    let html = '';
    for (let c = 1; c <= totalChapters; c++) {
      const activeClass = c === this.currentChapter ? 'active' : '';
      html += `<button class="chap-pill ${activeClass}" onclick="bibleReader.loadChapter('${this.currentBookSlug}', ${c})">${c}</button>`;
    }
    container.innerHTML = html;

    // Auto-scroll da pill ativa para o centro do container
    setTimeout(() => {
      const activePill = container.querySelector('.chap-pill.active');
      if (activePill) {
        activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 40);
  }

  // ==========================================================================
  // RENDERIZAÇÃO DO CONTEÚDO (VERSÍCULO POR VERSÍCULO vs TEXTO CORRIDO)
  // ==========================================================================
  renderChapterContent() {
    const container = document.getElementById('verses-list-container');
    if (!container) return;

    this.applyReaderStyles();

    if (this.viewMode === 'runningText') {
      this.renderRunningTextMode(container);
    } else {
      this.renderVerseByVerseMode(container);
    }
  }

  renderVerseByVerseMode(container) {
    let html = '';
    const bookSlug = this.currentBookSlug;
    const chapterNum = this.currentChapter;

    this.currentVerses.forEach(v => {
      const verseKey = `${bookSlug}_${chapterNum}_${v.verse}`;
      const highlight = this.highlights[verseKey] || '';
      const hasNote = !!this.notes[verseKey];
      const isFav = this.favorites.includes(verseKey);
      const isSelected = this.selectedVerses.has(v.verse);

      // Verifica se há título de perícope antes deste versículo
      const pericope = bibleService.getPericope(bookSlug, chapterNum, v.verse);
      if (pericope) {
        html += `<h3 class="pericope-title">${pericope}</h3>`;
      }

      let highlightClass = highlight ? `highlight-${highlight}` : '';
      let selectedClass = isSelected ? 'selected' : '';

      html += `
        <div class="verse-row ${selectedClass}" id="verse-${v.verse}" onclick="bibleReader.handleVerseClick(${v.verse}, event)">
          <span class="verse-num-badge">${v.verse}</span>
          <div class="verse-body ${highlightClass}">
            <span class="verse-text">${v.text}</span>
          </div>
          <div class="verse-meta-pins">
            ${hasNote ? `<span class="verse-pin pin-note" title="Ver anotação" onclick="bibleReader.openNoteForVerse(${v.verse}, event)">📝</span>` : ''}
            ${isFav ? `<span class="verse-pin pin-fav" title="Versículo favorito">⭐</span>` : ''}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderRunningTextMode(container) {
    let html = '<div class="running-text-wrapper">';
    const bookSlug = this.currentBookSlug;
    const chapterNum = this.currentChapter;

    // Agrupa versículos em parágrafos temáticos a cada 4-6 versículos ou quando houver perícope
    let currentParagraph = '';

    this.currentVerses.forEach((v, idx) => {
      const verseKey = `${bookSlug}_${chapterNum}_${v.verse}`;
      const highlight = this.highlights[verseKey] || '';
      const isSelected = this.selectedVerses.has(v.verse);
      const pericope = bibleService.getPericope(bookSlug, chapterNum, v.verse);

      if (pericope) {
        if (currentParagraph) {
          html += `<p class="running-p">${currentParagraph}</p>`;
          currentParagraph = '';
        }
        html += `<h3 class="pericope-title">${pericope}</h3>`;
      } else if (idx > 0 && idx % 5 === 0 && currentParagraph) {
        html += `<p class="running-p">${currentParagraph}</p>`;
        currentParagraph = '';
      }

      let highlightClass = highlight ? `highlight-${highlight}` : '';
      let selectedClass = isSelected ? 'selected' : '';

      currentParagraph += `
        <span class="verse-inline ${selectedClass} ${highlightClass}" id="verse-${v.verse}" onclick="bibleReader.handleVerseClick(${v.verse}, event)">
          <sup class="inline-vnum">${v.verse}</sup>
          <span class="inline-vtext">${v.text}</span>
        </span>
      `;
    });

    if (currentParagraph) {
      html += `<p class="running-p">${currentParagraph}</p>`;
    }

    html += '</div>';
    container.innerHTML = html;
  }

  renderFallbackContent(book) {
    const container = document.getElementById('verses-list-container');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.25rem; font-family: 'Cinzel', serif; color: var(--accent-gold); margin-bottom: 0.75rem;">
          ${book.name} — Capítulo ${this.currentChapter}
        </p>
        <p style="max-width: 500px; margin: 0 auto; line-height: 1.6;">
          Capítulo carregado a partir do repositório da Bíblia Sagrada ACF. Conectando aos manuscritos...
        </p>
      </div>
    `;
  }

  // ==========================================================================
  // SELEÇÃO MÚLTIPLA E BARRA DE AÇÕES FLUTUANTE
  // ==========================================================================
  handleVerseClick(verseNum, event) {
    if (event) event.stopPropagation();

    if (this.selectedVerses.has(verseNum)) {
      this.selectedVerses.delete(verseNum);
    } else {
      this.selectedVerses.add(verseNum);
    }

    this.updateSelectedVersesUI();
  }

  updateSelectedVersesUI() {
    // Atualiza classes nos elementos
    this.currentVerses.forEach(v => {
      const el = document.getElementById(`verse-${v.verse}`);
      if (el) {
        el.classList.toggle('selected', this.selectedVerses.has(v.verse));
      }
    });

    const dock = document.getElementById('floating-verse-dock');
    if (!dock) return;

    if (this.selectedVerses.size === 0) {
      dock.classList.remove('visible');
      return;
    }

    // Ordena os versículos selecionados
    const sorted = Array.from(this.selectedVerses).sort((a, b) => a - b);
    const book = this.getCurrentBook();

    let refStr = '';
    if (sorted.length === 1) {
      refStr = `${book.name} ${this.currentChapter}:${sorted[0]}`;
    } else {
      // Verifica se é intervalo contínuo
      const isContinuous = sorted.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
      if (isContinuous) {
        refStr = `${book.name} ${this.currentChapter}:${sorted[0]}-${sorted[sorted.length - 1]}`;
      } else {
        refStr = `${book.name} ${this.currentChapter}:${sorted.join(', ')}`;
      }
    }

    const badge = document.getElementById('dock-ref-badge');
    const countBadge = document.getElementById('dock-count-badge');

    if (badge) badge.textContent = `${refStr} (${bibleService.getVersion()})`;
    if (countBadge) countBadge.textContent = `${sorted.length} versículo${sorted.length > 1 ? 's' : ''}`;

    dock.classList.add('visible');
  }

  clearSelection() {
    this.selectedVerses.clear();
    document.querySelectorAll('.verse-row.selected, .verse-inline.selected').forEach(el => {
      el.classList.remove('selected');
    });

    const dock = document.getElementById('floating-verse-dock');
    if (dock) dock.classList.remove('visible');
  }

  getSelectedVersesObjects() {
    const sorted = Array.from(this.selectedVerses).sort((a, b) => a - b);
    return sorted.map(num => this.currentVerses.find(v => v.verse === num)).filter(Boolean);
  }

  // ==========================================================================
  // AÇÕES: MARCA-TEXTO, COPIAR, ANOTAR, FAVORITAR, COMPARTILHAR
  // ==========================================================================
  setHighlight(color) {
    if (this.selectedVerses.size === 0) return;

    const bookSlug = this.currentBookSlug;
    const chapterNum = this.currentChapter;

    this.selectedVerses.forEach(vNum => {
      const key = `${bookSlug}_${chapterNum}_${vNum}`;
      if (color === 'clear') {
        delete this.highlights[key];
      } else {
        this.highlights[key] = color;
      }
    });

    this.saveToStorage('bp_bible_highlights', this.highlights);
    this.renderChapterContent();
    this.clearSelection();
    showToast(color === 'clear' ? 'Destaque removido!' : 'Versículo(s) marcado(s) com sucesso!');
  }

  copySelection() {
    const items = this.getSelectedVersesObjects();
    if (items.length === 0) return;

    const book = this.getCurrentBook();
    const sorted = items.map(v => v.verse);
    let ref = '';
    if (sorted.length === 1) {
      ref = `${book.name} ${this.currentChapter}:${sorted[0]}`;
    } else {
      ref = `${book.name} ${this.currentChapter}:${sorted[0]}-${sorted[sorted.length - 1]}`;
    }

    const fullText = items.map(v => `"${v.text}" (${v.verse})`).join('\n') + `\n— ${ref} (${bibleService.getVersion()})`;

    navigator.clipboard.writeText(fullText).then(() => {
      showToast('Versículo(s) copiado(s) para a área de transferência!');
      this.clearSelection();
    }).catch(() => {
      showToast('Não foi possível copiar automaticamente.');
    });
  }

  toggleFavoriteCurrent() {
    if (this.selectedVerses.size === 0) return;

    const bookSlug = this.currentBookSlug;
    const chapterNum = this.currentChapter;

    let added = false;
    this.selectedVerses.forEach(vNum => {
      const key = `${bookSlug}_${chapterNum}_${vNum}`;
      const idx = this.favorites.indexOf(key);
      if (idx > -1) {
        this.favorites.splice(idx, 1);
      } else {
        this.favorites.push(key);
        added = true;
      }
    });

    this.saveToStorage('bp_bible_favorites', this.favorites);
    this.renderChapterContent();
    this.clearSelection();
    showToast(added ? 'Versículo(s) adicionado(s) aos Favoritos!' : 'Versículo(s) removido(s) dos Favoritos.');
  }

  openNoteForVerse(verseNum) {
    this.selectedVerses.clear();
    this.selectedVerses.add(verseNum);
    this.updateSelectedVersesUI();
    this.openNoteModal();
  }

  openNoteModal() {
    const items = this.getSelectedVersesObjects();
    if (items.length === 0) return;

    const book = this.getCurrentBook();
    const firstNum = items[0].verse;
    const key = `${this.currentBookSlug}_${this.currentChapter}_${firstNum}`;

    const quoteEl = document.getElementById('note-modal-quote');
    const refEl = document.getElementById('note-modal-ref');
    const textEl = document.getElementById('note-modal-text');

    if (refEl) refEl.textContent = `${book.name} ${this.currentChapter}:${firstNum} (${bibleService.getVersion()})`;
    if (quoteEl) quoteEl.textContent = `"${items[0].text}"`;
    if (textEl) {
      const saved = this.notes[key];
      textEl.value = saved ? (saved.text || saved) : '';
    }

    openModal('note-modal');
  }

  saveNoteFromModal() {
    const items = this.getSelectedVersesObjects();
    if (items.length === 0) return;

    const textEl = document.getElementById('note-modal-text');
    const noteText = textEl ? textEl.value.trim() : '';

    const key = `${this.currentBookSlug}_${this.currentChapter}_${items[0].verse}`;
    if (noteText) {
      this.notes[key] = {
        text: noteText,
        bookSlug: this.currentBookSlug,
        bookName: this.getCurrentBook().name,
        chapter: this.currentChapter,
        verse: items[0].verse,
        verseText: items[0].text,
        date: new Date().toLocaleDateString('pt-BR')
      };
      showToast('Anotação bíblica salva com sucesso!');
    } else {
      delete this.notes[key];
      showToast('Anotação removida.');
    }

    this.saveToStorage('bp_bible_notes', this.notes);
    closeModal('note-modal');
    this.renderChapterContent();
    this.clearSelection();
  }

  // ==========================================================================
  // COMPARADOR DE VERSÕES (ACF vs NVI)
  // ==========================================================================
  openComparisonModal() {
    const items = this.getSelectedVersesObjects();
    if (items.length === 0) return;

    const vNum = items[0].verse;
    const comp = bibleService.compareVerse(this.currentBookSlug, this.currentChapter, vNum);

    const titleEl = document.getElementById('compare-modal-title');
    const acfEl = document.getElementById('compare-text-acf');
    const nviEl = document.getElementById('compare-text-nvi');

    if (titleEl) titleEl.textContent = `Comparação Bíblica: ${comp.book.name} ${comp.chapter}:${vNum}`;
    if (acfEl) acfEl.textContent = comp.acf;
    if (nviEl) nviEl.textContent = comp.nvi;

    openModal('compare-version-modal');
  }

  // ==========================================================================
  // GERADOR DE CARTÃO VISUAL DE VERSÍCULO
  // ==========================================================================
  openVerseCardGenerator() {
    const items = this.getSelectedVersesObjects();
    if (items.length === 0) return;

    const book = this.getCurrentBook();
    const sorted = items.map(v => v.verse);
    const ref = sorted.length === 1 
      ? `${book.name} ${this.currentChapter}:${sorted[0]}`
      : `${book.name} ${this.currentChapter}:${sorted[0]}-${sorted[sorted.length - 1]}`;

    const text = items.map(v => v.text).join(' ');

    const cardText = document.getElementById('card-generator-verse-text');
    const cardRef = document.getElementById('card-generator-verse-ref');

    if (cardText) cardText.textContent = `"${text}"`;
    if (cardRef) cardRef.textContent = `— ${ref} (${bibleService.getVersion()}) —`;

    openModal('verse-card-modal');
  }

  // ==========================================================================
  // ÁUDIO DOCK PLAYER SINCRONIZADO
  // ==========================================================================
  startChapterAudio() {
    if (this.currentVerses.length === 0) return;
    this.audioVerseIndex = 0;
    this.audioPlaying = true;
    this.updateAudioDockUI();
    this.playCurrentAudioVerse();
  }

  playCurrentAudioVerse() {
    if (!this.audioPlaying || this.audioVerseIndex >= this.currentVerses.length) {
      this.stopAudio();
      return;
    }

    const vObj = this.currentVerses[this.audioVerseIndex];
    if (!vObj) return;

    // Destaca visualmente o versículo que está sendo narrado e faz scroll
    this.highlightAudioVerse(vObj.verse);

    const book = this.getCurrentBook();
    const prefix = this.audioVerseIndex === 0 
      ? `${book.name}, capítulo ${this.currentChapter}. Versículo 1: `
      : `Versículo ${vObj.verse}: `;

    const speakText = `${prefix} ${vObj.text}`;

    bibleSpeech.rate = this.audioSpeed;
    bibleSpeech.speak(
      speakText,
      () => {
        // onStart
        this.updateAudioDockProgress();
      },
      () => {
        // onEnd -> avança para o próximo versículo
        if (this.audioPlaying) {
          this.audioVerseIndex++;
          this.playCurrentAudioVerse();
        }
      }
    );
  }

  highlightAudioVerse(verseNum) {
    document.querySelectorAll('.verse-row.audio-speaking, .verse-inline.audio-speaking').forEach(el => {
      el.classList.remove('audio-speaking');
    });

    const el = document.getElementById(`verse-${verseNum}`);
    if (el) {
      el.classList.add('audio-speaking');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  toggleAudioPlayPause() {
    if (this.audioPlaying) {
      this.audioPlaying = false;
      bibleSpeech.pause();
      const btn = document.getElementById('dock-play-pause-btn');
      if (btn) btn.innerHTML = '▶';
    } else {
      this.audioPlaying = true;
      const btn = document.getElementById('dock-play-pause-btn');
      if (btn) btn.innerHTML = '⏸';
      this.playCurrentAudioVerse();
    }
  }

  stopAudio() {
    this.audioPlaying = false;
    bibleSpeech.stop();
    document.querySelectorAll('.audio-speaking').forEach(el => el.classList.remove('audio-speaking'));

    const dock = document.getElementById('floating-audio-dock');
    if (dock) dock.classList.remove('visible');
  }

  setAudioSpeed(rate) {
    this.audioSpeed = parseFloat(rate);
    localStorage.setItem('bp_audio_speed', rate);
    bibleSpeech.rate = this.audioSpeed;

    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.speed == rate);
    });

    if (this.audioPlaying) {
      bibleSpeech.stop();
      this.playCurrentAudioVerse();
    }
  }

  updateAudioDockUI() {
    const dock = document.getElementById('floating-audio-dock');
    if (!dock) return;

    const book = this.getCurrentBook();
    const title = document.getElementById('dock-audio-title');
    const version = document.getElementById('dock-audio-version');

    if (title) title.textContent = `${book.name} ${this.currentChapter}`;
    if (version) version.textContent = bibleService.getVersion();

    dock.classList.add('visible');
  }

  updateAudioDockProgress() {
    const total = this.currentVerses.length || 1;
    const current = this.audioVerseIndex + 1;
    const percent = Math.min(100, Math.round((current / total) * 100));

    const bar = document.getElementById('dock-audio-progress-bar');
    const label = document.getElementById('dock-audio-verse-label');

    if (bar) bar.style.width = `${percent}%`;
    if (label) label.textContent = `v. ${current} de ${total}`;
  }

  // ==========================================================================
  // NAVEGAÇÃO ENTRE CAPÍTULOS
  // ==========================================================================
  previousChapter() {
    const book = this.getCurrentBook();
    if (this.currentChapter > 1) {
      this.loadChapter(book.slug, this.currentChapter - 1);
    } else {
      // Vai para o último capítulo do livro anterior
      const books = bibleService.getBooks();
      const idx = books.findIndex(b => b.slug === book.slug);
      if (idx > 0) {
        const prevBook = books[idx - 1];
        this.loadChapter(prevBook.slug, prevBook.chapters);
      }
    }
  }

  nextChapter() {
    const book = this.getCurrentBook();
    if (this.currentChapter < book.chapters) {
      this.loadChapter(book.slug, this.currentChapter + 1);
    } else {
      // Vai para o primeiro capítulo do próximo livro
      const books = bibleService.getBooks();
      const idx = books.findIndex(b => b.slug === book.slug);
      if (idx < books.length - 1) {
        const nextBook = books[idx + 1];
        this.loadChapter(nextBook.slug, 1);
      }
    }
  }

  scrollToVerse(verseNum) {
    const el = document.getElementById(`verse-${verseNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('pulse-highlight');
      setTimeout(() => el.classList.remove('pulse-highlight'), 3000);
    }
  }

  // ==========================================================================
  // CONFIGURAÇÕES DE LEITURA (OPÇÕES DE LEITURA Aa)
  // ==========================================================================
  setViewMode(mode) {
    this.viewMode = mode;
    localStorage.setItem('bp_bible_viewmode', mode);
    this.renderChapterContent();
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  setFontFamily(family) {
    this.fontFamily = family;
    localStorage.setItem('bp_bible_fontfamily', family);
    this.applyReaderStyles();
    document.querySelectorAll('.font-family-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.family === family);
    });
  }

  adjustFontSize(delta) {
    this.fontSize = Math.max(15, Math.min(32, this.fontSize + delta));
    localStorage.setItem('bp_bible_fontsize', this.fontSize);
    this.applyReaderStyles();

    const label = document.getElementById('current-font-size-label');
    if (label) label.textContent = `${this.fontSize}px`;
  }

  setLineHeight(height) {
    this.lineHeight = height;
    localStorage.setItem('bp_bible_lineheight', height);
    this.applyReaderStyles();
  }

  toggleVersion() {
    const current = bibleService.getVersion();
    const next = current === 'ACF' ? 'NVI' : 'ACF';
    bibleService.setVersion(next);
    showToast(`Versão alterada para ${next}!`);
    this.loadChapter(this.currentBookSlug, this.currentChapter);
  }
}

// Instância global única
const bibleReader = new BibleReaderEngine();
