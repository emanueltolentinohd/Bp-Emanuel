/**
 * PLANOS DE LEITURA BÍBLICA - DADOS E RASTREAMENTO
 * Plataforma Bp. Emanuel
 */

const READING_PLANS = [
  {
    id: "plano-nt-90",
    title: "Novo Testamento em 90 Dias",
    description: "Percorra toda a vida de Jesus, o nascimento da Igreja em Atos e as preciosas cartas apostólicas com uma leitura diária edificante.",
    duration: "90 dias",
    totalItems: 30, // Mostra os 30 dias principais da primeira etapa
    days: [
      { day: 1, title: "O Princípio do Verbo e a Encarnação", bookId: "JHN", chapter: 1, ref: "João 1" },
      { day: 2, title: "O Primeiro Milagre e a Purificação do Templo", bookId: "JHN", chapter: 2, ref: "João 2" },
      { day: 3, title: "O Novo Nascimento e o Amor de Deus", bookId: "JHN", chapter: 3, ref: "João 3" },
      { day: 4, title: "A Mulher Samaritana e a Água Viva", bookId: "JHN", chapter: 4, ref: "João 4" },
      { day: 5, title: "A Cura do Paralítico de Betesda", bookId: "JHN", chapter: 5, ref: "João 5" },
      { day: 6, title: "O Pão da Vida", bookId: "JHN", chapter: 6, ref: "João 6" },
      { day: 7, title: "Rios de Água Viva no Templo", bookId: "JHN", chapter: 7, ref: "João 7" },
      { day: 8, title: "A Luz do Mundo e a Mulher Paga em Adultério", bookId: "JHN", chapter: 8, ref: "João 8" },
      { day: 9, title: "A Cura do Cego de Nascença", bookId: "JHN", chapter: 9, ref: "João 9" },
      { day: 10, title: "O Bom Pastor que Dá a Vida pelas Ovelhas", bookId: "JHN", chapter: 10, ref: "João 10" },
      { day: 11, title: "A Ressurreição de Lázaro", bookId: "JHN", chapter: 11, ref: "João 11" },
      { day: 12, title: "A Entrada Triunfal em Jerusalém", bookId: "JHN", chapter: 12, ref: "João 12" },
      { day: 13, title: "O Lava-Pés e a Humildade de Cristo", bookId: "JHN", chapter: 13, ref: "João 13" },
      { day: 14, title: "O Caminho, a Verdade e a Vida; O Consolador", bookId: "JHN", chapter: 14, ref: "João 14" },
      { day: 15, title: "A Videira Verdadeira e a Alegria Completa", bookId: "JHN", chapter: 15, ref: "João 15" },
      { day: 16, title: "A Obra do Espírito Santo e a Oração Sacerdotal", bookId: "JHN", chapter: 17, ref: "João 17" },
      { day: 17, title: "A Crucificação e a Redenção Consumada", bookId: "JHN", chapter: 19, ref: "João 19" },
      { day: 18, title: "A Ressurreição e a Vitória sobre a Morte", bookId: "JHN", chapter: 20, ref: "João 20" },
      { day: 19, title: "O Sermão do Monte: Bem-Aventuranças", bookId: "MAT", chapter: 5, ref: "Mateus 5" },
      { day: 20, title: "A Oração do Pai Nosso e a Providência Divina", bookId: "MAT", chapter: 6, ref: "Mateus 6" },
      { day: 21, title: "A Edificação sobre a Rocha Inabalável", bookId: "MAT", chapter: 7, ref: "Mateus 7" },
      { day: 22, title: "A Chegada do Espírito Santo no Pentecostes", bookId: "ACT", chapter: 2, ref: "Atos 2" },
      { day: 23, title: "A Conversão de Saulo de Tarso", bookId: "ACT", chapter: 9, ref: "Atos 9" },
      { day: 24, title: "Justificados pela Fé e Paz com Deus", bookId: "ROM", chapter: 5, ref: "Romanos 5" },
      { day: 25, title: "Mais que Vencedores em Cristo Jesus", bookId: "ROM", chapter: 8, ref: "Romanos 8" },
      { day: 26, title: "O Culto Racional e a Transformação da Mente", bookId: "ROM", chapter: 12, ref: "Romanos 12" },
      { day: 27, title: "O Hino ao Amor Divino", bookId: "1CO", chapter: 13, ref: "1 Coríntios 13" },
      { day: 28, title: "A Armadura de Deus e a Oração Contínua", bookId: "EPH", chapter: 6, ref: "Efésios 6" },
      { day: 29, title: "A Galeria dos Heróis da Fé", bookId: "HEB", chapter: 11, ref: "Hebreus 11" },
      { day: 30, title: "A Nova Jerusalém e o Fim de Toda Dor", bookId: "REV", chapter: 21, ref: "Apocalipse 21" }
    ]
  },
  {
    id: "plano-salmos-proverbios",
    title: "Salmos & Provérbios Diários",
    description: "Encontre refrigério, louvor matinal e sabedoria prática para tomada de decisões no seu dia a dia.",
    duration: "30 dias",
    totalItems: 15,
    days: [
      { day: 1, title: "A Árvore Junto a Ribeiro de Águas", bookId: "PSA", chapter: 1, ref: "Salmos 1" },
      { day: 2, title: "O Pastor da Minha Alma", bookId: "PSA", chapter: 23, ref: "Salmos 23" },
      { day: 3, title: "Confia no Senhor de Todo o Teu Coração", bookId: "PRO", chapter: 3, ref: "Provérbios 3" },
      { day: 4, title: "O Esconderijo do Altíssimo", bookId: "PSA", chapter: 91, ref: "Salmos 91" },
      { day: 5, title: "O Guarda Fiel de Israel", bookId: "PSA", chapter: 121, ref: "Salmos 121" },
      { day: 6, title: "O Senhor que Conhece Nossos Pensamentos", bookId: "PSA", chapter: 139, ref: "Salmos 139" },
      { day: 7, title: "A Sabedoria Edifica a Sua Casa", bookId: "PRO", chapter: 9, ref: "Provérbios 9" },
      { day: 8, title: "Lâmpada para os Meus Pés", bookId: "PSA", chapter: 119, ref: "Salmos 119" }
    ]
  }
];

class ReadingPlansManager {
  constructor() {
    this.storageKey = 'bp_emanuel_reading_progress';
    this.progress = this.loadProgress();
  }

  loadProgress() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  saveProgress() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
  }

  isDayCompleted(planId, day) {
    return !!(this.progress[planId] && this.progress[planId][day]);
  }

  toggleDay(planId, day) {
    if (!this.progress[planId]) {
      this.progress[planId] = {};
    }
    this.progress[planId][day] = !this.progress[planId][day];
    this.saveProgress();
    return this.progress[planId][day];
  }

  getPlanProgressPercent(planId, totalDays) {
    if (!this.progress[planId]) return 0;
    const completedCount = Object.values(this.progress[planId]).filter(Boolean).length;
    return Math.min(100, Math.round((completedCount / totalDays) * 100));
  }
}

const readingPlansManager = new ReadingPlansManager();
