## Setup
1) In the Discord Developer Portal:
   - Enable **Message Content Intent** for the bot.
   - Invite the bot with permissions: Send Messages, Embed Links.

2) Replit (or any host):
   - Import this repo.
   - Add Secrets: `DISCORD_TOKEN`, `AUTH_TOKEN`, (optional) `CHANNEL_ID`.
   - Run.

## n8n call
POST https://<your-repl>.repl.co/notify
Headers: Authorization: Bearer <AUTH_TOKEN>, Content-Type: application/json
Body:
{
  "channel_id": "123456789012345678",   // optional if CHANNEL_ID is set
  "content": "hello from n8n 🚀"
}
