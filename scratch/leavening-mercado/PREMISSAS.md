# OrientoHub — mercado para apresentação à Leavening

Data: 04/11/2026. Estimativa exploratória em reais nominais. Não é valuation, previsão financeira ou tração comprovada.

## Escopo e unidade

O ecossistema reúne plataforma de desenvolvimento de negócios, serviços de estratégia/marketing/tecnologia, educação e produtos próprios (Intentia, Humansys e SimplesMetrics em diferentes estágios). A mesma empresa pode comprar várias ofertas. Por isso, os mercados dessas frentes não foram somados.

O dimensionamento usa uma conta pagante por pequeno negócio e o plano Pro de R$ 97/mês, encontrado em src/pages/PricingPage.tsx. Assume cobrança mensal cheia, sem descontos anuais, impostos ou churn. O plano anual publicado de R$ 970 reduziria o TAM equivalente para R$ 23,28 bilhões, o SAM para R$ 232,8 milhões e o ARR de 300 contas para R$ 291 mil se todas adotassem essa modalidade.

## Cálculo reproduzível

| Indicador | Fórmula | Resultado | Natureza |
|---|---|---:|---|
| TAM amplo da plataforma | 24.000.000 × 97 × 12 | R$ 27.936.000.000/ano | Teto teórico, não mercado validado |
| SAM ilustrativo | 24.000.000 × 1% × 97 × 12 | R$ 279.360.000/ano | Filtro arbitrado, ainda a pesquisar |
| SOM plataforma no mês 36 | 300 contas ativas × 97 × 12 | R$ 349.200 de ARR | Meta operacional condicionada |
| Serviços na saída do mês 36 | 12 contratos ativos × 2.497 × 12 | R$ 359.568 anualizados | Meta, ticket do plano Marketing Growth no catálogo |
| Cenário híbrido anualizado | 349.200 + 359.568 | R$ 708.768/ano | ARR SaaS + serviços anualizados, sem projetos avulsos |

Não chamar o total híbrido de ARR SaaS. Não comparar seu percentual diretamente ao TAM exclusivo da plataforma. Serviços podem ser vendidos às mesmas 300 contas, sem duplicar quantidade de clientes. Verba de anúncios, faturamento de clientes e receitas dos parceiros não entram na receita OrientoHub.

## Construção do SOM e cenários

Horizonte: 36 meses contados do início da execução comercial. Os números são o ritmo anualizado ao final do período, não a soma de receitas dos três anos. Ponto de partida zero é premissa, pois não foi fornecida uma base atual de pagantes verificável.

| Cenário | Contas SaaS ativas | ARR SaaS | Contratos de serviços | Serviços anualizados | Total anualizado |
|---|---:|---:|---:|---:|---:|
| Enxuto | 100 | R$ 116.400 | 4 | R$ 119.856 | R$ 236.256 |
| Referência | 300 | R$ 349.200 | 12 | R$ 359.568 | R$ 708.768 |
| Expansão | 600 | R$ 698.400 | 20 | R$ 599.280 | R$ 1.297.680 |

A meta de referência exige 8,33 contas líquidas adicionais por mês em média. Com churn mensal hipotético de 3% e aquisição bruta mensal constante desde o mês 1, são necessárias aproximadamente 13,5 novas contas/mês para chegar a 300 no mês 36 (N = aquisição × [1 − 0,97^36] / 0,03). Com conversão hipotética de 5% de oportunidades qualificadas em pagantes, isso pede cerca de 270 oportunidades qualificadas/mês. Ambos os percentuais são hipóteses, não benchmarks ou métricas atuais.

Doze contratos de marketing exigem uma equipe ou rede de execução. A 10–20 horas por contrato/mês (hipótese), isso significa 120–240 horas mensais só em entregas, além de comercial, gestão e produto. A meta depende de capacidade, margem, retenção e canais; não é justificável como capacidade atual de um fundador sozinho.

## Como interpretar TAM e SAM

Os 24 milhões são uma base ampla de pequenos negócios, incluindo negócios que podem não ter interesse, capacidade de pagamento ou necessidade da plataforma. Logo, R$ 27,94 bilhões é um teto teórico de receita ao preço de entrada, não gasto observado no setor. Não afirmar que todos são clientes elegíveis.

O SAM de 1% é apenas uma simulação. Antes de apresentá-lo como mercado atendível comprovado, definir CNAEs, porte, região, maturidade e caso de uso; remover duplicação de estabelecimentos/filiais; pesquisar intenção e capacidade de compra e levantar contagem do ICP. Sensibilidade: filtro de 0,5% = 120 mil contas / R$ 139,68 milhões; 2% = 480 mil contas / R$ 558,72 milhões. Essa variação não constitui intervalo estatístico.

Instituições, aceleradoras e universidades podem ser um canal ou segmento B2B futuro. Não há preço de licença nem base institucional qualificada suficientes para monetizar esse mercado aqui. O site da Leavening informa possuir plataforma própria: a integração deve começar por um piloto complementar, evitando presumir que substituirá a ferramenta deles.

Produtos próprios, cursos, licenças institucionais, projetos avulsos e comissões representam expansão possível. Foram excluídos da conta financeira até terem público, preço e adesão verificáveis. Esse tratamento contempla a arquitetura completa sem inflar o dimensionamento por soma de públicos sobrepostos.

## Fontes

- Sebrae / ASN, “Pequenos negócios somam 24 milhões de empresas ativas”, publicado em 26/06/2026, atualizado em 06/07/2026: https://agenciasebrae.com.br/dados/pequenos-negocios-somam-24-milhoes-de-empresas-ativas/
- Leavening, posicionamento, foco SaaS B2B e plataforma própria, consultado em 04/11/2026: https://leavening.com/
- Preço Pro: src/pages/PricingPage.tsx (R$ 97 mensal / R$ 970 anual).
- Preço Marketing Growth: src/data/serviceCatalog.ts (R$ 2.497/mês).
- Escopo e estágio: orientohub_pitch_deck_html.html e documentacao-privada/PANORAMA_ECOSISTEMA_CTO.md. A documentação técnica tem data anterior; não foi feita auditoria operacional nesta tarefa.

## Arte

Slide 1920 × 1080, 16:9, preto #0A0A0A, amarelo #F5D90A, azul #60C8FF e logotipo original embutido. HTML autocontido e editável; PNG para inserir em apresentações; PDF para compartilhar. Criativo construído em HTML/CSS para manter texto e cálculos precisos.
