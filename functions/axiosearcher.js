const axios = require('axios').default;
const fs = require('fs')
const path = require('path');
const rawdata = require('/root/putribot/Jsonlibs/discservicons.json');
const util = require('util');

async function axiosgatherer(guildname,servername){
	guildname = guildname.replaceAll(" ", "+");
	const link = `http://armory.warmane.com/api/guild/${guildname}/${servername}/summary`;
	return await new Promise((resolve, reject) => {
		axios.get(link).then(function (response){
			// console.log("My Response status was: " + response.status);
			// console.log("My Response request was: " + util.inspect(response.request));
			// console.log("My Response data was: " + util.inspect(response.data));
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
			// if (error.response) {
			// 	console.log('Error', error.message);
			  
			// }
			// console.log(error.config);
			reject(error);
		  });
	});
}
module.exports = {axiosgatherer}