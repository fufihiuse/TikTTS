const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { deleteTemp } = require('../../helpers/deleteTemp.js');
const path = require('path');


const main = async (interaction) => {
	const connection = getVoiceConnection(interaction.guild.id);
	if (!connection) {
		interaction.editReply('Not in a channel!');
		return;
	};

	connection.destroy();

	deleteTemp(path.resolve(`${__dirname}/temp.mp3`));

	interaction.editReply('Goodbye!')
};

module.exports = {
	data: new SlashCommandBuilder().setName('leave').setDescription('Leaves the call!'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });
		await main(interaction);
	},
};