const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear-allmoney")
    .setDescription("Обнулить всем счета")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true })


    await User.updateMany({}, { currency: 0 })


    await interaction.editReply({
        content: "Все счета успешно обнулены!",
        ephemeral: true,
      });
     
  }
};
