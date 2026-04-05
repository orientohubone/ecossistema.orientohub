# Scroll UI Flicker Lesson

## Contexto

Durante o ajuste do botão `Voltar ao topo` da landing page, surgiu um problema de flicker visual:

- o botão piscava ao entrar no `footer`
- piscava novamente ao sair do `footer`
- o efeito piorava quando a lógica dependia de `setState` em eventos de `scroll`

## Causa Raiz

O problema não estava só na animação.

O ponto principal era este:

- o evento de `scroll` disparava atualizações frequentes de estado React
- essas atualizações causavam re-render do componente
- o botão montava, atualizava ou recalculava animação em momentos muito próximos
- isso gerava a sensação de piscar, mesmo com `fade`

Em resumo:

`scroll + setState frequente + componente animado = alto risco de flicker`

## O Que Não Funcionou Bem

As abordagens abaixo reduziram parcialmente o problema, mas não resolveram na raiz:

- trocar apenas a animação de entrada/saída
- usar `AnimatePresence` para montar/desmontar
- ajustar thresholds de scroll
- usar lógica baseada apenas em direção do scroll
- usar `IntersectionObserver` sem remover a dependência de re-render

Essas abordagens ajudam no acabamento, mas não resolvem quando o gargalo principal é o ciclo de renderização.

## Solução Que Resolveu

A solução estável foi:

- remover o `useState` de visibilidade do botão
- isolar o botão em um bloco próprio
- usar `refs` para armazenar estado operacional
- manipular classes/estilos do botão diretamente no DOM
- manter a transição visual via CSS (`opacity`, `translate`, `scale`)
- evitar re-render do `Footer` a cada scroll

## Padrão Recomendado

Para elementos de UI sensíveis a scroll, como:

- `back to top`
- CTA flutuante
- barras contextuais
- indicadores de leitura

preferir este padrão:

1. O `scroll` atualiza somente `refs` ou atributos/classe no DOM.
2. O componente React não deve depender de `setState` contínuo.
3. A animação deve ser feita por CSS ou transição leve.
4. O React deve montar a estrutura uma vez e não reprocessar o componente a cada evento.

## Quando Usar `setState`

`setState` ainda pode ser usado quando:

- a mudança é rara
- não depende de evento contínuo
- não há impacto visual perceptível

Evitar `setState` em:

- `scroll`
- `mousemove`
- `resize` de alta frequência
- tracking de posição em tempo real

## Implementação Aplicada no Projeto

No caso do `Footer`:

- o botão foi mantido fora do fluxo de render reativo do scroll
- a visibilidade passou a ser controlada por `refs`
- o fade continua existindo, mas sem remontagem constante
- o flicker foi eliminado na raiz

## Regra Prática Para o Time

Se um elemento visual controlado por scroll estiver piscando:

- não começar ajustando só a animação
- verificar primeiro se o scroll está forçando re-render
- se estiver, migrar o controle para `refs` + classe/estilo

## Resumo

Aprendizado principal:

> Em UI guiada por scroll, estabilidade visual costuma depender mais de evitar re-render do que de melhorar a animação.
