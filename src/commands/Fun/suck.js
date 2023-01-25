const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Settings = require("../../models/Settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suck")
    .setDescription("Начать сосать у пользователя")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Выберите пользователя")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("пользователь");

    const settingSchema =
      (await Settings.findOne({ id: 0 })) ?? (await Settings.create({ id: 0 }));

    const gifs = settingSchema.gifs.suckGifs;

    function getRandomElem(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    if (user.id === interaction.user.id) {
      await interaction.reply({
        content: "Вы не можете выбрать себя!",
        ephemeral: true,
      });
      return;
    }
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Реакция - сосать")
          .setDescription(`${interaction.user} начал сосать у ${user}!`)
          .setThumbnail(interaction.user.displayAvatarURL())
          .setImage(
            getRandomElem(gifs) ??
              "https://cdn.discordapp.com/attachments/948283010627825704/1022890258943193238/20220923_181646.gif"
          )
          .setColor("2f3136"),
      ],
    });
  },
};
