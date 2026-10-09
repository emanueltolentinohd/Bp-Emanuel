# 🏛️ Bp. Emanuel — Portal de Estudos Bíblicos & Bíblia Sagrada

Uma plataforma web moderna, sofisticada e imersiva para o estudo aprofundado das Sagradas Escrituras, teologia sistemática, planos devocionais e reflexões ministeriais do Bispo Emanuel.

---

## ✨ Principais Funcionalidades

### 📖 1. Leitor Bíblico Avançado
- **Todos os 66 Livros da Bíblia**: Antigo e Novo Testamento com navegação rápida por livro, capítulo e versículo.
- **Marcação Colorida (Marca-Texto)**: Destaque versículos em Amarelo, Verde, Azul ou Rosa com persistência local (`localStorage`).
- **Anotações Pessoais**: Registre comentários, revelações e notas exegéticas para cada versículo.
- **Favoritos**: Salve seus versículos prediletos para consulta rápida.
- **Narração em Áudio (Voz em Português)**: Text-to-Speech integrado para ouvir o capítulo completo ou versículos selecionados.
- **Ajuste de Tipografia**: Controle de tamanho de fonte (A- / A+) para leitura confortável.
- **Gerador de Cartão Visual**: Compartilhe versículos formatados em belos cartões para redes sociais e WhatsApp.

### 📜 2. Portal de Estudos Bíblicos & Teologia
- Artigos profundos organizados por categorias teológicas:
  - *Teologia Sistemática* (A Graça Soberana e a Justificação pela Fé)
  - *Vida Cristã & Discipulado* (A Armadura de Deus e Guerra Espiritual)
  - *Oração & Jejum* (O Segredo da Oração Eficaz no Quarto Secreto)
  - *Parábolas & Evangelhos* (O Sermão da Montanha e o Manifesto do Reino)
  - *Escatologia & Profecia* (A Bendita Esperança e o Retorno de Cristo)
  - *Liderança Pastoral* (O Modelo Bíblico de Servo e Cuidado do Rebanho)
- **Referências Bíblicas Interativas**: Clique em passagens como `[Rm 5:1]` ou `[Jo 3:16]` dentro dos textos para visualizar o versículo imediatamente em um popup.
- **Pontos de Oração**: Cada estudo conta com aplicações práticas e tópicos de oração.
- **Publicador de Novos Estudos**: Formulário intuitivo para cadastrar novos artigos teológicos e pregações.

### 🎨 3. Multitema Dinâmico Elegante
- **Nobre Escuro (Imperial)**: Fundo escuro com detalhes dourados para estudo noturno solene.
- **Papel Sépia Bíblico**: Tons quentes de pergaminho para leitura prolongada e descanso visual.
- **Claro Minimalista**: Estética límpida e moderna para leitura diurna de alta legibilidade.

### 📅 4. Planos de Leitura da Palavra
- **Novo Testamento em 90 Dias** com checklist interativo e cálculo de progresso percentual.
- **Salmos & Provérbios Diários** para louvor matinal e sabedoria prática.
- Acesso direto com um clique do dia do plano para o capítulo na Bíblia.

### 📚 5. Dicionário & Léxico Teológico
- Termos essenciais com etimologia em Hebraico e Grego (Graça, Justificação, Propiciação, Redenção, Paráclito, Koinonia, Metanoia, Ágape, etc.).
- Filtro alfabético de A a Z e busca instantânea.

### 🕊️ 6. Ambiente Sonoro Sacro
- Sintetizador procedimental suave (Web Audio API) com acordes quentes para oração e foco durante a meditação nas Escrituras.

---

## 🚀 Como Executar o Projeto

Como o projeto é construído em padrões web puros (**HTML5 + CSS3 + Vanilla JavaScript ES6**):
1. Basta abrir o arquivo `index.html` em qualquer navegador moderno (Google Chrome, Microsoft Edge, Firefox, Safari).
2. Não requer instalação de dependências ou servidores complexos.
3. Compatível com hospedagem estática gratuita no **GitHub Pages**, **Vercel** ou **Netlify**.

---

## 📁 Estrutura de Arquivos

```text
c:\projeto-git\Bp-Emanuel\
├── index.html              # Aplicação principal (SPA)
├── README.md               # Documentação do projeto
├── assets/
│   ├── emblem.jpg          # Brasão / Logo oficial dourado
│   └── hero-bible.jpg      # Imagem artística sacra de abertura
├── css/
│   ├── style.css           # Estilos principais, componentes e tipografia
│   ├── themes.css          # Paletas dos 3 temas (Escuro, Sépia, Claro)
│   └── responsive.css      # Otimizações para celulares e tablets
└── js/
    ├── app.js              # Roteador SPA, controle de temas e modais
    ├── bible-data.js       # Índice dos 66 livros e versículos offline
    ├── bible-reader.js     # Motor do leitor, marca-texto, notas e áudio
    ├── studies-data.js     # Estudos teológicos e gestor de artigos
    ├── reading-plans.js    # Planos devocionais e progresso
    ├── dictionary-data.js  # Léxico e dicionário teológico
    └── audio-player.js     # Sintetizador ambiente e narração por voz (TTS)
```
