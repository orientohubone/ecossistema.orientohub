# Notificações de novos usuários no Telegram

A rota `POST /api/telegram-new-user` recebe eventos de inserção da tabela `auth.users` no Supabase e envia ao Telegram nome, e-mail, data de cadastro, confirmação do e-mail e ID da conta. O bot token e o segredo do webhook ficam somente no servidor.

## Configuração

1. Crie um bot pelo `@BotFather` no Telegram e copie o token.
2. Abra uma conversa privada com o bot e envie `/start`. Para notificar um grupo, adicione o bot ao grupo e use o ID desse grupo.
3. Obtenha o `chat_id` da conversa/grupo. Uma forma simples é abrir `https://api.telegram.org/bot<TOKEN>/getUpdates` depois de enviar `/start` e ler `message.chat.id` na resposta. Não compartilhe essa URL nem o token.
4. Gere um segredo longo e aleatório, por exemplo com `openssl rand -hex 32`.
5. Cadastre no Vercel, em **Settings → Environment Variables**, as variáveis `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` e `SUPABASE_AUTH_USER_WEBHOOK_SECRET`. Use o mesmo segredo no passo seguinte e publique um novo deployment.
6. No Supabase, abra **Database → Webhooks** e crie um webhook:
   - tabela: `auth.users` (schema `auth`)
   - evento: `INSERT`
   - método: `POST`
   - URL: `https://orientohub.com.br/api/telegram-new-user`
   - header: `x-orientohub-webhook-secret: <o mesmo segredo configurado no Vercel>`
   - tipo de conteúdo: `application/json`
7. Crie uma conta de teste e confirme que a mensagem chegou. O webhook é disparado na criação da conta, inclusive quando a confirmação de e-mail ainda está pendente.

Não coloque `TELEGRAM_BOT_TOKEN` ou o segredo em variáveis `VITE_*`, no frontend, nem em mensagens ou no Git. Se o token for exposto, gere outro pelo BotFather.
