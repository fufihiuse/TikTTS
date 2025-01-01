const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, StreamType, NoSubscriberBehavior, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const { config, createAudioFromText } = require('tiktok-tts');
const { deleteTemp } = require('../../helpers/deleteTemp.js');
const path = require('path');

const tempPath = path.resolve(`${__dirname}/temp.mp3`);
const MAX_TTS_LENGTH = 300;

// Create audio player
const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Stop,
    },
});

const getTTS = async (msg, voice) => {

    try {
        config(process.env.SESSION_ID, process.env.TIKTOK_URL);
        await createAudioFromText(msg, `${__dirname}/temp`, voice);
    }
    catch (err) {
        console.log(`TTS Error: ${err}`);
        return false;
    }
    return true;
};

const playTTS = async () => {
    const resource = createAudioResource(tempPath, {
        inputType: StreamType.Arbitrary,
    });

    player.play(resource);

    return entersState(player, AudioPlayerStatus.Playing, 5000);
};

const main = async (interaction) => {
    const text = interaction.options.getString('text').slice(0, MAX_TTS_LENGTH);
    const voice = interaction.options.getString('voice') ?? 'en_us_002';

    let connection = getVoiceConnection(interaction.guild.id);
    const channel = await interaction.member.voice.channel;

    if (!channel) {
        interaction.editReply('Join a voice channel!');
        return;
    }
    else if (!connection) {
        console.log('Already in channel');
        connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 30_00);
        }
        catch (err) {
            connection.destroy();
            throw err;
        }
    };

    // Handle disconnect
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Probably reconnecting to a new channel
        }
        catch (err) {
            console.log(`Disconnect error: ${err}`);
            connection.destroy();
            interaction.editReply('Error! Make sure this bot has permission to view the channel and call.');
        }
    });

    player.on(AudioPlayerStatus.Idle, () => {
        deleteTemp(tempPath);
    });


    // Subscribe player
    connection.subscribe(player);

    // Create audio player, play, destroy?
    if (!await getTTS(text, voice)) {
        interaction.editReply('An error occured!');
    }
    playTTS();
    interaction.editReply(text);
};

// Clear temp file on startup
console.log(`Temp file path: ${tempPath}`);
deleteTemp(tempPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiktts')
        .setDescription('Sends a TTS Message!')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to send')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('voice')
                .setDescription('The Voice to Use')
                .setRequired(false)
                .addChoices(
                    { name: 'Game On', value: 'en_male_jomboy' },
                    { name: 'Warm', value: 'es_mx_002' },
                    { name: 'Wacky', value: 'en_male_funny' },
                    { name: 'Scream', value: 'en_us_ghostface' },
                    { name: 'Serious', value: 'en_male_cody' },
                    { name: 'Beauty Guru', value: 'en_female_makeup' },
                    { name: 'Bestie', value: 'en_female_richgirl' },
                    { name: 'Grinch', value: 'en_male_grinch' },
                    { name: 'Joey', value: 'en_us_006' },
                    { name: 'Story Teller', value: 'en_male_narration' },
                    { name: 'Deadpool', value: 'en_male_deadpool' },
                    { name: 'Narrator', value: 'en_uk_001' },
                    { name: 'Metro', value: 'en_au_001' },
                    { name: 'Alfred', value: 'en_male_jarvis' },
                    { name: 'Lord Cringe', value: 'en_male_ukneighbor' },
                    { name: 'Mr. Meticulous', value: 'en_male_ukbutler' },
                    { name: 'Debutante', value: 'en_female_shenna' },
                    { name: 'Varsity', value: 'en_female_pansino' },
                    { name: 'Pop Lullaby', value: 'en_female_f08_twinkle' },
                    { name: 'Classic Electric', value: 'en_male_m03_classical' },
                    { name: 'Cupid', value: 'en_male_cupid' },
                    { name: 'Granny', value: 'en_female_grandma' },
                    { name: 'Cozy', value: 'en_male_m2_xhxs_m03_christmas' },
                    { name: 'Author', value: 'en_male_santa_narration' },
                    { name: 'Chipmunk', value: 'en_male_m2_xhxs_m03_silly' },
                )),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        await main(interaction);
    },
};