const {Client, Collection, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const console = require('console');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]});

const eventsPath = path.join(__dirname, 'src\\events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(client,...args));
	}
}

client.login(process.env.DISCORD_SECRET);