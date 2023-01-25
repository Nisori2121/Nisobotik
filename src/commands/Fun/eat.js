const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Settings = require("../../models/Settings");

module.exports = {
  data: new SlashCommandBuilder().setName("eat").setDescription("Начать есть").setDMPermission(false),
  async execute(interaction, client) {
    const settingSchema =
      (await Settings.findOne({ id: 0 })) ?? (await Settings.create({ id: 0 }));

    const gifs = settingSchema.gifs.eatGifs

    function getRandomElem(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Реакция - есть")
          .setDescription(`${interaction.user} начал есть.`)
          .setColor("#2f3136")
          .setImage(getRandomElem(gifs) ?? "https://cdn.discordapp.com/attachments/948283010627825704/1022890258943193238/20220923_181646.gif")
          .setThumbnail(interaction.user.displayAvatarURL())
      ],
    });
  },
};