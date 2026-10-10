/**
 * SERVIÇO CENTRAL DE DADOS BÍBLICOS (ACF & NVI)
 * Plataforma Bíblia Sagrada Online - Bp. Emanuel
 * Suporte completo aos 66 livros e 1.189 capítulos (ACF & NVI)
 */

class BibleService {
  constructor() {
    this.currentVersion = localStorage.getItem('bp_bible_version') || 'ACF'; // Padrão: ACF
    this.isLoaded = false;
    this.booksIndex = [];
    this.initBooksMetadata();
  }

  initBooksMetadata() {
    // 66 Livros da Bíblia Sagrada com agrupamentos canônicos e slugs do Bíblia Online
    this.booksIndex = [
      // ANTIGO TESTAMENTO (39 Livros)
      // Pentateuco
      { id: 'GEN', slug: 'gn', abbrev: 'Gn', name: 'Gênesis', testament: 'AT', group: 'Pentateuco', chapters: 50 },
      { id: 'EXO', slug: 'ex', abbrev: 'Êx', name: 'Êxodo', testament: 'AT', group: 'Pentateuco', chapters: 40 },
      { id: 'LEV', slug: 'lv', abbrev: 'Lv', name: 'Levítico', testament: 'AT', group: 'Pentateuco', chapters: 27 },
      { id: 'NUM', slug: 'nm', abbrev: 'Nm', name: 'Números', testament: 'AT', group: 'Pentateuco', chapters: 36 },
      { id: 'DEU', slug: 'dt', abbrev: 'Dt', name: 'Deuteronômio', testament: 'AT', group: 'Pentateuco', chapters: 34 },

      // Históricos
      { id: 'JOS', slug: 'js', abbrev: 'Js', name: 'Josué', testament: 'AT', group: 'Históricos', chapters: 24 },
      { id: 'JDG', slug: 'jz', abbrev: 'Jz', name: 'Juízes', testament: 'AT', group: 'Históricos', chapters: 21 },
      { id: 'RUT', slug: 'rt', abbrev: 'Rt', name: 'Rute', testament: 'AT', group: 'Históricos', chapters: 4 },
      { id: '1SA', slug: '1sm', abbrev: '1Sm', name: '1 Samuel', testament: 'AT', group: 'Históricos', chapters: 31 },
      { id: '2SA', slug: '2sm', abbrev: '2Sm', name: '2 Samuel', testament: 'AT', group: 'Históricos', chapters: 24 },
      { id: '1KI', slug: '1rs', abbrev: '1Rs', name: '1 Reis', testament: 'AT', group: 'Históricos', chapters: 22 },
      { id: '2KI', slug: '2rs', abbrev: '2Rs', name: '2 Reis', testament: 'AT', group: 'Históricos', chapters: 25 },
      { id: '1CH', slug: '1cr', abbrev: '1Cr', name: '1 Crônicas', testament: 'AT', group: 'Históricos', chapters: 29 },
      { id: '2CH', slug: '2cr', abbrev: '2Cr', name: '2 Crônicas', testament: 'AT', group: 'Históricos', chapters: 36 },
      { id: 'EZR', slug: 'ed', abbrev: 'Ed', name: 'Esdras', testament: 'AT', group: 'Históricos', chapters: 10 },
      { id: 'NEH', slug: 'ne', abbrev: 'Ne', name: 'Neemias', testament: 'AT', group: 'Históricos', chapters: 13 },
      { id: 'EST', slug: 'et', abbrev: 'Et', name: 'Ester', testament: 'AT', group: 'Históricos', chapters: 10 },

      // Poéticos & Sabedoria
      { id: 'JOB', slug: 'jó', abbrev: 'Jó', name: 'Jó', testament: 'AT', group: 'Poéticos', chapters: 42 },
      { id: 'PSA', slug: 'sl', abbrev: 'Sl', name: 'Salmos', testament: 'AT', group: 'Poéticos', chapters: 150 },
      { id: 'PRO', slug: 'pv', abbrev: 'Pv', name: 'Provérbios', testament: 'AT', group: 'Poéticos', chapters: 31 },
      { id: 'ECC', slug: 'ec', abbrev: 'Ec', name: 'Eclesiastes', testament: 'AT', group: 'Poéticos', chapters: 12 },
      { id: 'SNG', slug: 'ct', abbrev: 'Ct', name: 'Cânticos', testament: 'AT', group: 'Poéticos', chapters: 8 },

      // Profetas Maiores
      { id: 'ISA', slug: 'is', abbrev: 'Is', name: 'Isaías', testament: 'AT', group: 'Profetas Maiores', chapters: 66 },
      { id: 'JER', slug: 'jr', abbrev: 'Jr', name: 'Jeremias', testament: 'AT', group: 'Profetas Maiores', chapters: 52 },
      { id: 'LAM', slug: 'lm', abbrev: 'Lm', name: 'Lamentações', testament: 'AT', group: 'Profetas Maiores', chapters: 5 },
      { id: 'EZK', slug: 'ez', abbrev: 'Ez', name: 'Ezequiel', testament: 'AT', group: 'Profetas Maiores', chapters: 48 },
      { id: 'DAN', slug: 'dn', abbrev: 'Dn', name: 'Daniel', testament: 'AT', group: 'Profetas Maiores', chapters: 12 },

      // Profetas Menores
      { id: 'HOS', slug: 'os', abbrev: 'Os', name: 'Oséias', testament: 'AT', group: 'Profetas Menores', chapters: 14 },
      { id: 'JOL', slug: 'jl', abbrev: 'Jl', name: 'Joel', testament: 'AT', group: 'Profetas Menores', chapters: 3 },
      { id: 'AMO', slug: 'am', abbrev: 'Am', name: 'Amós', testament: 'AT', group: 'Profetas Menores', chapters: 9 },
      { id: 'OBA', slug: 'ob', abbrev: 'Ob', name: 'Obadias', testament: 'AT', group: 'Profetas Menores', chapters: 1 },
      { id: 'JON', slug: 'jn', abbrev: 'Jn', name: 'Jonas', testament: 'AT', group: 'Profetas Menores', chapters: 4 },
      { id: 'MIC', slug: 'mq', abbrev: 'Mq', name: 'Miquéias', testament: 'AT', group: 'Profetas Menores', chapters: 7 },
      { id: 'NAM', slug: 'na', abbrev: 'Na', name: 'Naum', testament: 'AT', group: 'Profetas Menores', chapters: 3 },
      { id: 'HAB', slug: 'hc', abbrev: 'Hc', name: 'Habacuque', testament: 'AT', group: 'Profetas Menores', chapters: 3 },
      { id: 'ZEP', slug: 'sf', abbrev: 'Sf', name: 'Sofonias', testament: 'AT', group: 'Profetas Menores', chapters: 3 },
      { id: 'HAG', slug: 'ag', abbrev: 'Ag', name: 'Ageu', testament: 'AT', group: 'Profetas Menores', chapters: 2 },
      { id: 'ZEC', slug: 'zc', abbrev: 'Zc', name: 'Zacarias', testament: 'AT', group: 'Profetas Menores', chapters: 14 },
      { id: 'MAL', slug: 'ml', abbrev: 'Ml', name: 'Malaquias', testament: 'AT', group: 'Profetas Menores', chapters: 4 },

      // NOVO TESTAMENTO (27 Livros)
      // Evangelhos
      { id: 'MAT', slug: 'mt', abbrev: 'Mt', name: 'Mateus', testament: 'NT', group: 'Evangelhos', chapters: 28 },
      { id: 'MRK', slug: 'mc', abbrev: 'Mc', name: 'Marcos', testament: 'NT', group: 'Evangelhos', chapters: 16 },
      { id: 'LUK', slug: 'lc', abbrev: 'Lc', name: 'Lucas', testament: 'NT', group: 'Evangelhos', chapters: 24 },
      { id: 'JHN', slug: 'jo', abbrev: 'Jo', name: 'João', testament: 'NT', group: 'Evangelhos', chapters: 21 },

      // Histórico
      { id: 'ACT', slug: 'at', abbrev: 'At', name: 'Atos dos Apóstolos', testament: 'NT', group: 'Histórico', chapters: 28 },

      // Epístolas Paulinas
      { id: 'ROM', slug: 'rm', abbrev: 'Rm', name: 'Romanos', testament: 'NT', group: 'Epístolas Paulinas', chapters: 16 },
      { id: '1CO', slug: '1co', abbrev: '1Co', name: '1 Coríntios', testament: 'NT', group: 'Epístolas Paulinas', chapters: 16 },
      { id: '2CO', slug: '2co', abbrev: '2Co', name: '2 Coríntios', testament: 'NT', group: 'Epístolas Paulinas', chapters: 13 },
      { id: 'GAL', slug: 'gl', abbrev: 'Gl', name: 'Gálatas', testament: 'NT', group: 'Epístolas Paulinas', chapters: 6 },
      { id: 'EPH', slug: 'ef', abbrev: 'Ef', name: 'Efésios', testament: 'NT', group: 'Epístolas Paulinas', chapters: 6 },
      { id: 'PHP', slug: 'fp', abbrev: 'Fp', name: 'Filipenses', testament: 'NT', group: 'Epístolas Paulinas', chapters: 4 },
      { id: 'COL', slug: 'cl', abbrev: 'Cl', name: 'Colossenses', testament: 'NT', group: 'Epístolas Paulinas', chapters: 4 },
      { id: '1TH', slug: '1ts', abbrev: '1Ts', name: '1 Tessalonicenses', testament: 'NT', group: 'Epístolas Paulinas', chapters: 5 },
      { id: '2TH', slug: '2ts', abbrev: '2Ts', name: '2 Tessalonicenses', testament: 'NT', group: 'Epístolas Paulinas', chapters: 3 },
      { id: '1TI', slug: '1tm', abbrev: '1Tm', name: '1 Timóteo', testament: 'NT', group: 'Epístolas Paulinas', chapters: 6 },
      { id: '2TI', slug: '2tm', abbrev: '2Tm', name: '2 Timóteo', testament: 'NT', group: 'Epístolas Paulinas', chapters: 4 },
      { id: 'TIT', slug: 'tt', abbrev: 'Tt', name: 'Tito', testament: 'NT', group: 'Epístolas Paulinas', chapters: 3 },
      { id: 'PHM', slug: 'fm', abbrev: 'Fm', name: 'Filemom', testament: 'NT', group: 'Epístolas Paulinas', chapters: 1 },
      { id: 'HEB', slug: 'hb', abbrev: 'Hb', name: 'Hebreus', testament: 'NT', group: 'Epístolas Paulinas', chapters: 13 },

      // Epístolas Gerais
      { id: 'JAS', slug: 'tg', abbrev: 'Tg', name: 'Tiago', testament: 'NT', group: 'Epístolas Gerais', chapters: 5 },
      { id: '1PE', slug: '1pe', abbrev: '1Pe', name: '1 Pedro', testament: 'NT', group: 'Epístolas Gerais', chapters: 5 },
      { id: '2PE', slug: '2pe', abbrev: '2Pe', name: '2 Pedro', testament: 'NT', group: 'Epístolas Gerais', chapters: 3 },
      { id: '1JN', slug: '1jo', abbrev: '1Jo', name: '1 João', testament: 'NT', group: 'Epístolas Gerais', chapters: 5 },
      { id: '2JN', slug: '2jo', abbrev: '2Jo', name: '2 João', testament: 'NT', group: 'Epístolas Gerais', chapters: 1 },
      { id: '3JN', slug: '3jo', abbrev: '3Jo', name: '3 João', testament: 'NT', group: 'Epístolas Gerais', chapters: 1 },
      { id: 'JUD', slug: 'jd', abbrev: 'Jd', name: 'Judas', testament: 'NT', group: 'Epístolas Gerais', chapters: 1 },

      // Profecia
      { id: 'REV', slug: 'ap', abbrev: 'Ap', name: 'Apocalipse', testament: 'NT', group: 'Profecia', chapters: 22 }
    ];

    // Perícopes / Cabeçalhos de seção para enriquecer a leitura
    this.pericopes = {
      'gn_1': {
        1: 'A Criação dos Céus e da Terra',
        3: 'O Primeiro Dia: Haja Luz',
        6: 'O Segundo Dia: O Firmamento',
        9: 'O Terceiro Dia: A Terra Seca e a Vegetação',
        14: 'O Quarto Dia: Os Luminares nos Céus',
        20: 'O Quinto Dia: As Criaturas Marinhas e as Aves',
        24: 'O Sexto Dia: Os Animais Terrestres e a Criação do Homem',
        28: 'A Bênção e o Mandato da Criação'
      },
      'gn_2': {
        1: 'O Sétimo Dia: O Descanso Sagrado de Deus',
        4: 'O Homem no Jardim do Éden',
        18: 'A Criação da Mulher e a Instituição do Casamento'
      },
      'gn_3': {
        1: 'A Queda do Homem e a Tentação',
        14: 'O Julgamento e a Primeira Promessa do Redentor (Protoevangelho)'
      },
      'sl_23': {
        1: 'O Bom Pastor e a Sua Provisão Perfeita'
      },
      'sl_91': {
        1: 'A Proteção Sob as Asas do Onipotente'
      },
      'sl_1': {
        1: 'Os Dois Caminhos: O Justo e o Ímpio'
      },
      'sl_119': {
        1: 'A Excelência e a Pureza da Lei do Senhor',
        105: 'Lâmpada Para os Meus Pés'
      },
      'sl_121': {
        1: 'O Socorro que Vem do Alto'
      },
      'jo_1': {
        1: 'O Verbo Eterno Feito Carne',
        19: 'O Testemunho de João Batista',
        35: 'Os Primeiros Discípulos de Jesus'
      },
      'jo_3': {
        1: 'O Diálogo Noturno com Nicodemos: O Novo Nascimento',
        16: 'O Incomensurável Amor de Deus Pelo Mundo',
        22: 'O Testemunho Final de João Batista'
      },
      'mt_5': {
        1: 'O Sermão da Montanha: As Bem-Aventuranças',
        13: 'O Sal da Terra e a Luz do Mundo',
        17: 'Cristo e a Lei',
        21: 'O Homicídio e a Raiva do Coração',
        43: 'O Amor aos Inimigos'
      },
      'mt_6': {
        1: 'A Esmola em Secreto',
        5: 'A Oração e o Pai Nosso',
        16: 'O Jejum Agradável a Deus',
        19: 'Tesouros nos Céus',
        25: 'O Cuidado de Deus e o Fim da Ansiedade'
      },
      'rm_8': {
        1: 'Vida no Espírito: Nenhuma Condenação',
        12: 'Herdeiros com Cristo',
        18: 'A Glória Futura e a Criação que Geme',
        26: 'A Intercessão do Espírito Santo',
        31: 'Mais que Vencedores Pelo Amor de Cristo'
      },
      '1co_13': {
        1: 'O Hino ao Amor Divino (Ágape)'
      },
      'ef_6': {
        10: 'A Armadura Completa de Deus e a Oração Eficaz'
      },
      'fp_4': {
        4: 'A Alegria no Senhor e a Paz que Excede Todo Entendimento',
        10: 'O Segredo da Contenteza: Tudo Posso Naquele que me Fortalece'
      },
      'ap_21': {
        1: 'Novo Céu e Nova Terra: A Nova Jerusalém',
        5: 'Eis que Faço Novas Todas as Coisas'
      }
    };
  }

  setVersion(version) {
    if (version !== 'ACF' && version !== 'NVI') return;
    this.currentVersion = version;
    localStorage.setItem('bp_bible_version', version);
  }

  getVersion() {
    return this.currentVersion;
  }

  getBooks() {
    return this.booksIndex;
  }

  getBook(identifier) {
    if (!identifier) return this.booksIndex[0];
    const norm = String(identifier).trim().toLowerCase();

    // 1. Busca por slug
    let found = this.booksIndex.find(b => b.slug.toLowerCase() === norm);
    if (found) return found;

    // 2. Busca por abbrev
    found = this.booksIndex.find(b => b.abbrev.toLowerCase() === norm);
    if (found) return found;

    // 3. Busca por ID
    found = this.booksIndex.find(b => b.id.toLowerCase() === norm);
    if (found) return found;

    // 4. Busca por nome completo ou parcial
    found = this.booksIndex.find(b => b.name.toLowerCase() === norm);
    if (found) return found;

    // 5. Normaliza acentos
    const unaccent = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    found = this.booksIndex.find(b => unaccent(b.name.toLowerCase()) === unaccent(norm));
    if (found) return found;

    found = this.booksIndex.find(b => unaccent(b.name.toLowerCase()).startsWith(unaccent(norm)));
    if (found) return found;

    return this.booksIndex[0];
  }

  getRawDataset(version = this.currentVersion) {
    if (version === 'NVI') {
      if (window.BIBLE_NVI && Array.isArray(window.BIBLE_NVI)) return window.BIBLE_NVI;
    }
    if (window.BIBLE_ACF && Array.isArray(window.BIBLE_ACF)) return window.BIBLE_ACF;
    return null;
  }

  getChapter(identifier, chapterNumber, version = this.currentVersion) {
    const book = this.getBook(identifier);
    const chapNum = parseInt(chapterNumber) || 1;
    const dataset = this.getRawDataset(version);

    if (dataset) {
      // Procura o livro no dataset (pelo slug ou abbrev)
      const bookData = dataset.find(b => {
        const bAbbrev = (b.abbrev || '').toLowerCase();
        return bAbbrev === book.slug.toLowerCase() || 
               bAbbrev === book.abbrev.toLowerCase() ||
               (b.name && b.name.toLowerCase() === book.name.toLowerCase());
      });

      if (bookData && bookData.chapters && bookData.chapters[chapNum - 1]) {
        const verseStrings = bookData.chapters[chapNum - 1];
        return verseStrings.map((txt, idx) => ({
          verse: idx + 1,
          text: txt
        }));
      }
    }

    // Fallback: tenta buscar dos capítulos embutidos ou gera estrutura
    const key = `${book.id}_${chapNum}`;
    if (typeof BUILTIN_CHAPTERS !== 'undefined' && BUILTIN_CHAPTERS[key]) {
      return BUILTIN_CHAPTERS[key];
    }

    return null;
  }

  getVerse(identifier, chapterNumber, verseNumber, version = this.currentVersion) {
    const chapter = this.getChapter(identifier, chapterNumber, version);
    if (!chapter) return null;
    const item = chapter.find(v => v.verse === parseInt(verseNumber));
    return item ? item.text : null;
  }

  getPericope(bookSlug, chapterNumber, verseNumber) {
    const key = `${bookSlug.toLowerCase()}_${chapterNumber}`;
    if (this.pericopes[key] && this.pericopes[key][verseNumber]) {
      return this.pericopes[key][verseNumber];
    }
    return null;
  }

  compareVerse(identifier, chapterNumber, verseNumber) {
    const book = this.getBook(identifier);
    const acfText = this.getVerse(identifier, chapterNumber, verseNumber, 'ACF');
    const nviText = this.getVerse(identifier, chapterNumber, verseNumber, 'NVI');
    return {
      book: book,
      chapter: chapterNumber,
      verse: verseNumber,
      acf: acfText || 'Texto não disponível em ACF',
      nvi: nviText || 'Texto não disponível em NVI'
    };
  }

  parseReference(query) {
    if (!query || typeof query !== 'string') return null;
    const cleaned = query.trim().replace(/\s+/g, ' ');

    // Padrão 1: "Nome/Sigla Cap:Versículo" (ex: "João 3:16", "Jo 3:16", "Sl 23:1", "1Co 13:13")
    const fullMatch = cleaned.match(/^([1-3]?\s*[A-Za-zÀ-ÿ]+)\s*(\d+)[:\s\.\,](\d+)/i);
    if (fullMatch) {
      const bookStr = fullMatch[1].trim();
      const chapter = parseInt(fullMatch[2]);
      const verse = parseInt(fullMatch[3]);
      const book = this.getBook(bookStr);
      if (book) {
        return { book, chapter, verse, isExactRef: true };
      }
    }

    // Padrão 2: "Nome/Sigla Cap" (ex: "Salmos 23", "Gn 1", "Ap 22")
    const chapMatch = cleaned.match(/^([1-3]?\s*[A-Za-zÀ-ÿ]+)\s*(\d+)$/i);
    if (chapMatch) {
      const bookStr = chapMatch[1].trim();
      const chapter = parseInt(chapMatch[2]);
      const book = this.getBook(bookStr);
      if (book) {
        return { book, chapter, verse: null, isExactRef: true };
      }
    }

    // Padrão 3: Apenas nome de livro (ex: "Gênesis", "Salmos", "Mateus")
    const bookOnly = this.booksIndex.find(b => {
      const norm = cleaned.toLowerCase();
      return b.name.toLowerCase() === norm || b.slug.toLowerCase() === norm || b.abbrev.toLowerCase() === norm;
    });

    if (bookOnly) {
      return { book: bookOnly, chapter: 1, verse: null, isExactRef: true };
    }

    return null;
  }

  search(term, scope = 'all', version = this.currentVersion, maxResults = 100) {
    if (!term || term.trim().length < 2) return [];
    const query = term.trim().toLowerCase();
    const dataset = this.getRawDataset(version);
    if (!dataset) return [];

    const results = [];
    const queryWords = query.split(/\s+/).filter(w => w.length > 0);

    for (const b of dataset) {
      const bookMeta = this.getBook(b.abbrev || b.name);
      
      // Filtros de escopo
      if (scope === 'AT' && bookMeta.testament !== 'AT') continue;
      if (scope === 'NT' && bookMeta.testament !== 'NT') continue;
      if (scope.startsWith('book:') && bookMeta.slug !== scope.replace('book:', '')) continue;

      if (!b.chapters) continue;

      for (let cIdx = 0; cIdx < b.chapters.length; cIdx++) {
        const chapter = b.chapters[cIdx];
        const chapterNum = cIdx + 1;

        for (let vIdx = 0; vIdx < chapter.length; vIdx++) {
          const verseText = chapter[vIdx];
          const verseNum = vIdx + 1;
          const lowerText = verseText.toLowerCase();

          // Verifica se todas as palavras da consulta estão no versículo
          const matchesAll = queryWords.every(word => lowerText.includes(word));

          if (matchesAll) {
            results.push({
              book: bookMeta,
              chapter: chapterNum,
              verse: verseNum,
              text: verseText,
              version: version
            });

            if (results.length >= maxResults) {
              return results;
            }
          }
        }
      }
    }

    return results;
  }
}

// Instância global única
const bibleService = new BibleService();
