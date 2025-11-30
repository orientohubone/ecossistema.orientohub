# Heurísticas de Nielsen para Design de Interface

Aplicação dos 10 princípios gerais de Jakob Nielsen para design de interação no Ecossistema OrientoHub.

## 1. Visibilidade do Status do Sistema
**Princípio**: O design deve sempre manter os usuários informados sobre o que está acontecendo, através de feedback apropriado dentro de um tempo razoável.
- **Aplicação**:
    - Mostrar estados de carregamento (spinners, skeletons) ao buscar dados.
    - Fornecer toasts de sucesso/erro após envios de formulário (ex: Atualização de Perfil).
    - Destacar a etapa ativa na "Jornada" ou navegação.

## 2. Correspondência entre o Sistema e o Mundo Real
**Princípio**: O design deve falar a linguagem dos usuários. Use palavras, frases e conceitos familiares ao usuário, em vez de jargão interno.
- **Aplicação**:
    - Usar termos como "Founder", "Investidor", "Ecossistema" em vez de "UserType1", "Admin".
    - Usar ícones que representam objetos do mundo real (ex: uma engrenagem para Configurações).

## 3. Controle e Liberdade do Usuário
**Princípio**: Os usuários frequentemente realizam ações por engano. Eles precisam de uma "saída de emergência" claramente marcada para deixar a ação indesejada sem ter que passar por um processo extenso.
- **Aplicação**:
    - Garantir que todos os modais tenham um botão "Fechar" (X) claro e suportem "Clicar fora para fechar".
    - Permitir que os usuários voltem ("Voltar") em formulários de várias etapas.

## 4. Consistência e Padrões
**Princípio**: Os usuários não devem ter que se perguntar se palavras, situações ou ações diferentes significam a mesma coisa. Siga as convenções da plataforma e da indústria.
- **Aplicação**:
    - Usar o **Guia de Estilo** estritamente. Botões primários devem sempre ter a mesma aparência.
    - A navegação deve permanecer consistente em todas as páginas.
    - Ícones devem ser da mesma família (Lucide React).

## 5. Prevenção de Erros
**Princípio**: Boas mensagens de erro são importantes, mas os melhores designs previnem cuidadosamente que problemas ocorram em primeiro lugar.
- **Aplicação**:
    - Validar formulários em tempo real (ex: formato de e-mail).
    - Desativar botões de "Enviar" até que o formulário seja válido.
    - Usar diálogos de confirmação para ações destrutivas (ex: "Excluir Projeto").

## 6. Reconhecimento em vez de Memorização
**Princípio**: Minimize a carga de memória do usuário tornando elementos, ações e opções visíveis. O usuário não deve ter que lembrar informações de uma parte da interface para outra.
- **Aplicação**:
    - Manter a navegação visível ou facilmente acessível.
    - Mostrar "Vistos Recentemente" ou contexto onde necessário.
    - Usar texto de placeholder em inputs para dar dicas do formato esperado.

## 7. Flexibilidade e Eficiência de Uso
**Princípio**: Atalhos — ocultos para usuários novatos — podem acelerar a interação para o usuário experiente, de modo que o design possa atender tanto a usuários inexperientes quanto experientes.
- **Aplicação**:
    - Habilitar navegação por teclado (Tab, Enter, Esc).
    - Fornecer "Ações Rápidas" no dashboard para tarefas frequentes.

## 8. Estética e Design Minimalista
**Princípio**: As interfaces não devem conter informações irrelevantes ou raramente necessárias. Cada unidade extra de informação em uma interface compete com as unidades relevantes de informação e diminui sua visibilidade relativa.
- **Aplicação**:
    - **"Premium e Profissional"**: Evite desordem. Use espaço em branco de forma eficaz.
    - Foco no conteúdo (Material educacional, Detalhes do projeto).
    - Remova bordas ou decorações desnecessárias que não agregam valor.

## 9. Ajude os Usuários a Reconhecer, Diagnosticar e Recuperar de Erros
**Princípio**: As mensagens de erro devem ser expressas em linguagem simples (sem códigos de erro), indicar precisamente o problema e sugerir uma solução.
- **Aplicação**:
    - Em vez de "Erro 400", diga "Não conseguimos salvar seu perfil. Por favor, verifique sua conexão com a internet ou tente novamente."
    - Destaque o campo específico que causou o erro em vermelho.

## 10. Ajuda e Documentação
**Princípio**: É melhor se o sistema não precisar de nenhuma explicação adicional. No entanto, pode ser necessário fornecer documentação para ajudar os usuários a entender como completar suas tarefas.
- **Aplicação**:
    - Fornecer tooltips para termos complexos.
    - Incluir um link de "Ajuda" ou "Suporte" no rodapé.
    - Ajuda contextual na seção "Framework".
