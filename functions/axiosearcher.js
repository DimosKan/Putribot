const axios = require('axios').default;
const path = require('path');
const appDir = path.dirname(require.main.filename);
const dbPath = appDir + '/database/warmanedb.sqlite';
//const fs = require('fs')
//const path = require('path');
const rawdata = require('/root/putribot/Jsonlibs/discservicons.json');
const util = require('util');
const itemdata = require('/root/putribot/Jsonlibs/items.json');
var sqlite = require('sqlite3').verbose();

//outputs a JSON out of the GET request with detailed information of the guilds like players, who is online and so.
async function axiosgatherer(guildname,servername,client,mid){
	args = [guildname,servername,client,mid]
	if(guildname){convertedguildname = guildname.replaceAll(" ", "+")}
	const link = `http://armory.warmane.com/api/guild/${convertedguildname}/${servername}/summary`;
	return await new Promise((resolve, reject) => {
		axios.get(link,args).then(async function (response,args){
			let onlinearray = [];
			let classtable = rawdata;
				response.data.roster.forEach((user, index,error) => {
					classicon = classtable["classes"][user.class];
					if (user.online)onlinearray.push(` ${classicon} ${user.name}`);
				})
				if (onlinearray.length == 0 ){
					onlinearray.push("None")
				}
			resolve({
			onl_array : onlinearray.toString(),
			membercount: response.data.membercount,
			leader: response.data.leader.name,
			leaderclass: classtable["classes"][response.data.leader.class],
			linkready: link,
			client:client,
			Gn: response.data.name,
			Rn: response.data.realm,
			});
		})	
	
		.catch( (err,args) => {			
			reject({})
		})
		.finally(()=>{
			deleteError(args[0],args[3])
		})
	})
}

async function axiosgathererPlayer(playername,servername,client,mid){
	if(playername){convertedplayername = playername.replaceAll(" ", "+")}
	const link = `http://armory.warmane.com/api/character/${convertedplayername}/${servername}/summary`;
	return await new Promise((resolve, reject) => {
		args = [playername,servername,client,mid]
		axios.get(link,args).then((response,args)=>{
			let equipmentarray = [], 
			raceicon = rawdata["Race"][response.data.race],
			classicon = rawdata["classes"][response.data.class],
			classhex = rawdata["classcolor"][response.data.class],
			gripcounter = 0,
			gearscore= 0,
			tempgrip1 = 0,
			tempgrip2 = 0,
			ilvlsum = 0,
			dividecounter = 0,
			divider = 0;
			response.data.equipment.forEach((user, index, error) => {
				divider = divider+1;
				for (let i=0 ; i < itemdata.length ; i++){
					let equipmenttype = itemdata[i]["type"] ; 
					var equipmentname = rawdata["itemtype"][equipmenttype];
					if (itemdata[i]["itemID"] == user.item) {
						if (itemdata[i]["ItemLevel"] != "1" ){
							ilvlsum = ilvlsum + itemdata[i]["ItemLevel"] ;
						}
						if (equipmenttype == "19" || equipmenttype == "4"){
							dividecounter = dividecounter + 1;
						}
						let picker = itemdata[i];
						if (equipmenttype == "4"||equipmenttype == "19" ){
							picker.GearScore = 0;
						}
						if (response.data.class == "Hunter"){
							if (equipmenttype == "13" || equipmenttype == "17" || equipmenttype == "21" || equipmenttype == "22" ||equipmenttype == "23"){
								picker.GearScore = Math.round(picker.GearScore*0.3164);
								picker.GearScore = Math.trunc(picker.GearScore*5.3224);

							}else if (equipmenttype == "15" || equipmenttype== "25" || equipmenttype == "26" || equipmenttype == "28"){
								picker.GearScore = Math.round(picker.GearScore*5.3224);
								picker.GearScore = Math.trunc(picker.GearScore*5.3224);
							}
						}
						if (response.data.class == "Warrior"){
							if(equipmenttype == "17" && gripcounter == 0){
								gripcounter = gripcounter + 1;
								tempgrip1 = picker.GearScore;
							 	break;
							} else if (equipmenttype == "17" && gripcounter == 1){
								gripcounter = gripcounter + 1;
								tempgrip2 = picker.GearScore;
								picker.GearScore = (tempgrip1+tempgrip2)*0.5;
								picker.GearScore = Math.trunc(picker.GearScore);
								gearscore = picker.GearScore + gearscore;
								break;
							}
						}
						
						gearscore = picker.GearScore + gearscore;
						break;
					}
				}
				{equipmentarray.push(`${equipmentname}:\n[${user.name}](https://wotlkdb.com/?item=${user.item})`)}

			})
			if (response.data.class == "Warrior" && gripcounter == 1 ){
				gearscore = gearscore + tempgrip1;
			}
			let proffarray = [];
			let proftable = rawdata;
			response.data.professions.forEach((user, index,error) => {
				proficon = proftable["Professions"][user.name];
				proffarray.push(`${proficon} ${user.name}(${user.skill})`);
			});
			let talentarray = [];
			response.data.talents.forEach((user, index,error) => {
				talentarray.push(`${user.tree}`);
			});
			let pvptable= [];
			response.data.pvpteams.forEach((user, index,error) => {
				pvptable.push(`(${user.type})${user.name}\nRating: ${user.rating}`);
			});

			ilvltemp = ilvlsum / (divider-dividecounter)
			ilvltemp = Math.round(ilvltemp)
			ilvltemp = Math.trunc(ilvltemp)

			
			
			resolve({
			name : response.data.name,
			realm : response.data.realm,
			online : response.data.online,
			level : response.data.level,
			faction : response.data.faction,
			race : raceicon,
			wowclass : classicon,
			honorablekills : response.data.honorablekills,
			guild : response.data.guild,
			achievement : response.data.achievementpoints,
			tal_table : talentarray,
			eq_array: equipmentarray,
			prof_table: proffarray,
			pvpteams_table: pvptable,
			gs: gearscore,
			ilvl : ilvltemp,
			classword: response.data.class,
			classcolor: classhex,
			});
		})
		.catch((args)=>{
			
			reject({
			})
		})
		.finally(()=>{
			deleteError(args[0],args[3])
		})
	})
}

async function deleteError(name , id){
	let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE);
	db.serialize(function(rows){
		let smmt = db.prepare(`DELETE FROM guildinfo WHERE messageid = ? AND name = ? AND membercount =?`);
	 	smmt.run(id , name , "temp");
	 	smmt.finalize()
	 	db.close()
   });
}
module.exports = {axiosgatherer,axiosgathererPlayer}