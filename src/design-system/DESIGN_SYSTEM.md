# Design System

O Design System do OrientoHub é uma coleção de componentes reutilizáveis, guiados por padrões claros, que podem ser montados juntos para construir as aplicações do ecossistema.

## 🏗 Princípios Fundamentais

1.  **Premium e Profissional**: O design deve parecer de alto nível, usando a paleta Dourado/Preto para transmitir valor e autoridade.
2.  **Clareza e Foco**: O conteúdo é rei. Use espaço em branco e tipografia clara para guiar o usuário.
3.  **Consistência**: Reutilize componentes e tokens para garantir uma experiência unificada em toda a plataforma.
4.  **Acessibilidade**: Garanta contraste suficiente e estrutura HTML semântica.

## 🧩 Biblioteca de Componentes

### Botões
- **Primário**: `.btn-primary` (Fundo dourado, texto preto). Use para a chamada principal para ação em uma página.
- **Secundário**: `.btn-secondary` (Fundo escuro, texto branco). Use para ações alternativas.
- **Outline**: `.btn-outline` (Com borda, transparente). Use para ações de baixa prioridade (ex: "Cancelar").

### Cartões (Cards)
- **Card Padrão**: `.card` (Fundo Branco/Escuro, arredondado, sombra).
- **Card Animado**: `.animated-card` (Inclui uma animação de borda fluida). Use para destaques de recursos ou conteúdo premium.

### Conteúdo de Framework
Temos um sistema de estilização especializado para conteúdo educacional/framework (`.framework-content-enhanced`):
- **Títulos**: Estilizados com bordas e espaçamento específico.
- **Listas**: Marcadores personalizados (`◉`) e listas numeradas com estilo de fundo.
- **Código**: Estilização de código inline com cores primárias.

## 🌑 Modo Escuro (Dark Mode)
O sistema é construído "Dark Mode First" ou totalmente compatível.
- Use variantes `dark:` para todas as definições de cor.
- O texto deve ser `text-gray-900` (claro) / `text-gray-100` (escuro) por padrão.

## 🔄 Fluxo de Trabalho
1.  **Design**: Defina os requisitos e o fluxo da UI.
2.  **Desenvolver**: Construa usando componentes existentes de `src/components`.
3.  **Refinar**: Verifique contra o Guia de Estilo e Heurísticas.
