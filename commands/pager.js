const http = require('http');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pager')
		.setDescription('Write a message').addStringOption(option =>
			option.setName('text')
				.setDescription('text to send')
				.setRequired(true)),
	
	async execute({interaction,client}) {
		const requests = JSON.parse(fs.readFileSync('commands\\requests.json'));
		
		const member = interaction.member;
		const author = member.nickname ? member.nickname : member.user.username;
		const message = interaction.options.getString('text');
		
		requests.array.push({message,author,expire:10000});
		fs.writeFileSync('commands\\requests.json',JSON.stringify(requests));

		await interaction.reply(`[${author}] - ${message}`);
	},
};
