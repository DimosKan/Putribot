const { token } = require('./config.json');
const { Client, Intents, CommandInteractionOptionResolver } = require('discord.js');
const { Console } = require('console');
const client = new Client({ intents: [ "GUILDS" , "GUILD_MESSAGES"] });
//const axios = require('axios').default;
//const util = require('util');
//const path = require('path');
//const fs = require('fs')
//const sqlite = require('sqlite3').verbose();
//const appDir = path.dirname(require.main.filename);
//const { MessageEmbed } = require('discord.js');
const dbfunc = require('./functions/dbfunc');
//const dbPath = appDir + '/database/warmanedb.sqlite';
//const embedgroup = require('./functions/embed') // will be fixed in a next version soon
 var rownum = 1;
// Bot login
client.login(token);

async function messagEditRepeat(){
	/*function that just outputs the number of the rows at the given loop
	this happens in order to adjust the setimeout to happen just after 3 seconds pass from the last entry scan (otherwise the warmane API closes its connection for spamming protection*/
	let rowcount = await dbfunc.rowCounter()
	let rownum = rowcount.counter;
	//Function that scans every request in the form of a database entry and executes each one of it accordingly
	let messagescanner =  await dbfunc.messageEditor(client)
    setTimeout(messagEditRepeat, rownum*3000);
}

messagEditRepeat();

	//What does the bot do when it logs in
client.on('ready',async(client) => {
	console.log('Good news everyone! The bot is working once again!');
	client.user.setActivity('Good news everyone!');
}); 

	//Bot sends a message to the guild's welcome channel to let owner know how to initiate.
client.on("guildCreate", guild => {
	const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
	channel.send(`Just an ordinary Discord bot... but watch out, because that's no ordinary Discord bot! Just write the right command with your guild and the server it belongs like so: ";start guildname-servername" and let me do the magic!`);
})

	//If someone deletes the bot's channel, the bot responds with deleting the guild from the database.
client.on("channelDelete", async (channel) =>{
channelChecker = dbfunc.channelUpdater(channel);
})

client.on("messageCreate", async (message) => {
	var prefix = ';'
	if (message.author.bot) return;
	if (message.content.startsWith(prefix + "start") && (message.author.id === message.guild.ownerId)){
			//Filters the message in order to get the name of the guild and the name of the server.
		var messagecontent = message.content.replace(`${prefix}start `,'')
		var messagecontent = messagecontent.split("-")
		let guildname = messagecontent[0]
		let servername = messagecontent[1]
			//Checks if the user has used the "start" command in his server again. The user is allowed to monitor only one guild in each server.
		var flagdata = await dbfunc.flagChecker(message)
		if(flagdata.init == 1) return;
			//puts the ;start request on the stack in order to execute when messageEditor calls it
		let prereg = await dbfunc.preRegister(guildname,servername,message)
		return;
	}

	if (message.content.startsWith(prefix + "search")){
			/*edits the initial user's message in order to get the name of the guild and the server// IDEA: all guilds in warmane start with different letters so 
			using the startsWith(method) to determine the server is an efficient idea. Also, I have to make a function for the algorithm that finds the guild's name and server*/
		var realcontent = message.content.replace(`${prefix}search `,'')
		var contentslicer =  realcontent.split("-");
		var guildname = contentslicer[0];
		var servername = contentslicer[1];
		var channelid =  message.guildId;
		let authorid = message.author.id;
		let searchreg  = dbfunc.requestRegister(guildname,servername,authorid,channelid);
	}

});


