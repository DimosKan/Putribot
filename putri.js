const { token } = require('./config.json');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(token);

client.once('ready', () => {
	console.log('Good news everyone! The bot is working once again!');
});


