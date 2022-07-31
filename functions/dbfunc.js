var sqlite = require('sqlite3').verbose();
const util = require('util');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const dbPath = appDir + '/database/warmanedb.sqlite';
const bluebird = require("bluebird");
const axiosfuncgroup = require('./axiosearcher');

//Function to finalize the registration pending on the stack of the database
async function dbRegister(name,server,leader,membercount,guildid,channelid,messageid){
  const prefix = ";"
  const datescanned = "none"
  const keyword = "preregister"
    let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE);
  const sql = 'SELECT channelid FROM guildinfo WHERE name = ? AND server = ? AND leader = "preregister"';
  db.all(sql,[name,server], function(error,rows){
    if (rows.length == 0){
      console.log("Preregistration already exists")
      db.close()
      return; 
    }else{
      db.serialize(function(){
        var smmt = db.prepare("INSERT OR REPLACE INTO guildinfo VALUES(?,?,?,?,?,?,?,?,?)");
        smmt.run(name,server,leader,membercount,guildid,channelid,messageid,prefix,datescanned);
        smmt.finalize();
        db.close();
      })
    } 
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
    reject({error});
  })
}

async function messageEditor(client){
  let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE);
  return await new Promise(async (resolve,reject) => {
    const sql = 'SELECT * FROM guildinfo' 
    let rows = await new Promise((res, rej) => {
      db.all(sql, [], function (err, rs) {
        if (rs.length == 0) {
          db.close();
          rej(console.log("Empty Database"));
          return;
        }
        res(rs);
      });
    });
   let results = await bluebird.Promise.mapSeries(rows, function (row, index, array) {
      return new Promise(async (res, rej) => {
        let guildname = row.name;
        let servername = row.server;
        //waiting 3 seconds before it executes the next commands (for anti-requestspamming purposes)
        await new Promise(r => setTimeout(r, 3000));

        //"Temp" is the keyword to show that the request is made with the ";search" command
        if (row.leader == "temp"){
          let axiosfeeder = await axiosfuncgroup.axiosgatherer(guildname, servername,client)
          let statustext2 = `\n${guildname}-${servername}\nLeader: ${axiosfeeder.leaderclass} ${axiosfeeder.leader}\nMember sum: ${axiosfeeder.membercount}\nMembers online: ${axiosfeeder.onl_array}`;
          user = await client.users.fetch(row.messageid)
          user.send(statustext2).then((rows)=>{
            db.serialize(function(rows){
              keyword = "temp";
              var smmt = db.prepare(`DELETE FROM guildinfo WHERE messageid = ? AND name = ? `);
              smmt.run(row.messageid,row.name);    
              smmt.finalize()
              res({
                messageid: row.messageid,
              });
            });
          });
          return;
        }

        //"preregister" is the keyword to show that the request is made with the ";start" command
        if (row.leader == "preregister"){
          let axiosfeeder = await axiosfuncgroup.axiosgatherer(guildname, servername,client)
          let guildidcreate = row.guildid ;
          let statustext3 = `\n${guildname}-${servername}\nLeader:${axiosfeeder.leaderclass} ${axiosfeeder.leader}\nMember sum:${axiosfeeder.membercount}\nMembers online: ${axiosfeeder.onl_array}`
          let channel_creator= await ChanCreate(axiosfeeder,statustext3,client,guildidcreate);
          return;
        }   

        //if no keyword exists, that means it scans a regular registered guild, all it does is edit the message with the updated infos.
        let	guild = await client.guilds.cache.get(row.guildid);
        let	channel =  await guild.channels.cache.get(row.channelid)
        let	mfd =  await channel.messages.fetch(row.messageid);
        let axiosfeeder = await axiosfuncgroup.axiosgatherer(guildname, servername);
        let statustext = `\n${guildname}-${servername}\nLeader: ${axiosfeeder.leaderclass} ${axiosfeeder.leader}\nMember sum: ${axiosfeeder.membercount}\nMembers online: ${axiosfeeder.onl_array}`;
        let em = mfd.edit(statustext)
        res({
          messageid: row.messageid,
        });
      });
    })
    db.close();
    resolve(results);
  })
}

//registers a temporal entry in order to then make an axios request with it and send it via dm to the user (for ;search function)
async function requestRegister(name,server,authorid,channelid){
  const prefix = ";"
  const datescanned = "none"
  const leader = "temp"
  const membercount = "temp"
  const guildid = "temp"
  let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE);
  db.serialize(function(){
    var smmt = db.prepare("INSERT INTO guildinfo VALUES(?,?,?,?,?,?,?,?,?)");
    smmt.run(name,server,leader,membercount,guildid,channelid,authorid,prefix,datescanned);
    smmt.finalize();
    db.close();
  })
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
      resolve({counter: rows.length})
    })
  })
  .catch((e)=>console.log(e))
}

//after the axios GET request of the "start" command, this function creates the channel of the guild and sends the message with the guild information
async function ChanCreate(axiosfeeder,statustext,client,guildid){
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
	channeldata = await channelcreator.send(statustext)
	let init = true;
	dbRegister(axiosfeeder.Gn,axiosfeeder.Rn,axiosfeeder.leader,axiosfeeder.membercount,channelcreator.guildId,channelcreator.id,channelcreator.lastMessageId)
}
module.exports = {dbRegister,flagChecker,channelUpdater,messageEditor,requestRegister,rowCounter,preRegister}