const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { default: mongoose } = require("mongoose");
const Product = require("../../models/Product");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Добавить новый товар")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("название")
        .setDescription("Введите название для товара")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("цена")
        .setDescription("Введите цену для товара")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("товар")
        .setDescription("Введите сам товар")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("описание").setDescription("Введите описание для товара")
    ),
  async execute(interaction, client) {
    const name = interaction.options.getString("название");
    const description =
      interaction.options.getString("описание", false) ??
      "Описание товара отсутствует";
    const price = interaction.options.getNumber("цена", true);
    const product = interaction.options.getString("товар");

    await Product.create({ _id:  mongoose.Types.ObjectId(),
      content: { name, description, product },
      price,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Создание нового товара")
          .setDescription(`${interaction.user}, новый товар был **успешно** создан!`)
          .setColor("#2f3136")
          .setThumbnail(interaction.user.displayAvatarURL()),
      ],
    });
  },
};
