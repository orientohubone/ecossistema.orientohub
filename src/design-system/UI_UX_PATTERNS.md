# Padrões de UI/UX

Padrões de interação comuns e estruturas de interface usados no Ecossistema OrientoHub.

## 🗂 Navegação
- **Barra Superior (Top Bar)**: Contém Logo, Links Principais de Navegação e Perfil do Usuário/Configurações.
    - *Comportamento*: Fixa na rolagem (opcional), responsiva (menu hambúrguer no celular).
- **Barra Lateral (Sidebar)** (Dashboard): Acesso rápido aos módulos principais (Projetos, Aprendizado, Configurações).

## 📄 Layouts de Página
- **Landing/Marketing**: Largura total, seção hero, grades de recursos (Cards), rodapé com CTA.
- **Dashboard**: Barra Lateral + Área de Conteúdo. A área de conteúdo geralmente tem um Cabeçalho (Título + Ações) e uma Grade/Lista de itens.
- **Conteúdo/Artigo**: Coluna centralizada (`max-w-3xl`) para legibilidade, tipografia distinta para títulos.

## 🃏 Cartões (Cards) e Listas
- **Visualização em Grade**: Use para navegar por itens (ex: "Meus Projetos").
    - *Responsivo*: 1 col (celular) -> 2 cols (tablet) -> 3 cols (desktop).
- **Visualização em Lista**: Use para dados densos ou logs.
- **Ações do Cartão**: Ação primária clica em todo o cartão (ou título). Ações secundárias (Editar, Excluir) são ícones no canto.

## 📝 Formulários
- **Rótulos (Labels)**: Sempre visíveis acima do input.
- **Validação**: Inline, em tempo real onde possível.
- **Botões**:
    - Primário: "Salvar", "Criar", "Atualizar".
    - Secundário/Ghost: "Cancelar".
    - Posição: Canto inferior direito do formulário ou modal.

## 🔔 Feedback e Notificações
- **Toasts**: Popups temporários (canto superior direito ou inferior direito) para mensagens de sucesso/erro.
- **Modals**: Para interrupções críticas ou subtarefas complexas (ex: "Editar Perfil").
    - *Overlay*: Fundo escurecido para focar a atenção.

## 🖼 Estados Vazios (Empty States)
- Quando uma lista está vazia (ex: "Nenhum Projeto Ainda"), mostre:
    1.  Uma ilustração ou ícone amigável.
    2.  Uma mensagem clara ("Você ainda não criou nenhum projeto").
    3.  Um botão primário para corrigir isso ("Criar Projeto").
