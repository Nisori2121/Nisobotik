const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Отправить подумать пользователя о своём поведении")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription(
          "Пользователь, которому следует подумать о своём поведении"
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("время")
        .setDescription("Укажите в минутах")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const member = interaction.options.getMember("пользователь");
    const user = interaction.options.getUser("пользователь");
    const time = interaction.options.getInteger("время");

    if (user.id === interaction.user.id) {
      await interaction.reply({
        content: "Вы не можете выдать мут **самому себе!**",
        ephemeral: true,
      });
      return;
    }
    if (Number(time) === 0) {
      await interaction.reply({
        content: "Запрещено указывать **0** минут!",
        ephemeral: true,
      });
      return
    }
    if (!member.moderatable) {
      await interaction.reply({
        content: `У бота недостаточно прав для выполнения данной команды`,
        ephemeral: true,
      });
    } else if (member.moderatable) {
      await member.timeout(time * 60 * 1000).catch(console.error);
      await interaction.reply({
        content: `Вы отправили пользователя ${user} подумать о своём поведении!`,
        ephemeral: true,
      });
    }
  },
};
