const axios = require('axios').default;
//const fs = require('fs')
//const path = require('path');
const rawdata = require('/root/putribot/Jsonlibs/discservicons.json');
//const util = require('util');

//outputs a JSON out of the GET request with detailed information of the guilds like players, who is online and so.
async function axiosgatherer(guildname,servername,client){
	if(guildname){guildname = guildname.replaceAll(" ", "+")}
	const link = `http://armory.warmane.com/api/guild/${guildname}/${servername}/summary`;
	return await new Promise((resolve, reject) => {
		axios.get(link).then(function (response){
			let onlinearray = [];
			let classtable = rawdata;
			if (!response.data.roster){console.log("Error on request");}
				response.data.roster.forEach((user, index,error) => {
					classicon = classtable["classes"][user.class];
					if (user.online)onlinearray.push(`${classicon} ${user.name}`);
				})
			resolve({
			onl_array : onlinearray.toString(),
			membercount: response.data.membercount,
			leader: response.data.leader.name,
			leaderclass: classtable["classes"][response.data.leader.class],
			linkready: link,
			client:client,
			Gn: response.data.name,
			Rn: response.data.realm
			});
		})
	})
}

module.exports = {axiosgatherer}