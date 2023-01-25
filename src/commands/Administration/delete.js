const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Product = require("../../models/Product");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Удалить товар")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Введите уникальный ID товара")
        .setRequired(true)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const id = interaction.options.getString("id")

        const productSchema = await Product.findOne({ _id: id }) 
        if(!productSchema) {
            await interaction.reply({
                content: "Ничего не найдено!",
                ephemeral: true
            })
            return
        }
        await Product.deleteOne({ _id: id})

        await interaction.reply({
            content: "Товар был удалён!",
            ephemeral: true
        })
    }
};