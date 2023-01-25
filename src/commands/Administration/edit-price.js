const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Product = require("../../models/Product");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit-price")
    .setDescription("Изменить цену товара")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Введите уникальный ID товара")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("цена")
        .setDescription("Введите новую цену")
        .setRequired(true)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const id = interaction.options.getString("id")
        const newPrice = interaction.options.getNumber("цена")

        const productSchema = await Product.findOne({ _id: id }) 
        if(!productSchema) {
            await interaction.reply({
                content: "Ничего не найдено!",
                ephemeral: true
            })
            return
        }
        productSchema.price = newPrice
        productSchema.save().catch(() => {})

        await interaction.reply({
            content: "Цена товара была изменена!",
            ephemeral: true
        })
    }
};
