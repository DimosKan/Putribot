var sqlite = require('sqlite3').verbose();



async function dbRegister(name,server,leader,membercount,init,channelid,messageid){
let prefix = ";"

let db = new sqlite.Database('putribot/database/warmanedb', sqlite.OPEN_READWRITE);
const sql = 'SELECT channelid FROM guildinfo WHERE channelid = ?';
db.all(sql,[channelid], function(error,rows){
  if (rows.length > 0){
    message.author.send(`Το όνομα ${name} υπάρχει ήδη στην βάση δεδομένων. Αν το Friend Code σου δεν είναι σωστό, ενημέρωσε ένας Admin ή mod του Σερβερ για να το αλλάξουν.`).then(message.delete());
    db.close()
    return; 
  }else{
    db.serialize(function(){
   var smmt = db.prepare("INSERT OR REPLACE INTO guildinfo VALUES(?,?,?,?,?,?,?,?)");
   smmt.run(name,server,leader,membercount,init,channelid,prefix,messageid);
   smmt.finalize();
   db.close();
  })
  }
})
}

module.exports = {dbRegister}