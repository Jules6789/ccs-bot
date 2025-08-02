import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// ========== Commande Slash ==========
const commands = [
  new SlashCommandBuilder()
    .setName('écrire')
    .setDescription('Le bot écrit le message à ta place')
    .addStringOption(option =>
      option.setName('texte')
        .setDescription('Le message à envoyer')
        .setRequired(true))
].map(cmd => cmd.toJSON());

(async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Commande /écrire ajoutée');
  } catch (err) {
    console.error('❌ Erreur lors de l’enregistrement des commandes :', err);
  }
})();

// ========== Écoute des interactions ==========
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'écrire') {
    try {
      const texte = interaction.options.getString('texte');
      await interaction.reply({ content: texte, ephemeral: false });
    } catch (err) {
      console.error('❌ Erreur pendant l’exécution de la commande /écrire :', err);
    }
  }
});

// ========== Gestion des erreurs globales ==========
process.on('unhandledRejection', (error) => {
  console.error('💥 Rejection non gérée :', error);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Erreur non interceptée :', err);
});

client.login(process.env.TOKEN);
