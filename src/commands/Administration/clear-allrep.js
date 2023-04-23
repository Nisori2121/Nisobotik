const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear-allrep")
    .setDescription("Обнулить всем репутацию")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true })


    await User.updateMany({}, { repAmount: 0, antirepAmount: 0 })


    await interaction.editReply({
        content: "Вся репутация успешно обнулена!",
        ephemeral: true,
      });
     
  }
};
