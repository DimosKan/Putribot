const axios = require('axios').default;
const fs = require('fs')
const path = require('path');
const rawdata = require('/root/putribot/Jsonlibs/discservicons.json');

async function axiosgatherer(guildname,servername){
	guildname = guildname.replaceAll(" ", "+");
	const link = `http://armory.warmane.com/api/guild/${guildname}/${servername}/summary`;
	return await new Promise((resolve, reject) => {
		const instance = axios.create();
		axios.get(link).then(function (response){
			let onlinearray = [];
			let classtable = rawdata;
			response.data.roster.forEach((user, index,error) => {
				classicon = classtable["classes"][user.class];
				if (user.online)onlinearray.push(`${classicon} ${user.name}`);
			})
			if (onlinearray === []){
				let onlinearray = onlinearray.tostring("None")
			}
			resolve({
			onl_array : onlinearray.toString(),
			membercount: response.data.membercount,
			leader: response.data.leader.name,
			leaderclass: classtable["classes"][response.data.leader.class],
			linkready: link
			});	
		}).catch(function (error) {
			if (error.response) {
				console.log('Error', error.message);
			  
			}
			console.log(error.config);
			reject("Κάτι πήγε λάθος");
		  });
	});
}
module.exports = {axiosgatherer}