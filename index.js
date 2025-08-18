import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// ==== COMMANDE SLASH ====

const commands = [
  new SlashCommandBuilder()
    .setName('écrire')
    .setDescription('Le bot écrit le message à votre place.')
    .addStringOption(option =>
      option.setName('texte')
        .setDescription('Le message à envoyer')
        .setRequired(false)
    )
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('Image à envoyer')
        .setRequired(false)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
  { body: commands }
).then(() => console.log("🟢 Commande enregistrée."))
  .catch(console.error);

// ==== RÉPONSE À LA COMMANDE ====

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'écrire') {
    const texte = interaction.options.getString('texte');
    const image = interaction.options.getAttachment('image');

    await interaction.deferReply({ ephemeral: true });

    const messagePayload = {};
    if (texte) messagePayload.content = texte;
    if (image) messagePayload.files = [image.url];

    await interaction.channel.send(messagePayload);

    await interaction.editReply('✉️ Message envoyé sans mention de ton pseudo !');
  }
});

client.login(process.env.TOKEN);
