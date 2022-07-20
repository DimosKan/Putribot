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
const dbfile = require('./functions/dbfunc')
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
//if (message.guild == null)return;
if (message.author.bot) return;

if (message.content.startsWith(prefix + "start") && (message.author.id === message.guild.ownerId)){
	var messagecontent = message.content.replace(`${prefix}start `,'')
	var messagecontent = messagecontent.split("-")
	let guildname = messagecontent[0]
	let servername = messagecontent[1]
	let axiosfeeder = await axiosfuncgroup.axiosgatherer(message,guildname,servername);
	let statustext = `\n${guildname}-${servername}\nLeader:${axiosfeeder.leaderclass} ${axiosfeeder.leader}\nMember sum:${axiosfeeder.membercount}\nMembers online: ${axiosfeeder.onl_array}`
	message.guild.channels.create("Putricide's Laboratory of Alchemical Horrors and Fun",{
		type: 'GUILD_TEXT', 
		reason: 'Made a channel for guild tracking',
		permissionOverwrites:[{
			id: message.guild.id, 
			allow: ["VIEW_CHANNEL"], 
			deny: ["SEND_MESSAGES"],
		}]
	}).then((channel)=> {
		channeldata = channel.send(statustext).then(
			(channeldata)=> {
			let init = true;
			dbfile.dbRegister(guildname,servername,axiosfeeder.leader,axiosfeeder.membercount,init,channel.id,channel.lastMessageId)
			}
			//console.log(channel.id,channel.lastMessageId)
		)
	})		
}

if (message.content.startsWith(prefix + "search")){
	var realcontent = message.content.replace(`${prefix}search `,'')
	var contentslicer =  realcontent.split("-");
	var guildname = contentslicer[0];
	var servername = contentslicer[1];
	//Known bugs: When guild is not written properly(does not exist), it throws unhandled error
	let axiosfeeder = await axiosfuncgroup.axiosgatherer(message,guildname,servername);
	let statustext = `\n${guildname}-${servername}\nLeader:${axiosfeeder.leaderclass} ${axiosfeeder.leader}\nMember sum:${axiosfeeder.membercount}\nMembers online: ${axiosfeeder.onl_array}`
	message.author.send(statustext);
	
}

});


