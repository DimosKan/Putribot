const { token } = require('./config.json');
const { Client, Intents, CommandInteractionOptionResolver } = require('discord.js');
const { Console } = require('console');
const client = new Client({ intents: [ "GUILDS" , "GUILD_MESSAGES"] });
const axios = require('axios').default;
const util = require('util');
client.login(token);
const path = require('path');
const fs = require('fs')
var sqlite = require('sqlite3').verbose();
const { MessageEmbed } = require('discord.js');
const axiosfuncgroup = require('./functions/axiosearcher')
//const embedgroup = require('./functions/embed')


client.on('ready', () => {
	console.log('Good news everyone! The bot is working once again!');
	client.user.setActivity('Good news everyone!');
});


client.on("guildCreate", guild => {
	const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
	channel.send(`Just an ordinary Discord bot... but watch out, because that's no ordinary Discord bot! Just write the right command with your guild and the server it belongs like so: ";init guildname-servername" and let me do the magic!`);
})

client.on("messageCreate", async (message) => {
	var prefix = ';';
if (message.guild == null)return;
if (message.author.bot) return;

if (message.content.startsWith(prefix + "search")){
	var realcontent = message.content.slice(8)
	var contentslicer =  realcontent.split("-");
	var guildname = contentslicer[0];
	var servername = contentslicer[1];
	//Known bugs: When no members are online in the guild, it throws unhandled error
	let axiosfeeder = await axiosfuncgroup.axiosgatherer(message,guildname,servername);
	message.author.send(`\n${guildname}-${servername}\nLeader:${axiosfeeder.leaderclass} ${axiosfeeder.leader}\nMember sum:${axiosfeeder.membercount}\nMembers online: ${axiosfeeder.onl_array}`);
}	

});
