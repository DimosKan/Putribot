const { token } = require('./config.json');
const { Client, Intents, CommandInteractionOptionResolver } = require('discord.js');
const { Console } = require('console');
const client = new Client({ intents: [ "GUILDS" , "GUILD_MESSAGES"] });
const path = require('path');
const appDir = path.dirname(require.main.filename);
const dbPath = appDir + '/database/warmanedb.sqlite';
var sqlite = require('sqlite3').verbose();
const util = require("util");
//const axios = require('axios').default;
//const util = require('util');
//const path = require('path');
//const fs = require('fs')
//const sqlite = require('sqlite3').verbose();
//const appDir = path.dirname(require.main.filename);
const dbfunc = require('./functions/dbfunc');
var rownum = 1;
// Bot login
client.login(token);

//What does the bot do when it logs in
client.on('ready',async(client) => {
	console.log('Good news everyone! The bot is working once again!');
	client.user.setActivity('Good news everyone!');
}); 

/* const rega = require("@timelostprototype/wow-client");

const botaki = new rega.Client(
  "logon.warmane.com", //Realmlist
  "gpago",
  "8zmcf69hv0pgs1q"
);

botaki.worldServer.on('message', Message=>{
    //msg.logLine converts WoW color codes etc into ASNI escape codes for the terminal
    console.log(Message.logLine);
});

async function bootstrap() {
  //helper function for quick start, may go away
  await botaki.connectToFirstRealmWithFirstCharacter();

}
bootstrap();

 */

async function messagEditRepeat(){
	/*function that just outputs the number of the rows at the given loop
	this happens in order to adjust the setimeout to happen just after 3 seconds pass from the last entry scan (otherwise the warmane API closes its connection for spamming protection*/
	let rowcount = await dbfunc.rowCounter().catch((err)=> console.log("Error 2"));
	if(!rowcount == undefined){
	let rownum = rowcount.counter  
	} else {
		rownum = 1;
	} 
	//Function that scans every request in the form of a database entry and executes each one of it accordingly
	let messagescanner =  await dbfunc.messageEditor(client).catch((err) => console.log("Error"));
    let obj123 = setTimeout(() => {
		messagEditRepeat();
	}, rownum*3000);
}


messagEditRepeat();


	//Bot sends a message to the guild's welcome channel to let owner know how to initiate.
client.on("guildCreate", guild => {
	const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
	channel.send(`Just an ordinary Discord bot... but watch out, because that's no ordinary Discord bot! Just write the right command with your guild and the server it belongs like so: ";start guildname-servername" and let me do the magic!`);
})

	//If someone deletes the bot's channel, the bot responds with deleting the guild from the database.
client.on("channelDelete", async (channel) =>{
	//faulty: Recheck it
channelChecker = dbfunc.channelUpdater(channel);
})

client.on("messageCreate", async (message) => {
	var mode = "None"
	var searchreg = "None"
	var prefix = ';';
	let results = commandEditor(message,prefix);
	if (message.author.bot) return;
	if (!results)return;
	let command = results[0];
	let name = results[1];
	let server = results[2];
	var channelid =  message.guildId;
	let authorid = message.author.id;
	if (command == `${prefix}START` && (message.author.id === message.guild.ownerId)){
			//Filters the message in order to get the name of the guild and the name of the server.
			//Checks if the user has used the "start" command in his server again. The user is allowed to monitor only one guild in each server.
		var flagdata = await dbfunc.flagChecker(message)
		if(flagdata.init == 1) return;
			//puts the ;start request on the stack in order to execute when messageEditor calls it
		let prereg = await dbfunc.preRegister(name,server,message)
		return;
	}
    if (command == `${prefix}G`){
		let mode = "Guild";
		msg = message;
		let searchreg  = dbfunc.requestRegister(name,server,authorid,channelid,mode);
	}
	if (command == `${prefix}WHO`){
		let mode = "Player";
		let searchreg  = dbfunc.requestRegister(name,server,authorid,channelid,mode);
	}

});

function commandEditor(message,prefix){
	if (message.content.startsWith(prefix)){
		contentslicer =  message.content.split(" ")
		precommand = contentslicer[0];
		command = contentslicer[0].toUpperCase();
		contentslicer = contentslicer.toString()
		contentslicer = contentslicer.replace(`${precommand},`,'')
		contentslicer = contentslicer.replace(`,`,' ')
		contentslicer =  contentslicer.split("-");
		let name = contentslicer[0];
		let servername = contentslicer[1] || "Lordaeron"

		if (name.startsWith((prefix))){
			message.author.send("There was a problem with the message's spelling, try ;who / ;g [name]-[server(optional)]")
			return;
		}
		if (servername.startsWith("I")||servername.startsWith("i")){ 
			servername = "Icecrown";
		} else if ((servername.startsWith("F")||servername.startsWith("f")) && (servername.endsWith("F")||servername.endsWith("f"))){
			servername = "Frostwolf";
		}else if (servername.startsWith("B")||servername.startsWith("b")){
			servername = "Blackrock";
		}else if  (servername.startsWith("F")||servername.startsWith("f")){
			servername = "Frostmourne";
		}else {
			servername = "Lordaeron";
		}
		restofthename= name.slice(1)
		name = name[0].toUpperCase()
		name = name + restofthename
		return [command,name,servername]
	}
}