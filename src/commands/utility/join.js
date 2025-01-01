const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const main = async (interaction) => {
	const channel = await interaction.member.voice.channel;

	let connection = getVoiceConnection(interaction.guild.id);
	console.log(connection);

	if (!channel) {
		interaction.reply('Join a voice channel!');
		return;
	}
	if (connection) {
		interaction.reply('Already in a channel!');
	};

	connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});

	// console.log(connection);
};

module.exports = {
	data: new SlashCommandBuilder().setName('join').setDescription('Joins call!'),
	async execute(interaction) {
		await main(interaction);
	},
};