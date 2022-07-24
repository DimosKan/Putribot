var sqlite = require('sqlite3').verbose();
const util = require('util');

async function dbRegister(name,server,leader,membercount,guildid,channelid,messageid){
const prefix = ";"
let db = new sqlite.Database('putribot/database/warmanedb', sqlite.OPEN_READWRITE);
const sql = 'SELECT channelid FROM guildinfo WHERE name = ? AND server = ?';
db.all(sql,[name,server], function(error,rows){
  if (rows.length > 0){
   console.log("Η καταχώριση υπάρχει ήδη.")
    db.close()
    return; 
  }else{
    db.serialize(function(){
   var smmt = db.prepare("INSERT OR REPLACE INTO guildinfo VALUES(?,?,?,?,?,?,?,?)");
   smmt.run(name,server,leader,membercount,guildid,channelid,messageid,prefix);
   smmt.finalize();
   db.close();
  })
  }   if (error){
    throw error;
  }
})
}

  function channelUpdater(channel){
    let db = new sqlite.Database('putribot/database/warmanedb', sqlite.OPEN_READWRITE);
    db.serialize(function(){
      var smmt = db.prepare("DELETE FROM guildinfo WHERE channelid = ?");
      smmt.run(channel.id);
      smmt.finalize();
      db.close();
    })
  }

async function flagChecker(message){
  return await new Promise((resolve, reject) => {
  let init = 0;
  let db = new sqlite.Database('putribot/database/warmanedb', sqlite.OPEN_READWRITE);
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
  }).catch(function (error) {
    console.log(error);
    reject({error});
  })
}

module.exports = {dbRegister,flagChecker,channelUpdater}