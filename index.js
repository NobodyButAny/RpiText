// https://discord.com/api/oauth2/authorize?client_id=942076042506551337&permissions=3072&scope=bot%20applications.commands
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token, globalLoop } = require('./config.json');
const { interval } = require('rxjs');
const { sendRequest, Request, refreshQueue} = require('./utils.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
});

client.once('ready', () => {
	console.log('Ready!');
	client.globalInterval = interval(parseInt(globalLoop));

	client.globalInterval.subscribe(()=>{
		const nextRequest = refreshQueue('./commands/requests.json', globalLoop);
		if (nextRequest.isValid()) sendRequest(nextRequest);
	});
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute({interaction,client});
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);