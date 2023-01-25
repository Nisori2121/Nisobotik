const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Забанить пользователя")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Выберите пользователя")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser("пользователь", true);

    if (user.id === interaction.user.id) {
      await interaction.reply({
        content: "Вы не можете забанить **себя**!",
        ephemeral: true,
      });
      return;
    }
    if(user.bannable) {
        await user.ban().catch(() => {})
        await interaction.reply({
            content: `Вы успешно забанили ${user}!`,
            ephemeral: true
        })
    } else if(!user.bannable) {
        await interaction.reply({
            content: "Вы не можете забанить **данного** пользователя!",
            ephemeral: true
        })
    }
  },
};
