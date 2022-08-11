const { EmbedBuilder } = require('discord.js');

async function embedbody(guild_name,server_name,leader_class,leader_name,member_count,members_online){ 
	return await new Promise((resolve, reject) => {
		const guildembed= {
			color: 0x82D200,
			title: `${guild_name}-${server_name}`,
			url: `https://discord.js.org`, //ToDo Na petaei auton pou klikarei sto Warmane armory tou paixti
			author: {
				name: 'Professor Putricide',
				icon_url: 'https://static.wikia.nocookie.net/wowpedia/images/6/67/Professor_Putricide_HS.jpg/revision/latest/scale-to-width-down/200?cb=20170808222534',
			},
			description: `Everything concerning the guild ${guild_name} `,
			fields: [
				{
					name: `Leader:`,
					value: `${leader_class}${leader_name}`,
					inline: true
				},
				{
					name: `Total Members:`,
					value: `${member_count}`,
					inline: true,
				},
				{
					name: '\u200b',
					value: '\u200b',
					inline: false,
				},
				{
					name: 'Members online:',
					value: `${members_online}`,
					inline: false,
				},
			],
			image: {
				url: 'https://static.wikia.nocookie.net/wowpedia/images/6/67/Professor_Putricide_HS.jpg/revision/latest/scale-to-width-down/200?cb=20170808222534',
			},
			timestamp: new Date(),
			footer: {
				text: 'Tastes like... cherry! Oh! Excuse me!',
				icon_url: 'https://static.wikia.nocookie.net/wowpedia/images/6/67/Professor_Putricide_HS.jpg/revision/latest/scale-to-width-down/200?cb=20170808222534',
			},
		};
		resolve({
			G_embed : guildembed
		})
	})	
}


async function embedbodyplayer(pname,prealm,pstatus,plevel,pfaction,prace,pclass,phonoroablekills,pguild,pfachieve,ptalent,pgear,pprofes,ppvpteam,gs,ilvl,pclassword,classcolor){ 
	return await new Promise((resolve, reject) => {

		for (i = 0 ; i<18 ; i++){
			if (pgear[i] == undefined ){pgear[i] = "\u200b";}
		}
		if(pguild){
			pguild = `of guild ${pguild}`
			
		} else {
			pguild = ""
		}

		if(ptalent[1]){
			ptalent[1] = `/ ${ptalent[1]}`
		} else {
			ptalent[1] = ""
		}

		if (pstatus ==true){
			pstatus = "{Online}";
		}else{
			pstatus = "";
		}
		if(pprofes[0] == undefined && pprofes[1] == undefined){
			pprofes[0] = "None"
			pprofes[1] = ""	
		} else if(!pprofes[1]==undefined) {
			pprofes[1] = ""
		}

		if (ppvpteam==""){
			ppvpteam="None"
		}

		const playerembed= {
			color: classcolor,
			title: `${pname} - ${prealm} (${plevel}) ${pstatus}`,
			url: `https://discord.js.org`, //ToDo Na petaei auton pou klikarei sto Warmane armory tou paixti
			author: {
				name: 'Professor Putricide',
				icon_url: 'https://static.wikia.nocookie.net/wowpedia/images/6/67/Professor_Putricide_HS.jpg/revision/latest/scale-to-width-down/200?cb=20170808222534',
			},
			description: `${ptalent[0]}${ptalent[1]} ${pclassword} ${pguild}`,
			fields: [
				{
					name: "Race/Class",
					value: `${prace}/${pclass}`,
					inline: true
				},
				{
					name: `Professions:`,
					value: `${pprofes[0]}\n${pprofes[1]}`,
					inline: true,
				},
				{
					name: `Achievement Points`,
					value: `${pfachieve}`,
					inline: true,
				},
				{
					name: 'Honorable Kills',
					value: `${phonoroablekills}`,
					inline: true,
				},
				{
					name: 'GS / ilvl',
					value: `${gs} / ${ilvl}`,
					inline: true,
				},
				{
					name: '\u200b',
					value: '\u200b',
					inline: true,
				},
				{
					name: 'Equipment',
					value: `${pgear[0]}\n${pgear[1]}\n${pgear[2]}\n${pgear[3]}\n${pgear[4]}\n${pgear[5]}`,
					inline: true,
				},
				{
					name: '\u200b',
					value: `${pgear[6]}\n${pgear[7]}\n${pgear[8]}\n${pgear[9]}\n${pgear[10]}\n${pgear[11]}`,
					inline: true,
				},
				{
					name: '\u200b',
					value: `${pgear[12]}\n${pgear[13]}\n${pgear[14]}\n${pgear[15]}\n${pgear[16]}\n${pgear[17]}`,
					inline: true,
				},
				{
					name: 'Arena Teams:',
					value: `\u200b${ppvpteam}`,
					inline: false,
				},

			],
			timestamp: new Date(),
			footer: {
				text: 'Tastes like... cherry! Oh! Excuse me!',
				icon_url: 'https://static.wikia.nocookie.net/wowpedia/images/6/67/Professor_Putricide_HS.jpg/revision/latest/scale-to-width-down/200?cb=20170808222534',
			},
		};
		resolve({
			P_embed : playerembed
		})
	})	
}

module.exports = {embedbody,embedbodyplayer}