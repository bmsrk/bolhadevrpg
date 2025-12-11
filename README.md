<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BolhaDev: Threads & Bugs RPG

Uma sátira sobre a vida de dev no Brasil: sobreviva a bugs, debates de ego e frameworks JS enquanto tenta fazer o deploy antes de sexta-feira.

## 🎮 Jogar Online

Acesse a versão mais recente: [https://bmsrk.github.io/bolhadevrpg/](https://bmsrk.github.io/bolhadevrpg/)

## 🚀 Desenvolvimento Local

**Pré-requisitos:** Node.js 18+

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/bmsrk/bolhadevrpg.git
   cd bolhadevrpg
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute em modo desenvolvimento:**
   ```bash
   npm run dev
   ```
   
   O jogo estará disponível em: http://localhost:3000

4. **Build para produção:**
   ```bash
   npm run build
   ```
   
   Os arquivos otimizados serão gerados na pasta `dist/`

## 📦 Deploy

O projeto está configurado com GitHub Actions para deploy automático no GitHub Pages:

- **Deploy automático:** Push na branch `main` faz deploy automático
- **Deploy manual:** Acesse Actions → Deploy to GitHub Pages → Run workflow

## 🛠️ Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido
- **Tailwind CSS** - Estilização (via CDN)
- **Lucide React** - Ícones

## 📝 Estrutura do Projeto

```
.
├── App.tsx              # Componente principal e lógica do jogo
├── index.tsx            # Ponto de entrada
├── components/          # Componentes UI reutilizáveis
│   └── TerminalUI.tsx   # Interface tipo terminal
├── types.ts             # Definições de tipos TypeScript
├── constants.ts         # Dados do jogo (personagens, inimigos, locais)
├── utils/              
│   └── dice.ts          # Sistema de dados e combate
└── .github/workflows/   # CI/CD para GitHub Pages

```

## 🎯 Funcionalidades

- ✅ Sistema de combate baseado em dados
- ✅ 4 arquétipos jogáveis únicos
- ✅ Múltiplos locais para explorar
- ✅ Sistema de inventário
- ✅ Interface estilo terminal retrô com efeitos CRT
- ✅ Totalmente responsivo
- ✅ Deploy automatizado no GitHub Pages

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.
