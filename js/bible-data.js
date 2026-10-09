/**
 * BÍBLIA SAGRADA - DADOS E ÍNDICE COMPLETO (66 LIVROS)
 * Plataforma de Estudos Bíblicos Bp. Emanuel
 */

const BIBLE_BOOKS = [
  // ANTIGO TESTAMENTO
  // Pentateuco
  { id: 'GEN', name: 'Gênesis', abbrev: 'Gn', testament: 'AT', group: 'Pentateuco', chapters: 50 },
  { id: 'EXO', name: 'Êxodo', abbrev: 'Êx', testament: 'AT', group: 'Pentateuco', chapters: 40 },
  { id: 'LEV', name: 'Levítico', abbrev: 'Lv', testament: 'AT', group: 'Pentateuco', chapters: 27 },
  { id: 'NUM', name: 'Números', abbrev: 'Nm', testament: 'AT', group: 'Pentateuco', chapters: 36 },
  { id: 'DEU', name: 'Deuteronômio', abbrev: 'Dt', testament: 'AT', group: 'Pentateuco', chapters: 34 },
  // Históricos
  { id: 'JOS', name: 'Josué', abbrev: 'Js', testament: 'AT', group: 'Históricos', chapters: 24 },
  { id: 'JDG', name: 'Juízes', abbrev: 'Jz', testament: 'AT', group: 'Históricos', chapters: 21 },
  { id: 'RUT', name: 'Rute', abbrev: 'Rt', testament: 'AT', group: 'Históricos', chapters: 4 },
  { id: '1SA', name: '1 Samuel', abbrev: '1Sm', testament: 'AT', group: 'Históricos', chapters: 31 },
  { id: '2SA', name: '2 Samuel', abbrev: '2Sm', testament: 'AT', group: 'Históricos', chapters: 24 },
  { id: '1KI', name: '1 Reis', abbrev: '1Rs', testament: 'AT', group: 'Históricos', chapters: 22 },
  { id: '2KI', name: '2 Reis', abbrev: '2Rs', testament: 'AT', group: 'Históricos', chapters: 25 },
  { id: '1CH', name: '1 Crônicas', abbrev: '1Cr', testament: 'AT', group: 'Históricos', chapters: 29 },
  { id: '2CH', name: '2 Crônicas', abbrev: '2Cr', testament: 'AT', group: 'Históricos', chapters: 36 },
  { id: 'EZR', name: 'Esdras', abbrev: 'Ed', testament: 'AT', group: 'Históricos', chapters: 10 },
  { id: 'NEH', name: 'Neemias', abbrev: 'Ne', testament: 'AT', group: 'Históricos', chapters: 13 },
  { id: 'EST', name: 'Ester', abbrev: 'Et', testament: 'AT', group: 'Históricos', chapters: 10 },
  // Poéticos e Sabedoria
  { id: 'JOB', name: 'Jó', abbrev: 'Jó', testament: 'AT', group: 'Poéticos', chapters: 42 },
  { id: 'PSA', name: 'Salmos', abbrev: 'Sl', testament: 'AT', group: 'Poéticos', chapters: 150 },
  { id: 'PRO', name: 'Provérbios', abbrev: 'Pv', testament: 'AT', group: 'Poéticos', chapters: 31 },
  { id: 'ECC', name: 'Eclesiastes', abbrev: 'Ec', testament: 'AT', group: 'Poéticos', chapters: 12 },
  { id: 'SNG', name: 'Cantares', abbrev: 'Ct', testament: 'AT', group: 'Poéticos', chapters: 8 },
  // Profetas Maiores
  { id: 'ISA', name: 'Isaías', abbrev: 'Is', testament: 'AT', group: 'Profetas Maiores', chapters: 66 },
  { id: 'JER', name: 'Jeremias', abbrev: 'Jr', testament: 'AT', group: 'Profetas Maiores', chapters: 52 },
  { id: 'LAM', name: 'Lamentações', abbrev: 'Lm', testament: 'AT', group: 'Profetas Maiores', chapters: 5 },
  { id: 'EZK', name: 'Ezequiel', abbrev: 'Ez', testament: 'AT', group: 'Profetas Maiores', chapters: 48 },
  { id: 'DAN', name: 'Daniel', abbrev: 'Dn', testament: 'AT', group: 'Profetas Maiores', chapters: 12 },
  // Profetas Menores
  { id: 'HOS', name: 'Oséias', abbrev: 'Os', testament: 'AT', group: 'Profetas Menores', chapters: 14 },
  { id: 'JOL', name: 'Joel', abbrev: 'Jl', testament: 'AT', group: 'Profetas Menores', chapters: 3 },
  { id: 'AMO', name: 'Amós', abbrev: 'Am', testament: 'AT', group: 'Profetas Menores', chapters: 9 },
  { id: 'OBA', name: 'Obadias', abbrev: 'Ob', testament: 'AT', group: 'Profetas Menores', chapters: 1 },
  { id: 'JON', name: 'Jonas', abbrev: 'Jn', testament: 'AT', group: 'Profetas Menores', chapters: 4 },
  { id: 'MIC', name: 'Miquéias', abbrev: 'Mq', testament: 'AT', group: 'Profetas Menores', chapters: 7 },
  { id: 'NAM', name: 'Naum', abbrev: 'Na', testament: 'AT', group: 'Profetas Menores', chapters: 3 },
  { id: 'HAB', name: 'Habacuque', abbrev: 'Hc', testament: 'AT', group: 'Profetas Menores', chapters: 3 },
  { id: 'ZEP', name: 'Sofonias', abbrev: 'Sf', testament: 'AT', group: 'Profetas Menores', chapters: 3 },
  { id: 'HAG', name: 'Ageu', abbrev: 'Ag', testament: 'AT', group: 'Profetas Menores', chapters: 2 },
  { id: 'ZEC', name: 'Zacarias', abbrev: 'Zc', testament: 'AT', group: 'Profetas Menores', chapters: 14 },
  { id: 'MAL', name: 'Malaquias', abbrev: 'Ml', testament: 'AT', group: 'Profetas Menores', chapters: 4 },

  // NOVO TESTAMENTO
  // Evangelhos
  { id: 'MAT', name: 'Mateus', abbrev: 'Mt', testament: 'NT', group: 'Evangelhos', chapters: 28 },
  { id: 'MRK', name: 'Marcos', abbrev: 'Mc', testament: 'NT', group: 'Evangelhos', chapters: 16 },
  { id: 'LUK', name: 'Lucas', abbrev: 'Lc', testament: 'NT', group: 'Evangelhos', chapters: 24 },
  { id: 'JHN', name: 'João', abbrev: 'Jo', testament: 'NT', group: 'Evangelhos', chapters: 21 },
  // História
  { id: 'ACT', name: 'Atos dos Apóstolos', abbrev: 'At', testament: 'NT', group: 'História', chapters: 28 },
  // Cartas Paulinas
  { id: 'ROM', name: 'Romanos', abbrev: 'Rm', testament: 'NT', group: 'Epístolas Paulinas', chapters: 16 },
  { id: '1CO', name: '1 Coríntios', abbrev: '1Co', testament: 'NT', group: 'Epístolas Paulinas', chapters: 16 },
  { id: '2CO', name: '2 Coríntios', abbrev: '2Co', testament: 'NT', group: 'Epístolas Paulinas', chapters: 13 },
  { id: 'GAL', name: 'Gálatas', abbrev: 'Gl', testament: 'NT', group: 'Epístolas Paulinas', chapters: 6 },
  { id: 'EPH', name: 'Efésios', abbrev: 'Ef', testament: 'NT', group: 'Epístolas Paulinas', chapters: 6 },
  { id: 'PHP', name: 'Filipenses', abbrev: 'Fp', testament: 'NT', group: 'Epístolas Paulinas', chapters: 4 },
  { id: 'COL', name: 'Colossenses', abbrev: 'Cl', testament: 'NT', group: 'Epístolas Paulinas', chapters: 4 },
  { id: '1TH', name: '1 Tessalonicenses', abbrev: '1Ts', testament: 'NT', group: 'Epístolas Paulinas', chapters: 5 },
  { id: '2TH', name: '2 Tessalonicenses', abbrev: '2Ts', testament: 'NT', group: 'Epístolas Paulinas', chapters: 3 },
  { id: '1TI', name: '1 Timóteo', abbrev: '1Tm', testament: 'NT', group: 'Epístolas Paulinas', chapters: 6 },
  { id: '2TI', name: '2 Timóteo', abbrev: '2Tm', testament: 'NT', group: 'Epístolas Paulinas', chapters: 4 },
  { id: 'TIT', name: 'Tito', abbrev: 'Tt', testament: 'NT', group: 'Epístolas Paulinas', chapters: 3 },
  { id: 'PHM', name: 'Filemom', abbrev: 'Fm', testament: 'NT', group: 'Epístolas Paulinas', chapters: 1 },
  // Epístolas Gerais
  { id: 'HEB', name: 'Hebreus', abbrev: 'Hb', testament: 'NT', group: 'Epístolas Gerais', chapters: 13 },
  { id: 'JAS', name: 'Tiago', abbrev: 'Tg', testament: 'NT', group: 'Epístolas Gerais', chapters: 5 },
  { id: '1PE', name: '1 Pedro', abbrev: '1Pe', testament: 'NT', group: 'Epístolas Gerais', chapters: 5 },
  { id: '2PE', name: '2 Pedro', abbrev: '2Pe', testament: 'NT', group: 'Epístolas Gerais', chapters: 3 },
  { id: '1JN', name: '1 João', abbrev: '1Jo', testament: 'NT', group: 'Epístolas Gerais', chapters: 5 },
  { id: '2JN', name: '2 João', abbrev: '2Jo', testament: 'NT', group: 'Epístolas Gerais', chapters: 1 },
  { id: '3JN', name: '3 João', abbrev: '3Jo', testament: 'NT', group: 'Epístolas Gerais', chapters: 1 },
  { id: 'JUD', name: 'Judas', abbrev: 'Jd', testament: 'NT', group: 'Epístolas Gerais', chapters: 1 },
  // Profecia
  { id: 'REV', name: 'Apocalipse', abbrev: 'Ap', testament: 'NT', group: 'Profecia', chapters: 22 }
];

/**
 * CAPÍTULOS INTEGRADOS PARA LEITURA OFFLINE IMEDIATA (ARC / Almeida)
 */
const BUILTIN_CHAPTERS = {
  // Salmos 23
  'PSA_23': [
    { verse: 1, text: 'O SENHOR é o meu pastor; nada me faltará.' },
    { verse: 2, text: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranqüilas.' },
    { verse: 3, text: 'Refrigera a minha alma; guia-me pelas veredas da justiça por amor do seu nome.' },
    { verse: 4, text: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
    { verse: 5, text: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.' },
    { verse: 6, text: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na Casa do SENHOR por longos dias.' }
  ],

  // Salmos 91
  'PSA_91': [
    { verse: 1, text: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.' },
    { verse: 2, text: 'Direi do SENHOR: Ele é o meu refúgio e a minha fortaleza, o meu Deus, em quem confio.' },
    { verse: 3, text: 'Porque ele te livrará do laço do passarinheiro e da peste perniciosa.' },
    { verse: 4, text: 'Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel.' },
    { verse: 5, text: 'Não terás medo do terror de noite nem da seta que voa de dia.' },
    { verse: 6, text: 'Nem da peste que anda na escuridão, nem da mortandade que assola ao meio-dia.' },
    { verse: 7, text: 'Mil cairão ao teu lado, e dez mil, à tua direita, mas tu não serás atingido.' },
    { verse: 8, text: 'Somente com os teus olhos olharás e verás a recompensa dos ímpios.' },
    { verse: 9, text: 'Porque tu, ó SENHOR, és o meu refúgio! No Altíssimo fizeste a tua habitação.' },
    { verse: 10, text: 'Nenhum mal te sucederá, nem praga alguma chegará à tua tenda.' },
    { verse: 11, text: 'Porque aos seus anjos dará ordem a teu respeito, para te guardarem em todos os teus caminhos.' },
    { verse: 12, text: 'Eles te sustentarão nas suas mãos, para que não tropeces com o teu pé em pedra.' },
    { verse: 13, text: 'Pisarás o leão e a áspide; calcarás aos pés o filho do leão e a serpente.' },
    { verse: 14, text: 'Porquanto tão encarecidamente me amou, também eu o livrarei; pô-lo-ei num alto retiro, porque conheceu o meu nome.' },
    { verse: 15, text: 'Ele me invocará, e eu lhe responderei; estarei com ele na angústia; dele o retirarei e o glorificarei.' },
    { verse: 16, text: 'Dar-lhe-ei abundância de dias e lhe mostrarei a minha salvação.' }
  ],

  // Salmos 1
  'PSA_1': [
    { verse: 1, text: 'Bem-aventurado o varão que não anda segundo o conselho dos ímpios, nem se detém no caminho dos pecadores, nem se assenta na roda dos escarnecedores.' },
    { verse: 2, text: 'Antes, tem o seu prazer na lei do SENHOR, e na sua lei medita de dia e de noite.' },
    { verse: 3, text: 'Pois será como a árvore plantada junto a ribeiros de águas, a qual dá o seu fruto na estação própria, e cujas folhas não caem, e tudo quanto fizer prosperará.' },
    { verse: 4, text: 'Não são assim os ímpios; mas são como a moinha que o vento espalha.' },
    { verse: 5, text: 'Pelo que os ímpios não subsistirão no juízo, nem os pecadores na congregação dos justos.' },
    { verse: 6, text: 'Porque o SENHOR conhece o caminho dos justos; mas o caminho dos ímpios perecerá.' }
  ],

  // Salmos 121
  'PSA_121': [
    { verse: 1, text: 'Levantarei os meus olhos para os montes, de onde vem o meu socorro.' },
    { verse: 2, text: 'O meu socorro vem do SENHOR, que fez o céu e a terra.' },
    { verse: 3, text: 'Não deixará vacilar o teu pé; aquele que te guarda não tosquenejará.' },
    { verse: 4, text: 'Eis que não tosquenejará nem dormirá o guarda de Israel.' },
    { verse: 5, text: 'O SENHOR é quem te guarda; o SENHOR é a tua sombra à tua direita.' },
    { verse: 6, text: 'O sol não te molestará de dia, nem a lua de noite.' },
    { verse: 7, text: 'O SENHOR te guardará de todo o mal; guardará a tua alma.' },
    { verse: 8, text: 'O SENHOR guardará a tua entrada e a tua saída, desde agora e para sempre.' }
  ],

  // João 3
  'JHN_3': [
    { verse: 1, text: 'E havia entre os fariseus um homem chamado Nicodemos, príncipe dos judeus.' },
    { verse: 2, text: 'Este foi ter de noite com Jesus e disse-lhe: Rabi, bem sabemos que és mestre vindo de Deus, porque ninguém pode fazer estes sinais que tu fazes, se Deus não for com ele.' },
    { verse: 3, text: 'Jesus respondeu e disse-lhe: Na verdade, na verdade te digo que aquele que não nascer de novo não pode ver o Reino de Deus.' },
    { verse: 4, text: 'Disse-lhe Nicodemos: Como pode um homem nascer, sendo velho? Porventura, pode tornar a entrar no ventre de sua mãe e nascer?' },
    { verse: 5, text: 'Jesus respondeu: Na verdade, na verdade te digo que aquele que não nascer da água e do Espírito não pode entrar no Reino de Deus.' },
    { verse: 6, text: 'O que é nascido da carne é carne, e o que é nascido do Espírito é espírito.' },
    { verse: 7, text: 'Não te maravilhes de te ter dito: Necessário vos é nascer de novo.' },
    { verse: 8, text: 'O vento assopra onde quer, e ouves a sua voz, mas não sabes donde vem, nem para onde vai; assim é todo aquele que é nascido do Espírito.' },
    { verse: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
    { verse: 17, text: 'Porque Deus enviou o seu Filho ao mundo não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' },
    { verse: 18, text: 'Quem crê nele não é condenado; mas quem não crê já está condenado, porquanto não crê no nome do unigênito Filho de Deus.' }
  ],

  // João 1
  'JHN_1': [
    { verse: 1, text: 'No princípio, era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.' },
    { verse: 2, text: 'Ele estava no princípio com Deus.' },
    { verse: 3, text: 'Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.' },
    { verse: 4, text: 'Nele, estava a vida e a vida era a luz dos homens.' },
    { verse: 5, text: 'E a luz resplandece nas trevas, e as trevas não a compreenderam.' },
    { verse: 14, text: 'E o Verbo se fez carne e habitou entre nós, e vimos a sua glória, como a glória do Unigênito do Pai, cheio de graça e de verdade.' }
  ],

  // Romanos 8
  'ROM_8': [
    { verse: 1, text: 'Portanto, agora, nenhuma condenação há para os que estão em Cristo Jesus, que não andam segundo a carne, mas segundo o espírito.' },
    { verse: 2, text: 'Porque a lei do Espírito de vida, em Cristo Jesus, me livrou da lei do pecado e da morte.' },
    { verse: 14, text: 'Porque todos os que são guiados pelo Espírito de Deus, esses são filhos de Deus.' },
    { verse: 15, text: 'Porque não recebestes o espírito de escravidão, para, outra vez, estardes em temor, mas recebestes o espírito de adoção de filhos, pelo qual clamamos: Aba, Pai.' },
    { verse: 28, text: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.' },
    { verse: 31, text: 'Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?' },
    { verse: 37, text: 'Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.' },
    { verse: 38, text: 'Porque estou certo de que nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir,' },
    { verse: 39, text: 'nem a altura, nem a profundidade, nem alguma outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus, nosso Senhor!' }
  ],

  // 1 Coríntios 13
  '1CO_13': [
    { verse: 1, text: 'Ainda que eu falasse as línguas dos homens e dos anjos e não tivesse amor, seria como o metal que soa ou como o sino que tine.' },
    { verse: 2, text: 'E ainda que tivesse o dom de profecia, e conhecesse todos os mistérios e toda a ciência, e ainda que tivesse toda a fé, de maneira tal que transportasse os montes, e não tivesse amor, nada seria.' },
    { verse: 3, text: 'E ainda que distribuísse toda a minha fortuna para sustento dos pobres, e ainda que entregasse o meu corpo para ser queimado, e não tivesse amor, nada disso me aproveitaria.' },
    { verse: 4, text: 'O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece.' },
    { verse: 5, text: 'Não se porta com indecência, não busca os seus interesses, não se irrita, não suspeita mal;' },
    { verse: 6, text: 'não folga com a injustiça, mas folga com a verdade;' },
    { verse: 7, text: 'tudo sofre, tudo crê, tudo espera, tudo suporta.' },
    { verse: 8, text: 'O amor nunca falha; mas, havendo profecias, serão aniquiladas; havendo línguas, cessarão; havendo ciência, desaparecerá.' },
    { verse: 13, text: 'Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.' }
  ],

  // Efésios 6
  'EPH_6': [
    { verse: 10, text: 'No demais, irmãos meus, fortalecei-vos no Senhor e na força do seu poder.' },
    { verse: 11, text: 'Revesti-vos de toda a armadura de Deus, para que possais estar firmes contra as astutas ciladas do diabo;' },
    { verse: 12, text: 'porque não temos que lutar contra carne e sangue, mas, sim, contra os principados, contra as potestades, contra os príncipes das trevas deste século, contra as hostes espirituais da maldade, nos lugares celestiais.' },
    { verse: 13, text: 'Portanto, tomai toda a armadura de Deus, para que possais resistir no dia mau e, havendo feito tudo, ficar firmes.' },
    { verse: 14, text: 'Estai, pois, firmes, tendo cingidos os vossos lombos com a verdade, e vestida a couraça da justiça,' },
    { verse: 15, text: 'e calçados os pés na preparação do evangelho da paz;' },
    { verse: 16, text: 'tomando sobretudo o escudo da fé, com o qual podereis apagar todos os dardos inflamados do maligno.' },
    { verse: 17, text: 'Tomai também o capacete da salvação e a espada do Espírito, que é a palavra de Deus;' },
    { verse: 18, text: 'orando em todo tempo com toda oração e súplica no Espírito, e vigiando nisso com toda perseverança e súplica por todos os santos.' }
  ],

  // Gênesis 1
  'GEN_1': [
    { verse: 1, text: 'No princípio, criou Deus os céus e a terra.' },
    { verse: 2, text: 'E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.' },
    { verse: 3, text: 'E disse Deus: Haja luz. E houve luz.' },
    { verse: 4, text: 'E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas.' },
    { verse: 5, text: 'E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã: o dia primeiro.' }
  ],

  // Isaías 53
  'ISA_53': [
    { verse: 3, text: 'Era desprezado e o mais indigno entre os homens, homem de dores, experimentado nos trabalhos e, como um de quem os homens escondiam o rosto, era desprezado, e não fizemos dele caso algum.' },
    { verse: 4, text: 'Verdadeiramente, ele tomou sobre si as nossas enfermidades e as nossas dores levou sobre si; e nós o reputamos por aflito, ferido de Deus e oprimido.' },
    { verse: 5, text: 'Mas ele foi ferido pelas nossas transgressões e moído pelas nossas iniqüidades; o castigo que nos traz a paz estava sobre ele, e, pelas suas pisaduras, fomos sarados.' },
    { verse: 6, text: 'Todos nós andávamos desgarrados como ovelhas; cada um se desviava pelo seu caminho; mas o SENHOR fez cair sobre ele a iniqüidade de nós todos.' }
  ],

  // Mateus 5 (Sermão da Montanha)
  'MAT_5': [
    { verse: 1, text: 'E Jesus, vendo a multidão, subiu a um monte, e, assentando-se, chegaram-se a ele os seus discípulos;' },
    { verse: 2, text: 'e, abrindo a boca, os ensinava, dizendo:' },
    { verse: 3, text: 'Bem-aventurados os pobres de espírito, porque deles é o Reino dos céus;' },
    { verse: 4, text: 'Bem-aventurados os que choram, porque eles serão consolados;' },
    { verse: 5, text: 'Bem-aventurados os mansos, porque eles herdarão a terra;' },
    { verse: 6, text: 'Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos;' },
    { verse: 7, text: 'Bem-aventurados os misericordiosos, porque eles alcançarão misericórdia;' },
    { verse: 8, text: 'Bem-aventurados os limpos de coração, porque eles verão a Deus;' },
    { verse: 9, text: 'Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus;' },
    { verse: 10, text: 'Bem-aventurados os que sofrem perseguição por causa da justiça, porque deles é o Reino dos céus.' },
    { verse: 14, text: 'Vós sois a luz do mundo; não se pode esconder uma cidade edificada sobre um monte;' },
    { verse: 16, text: 'Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem o vosso Pai, que está nos céus.' }
  ],

  // Apocalipse 21
  'REV_21': [
    { verse: 1, text: 'E vi um novo céu e uma nova terra. Porque já o primeiro céu e a primeira terra passaram, e o mar já não existe.' },
    { verse: 2, text: 'E eu, João, vi a Santa Cidade, a nova Jerusalém, que de Deus descia do céu, adereçada como uma esposa ataviada para o seu marido.' },
    { verse: 3, text: 'E ouvi uma grande voz do céu, que dizia: Eis aqui o tabernáculo de Deus com os homens, pois com eles habitará, e eles serão o seu povo, e o mesmo Deus estará com eles e será o seu Deus.' },
    { verse: 4, text: 'E Deus limpará de seus olhos toda lágrima, e não haverá mais morte, nem pranto, nem clamor, nem dor, porque já as primeiras coisas são passadas.' },
    { verse: 5, text: 'E o que estava assentado sobre o trono disse: Eis que faço novas todas as coisas. E disse-me: Escreve, porque estas palavras são verdadeiras e fiéis.' }
  ]
};

/**
 * VERSÍCULOS DO DIA PARA INSPIRAÇÃO DIÁRIA
 */
const DAILY_VERSES = [
  {
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
    bookId: "JHN",
    chapter: 3,
    verse: 16
  },
  {
    text: "O SENHOR é o meu pastor; nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas tranqüilas.",
    reference: "Salmos 23:1-2",
    bookId: "PSA",
    chapter: 23,
    verse: 1
  },
  {
    text: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do SENHOR: Ele é o meu refúgio e a minha fortaleza.",
    reference: "Salmos 91:1-2",
    bookId: "PSA",
    chapter: 91,
    verse: 1
  },
  {
    text: "E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.",
    reference: "Romanos 8:28",
    bookId: "ROM",
    chapter: 8,
    verse: 28
  },
  {
    text: "Posso todas as coisas naquele que me fortalece.",
    reference: "Filipenses 4:13",
    bookId: "PHP",
    chapter: 4,
    verse: 13
  },
  {
    text: "Confia no SENHOR de todo o teu coração e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.",
    reference: "Provérbios 3:5-6",
    bookId: "PRO",
    chapter: 3,
    verse: 5
  },
  {
    text: "Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.",
    reference: "1 Coríntios 13:13",
    bookId: "1CO",
    chapter: 13,
    verse: 13
  }
];
