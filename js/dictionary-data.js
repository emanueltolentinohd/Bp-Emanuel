/**
 * DICIONÁRIO E LÉXICO TEOLÓGICO - TERMOS ESSENCIAIS
 * Plataforma Bp. Emanuel
 */

const THEOLOGICAL_DICTIONARY = [
  {
    term: "Graça",
    origin: "Grego: Χάρις (Cháris) / Hebraico: חֵן (Chen)",
    definition: "O favor imerecido e benevolente de Deus concedido ao ser humano caído. Na teologia paulina, a graça não é apenas a clemência divina que cancela a culpa, mas o poder operante do Espírito Santo que capacita o homem a viver em santidade e receber a vida eterna gratuitamente.",
    references: "Efésios 2:8-9; Romanos 3:24; Tito 2:11"
  },
  {
    term: "Justificação",
    origin: "Grego: Δικαίωσις (Dikaíōsis) / Hebraico: צְדָקָה (Tzedakah)",
    definition: "Ato judicial soberano pelo qual Deus declara o pecador culpado como plenamente justo perante a Sua lei, não com base nas obras do pecador, mas pela imputação (crédito) da justiça perfeita de Jesus Cristo recebida exclusivamente pela fé.",
    references: "Romanos 5:1; Gálatas 2:16; 2 Coríntios 5:21"
  },
  {
    term: "Propiciação",
    origin: "Grego: Ἱλασμός (Hilasmós) / Hebraico: כַּפֹּרֶת (Kapporeth)",
    definition: "O sacrifício expiatório que aplaca a justa ira de Deus contra o pecado, satisfazendo plenamente as exigências da justiça divina. Cristo é tanto o Sumo Sacerdote quanto o Cordeiro Propiciatório.",
    references: "1 João 2:2; Romanos 3:25; Hebreus 2:17"
  },
  {
    term: "Redenção",
    origin: "Grego: Ἀπολύτρωσις (Apolýtrōsis)",
    definition: "O resgate ou libertação de um escravo ou prisioneiro mediante o pagamento de um preço (o 'resgate'). Em termos teológicos, a libertação do ser humano do cativeiro do pecado, da condenação e da morte mediante o precioso sangue de Cristo.",
    references: "Efésios 1:7; Colossenses 1:14; 1 Pedro 1:18-19"
  },
  {
    term: "Santificação",
    origin: "Grego: Ἁγιασμός (Hagiasmós) / Hebraico: קָדוֹשׁ (Kadosh)",
    definition: "O processo contínuo operado pelo Espírito Santo na vida do crente, separando-o do pecado e conformando o seu caráter, pensamentos e ações à imagem e semelhança de Jesus Cristo.",
    references: "1 Tessalonicenses 4:3; Hebreus 12:14; João 17:17"
  },
  {
    term: "Paráclito",
    origin: "Grego: Παράκλητος (Paráklētos)",
    definition: "Aquele que é chamado para estar ao lado; Consolo, Defensor, Advogado e Intercessor. Título glorioso atribuído por Jesus ao Espírito Santo, que habita no coração dos crentes para guiar em toda a verdade.",
    references: "João 14:16, 26; João 15:26; João 16:7"
  },
  {
    term: "Koinonia",
    origin: "Grego: Κοινωνία (Koinōnía)",
    definition: "Comunhão íntima, participação mútua e compartilhamento fraternal. Descreve o vínculo sagrado de amor, união e partilha que une os membros do Corpo de Cristo entre si e com a Santíssima Trindade.",
    references: "Atos 2:42; 1 João 1:3, 7; Filipenses 2:1"
  },
  {
    term: "Metanoia",
    origin: "Grego: Μετάνοια (Metánoia)",
    definition: "Mudança radical de mente, perspectiva e rumo de vida. Não é mero remorso emocional temporário, mas uma transformação profunda de valores que conduz ao abandono do pecado e retorno a Deus.",
    references: "Mateus 4:17; Atos 3:19; 2 Coríntios 7:10"
  },
  {
    term: "Ágape",
    origin: "Grego: Ἀγάπη (Agápē)",
    definition: "O mais nobre amor divino: incondicional, sacrificial, voluntário e altruísta. É o amor demonstrado por Deus ao entregar o Seu Filho Unigênito pela salvação do mundo.",
    references: "João 3:16; 1 Coríntios 13:4-8; 1 João 4:8"
  },
  {
    term: "Aliança",
    origin: "Hebraico: בְּרִית (Berith) / Grego: Διαθήκη (Diathēkē)",
    definition: "Pacto solene e sagrado estabelecido por Deus com a humanidade, selado por juramento e sangue, contendo promessas graciosas, bênçãos e mandamentos. Tem seu ápice na Nova Aliança em Cristo.",
    references: "Gênesis 15:18; Jeremias 31:31-34; Lucas 22:20"
  },
  {
    term: "Escatologia",
    origin: "Grego: Ἔσχατος (Éschatos) + Λόγος (Lógos)",
    definition: "O ramo da teologia que estuda as 'últimas coisas': a consumação da história humana, o arrebatamento da Igreja, a volta visível de Cristo, a ressurreição dos mortos, o Juízo Final e o estabelecimento do Novo Céu e Nova Terra.",
    references: "1 Tessalonicenses 4:13-18; Apocalipse 21:1-8; Daniel 12:2"
  },
  {
    term: "Exegese",
    origin: "Grego: Ἐξήγησις (Exēgēsis)",
    definition: "A prática crítica e histórica de 'extrair o significado' original de um texto bíblico à luz do seu contexto histórico, cultural, literário e gramatical, respeitando a intenção primordial do autor sagrado.",
    references: "2 Timóteo 2:15; Neemias 8:8"
  },
  {
    term: "Hermenêutica",
    origin: "Grego: Ἑρμηνευτική (Hermēneutikē)",
    definition: "A ciência e a arte da interpretação de textos. Na teologia bíblica, compreende os princípios e métodos para entender e aplicar com precisão e fidelidade as Escrituras na atualidade.",
    references: "Lucas 24:27; 2 Pedro 1:20-21"
  },
  {
    term: "Teofania",
    origin: "Grego: Θεοφάνεια (Theopháneia)",
    definition: "Manifestação visível e temporária de Deus aos seres humanos antes da encarnação de Cristo, como na sarça ardente a Moisés, na coluna de nuvem e fogo, ou através do Anjo do Senhor.",
    references: "Êxodo 3:2-6; Gênesis 18:1-2; Juízes 6:11-24"
  },
  {
    term: "Kenosis",
    origin: "Grego: Κένωσις (Kénōsis)",
    definition: "O ato voluntário pelo qual o Filho eterno de Deus 'esvaziou-se a Si mesmo' de Seus privilégios e glória celestial exterior ao assumir a natureza humana na Encarnação, sem jamais perder Sua divindade essencial.",
    references: "Filipenses 2:5-8"
  },
  {
    term: "Regeneração",
    origin: "Grego: Παλιγγενεσία (Palingenesía)",
    definition: "A obra sobrenatural instantânea do Espírito Santo que concede nova vida espiritual e uma nova natureza ao pecador que crê ('o novo nascimento').",
    references: "João 3:3-5; Tito 3:5; 2 Coríntios 5:17"
  }
];
