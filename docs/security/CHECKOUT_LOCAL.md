# Checkout no ambiente local

O GitHub e a sessão podem retornar para localhost. O retorno do pagamento e as notificações do provedor usam uma origem pública HTTPS separada, para evitar o erro `Invalid value for back_url`.

Configure no servidor, em `.env.local` e na Vercel:

```env
CHECKOUT_PUBLIC_URL=https://orientohub.com.br
```

A variável aceita apenas a origem, sem caminho ou parâmetros. Em sua ausência, o checkout usa APP_URL quando válida. Exclusivamente no servidor local de desenvolvimento, se APP_URL estiver vazia ou apontando para localhost HTTP, utiliza https://orientohub.com.br. Em produção, uma configuração inválida interrompe a criação antes da chamada ao provedor.

Mesmo iniciado localmente, o checkout retorna para o domínio público depois do pagamento. O webhook também aponta para esse domínio: mantenha o handler de pagamento publicado e configurado. A liberação do plano depende da verificação do pagamento no servidor, não da visita à página de sucesso.

Para um retorno a uma versão local acessível externamente, configure CHECKOUT_PUBLIC_URL com a origem HTTPS pública do túnel que encaminha para seu servidor. Isso também direciona os webhooks para o túnel.

Testes sem criar pagamentos reais:

```bash
node scripts/check-checkout-urls.mjs
node scripts/check-local-api.mjs
```

Referência: [orientações de URLs de retorno do Mercado Pago](https://www.mercadopago.com.br/developers/en/docs/checkout-pro-preferences/configure-back-urls).
