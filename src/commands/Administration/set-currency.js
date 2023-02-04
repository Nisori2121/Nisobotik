const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Settings = require("../../models/Settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-currency")
    .setDescription("Установить валюту")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("название")
        .setDescription("Введите название для валюты")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const currencyName = interaction.options.getString("название");

    const settingSchema =
      (await Settings.findOne({ id: 0 })) ?? (await Settings.create({ id: 0 }));

    settingSchema?.currencyName = currencyName
    settingSchema.save().catch((err) => console.log(err))

    await interaction.reply({
      content: "Вы успешно установили название для валюты",
      ephemeral: true,
    });
  },
};
