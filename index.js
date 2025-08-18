import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// ========== Commandes Slash ==========
const commands = [
  new SlashCommandBuilder()
    .setName('écrire')
    .setDescription('Le bot écrit le message à votre place dans le salon')
    .addStringOption(option =>
      option.setName('texte')
        .setDescription('Le message à envoyer')
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription("Image à joindre (facultative)")
    ),

  new SlashCommandBuilder()
    .setName('envoyer')
    .setDescription('Envoyer un message privé à un utilisateur, anonymement')
    .addUserOption(option =>
      option.setName('destinataire')
        .setDescription("L'utilisateur à qui envoyer le message")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('texte')
        .setDescription('Le message à envoyer')
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

// Enregistrement des commandes
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: commands }
);

// ========== Réactions aux commandes ==========
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'écrire') {
    const texte = interaction.options.getString('texte');
    const image = interaction.options.getAttachment('image');

    const messagePayload = { content: texte };
    if (image) {
      messagePayload.files = [image];
    }

    await interaction.reply({ content: '✅ Message envoyé !', ephemeral: true });
    await interaction.channel.send(messagePayload);
  }

  else if (interaction.commandName === 'envoyer') {
    const user = interaction.options.getUser('destinataire');
    const texte = interaction.options.getString('texte');

    await interaction.deferReply({ ephemeral: true });

    try {
      await user.send(`📨 ${texte}`);
      await interaction.editReply('✅ Message privé envoyé anonymement !');
    } catch (err) {
      await interaction.editReply('❌ Impossible d’envoyer un message privé à cet utilisateur.');
    }
  }
});

client.login(process.env.TOKEN);
