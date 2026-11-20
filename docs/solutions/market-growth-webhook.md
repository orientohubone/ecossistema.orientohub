# Integração Market & Growth

Cada solução pode enviar um snapshot de indicadores para a OrientoHub por webhook. O webhook atualiza os valores exibidos na aba **Market & Growth**: audiência ativa, MRR e valuation.

## Configurar

1. Abra os detalhes da solução na OrientoHub e acesse **Market & Growth**.
2. Clique em **Configurar webhook**. A OrientoHub gera um token exclusivo da solução; copie-o e guarde-o como segredo no backend da solução. Gerar um token novo invalida o anterior.
3. Envie um `POST` para a URL exibida, com o token no header `X-Solution-Webhook-Token` e o payload abaixo.

```http
POST /api/solution-market-growth
X-Solution-Webhook-Token: <token da solução>
Content-Type: application/json
```

```json
{
  "solution_id": "uuid-da-solucao-na-orientohub",
  "active_audience": 120,
  "mrr": 12500,
  "valuation": 750000,
  "currency": "BRL",
  "source": "billing"
}
```

`active_audience` é um inteiro não negativo; `mrr` e `valuation` são números não negativos. `valuation` pode ser `null`. `currency` aceita `BRL`, `USD` ou `EUR`. `source` é opcional e limitado a 100 caracteres.

Exemplo Node.js no servidor da solução:

```ts
await fetch(process.env.ORIENTOHUB_MARKET_GROWTH_WEBHOOK_URL!, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Solution-Webhook-Token': process.env.ORIENTOHUB_MARKET_GROWTH_WEBHOOK_TOKEN!,
  },
  body: JSON.stringify({
    solution_id: process.env.ORIENTOHUB_SOLUTION_ID,
    active_audience: 120,
    mrr: 12500,
    valuation: 750000,
    currency: 'BRL',
    source: 'billing',
  }),
});
```

Envie os valores do lado servidor, por exemplo após uma atualização de cobrança ou por um job diário. Não coloque o token em código frontend ou em repositório público. A entrega substitui o snapshot anterior. Respostas `200` confirmam recebimento; `401` indica token ausente ou inválido; `400` indica payload inválido.

## Se a outra solução também usa Supabase

Configure os segredos no projeto Supabase da outra solução (substitua os valores pelos dados mostrados na OrientoHub):

```sh
supabase secrets set ORIENTOHUB_MARKET_GROWTH_WEBHOOK_URL='https://orientohub.com.br/api/solution-market-growth' ORIENTOHUB_MARKET_GROWTH_WEBHOOK_TOKEN='cole-o-token' ORIENTOHUB_SOLUTION_ID='uuid-da-solucao'
```

Em uma Edge Function Deno, envie valores obtidos do banco ou do seu sistema de cobrança:

```ts
const endpoint = Deno.env.get('ORIENTOHUB_MARKET_GROWTH_WEBHOOK_URL')!;
const token = Deno.env.get('ORIENTOHUB_MARKET_GROWTH_WEBHOOK_TOKEN')!;
const solutionId = Deno.env.get('ORIENTOHUB_SOLUTION_ID')!;

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Solution-Webhook-Token': token,
  },
  body: JSON.stringify({
    solution_id: solutionId,
    active_audience: activeUsers,
    mrr: monthlyRecurringRevenue,
    valuation: valuation ?? null,
    currency: 'BRL',
    source: 'supabase-edge-function',
  }),
});

if (!response.ok) throw new Error(await response.text());
```

Conecte `activeUsers`, `monthlyRecurringRevenue` e `valuation` às consultas reais da solução. A Edge Function deve ser chamada pelo fluxo do servidor ou por um agendamento protegido, nunca diretamente pelo navegador.
