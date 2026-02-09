const { Client, GatewayIntentBits, AttachmentBuilder, SlashCommandBuilder, REST, Routes } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [
  new SlashCommandBuilder()
    .setName("écrire")
    .setDescription("Envoie un message anonyme avec ou sans image")
    .addStringOption(option =>
      option.setName("message")
        .setDescription("Le message à envoyer")
        .setRequired(false))
    .addAttachmentOption(option =>
      option.setName("image1")
        .setDescription("Image facultative à envoyer"))
    .addAttachmentOption(option =>
      option.setName("image2")
        .setDescription("Deuxième image facultative"))
    .addAttachmentOption(option =>
      option.setName("image3")
        .setDescription("Troisième image facultative"))
    .addAttachmentOption(option =>
      option.setName("image4")
        .setDescription("Quatrième image facultative"))
    .addAttachmentOption(option =>
      option.setName("image5")
        .setDescription("Cinquième image facultative"))
    .addAttachmentOption(option =>
      option.setName("image6")
        .setDescription("Sixième image facultative"))
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

client.once("ready", async () => {
  console.log("✅ Bot prêt !");
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands.map(cmd => cmd.toJSON())
    });
    console.log("✅ Commande /écrire enregistrée !");
  } catch (err) {
    console.error("Erreur d’enregistrement :", err);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "écrire") {
    const message = interaction.options.getString("message");
    const images = [
      interaction.options.getAttachment("image1"),
      interaction.options.getAttachment("image2"),
      interaction.options.getAttachment("image3"),
      interaction.options.getAttachment("image4"),
      interaction.options.getAttachment("image5"),
      interaction.options.getAttachment("image6")
    ].filter(img => img);

    const files = images.map(img => new AttachmentBuilder(img.url));

    await interaction.reply({ content: "✅ Message envoyé !", ephemeral: true });

    if (message || images.length > 0) {
      await interaction.channel.send({
        content: message || "",
        files: files
      });
    }
  }
});

client.login(TOKEN);
