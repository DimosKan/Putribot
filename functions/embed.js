const { MessageEmbed } = require('discord.js');

async function embedbody(guild_name,server_name,leader_class,leader_name,member_count,members_online,link){ 

const guildstats = new MessageEmbed()
    	.setColor('#0099ff')
		.setTitle(`${guild_name} - ${server_name}`)
		.setURL(`${link}`)
		.setAuthor({ name: 'Professor Putricide', iconURL: 'https://static.wikia.nocookie.net/wowpedia/images/6/67/Professor_Putricide_HS.jpg/revision/latest/scale-to-width-down/200?cb=20170808222534', url: 'https://warmane.com/' })
		.setDescription(`Leader: ${leader_class} ${leader_name}`)
		.addFields(
			{ name: 'Members online', value: `${members_online}` },
			{ name: '\u200B', value: '\u200B' },
		)
		.addField(`Members in guild: ${member_count}`,true)
		.setTimestamp()
		.setFooter({ text: 'Good news everyone!', iconURL: 'https://static.wikia.nocookie.net/wowpedia/images/6/67/Professor_Putricide_HS.jpg/revision/latest/scale-to-width-down/200?cb=20170808222534' });

		//message.reply({ embeds: [guildstats] });




module.exports = {embedbody}