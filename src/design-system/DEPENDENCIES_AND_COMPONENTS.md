# Dependências e Componentes

Este documento fornece uma visão geral das bibliotecas, dependências e componentes reutilizáveis utilizados no projeto Ecossistema OrientoHub.

## 📦 Dependências Principais

### Core & Framework
- **React** (`^18.3.1`): Biblioteca principal para construção da interface.
- **Vite** (`^5.4.2`): Build tool e servidor de desenvolvimento rápido.
- **TypeScript** (`^5.5.3`): Superset tipado de JavaScript para maior segurança e manutenibilidade.

### Estilização e UI
- **Tailwind CSS** (`^3.4.1`): Framework CSS utilitário para estilização rápida.
- **Framer Motion** (`^11.0.8`): Biblioteca para animações complexas e gestos.
- **Headless UI** (`^1.7.18`): Componentes de UI acessíveis e sem estilo (usado para lógica de componentes).
- **Lucide React** (`^0.344.0`): Biblioteca de ícones consistente e leve.
- **Recharts** (`^3.3.0`): Biblioteca para criação de gráficos e visualização de dados.

### Gerenciamento de Estado e Dados
- **Zustand** (`^4.5.1`): Gerenciamento de estado global leve e flexível.
- **Supabase JS** (`^2.39.7`): Cliente para interação com o backend Supabase (Auth, DB, Storage).
- **React Router DOM** (`^6.22.2`): Roteamento declarativo para aplicações React.

### Utilitários e Funcionalidades
- **date-fns** (`^4.1.0`): Manipulação moderna de datas.
- **i18next** & **react-i18next**: Internacionalização (i18n).
- **Stripe** (`@stripe/react-stripe-js`): Integração de pagamentos.
- **html2canvas** & **jspdf**: Geração de PDFs e captura de tela.

---

## 🧩 Biblioteca de Componentes (`src/components`)

### UI Base (`src/components/ui`)
Componentes atômicos e moleculares reutilizáveis em toda a aplicação.

| Componente | Descrição |
|------------|-----------|
| **Badge** | Etiquetas para status ou categorias. |
| **Button** | Botões padrão com variantes (primary, secondary, outline). |
| **Card** | Container padrão para conteúdo agrupado. |
| **GlowBorder** | Efeito visual de borda brilhante para destaque. |
| **Progress** | Barras de progresso para feedback visual. |
| **Separator** | Divisores visuais para organizar conteúdo. |
| **SimpleTooltip** | Dicas de ferramenta simples ao passar o mouse. |
| **VideoShowcase** | Componente para exibição de vídeos em destaque. |

### Componentes de Funcionalidade

#### Pagamentos
- **CheckoutForm**: Formulário para processamento de pagamentos via Stripe.

#### Interatividade
- **InteractiveCard**: Cartões com comportamentos avançados de interação.

### Módulos (`src/components/*`)

- **auth/**: Componentes relacionados à autenticação (Login, Registro, Proteção de Rotas).
- **founder/**: Componentes específicos para a jornada do fundador.
- **layout/**: Estruturas de página (Header, Sidebar, Footer).
- **modals/**: Janelas modais para diálogos e ações secundárias.
- **projects/**: Componentes para listagem e gerenciamento de projetos.

## 📚 Como Adicionar Novas Dependências

1.  Avalie a necessidade: A funcionalidade pode ser implementada com o que já existe?
2.  Verifique o tamanho: Use ferramentas como `bundlephobia` para checar o impacto no bundle.
3.  Instale via npm: `npm install nome-do-pacote`.
4.  Documente aqui: Adicione a nova dependência nesta lista com uma breve descrição.
