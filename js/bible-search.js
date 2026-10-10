/**
 * MOTOR DE PESQUISA BÍBLICA E AUTO-COMPLETE INTELIGENTE
 * Plataforma Bíblia Online ACF - Bp. Emanuel
 */

class BibleSearchEngine {
  constructor() {
    this.currentScope = 'all';
    this.currentQuery = '';
    this.debounceTimer = null;
    this.init();
  }

  init() {
    // Configura listeners para barra de busca do Hero
    const heroInput = document.getElementById('home-search-input');
    if (heroInput) {
      heroInput.addEventListener('input', (e) => this.handleHeroInput(e.target.value));
      heroInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.executeGlobalSearch(e.target.value);
        }
      });
    }

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('home-search-dropdown');
      const input = document.getElementById('home-search-input');
      if (dropdown && !dropdown.contains(e.target) && e.target !== input) {
        dropdown.classList.remove('visible');
      }
    });
  }

  handleHeroInput(val) {
    clearTimeout(this.debounceTimer);
    const dropdown = document.getElementById('home-search-dropdown');
    if (!dropdown) return;

    if (!val || val.trim().length < 2) {
      dropdown.classList.remove('visible');
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.renderSuggestions(val.trim());
    }, 220);
  }

  renderSuggestions(query) {
    const dropdown = document.getElementById('home-search-dropdown');
    if (!dropdown) return;

    // 1. Tenta interpretar como referência direta (ex: "jo 3:16", "sl 23", "gn 1")
    const parsedRef = bibleService.parseReference(query);

    let html = '';

    if (parsedRef && parsedRef.book) {
      const b = parsedRef.book;
      const ch = parsedRef.chapter || 1;
      const v = parsedRef.verse;

      if (v) {
        // Versículo específico
        const verseText = bibleService.getVerse(b.slug, ch, v, bibleService.getVersion());
        html += `
          <div class="search-suggest-item highlight-ref" onclick="bibleSearchEngine.goToPassage('${b.slug}', ${ch}, ${v})">
            <div class="suggest-badge">Passagem Exata</div>
            <div class="suggest-title">${b.name} ${ch}:${v} <span class="suggest-version">(${bibleService.getVersion()})</span></div>
            ${verseText ? `<div class="suggest-snippet">"${verseText}"</div>` : ''}
          </div>
        `;
      } else {
        // Capítulo do livro
        html += `
          <div class="search-suggest-item highlight-ref" onclick="bibleSearchEngine.goToPassage('${b.slug}', ${ch})">
            <div class="suggest-badge">Capítulo</div>
            <div class="suggest-title">${b.name} ${ch} <span class="suggest-version">(${b.chapters} capítulos)</span></div>
            <div class="suggest-snippet">Clique para abrir ${b.name} capítulo ${ch}</div>
          </div>
        `;
      }
    }

    // 2. Busca rápida por amostra de termos (limitado a 4 resultados para pré-visualização instantânea)
    const quickHits = bibleService.search(query, 'all', bibleService.getVersion(), 4);

    if (quickHits.length > 0) {
      html += `<div class="suggest-header">Versículos encontrados contendo "${query}":</div>`;
      quickHits.forEach(item => {
        const highlighted = this.highlightMatches(item.text, query);
        html += `
          <div class="search-suggest-item" onclick="bibleSearchEngine.goToPassage('${item.book.slug}', ${item.chapter}, ${item.verse})">
            <div class="suggest-title">${item.book.name} ${item.chapter}:${item.verse}</div>
            <div class="suggest-snippet">${highlighted}</div>
          </div>
        `;
      });
    }

    // 3. Botão para pesquisa ampla com todos os resultados
    html += `
      <div class="search-suggest-footer" onclick="bibleSearchEngine.executeGlobalSearch('${encodeURIComponent(query)}')">
        <span>🔍 Ver todos os resultados para "<strong>${this.escapeHtml(query)}</strong>" na Bíblia ACF</span>
        <span>↵ Enter</span>
      </div>
    `;

    dropdown.innerHTML = html;
    dropdown.classList.add('visible');
  }

  highlightMatches(text, query) {
    if (!text || !query) return text || '';
    const words = query.trim().split(/\s+/).filter(w => w.length > 0);
    let result = this.escapeHtml(text);
    words.forEach(w => {
      const regex = new RegExp(`(${this.escapeRegex(w)})`, 'gi');
      result = result.replace(regex, '<mark class="search-mark">$1</mark>');
    });
    return result;
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  goToPassage(bookSlug, chapter, verse = null) {
    const dropdown = document.getElementById('home-search-dropdown');
    if (dropdown) dropdown.classList.remove('visible');

    const book = bibleService.getBook(bookSlug);
    if (!book) return;

    if (verse) {
      window.location.hash = `/acf/${book.slug}/${chapter}:${verse}`;
    } else {
      window.location.hash = `/acf/${book.slug}/${chapter}`;
    }
  }

  executeGlobalSearch(query) {
    const dropdown = document.getElementById('home-search-dropdown');
    if (dropdown) dropdown.classList.remove('visible');

    const cleanQuery = decodeURIComponent(query || '').trim();
    if (!cleanQuery) return;

    this.currentQuery = cleanQuery;
    appRouter.navigateTo('search');

    // Preenche input da página de pesquisa
    const searchPageInput = document.getElementById('global-search-input');
    if (searchPageInput) {
      searchPageInput.value = cleanQuery;
    }

    this.performSearch();
  }

  performSearch() {
    const container = document.getElementById('search-results-container');
    const countBadge = document.getElementById('search-results-count');
    if (!container) return;

    if (!this.currentQuery || this.currentQuery.trim().length < 2) {
      container.innerHTML = `
        <div class="empty-state-box">
          <span style="font-size: 2.5rem;">🔍</span>
          <h3>Digite uma palavra ou referência</h3>
          <p>Pesquise termos como "graça", "amor", "ressurreição" ou referências como "Sl 23" em toda a Bíblia.</p>
        </div>
      `;
      if (countBadge) countBadge.textContent = '0 versículos';
      return;
    }

    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Pesquisando nas Escrituras Sagradas (${bibleService.getVersion()})...</p>
      </div>
    `;

    setTimeout(() => {
      const results = bibleService.search(this.currentQuery, this.currentScope, bibleService.getVersion(), 150);
      
      if (countBadge) {
        countBadge.textContent = `${results.length} versículo${results.length === 1 ? '' : 's'} encontrado${results.length === 1 ? '' : 's'}`;
      }

      if (results.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box">
            <span style="font-size: 2.5rem;">🕊️</span>
            <h3>Nenhum versículo encontrado</h3>
            <p>Não encontramos ocorrências exatas para "<strong>${this.escapeHtml(this.currentQuery)}</strong>" com o filtro selecionado.</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Dica: Verifique a ortografia ou busque por palavras mais curtas como "fé", "oração" ou "Senhor".</p>
          </div>
        `;
        return;
      }

      let html = '<div class="search-results-list">';
      results.forEach(res => {
        const highlighted = this.highlightMatches(res.text, this.currentQuery);
        html += `
          <article class="search-result-card" onclick="bibleSearchEngine.goToPassage('${res.book.slug}', ${res.chapter}, ${res.verse})">
            <div class="search-card-header">
              <span class="search-card-ref">${res.book.name} ${res.chapter}:${res.verse}</span>
              <span class="search-card-version">${res.version}</span>
            </div>
            <p class="search-card-text">${highlighted}</p>
            <div class="search-card-action">
              <span>Ler no contexto do capítulo →</span>
            </div>
          </article>
        `;
      });
      html += '</div>';

      container.innerHTML = html;
    }, 50);
  }

  setFilterScope(scope, btnElement) {
    this.currentScope = scope;
    document.querySelectorAll('.search-filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    this.performSearch();
  }
}

const bibleSearchEngine = new BibleSearchEngine();
