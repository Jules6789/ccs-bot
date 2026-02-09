const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, AttachmentBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder()
    .setName('écrire')
    .setDescription('Envoie un message anonyme dans le salon')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Le message à envoyer')
        .setRequired(false))
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('Image à envoyer')
        .setRequired(false)),
]
.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
  (async () => {
    try {
      console.log("🔁 Déploiement des commandes...");
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log("✅ Commandes déployées !");
    } catch (error) {
      console.error("❌ Erreur de déploiement :", error);
    }
  })();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'écrire') {
    const message = interaction.options.getString('message');
    const image = interaction.options.getAttachment('image');

    const channel = interaction.channel;

    try {
      if (message && image) {
        await channel.send({
          content: message,
          files: [image.url]
        });
      } else if (message) {
        await channel.send(message);
      } else if (image) {
        await channel.send({ files: [image.url] });
      } else {
        await interaction.reply({ content: '❌ Vous devez fournir un message ou une image.', ephemeral: true });
        return;
      }

      await interaction.reply({ content: '✅ Message envoyé !', ephemeral: true });

    } catch (err) {
      console.error('Erreur lors de l\'envoi du message :', err);
      try {
        await interaction.reply({ content: '❌ Une erreur est survenue.', ephemeral: true });
      } catch (_) {}
    }
  }
});

client.login(process.env.TOKEN);
