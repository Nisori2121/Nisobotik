const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const User = require("./../../models/User")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit-currency")
    .setDescription("Изменить счёт пользователя")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Выберите пользователя")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("количество")
        .setDescription("Укажите на сколько хотите добавить/убрать валюты")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("действие")
        .setDescription("Выберите конкретное действие с счётом")
        .setRequired(true)
        .addChoices(
            { name: "Добавить к счёту", value: "Добавить"},
            { name: "Вычесть из счёта", value: "Вычесть"}
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const user = interaction.options.getUser("пользователь")
    const amount = interaction.options.getNumber("количество")
    const action = interaction.options.getString("действие")

    const userSchema = await User.findOne({ userId: user.id }) ?? await User.create({ userId: user.id })

    if(action === "Добавить") {
        userSchema.currency += amount
        userSchema.save().catch((error) => console.log(error))
    } else if(action === "Вычесть") {
        userSchema.currency -= amount
        if(userSchema.currency < 0) userSchema.currency = 0
        userSchema.save().catch((error) => console.log(error))
    }
    await interaction.reply({
        content: "Вы успешно изменили счёт пользователя!",
        ephemeral: true
    })
  },
};
