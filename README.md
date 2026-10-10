# 🏛️ Bíblia Online ACF — Bp. Emanuel

Uma plataforma web moderna, sofisticada e imersiva inspirada na **lógica e arquitetura do Bíblia Online (`bibliaonline.com.br/acf`)**, com todos os **66 livros e 1.189 capítulos da Bíblia Sagrada na versão ACF (Almeida Corrigida Fiel)** e comparador com a NVI, estudos teológicos, áudio sincronizado e busca instantânea.

---

## ✨ Lógica e Funcionalidades Inspiradas no Bíblia Online (`/acf`)

### 📖 1. Leitor Bíblico com Navegação em 3 Níveis
- **Roteamento por Hash Amigável**:
  - `#/acf` — Página Inicial com busca e versículo do dia
  - `#/acf/gn/1` — Gênesis 1 (ACF)
  - `#/acf/sl/23` — Salmos 23 (ACF)
  - `#/acf/jo/3:16` — João 3 com rolagem suave e destaque luminoso no versículo 16
  - `#/nvi/rm/8` — Romanos 8 na versão NVI
- **Toolbar Superior Sticky**:
  - `[ Livro ▼ ]` — Abre modal com abas de Antigo Testamento (39) e Novo Testamento (27) com filtro de busca em tempo real.
  - `[ Capítulo ▼ ]` — Abre grade numérica com todos os capítulos do livro (1 toque).
  - `[ Versão ACF ▼ ]` — Alterna instantaneamente entre ACF (Almeida Corrigida Fiel) e NVI.
  - `◀ Anterior` e `Próximo ▶` com suporte a setas do teclado.
  - `🔊 Ouvir Capítulo` — Ativa o player dock de áudio.
  - `Aa Opções de Leitura` — Painel com modo de exibição, tamanho da fonte, fonte serifada/sem serifa e temas.

### 📑 2. Modos de Leitura Versáteis
- **Versículo por Versículo**: Formato de estudo detalhado com número do versículo destacado à esquerda e perícopes temáticas.
- **Texto Corrido**: Parágrafos contínuos bíblicos com recuo elegante e números sobrescritos sutis para leitura fluida.
- **Perícopes Integradas**: Títulos temáticos de seção clássicos inseridos nos momentos chaves dos capítulos.

### 🎯 3. Seleção Múltipla e Barra de Ações Flutuante (Action Dock)
- Clique para selecionar 1 ou múltiplos versículos.
- Ao selecionar, abre a barra inferior flutuante com:
  - **Identificador de seleção**: Ex: `Gênesis 1:1-3 (ACF)`
  - **Marcador Colorido**: Amarelo, Verde, Azul, Rosa, Laranja e Limpar (persistido no `localStorage`).
  - **📋 Copiar**: Copia versículos com referência bíblica formatada.
  - **📝 Anotar**: Adiciona notas pessoais de estudo exegético.
  - **⭐ Favoritar**: Salva na lista de favoritos.
  - **🖼️ Gerar Cartão**: Cria cartões visuais para WhatsApp e redes sociais.
  - **🔄 Comparar Versões**: Abre modal com os versículos em ACF e NVI lado a lado.

### 🔊 4. Áudio Dock Sincronizado (Karaokê Bíblico)
- Narração em voz natural em português brasileiro (Web Speech API).
- Dock flutuante na base com Play, Pause, Stop, barra de progresso visual e seletor de velocidade (1.0x, 1.25x, 1.5x).
- **Sincronização em tempo real**: O versículo narrado no momento recebe um destaque luminoso e a tela faz auto-scroll para mantê-lo visível!

### 🔍 5. Busca Inteligente em Toda a Bíblia
- **Auto-complete no Hero**:
  - Digite referências diretas (ex: `jo 3:16`, `sl 23`, `gn 1`) para sugestão e pulo imediato.
  - Digite palavras (ex: `amor`, `graça`, `fé`) para pré-visualização e contagem de ocorrências.
- **View de Pesquisa Global**:
  - Busca instantânea nos 31.102 versículos da ACF.
  - Filtros por Toda a Bíblia, Antigo Testamento e Novo Testamento.
  - Destaque dos termos encontrados com `<mark>`.

### 📚 6. Recursos Teológicos Adicionais do Bispo Emanuel
- **Portal de Estudos Bíblicos**: Artigos por categorias (Teologia Sistemática, Vida Cristã, Oração, Parábolas, Escatologia).
- **Planos de Leitura**: Novo Testamento em 90 Dias com checklist de progresso.
- **Dicionário Teológico**: Termos essenciais com raízes em Hebraico e Grego.
- **Ambiente Sonoro Sacro**: Sintetizador procedimental suave (Web Audio API) para oração e meditação.

---

## 🚀 Como Executar

Como o projeto é construído em padrões web modernos e 100% offline (**HTML5 + CSS3 + Vanilla JavaScript ES6**):
1. Basta abrir o arquivo `index.html` com dois cliques em qualquer navegador (Google Chrome, Microsoft Edge, Firefox, Safari) ou servir com qualquer servidor HTTP estático.
2. Funciona diretamente em `file:///` sem necessidade de servidores ou instalação prévia.
3. Compatível com hospedagem estática gratuita no **GitHub Pages**, **Vercel** ou **Netlify**.

---

## 📁 Estrutura de Arquivos

```text
c:\projeto-git\Bp-Emanuel\
├── index.html              # Aplicação Bíblia Online ACF (SPA)
├── README.md               # Documentação
├── data/
│   ├── pt_acf.json         # Texto completo em JSON da Bíblia ACF
│   └── pt_nvi.json         # Texto completo em JSON da Bíblia NVI
├── css/
│   ├── style.css           # Estilos base e temas gerais
│   ├── themes.css          # Paletas (Nobre Escuro, Sépia, Claro)
│   ├── bible-online.css    # Toolbar, docks flutuantes, perícopes e modos de leitura
│   └── responsive.css      # Otimizações para smartphones e tablets
├── js/
│   ├── bible-acf.js        # Dataset 100% offline da Bíblia ACF completa
│   ├── bible-nvi.js        # Dataset 100% offline da Bíblia NVI completa
│   ├── bible-service.js    # Serviço de busca, capítulos e referências
│   ├── bible-reader.js     # Motor do leitor, seleção múltipla e áudio dock
│   ├── bible-search.js     # Mecanismo de busca e auto-complete do Hero
│   ├── audio-player.js     # Síntese de voz TTS e sintetizador ambiente
│   ├── studies-data.js     # Artigos e estudos teológicos
│   ├── reading-plans.js    # Planos de leitura e progresso
│   ├── dictionary-data.js  # Léxico e dicionário teológico
│   └── app.js              # Roteador de hash e gerenciador de modais
└── assets/
    ├── emblem.jpg          # Brasão / Logo oficial
    └── hero-bible.jpg      # Arte sacra para cartões e heros
```
