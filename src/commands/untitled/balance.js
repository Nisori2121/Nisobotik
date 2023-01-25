const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Узнать баланс пользователя")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Выберите пользователя")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const user =
      interaction.options.getUser("пользователь") ?? interaction.user;

    const userSchema =
      (await User.findOne({ userId: user.id })) ??
      (await User.create({ userId: user.id }));

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Баланс — ${user.tag}`)
          .setColor("#2f3136")
          .addFields({
            name: "Баланс пользователя",
            value: codeBlock(userSchema.currency),
            inline: true,
          })
          .setImage(
            "https://cdn.discordapp.com/attachments/948283010627825704/1022890258943193238/20220923_181646.gif"
          )
          .setThumbnail(user.displayAvatarURL()),
      ],
    });
  },
};
