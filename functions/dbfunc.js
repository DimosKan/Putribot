var sqlite = require('sqlite3').verbose();
const util = require('util');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const dbPath = appDir + '/database/warmanedb.sqlite';
const bluebird = require("bluebird");
const axiosfuncgroup = require('./axiosearcher');
const embedmessage = require('./embed');
const itemdata = require('/root/putribot/Jsonlibs/items.json');

//Function to finalize the registration pending on the stack of the database
async function dbRegister(name,server,leader,membercount,guildid,channelid,messageid){
  const prefix = ";"
  const datescanned = "none"
  let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE);
  const sql = 'SELECT channelid FROM guildinfo WHERE name = ? AND server = ? AND leader = "preregister"';
  db.all(sql,[name,server], function(error,rows){
    if (rows.length == 0){
      console.log("Preregistration already exists")
      db.close()
      return; 
    }
      db.serialize(function(rows){
        var smmt = db.prepare("INSERT INTO guildinfo VALUES(?,?,?,?,?,?,?,?,?)");
        smmt.run(name,server,leader,membercount,guildid,channelid,messageid,prefix,datescanned);
        smmt.finalize();
      })
      const sql = 'SELECT * FROM guildinfo WHERE name = ? AND server = ? AND leader = "preregister"';
      db.all(sql,[name,server], function(error,rows){
       db.serialize(function(rows){
        var smmt = db.prepare(`DELETE FROM guildinfo WHERE name = ? AND server = ? AND leader = "preregister" `);
        smmt.run(name,server);    
        smmt.finalize()
       db.close();
       return; 
       })
      })
  })
}

//Deletes database if someone deletes the bot's channel
function channelUpdater(channel){
  let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE);
  db.serialize(function(){
    var smmt = db.prepare("DELETE FROM guildinfo WHERE channelid = ?");
    smmt.run(channel.id);
    smmt.finalize();
    db.close();
  })
}

//Checks if the user has already registered a guild in his channel
async function flagChecker(message){
  return await new Promise((resolve, reject) => {
    let init = 0;
    let db = new sqlite.Database(dbPath, sqlite.OPEN_READONLY);
    const sql = 'SELECT channelid FROM guildinfo WHERE guildid = ?';
    db.all(sql,[message.guildId], function(error,rows){
      if (rows.length > 0){
        db.close()
        resolve({init: 1})
        message.author.send("You cannot register more than once in a channel")
      }else{
        resolve({init: 0})
      }
    })
  })
  .catch(function (error) {
    console.log(error);
  })
}

async function messageEditor(client){
  let db = new sqlite.Database(dbPath, sqlite.OPEN_READONLY);
  return await new Promise(async (resolve,reject) => {
    const sql = 'SELECT * FROM guildinfo';
    let rows = await new Promise((res, rej) => {
      db.all(sql, [], function (err, rs) {
        if (rs.length == 0) {
          db.close();
          rej({lol : test = "0"});
        } else {
          res(rs);
        }
      });
    });
   let results = await bluebird.Promise.mapSeries(rows, function (row, index, array) {
      return new Promise(async (res, rej) => {
        //try {
          let guildname = row.name;
          let servername = row.server;
          //waiting 3 seconds before it executes the next commands (for anti-requestspamming purposes)
          await new Promise(r => setTimeout(r, 3000));

          //"Guild" is the keyword to show that the request is made with the ";search" command
          if (row.leader == "Guild") {
            user = await client.users.fetch(row.messageid);
            let axiosfeeder = await axiosfuncgroup.axiosgatherer(guildname, servername, client, row.messageid);
            let embed = await embedmessage.embedbody(guildname, servername, axiosfeeder.leaderclass, axiosfeeder.leader, axiosfeeder.membercount, axiosfeeder.onl_array);
            user.send({ embeds: [embed.G_embed] });

          } else if (row.leader == "Player") {
            user = await client.users.fetch(row.messageid);
            let axiosfeeder = await axiosfuncgroup.axiosgathererPlayer(guildname, servername, client, row.messageid);
            let embed = await embedmessage.embedbodyplayer(axiosfeeder.name, axiosfeeder.realm, axiosfeeder.online, axiosfeeder.level, axiosfeeder.faction, axiosfeeder.race, axiosfeeder.wowclass, axiosfeeder.honorablekills, axiosfeeder.guild, axiosfeeder.achievement, axiosfeeder.tal_table, axiosfeeder.eq_array, axiosfeeder.prof_table, axiosfeeder.pvpteams_table, axiosfeeder.gs, axiosfeeder.ilvl, axiosfeeder.classword, axiosfeeder.classcolor);
            user.send({ embeds: [embed.P_embed] });
          }
          //"preregister" is the keyword to show that the request is made with the ";start" command
          else if (row.leader == "preregister") {
            let axiosfeeder = await axiosfuncgroup.axiosgatherer(guildname, servername, client);
            let guildidcreate = row.guildid;
            let channel_creator = await ChanCreate(axiosfeeder, client, guildidcreate);
          } else {
            //if no keyword exists, that means it scans a regular registered guild, all it does is edit the message with the updated infos.
            let guild = await client.guilds.cache.get(row.guildid);
            let channel = await guild.channels.cache.get(row.channelid)
            let mfd = await channel.messages.fetch(row.messageid);
            let axiosfeeder = await axiosfuncgroup.axiosgatherer(guildname, servername);
            let embed = await embedmessage.embedbody(guildname, servername, axiosfeeder.leaderclass, axiosfeeder.leader, axiosfeeder.membercount, axiosfeeder.onl_array);
            let em = mfd.edit({ embeds: [embed.G_embed] })
          }
          res({
            messageid: row.messageid,
          });
        /* } catch (err) {
          user = await client.users.fetch(row.messageid);
          user.send("Bad news everyone! You seem you have mispelled something in the name... either that or you have chosen the wrong server.");
          console.log(err)
          rej({});
        }*/
      });
    }).catch(err => {
      console.log(err)
      reject({});
    });
    db.close();
    resolve(results);
  });
};

//registers a temporal entry in order to then make an axios request with it and send it via dm to the user (for ;search function)
async function requestRegister(name,server,authorid,channelid,mode){
  const prefix = ";";
  const datescanned = "none";
  const leader = mode;
  const membercount = "temp";
  const guildid = "temp";
  let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE);
  db.serialize(function(){
    let smmt = db.prepare("INSERT INTO guildinfo VALUES(?,?,?,?,?,?,?,?,?)");
    smmt.run(name,server,leader,membercount,guildid,channelid,authorid,prefix,datescanned);
    smmt.finalize();
    db.close();
  });
}

//same as requestRegister but for the ;start command//in the future, I will merge them
async function preRegister(name,server,message){
  const prefix = ";";
  const datescanned = "none";
  const leader = "preregister";
  const membercount = "preregister";
  const guildid =    message.guild.id;
  const channelid =  "preregister";
  const messageid =  "preregister"
  let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE);
  db.serialize(function(){
    var smmt = db.prepare("INSERT OR REPLACE INTO guildinfo VALUES(?,?,?,?,?,?,?,?,?)");
    smmt.run(name,server,leader,membercount,guildid,channelid,messageid,prefix,datescanned);
    smmt.finalize();
    db.close();
  })
}

//Counts the rows of the database.
async function rowCounter(){
  let db = new sqlite.Database(dbPath, sqlite.OPEN_READONLY);
  const sql = 'SELECT * FROM guildinfo' ;
  return await new Promise((resolve, reject) => {
    db.all(sql,[], function(error,rows){
      if (rows.length == 0){
        console.log("Empty database")
        resolve({pagopoulos: "gay" });
      }
      resolve({counter: rows.length})
    });
  })
}

//after the axios GET request of the "start" command, this function creates the channel of the guild and sends the message with the guild information
async function ChanCreate(axiosfeeder,client,guildid){
  let	guild = await client.guilds.cache.get(guildid);
  let channelcreator =  await guild.channels.create("Putricide's Laboratory of Alchemical Horrors and Fun",{
		type: 'GUILD_TEXT', 
		reason: 'Made a channel for guild tracking',
		permissionOverwrites:[{
			id: guildid,
			allow: ["VIEW_CHANNEL"], 
			deny: ["SEND_MESSAGES"],
		}]
	})
  let embed = await embedmessage.embedbody(axiosfeeder.Gn,axiosfeeder.Rn,axiosfeeder.leaderclass,axiosfeeder.leader,axiosfeeder.membercount,axiosfeeder.onl_array)
	channeldata = await channelcreator.send({embeds: [embed.G_embed]})
	let init = true;
	dbRegister(axiosfeeder.Gn,axiosfeeder.Rn,axiosfeeder.leader,axiosfeeder.membercount,channelcreator.guildId,channelcreator.id,channelcreator.lastMessageId)
}
module.exports = {dbRegister,flagChecker,channelUpdater,messageEditor,requestRegister,rowCounter,preRegister}