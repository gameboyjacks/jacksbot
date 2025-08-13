import express from "express";
import { Client, GatewayIntentBits, Partials } from "discord.js";

const app = express();
app.use(express.json());

// ENV
const { DISCORD_TOKEN, USER_ID } = process.env;
if (!DISCORD_TOKEN) console.warn("⚠️ Set DISCORD_TOKEN in Replit Secrets");
if (!USER_ID) console.warn("⚠️ Set USER_ID (your Discord user ID) in Replit Secrets");

// Discord client (include DirectMessages intent so we're safe with DMs)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,    // DM support
    GatewayIntentBits.MessageContent     // not strictly needed for sending, but ok to keep
  ],
  partials: [Partials.Channel]           // Required to work with DM channels
});

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// HTTP endpoint n8n will call
app.post("/notify", async (req, res) => {
  try {
    const { message, user_id } = req.body || {};
    const targetUserId = (user_id || USER_ID || "").trim();

    if (!targetUserId) return res.status(400).json({ ok:false, error: "missing user_id/USER_ID" });
    if (!message)      return res.status(400).json({ ok:false, error: "missing message" });

    // create DM channel & send
    const user = await client.users.fetch(targetUserId, { force: true });
    const dm   = await user.createDM();
    await dm.send(String(message));

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false, error: String(e) });
  }
});

// simple health page
app.get("/", (_req, res) => res.send("DM bot running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HTTP listening on :${PORT}`));

client.login(DISCORD_TOKEN);
