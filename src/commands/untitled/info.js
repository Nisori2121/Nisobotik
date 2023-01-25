const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Посмотреть информацию о пользователе")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Пользователь для просмотра")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const user =
      interaction.options.getUser("пользователь", false) ?? interaction.user;

    const userSchema =
      (await User.findOne({ userId: user.id })) ??
      (await User.create({ userId: user.id }));

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Информация — ${user.tag}`)
          .setColor("#2f3136")
          .addFields({
            name: "Репутация",
            value: codeBlock(userSchema.repAmount),
            inline: true
          })
          .addFields({
            name: "Анти-репутация",
            value: codeBlock(userSchema.antirepAmount),
            inline: true
          })
          .setImage("https://cdn.discordapp.com/attachments/948283010627825704/1022890258943193238/20220923_181646.gif")
          .setThumbnail(user.displayAvatarURL())
          
      ],
    });
  },
};
