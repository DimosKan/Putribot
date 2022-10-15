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
const sendmail = require('./functions/sendmail');
var rownum = 1;
// Bot login
client.login(token);


//What does the bot do when it logs in
client.on('ready',async(client) => {
	console.log('Good news everyone! The bot is working once again!');
	client.user.setActivity('Good news everyone!');
	//sendmail.sendMail();
}); 

/* client.on("error", m=>{ 
	console.log(cError(" WARN ") + " " + m); });
client.on("warn", m=>{
	if (show_warn) console.log(cWarn(" WARN ") + " " + m); 
}); */

client.on("disconnected", () => {
	console.log(cRed("Disconnected") + " from Discord");
	setTimeout(() => {
		console.log("Attempting to log in...");
		client.loginWithToken(config.token, (err, token) => {
			if (err) { console.log(err); setTimeout(() => { process.exit(1); sendmail.sendMail(err); }, 2000); }
			if (!token) { console.log(" WARN " + " failed to connect"); setTimeout(() => { process.exit(0); }, 2000); }
		});
	});
}); 


const rega = require("@timelostprototype/wow-client");
const { send } = require('process');
const botaki = new rega.Client(
  "logon.warmane.com", //Realmlist
  "zaro4ever",
  "2104625947Zaro"
);

async function bootstrap() {
	await botaki.connectToFirstRealmWithFirstCharacter();
	const m_content = "Ela bro mou"
	const p_name = "Critias"
	const ch_name = "3";

	const say = rega.SayMessage;
	const saym = await say.toPacket(m_content);
	//saym.buffer = `<Buffer 07 FF FF FF FF 00 00 00 00 00 00 00 00 FF FF FF FF 00 00 00 00 00 00 00 00 4C 02 00 00 59 6D 76 78 6D 41 44 76 77 61 62 09 6C 6F 63 61 6C 20 76 54 49 71 4C 4E 49 5A 4B 65 42 48 49 47 43 6A 64 76 65 59 20 3D 20 22 58 71 57 53 44 54 41 6E 4D 51 75 50 56 6A 79 50 22 20 2D 2D 20 43 42 78 48 53 4C 4C 4E 6C 4E 52 45 6F 69 69 50 4C 47 4A 59 72 73 75 56 56 69 70 79 70 67 4A 54 62 66 63 50 71 47 45 64 46 4B 74 68 45 4F 4E 73 66 70 76 74 6F 67 49 78 56 76 6B 6A 54 79 72 54 49 66 74 5A 58 53 72 79 5A 68 63 47 54 4A 62 4D 69 59 65 76 59 50 5A 74 73 51 62 6D 72 53 70 50 59 49 4D 50 44 68 41 70 68 4B 73 44 62 41 6C 74 59 59 5A 50 43 6F 57 6D 57 5A 64 70 53 51 4D 77 47 68 53 49 5A 6D 67 58 74 51 46 44 54 41 41 66 44 68 44 6A 4C 57 52 4B 71 67 6C 64 46 63 48 4D 6C 62 79 68 54 4C 63 6F 54 76 55 6C 68 66 51 4F 68 73 67 4F 64 6E 65 70 63 74 61 54 73 63 50 62 79 54 58 46 65 59 45 62 4F 56 72 48 45 63 64 4B 73 62 63 49 56 70 74 55 76 6A 72 6F 43 55 76 4C 4C 44 4C 4E 59 4D 74 57 48 78 49 65 74 6D 63 62 56 64 77 59 69 54 45 77 78 4D 49 59 71 51 58 59 75 6D 58 65 41 6C 74 62 66 66 75 67 41 71 53 56 6D 4A 44 6B 59 71 77 48 59 4A 56 44 6B 4F 77 61 42 69 56 64 41 4B 6B 72 51 78 43 6A 4F 6F 62 49 43 74 6B 70 66 73 42 51 43 68 4B 6F 57 50 78 69 4D 6D 4E 6D 6F 59 79 47 42 52 50 4D 71 46 5A 65 46 6F 42 68 56 4C 69 6E 6D 47 76 6F 45 64 6F 61 43 68 77 75 61 6C 76 42 51 48 59 72 49 45 6C 54 44 53 43 54 59 61 6D 79 6B 62 51 71 63 62 4F 52 57 73 6D 58 6F 61 46 45 78 71 51 79 64 67 79 55 6A 6E 6A 74 58 43 61 72 6C 65 79 73 56 6B 78 48 73 6B 68 6B 43 74 79 6C 58 73 41 4D 59 57 42 78 58 79 55 76 61 4E 63 55 42 72 6D 73 70 72 63 51 41 67 46 45 62 50 63 70 45 77 6D 5A 6F 52 42 71 67 65 49 70 54 71 69 69 44 70 57 50 53 67 70 69 59 75 6E 78 75 61 43 4A 74 58 63 52 41 4F 74 6B 65 50 64 55 4C 78 69 64 4A 6F 52 6E 73 4E 50 6A 71 4B 43 51 44 76 6D 69 58 4F 5A 4F 50 00>`
	//console.log(saym.buffer)
	//console.log(saym)

	const yell = rega.YellMessage;
	const yellm = await yell.toPacket(m_content);

	const guild = rega.GuildMessage;
	const guildm = await guild.toPacket(m_content);

	const officer = rega.OfficerMessage;
	const officerm = await officer.toPacket(m_content);

	const whisper = rega.WhisperMessage;
	const whispm = await whisper.toPacket(p_name, m_content);

	const channel = rega.ChannelMessage;
	const channelm = await channel.toPacket(ch_name, m_content);

	const fr = new rega.AddToFriends();
	//const frm = await fr.send("Sickpsiho");

	await new Promise(r => setTimeout(r, 3000));
	await botaki.worldServer.send(whispm)
	//const who_m = await who.send(p_name);
	//console.log(who_m)

	const whisperl = rega.WhisperMessage;
	const whispml = whisperl.fromPacket(botaki.worldServer);
	console.log(whispml)

}
bootstrap();//.catch((err)=> console.log("Error"));

botaki.worldServer.on('message', Message=>{
	//msg.logLine converts WoW color codes etc into ASNI escape codes for the terminal
	//console.log(Message);
	//console.log("mpika")
	
});

async function messagEditRepeat(){
	log_date = new Date();
	console.log("Scanner activated",log_date.toLocaleString());
	/*function that just outputs the number of the rows at the given loop
	this happens in order to adjust the setimeout to happen just after 3 seconds pass from the last entry scan (otherwise the warmane API closes its connection for spamming protection*/
	let rowcount = await dbfunc.rowCounter().catch((err)=> console.log("Error"));
	if(!rowcount == undefined){
	let rownum = rowcount.counter  
	} else {
		rownum = 1;
	} 
	//Function that scans every request in the form of a database entry and executes each one of it accordingly
	let messagescanner =  await dbfunc.messageEditor(client).catch((err) => console.log("Error"));
	//issue: if a malicious player spams commands, the messagEditor will very easily get bloated with pending commands. I have to let a user use a command per person.
    let obj123 = setTimeout(() => {
		messagEditRepeat();
	}, rownum*3000);
}


//messagEditRepeat();


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