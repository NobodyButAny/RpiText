const http = require('http');
const { SlashCommandBuilder } = require('@discordjs/builders');

function sendLines(msg1, msg2) {
	const reqFirstLine = http.request(`http://192.168.1.140:3000/?text=[${msg1}]&line=0`, _ => { });
	const reqSecondLine = http.request(`http://192.168.1.140:3000/?text=${msg2}&line=1`, _ => { });
	reqFirstLine.on('error', e => console.error(`problem with ${e.message}`));
	reqSecondLine.on('error', e => console.error(`problem with ${e.message}`));
	reqFirstLine.end();
	reqSecondLine.end();
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pager')
		.setDescription('Write a message').addStringOption(option =>
			option.setName('text')
				.setDescription('text to send')
				.setRequired(true)),
	async execute(interaction) {
		const member = interaction.member;
		let message = interaction.options.getString('text');
		const author = member.nickname ? member.nickname : member.user.username;

		sendLines(author, message);

		await interaction.reply(`[${author}] - ${message}`);
	},
};
