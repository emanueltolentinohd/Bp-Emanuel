/**
 * LEITOR BÍBLICO INTERATIVO - MOTOR DE NAVEGAÇÃO, DESTAQUES E ANOTAÇÕES
 * Plataforma Bp. Emanuel
 */

class BibleReaderEngine {
  constructor() {
    this.currentBookId = 'PSA';
    this.currentChapter = 23;
    this.currentVerses = [];
    this.selectedVerseNum = null;
    
    // Armazenamento local
    this.highlights = this.loadFromStorage('bp_bible_highlights', {});
    this.notes = this.loadFromStorage('bp_bible_notes', {});
    this.favorites = this.loadFromStorage('bp_bible_favorites', []);
    this.fontSize = parseInt(localStorage.getItem('bp_bible_fontsize') || '19');
    
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
    this.bindEvents();
  }

  bindEvents() {
    // Teclas de navegação (seta esquerda/direita muda de capítulo)
    window.addEventListener('keydown', (e) => {
      if (document.getElementById('view-bible').classList.contains('active')) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowLeft') this.previousChapter();
        if (e.key === 'ArrowRight') this.nextChapter();
      }
    });

    // Clique fora fecha a barra flutuante de versículo
    document.addEventListener('click', (e) => {
      const toolbar = document.getElementById('floating-verse-toolbar');
      const isVerse = e.target.closest('.verse-row');
      const isToolbar = e.target.closest('#floating-verse-toolbar');
      const isModal = e.target.closest('.modal-box');
      if (!isVerse && !isToolbar && !isModal && toolbar) {
        toolbar.classList.remove('visible');
        document.querySelectorAll('.verse-row.selected').forEach(el => el.classList.remove('selected'));
        this.selectedVerseNum = null;
      }
    });
  }

  getCurrentBook() {
    return BIBLE_BOOKS.find(b => b.id === this.currentBookId) || BIBLE_BOOKS[0];
  }

  async loadChapter(bookId, chapterNum) {
    this.currentBookId = bookId;
    this.currentChapter = parseInt(chapterNum);
    this.selectedVerseNum = null;

    // Atualiza cabeçalho do leitor
    const book = this.getCurrentBook();
    const titleEl = document.getElementById('reader-book-title');
    const chapBadge = document.getElementById('reader-chap-badge');
    const selectBtn = document.getElementById('book-selector-btn-text');

    if (titleEl) titleEl.textContent = book.name;
    if (chapBadge) chapBadge.textContent = `Capítulo ${this.currentChapter}`;
    if (selectBtn) selectBtn.textContent = `${book.name} ${this.currentChapter}`;

    // Atualiza pills de capítulos
    this.renderChapterPills(book.chapters);

    // Salva última leitura para "Continuar Leitura"
    localStorage.setItem('bp_last_reading', JSON.stringify({
      bookId: this.currentBookId,
      bookName: book.name,
      chapter: this.currentChapter
    }));

    const container = document.getElementById('verses-list-container');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Carregando Escrituras...</p>
        <span style="font-size: 0.85rem; color: var(--accent-gold);">Almeida Revista e Corrigida</span>
      </div>
    `;

    // 1. Verifica se já temos em memória offline (BUILTIN_CHAPTERS)
    const key = `${this.currentBookId}_${this.currentChapter}`;
    if (BUILTIN_CHAPTERS[key]) {
      this.currentVerses = BUILTIN_CHAPTERS[key];
      this.renderVerses(this.currentVerses);
      return;
    }

    // 2. Verifica se temos no cache local
    const cached = localStorage.getItem(`bp_cached_${key}`);
    if (cached) {
      try {
        this.currentVerses = JSON.parse(cached);
        this.renderVerses(this.currentVerses);
        return;
      } catch (e) {}
    }

    // 3. Tenta buscar da API pública ou gera fallback estruturado
    try {
      const verses = await this.fetchVersesFromAPI(book.name, this.currentChapter);
      if (verses && verses.length > 0) {
        this.currentVerses = verses;
        localStorage.setItem(`bp_cached_${key}`, JSON.stringify(verses));
        this.renderVerses(this.currentVerses);
        return;
      }
    } catch (err) {
      console.warn("API de Bíblia externa indisponível, usando fallback bíblico:", err);
    }

    // 4. Fallback edificante elegante
    this.currentVerses = this.generateFallbackVerses(book, this.currentChapter);
    this.renderVerses(this.currentVerses);
  }

  async fetchVersesFromAPI(bookName, chapter) {
    const cleanBook = encodeURIComponent(bookName);
    // Tenta API pública bible-api.com com tradução Almeida
    const url = `https://bible-api.com/${cleanBook}+${chapter}?translation=almeida`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error("Falha na resposta da API");
    const data = await res.json();
    if (data.verses && data.verses.length > 0) {
      return data.verses.map(v => ({
        verse: v.verse,
        text: v.text.trim()
      }));
    }
    return null;
  }

  generateFallbackVerses(book, chapter) {
    // Versículos padrão de reflexão para capítulos dinâmicos
    const count = 12;
    const list = [];
    for (let i = 1; i <= count; i++) {
      list.push({
        verse: i,
        text: `Versículo ${i} do livro de ${book.name}, capítulo ${chapter}. Que a Palavra de Deus habite ricamente no seu coração através de toda a sabedoria e graça.`
      });
    }
    return list;
  }

  renderChapterPills(totalChapters) {
    const container = document.getElementById('chapter-pills-bar');
    if (!container) return;

    let html = '';
    for (let c = 1; c <= totalChapters; c++) {
      const activeClass = c === this.currentChapter ? 'active' : '';
      html += `<button class="chap-pill ${activeClass}" onclick="bibleReader.loadChapter('${this.currentBookId}', ${c})">${c}</button>`;
    }
    container.innerHTML = html;

    // Auto-scroll pill ativa para o campo de visão
    setTimeout(() => {
      const activePill = container.querySelector('.chap-pill.active');
      if (activePill) {
        activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 50);
  }

  renderVerses(verses) {
    const container = document.getElementById('verses-list-container');
    if (!container) return;

    let html = '';
    verses.forEach(v => {
      const verseKey = `${this.currentBookId}_${this.currentChapter}_${v.verse}`;
      const highlightColor = this.highlights[verseKey] || '';
      const hasNote = !!this.notes[verseKey];
      const isFav = this.favorites.includes(verseKey);

      let highlightClass = '';
      if (highlightColor) {
        highlightClass = `highlight-${highlightColor}`;
      }

      html += `
        <div class="verse-row" id="verse-${v.verse}" onclick="bibleReader.selectVerse(${v.verse}, event)">
          <span class="verse-number">${v.verse}</span>
          <span class="verse-content ${highlightClass}" style="font-size: ${this.fontSize}px;">
            ${v.text}
          </span>
          ${hasNote ? `<span class="has-note-pin" title="Ver anotação" onclick="bibleReader.viewNote('${verseKey}', event)">📝</span>` : ''}
          ${isFav ? `<span class="has-note-pin" title="Versículo Favorito">⭐</span>` : ''}
        </div>
      `;
    });

    container.innerHTML = html;
  }

  selectVerse(verseNum, event) {
    if (event) event.stopPropagation();

    this.selectedVerseNum = verseNum;
    const verseKey = `${this.currentBookId}_${this.currentChapter}_${verseNum}`;
    const verseObj = this.currentVerses.find(v => v.verse === verseNum);

    // Marca visual de seleção
    document.querySelectorAll('.verse-row').forEach(el => el.classList.remove('selected'));
    const verseEl = document.getElementById(`verse-${verseNum}`);
    if (verseEl) verseEl.classList.add('selected');

    // Atualiza barra de ferramentas flutuante
    const book = this.getCurrentBook();
    const toolbar = document.getElementById('floating-verse-toolbar');
    const badge = document.getElementById('toolbar-verse-label');

    if (badge) {
      badge.textContent = `${book.abbrev} ${this.currentChapter}:${verseNum}`;
    }

    if (toolbar) {
      toolbar.classList.add('visible');
    }
  }

  setHighlight(color) {
    if (!this.selectedVerseNum) return;
    const verseKey = `${this.currentBookId}_${this.currentChapter}_${this.selectedVerseNum}`;

    if (color === 'clear') {
      delete this.highlights[verseKey];
    } else {
      this.highlights[verseKey] = color;
    }

    this.saveToStorage('bp_bible_highlights', this.highlights);
    this.renderVerses(this.currentVerses);
    showToast(color === 'clear' ? "Marcação removida." : "Versículo destacado!");
  }

  toggleFavoriteCurrent() {
    if (!this.selectedVerseNum) return;
    const verseKey = `${this.currentBookId}_${this.currentChapter}_${this.selectedVerseNum}`;
    const index = this.favorites.indexOf(verseKey);

    if (index > -1) {
      this.favorites.splice(index, 1);
      showToast("Removido dos favoritos.");
    } else {
      this.favorites.push(verseKey);
      showToast("Adicionado aos versículos favoritos! ⭐");
    }

    this.saveToStorage('bp_bible_favorites', this.favorites);
    this.renderVerses(this.currentVerses);
  }

  copyCurrentVerse() {
    if (!this.selectedVerseNum) return;
    const book = this.getCurrentBook();
    const verseObj = this.currentVerses.find(v => v.verse === this.selectedVerseNum);
    if (!verseObj) return;

    const formatted = `"${verseObj.text}"\n— ${book.name} ${this.currentChapter}:${verseObj.verse} (ARC)`;
    navigator.clipboard.writeText(formatted).then(() => {
      showToast("Versículo copiado com referência!");
    }).catch(() => {
      showToast("Versículo pronto para compartilhar!");
    });
  }

  narrateCurrentVerse() {
    if (!this.selectedVerseNum) return;
    const verseObj = this.currentVerses.find(v => v.verse === this.selectedVerseNum);
    if (!verseObj) return;

    bibleSpeech.speak(verseObj.text, () => {
      showToast("Narrando versículo...");
    }, () => {
      showToast("Narração concluída.");
    });
  }

  narrateFullChapter() {
    if (!this.currentVerses || this.currentVerses.length === 0) return;
    const book = this.getCurrentBook();
    const fullText = `${book.name}, capítulo ${this.currentChapter}. ` +
      this.currentVerses.map(v => `${v.verse}. ${v.text}`).join(' ');

    const playBtn = document.getElementById('play-chapter-audio-btn');
    
    bibleSpeech.speak(fullText, () => {
      if (playBtn) playBtn.innerHTML = `<span>⏸️</span> Pausar Narração`;
      showToast(`Iniciando narração de ${book.name} ${this.currentChapter}...`);
    }, () => {
      if (playBtn) playBtn.innerHTML = `<span>🔊</span> Ouvir Capítulo`;
      showToast("Narração do capítulo finalizada.");
    });
  }

  viewNote(verseKey, event) {
    if (event) event.stopPropagation();
    const note = this.notes[verseKey];
    if (!note) return;
    this.selectedVerseNum = note.verse;
    this.openNoteModal();
  }

  openNoteModal() {
    if (!this.selectedVerseNum) return;
    const book = this.getCurrentBook();
    const verseKey = `${this.currentBookId}_${this.currentChapter}_${this.selectedVerseNum}`;
    const verseObj = this.currentVerses.find(v => v.verse === this.selectedVerseNum);

    const titleEl = document.getElementById('note-modal-ref');
    const quoteEl = document.getElementById('note-modal-quote');
    const textarea = document.getElementById('note-modal-text');

    if (titleEl) titleEl.textContent = `${book.name} ${this.currentChapter}:${this.selectedVerseNum}`;
    if (quoteEl && verseObj) quoteEl.textContent = `"${verseObj.text}"`;
    if (textarea) textarea.value = this.notes[verseKey] ? this.notes[verseKey].text : '';

    openModal('note-modal');
  }

  saveNoteFromModal() {
    if (!this.selectedVerseNum) return;
    const verseKey = `${this.currentBookId}_${this.currentChapter}_${this.selectedVerseNum}`;
    const textarea = document.getElementById('note-modal-text');
    const text = textarea ? textarea.value.trim() : '';
    const book = this.getCurrentBook();
    const verseObj = this.currentVerses.find(v => v.verse === this.selectedVerseNum);

    if (text) {
      this.notes[verseKey] = {
        bookId: this.currentBookId,
        bookName: book.name,
        chapter: this.currentChapter,
        verse: this.selectedVerseNum,
        verseText: verseObj ? verseObj.text : '',
        text: text,
        date: new Date().toLocaleDateString('pt-BR')
      };
      showToast("Anotação guardada com sucesso! 📝");
    } else {
      delete this.notes[verseKey];
      showToast("Anotação excluída.");
    }

    this.saveToStorage('bp_bible_notes', this.notes);
    this.renderVerses(this.currentVerses);
    closeModal('note-modal');
  }

  adjustFontSize(delta) {
    this.fontSize = Math.min(32, Math.max(14, this.fontSize + delta));
    localStorage.setItem('bp_bible_fontsize', this.fontSize.toString());
    const label = document.getElementById('current-font-size-label');
    if (label) label.textContent = `${this.fontSize}px`;

    document.querySelectorAll('.verse-content').forEach(el => {
      el.style.fontSize = `${this.fontSize}px`;
    });
  }

  nextChapter() {
    const book = this.getCurrentBook();
    if (this.currentChapter < book.chapters) {
      this.loadChapter(this.currentBookId, this.currentChapter + 1);
    } else {
      // Avança para o próximo livro
      const bookIndex = BIBLE_BOOKS.findIndex(b => b.id === this.currentBookId);
      if (bookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[bookIndex + 1];
        this.loadChapter(nextBook.id, 1);
      } else {
        showToast("Você alcançou o fim de Apocalipse!");
      }
    }
  }

  previousChapter() {
    if (this.currentChapter > 1) {
      this.loadChapter(this.currentBookId, this.currentChapter - 1);
    } else {
      // Volta para o livro anterior
      const bookIndex = BIBLE_BOOKS.findIndex(b => b.id === this.currentBookId);
      if (bookIndex > 0) {
        const prevBook = BIBLE_BOOKS[bookIndex - 1];
        this.loadChapter(prevBook.id, prevBook.chapters);
      } else {
        showToast("Você está no início de Gênesis!");
      }
    }
  }

  openVerseCardGenerator() {
    if (!this.selectedVerseNum) return;
    const book = this.getCurrentBook();
    const verseObj = this.currentVerses.find(v => v.verse === this.selectedVerseNum);
    if (!verseObj) return;

    const previewText = document.getElementById('card-generator-verse-text');
    const previewRef = document.getElementById('card-generator-verse-ref');

    if (previewText) previewText.textContent = `“${verseObj.text}”`;
    if (previewRef) previewRef.textContent = `— ${book.name} ${this.currentChapter}:${verseObj.verse} —`;

    openModal('verse-card-modal');
  }
}

const bibleReader = new BibleReaderEngine();
