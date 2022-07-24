const { token } = require('./config.json');
const { Client, Intents, CommandInteractionOptionResolver } = require('discord.js');
const { Console } = require('console');
const client = new Client({ intents: [ "GUILDS" , "GUILD_MESSAGES"] });
const axios = require('axios').default;
const util = require('util');
const path = require('path');
const fs = require('fs')
const bluebird = require("bluebird");
const sqlite = require('sqlite3').verbose();

const appDir = path.dirname(require.main.filename);
const { MessageEmbed } = require('discord.js');
const axiosfuncgroup = require('./functions/axiosearcher');
const dbfunc = require('./functions/dbfunc');
const dbPath = appDir + '/database/warmanedb.sqlite';
//const embedgroup = require('./functions/embed')
 
// Bot login
client.login(token);

//το παρακάτω scriptακι χρησιμευέι ΓΙΑ ΝΑ ΜΟΥ ΓΑΜΑΝΕ ΤΗΝ ΖΩΗ ΓΙΑ ΑΛΛΗ ΜΙΑ ΦΟΡΑ ΤΑ ΚΩΛΟΑΣΥΓΧΡΟΝΑ, ΓΙΩΡΓΟ ΒΟΗΘΕΙΑ ΡΕ ΜΑΛΑΚΑ
async function messageEditor(){
	let guildsArr = ["Lordaeron"];

	let db = new sqlite.Database(dbPath, sqlite.OPEN_READONLY);

	return await new Promise(async (resolve,reject) => {
		try {
			const sql = 'SELECT * FROM guildinfo WHERE server = ?';

			let rows = await new Promise((res, rej) => {
				db.all(sql, guildsArr, function (err, rs) {
					if (rs.length == 0) {
						console.log("Η βάση δεδομένων είναι άδεια")
						db.close();
						rej(new Error("Η βάση δεδομένων είναι άδεια"));
					}
					res(rs);
				});
			});

			//rows = ["Test1", "Potato"];

			let results = await bluebird.Promise.mapSeries(rows, function (row, index, array) {
				return new Promise(async (res, rej) => {
					let guildname = row.name;
					let servername = row.server;
					await new Promise(r => setTimeout(r, 3000));
					let axiosfeeder = await axiosfuncgroup.axiosgatherer(guildname, servername);
					let statustext = `\n${guildname}-${servername}\nLeader:${axiosfeeder.leaderclass} ${axiosfeeder.leader}\nMember sum:${axiosfeeder.membercount}\nMembers online: ${axiosfeeder.onl_array} KAI ANTE ΓΑΜΗΣΟΥ`;
					// console.log(`θα κάνω edit το μήνυμα ${row.messageid} και το μήνυμα θα είναι ${statustext}`);
					// console.log(`Message Edited ${guildname}`);
					// console.log("I run " + index);
					res({
						editedmessage: statustext,
						messageid: row.messageid
					});
				});
			});

			db.close();
			resolve(results);
		} catch (error) {
			db.close();
			reject(error);
		}
	})
}

client.on('ready', () => {
	console.log('Good news everyone! The bot is working once again!');
	client.user.setActivity('Good news everyone!');
	let messagescanner = messageEditor(); 
	messagescanner.then(r => console.log(r));
}); 


client.on("guildCreate", guild => {
	const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
	channel.send(`Just an ordinary Discord bot... but watch out, because that's no ordinary Discord bot! Just write the right command with your guild and the server it belongs like so: ";start guildname-servername" and let me do the magic!`);
})

client.on("channelDelete", async (channel) =>{
channelChecker = dbfunc.channelUpdater(channel);
})

client.on("messageCreate", async (message) => {
	var prefix = ';'
//if (message.guild == null)return;
if (message.author.bot) return;

if (message.content.startsWith(prefix + "start") && (message.author.id === message.guild.ownerId)){
	var messagecontent = message.content.replace(`${prefix}start `,'')
	var messagecontent = messagecontent.split("-")
	let guildname = messagecontent[0]
	let servername = messagecontent[1]
	var flagdata = await dbfunc.flagChecker(message)
	if(flagdata.init == 1){
	return;
	}
	let axiosfeeder = await axiosfuncgroup.axiosgatherer(guildname,servername);
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
			dbfunc.dbRegister(guildname,servername,axiosfeeder.leader,axiosfeeder.membercount,channel.guild.id,channel.id,channel.lastMessageId)
			}
		)
	})		
}

if (message.content.startsWith(prefix + "search")){
	var realcontent = message.content.replace(`${prefix}search `,'')
	var contentslicer =  realcontent.split("-");
	var guildname = contentslicer[0];
	var servername = contentslicer[1];
	var channelid =  message.guildId;
	//Known bugs: When guild is not written properly(does not exist), it throws unhandled error
	let axiosfeeder = await axiosfuncgroup.axiosgatherer(guildname,servername);
	let statustext = `\n${guildname}-${servername}\nLeader:${axiosfeeder.leaderclass} ${axiosfeeder.leader}\nMember sum:${axiosfeeder.membercount}\nMembers online: ${axiosfeeder.onl_array}`
	message.author.send(statustext);
	
}

});


