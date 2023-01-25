const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Settings = require("../../models/Settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-gif")
    .setDescription("Добавить новое Gif-изображение")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("gif")
        .setDescription("Введите ссылку на gif")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("категория")
        .setDescription("Выберите нужную категорию")
        .setRequired(true)
        .addChoices(
          { name: "Ударить", value: "Ударить" },
          { name: "Обнять", value: "Обнять" },
          { name: "Убить", value: "Убить" },
          { name: "Поцеловать", value: "Поцеловать" },
          { name: "Курить", value: "Курить" },
          { name: "Есть", value: "Есть" },
          { name: "Плакать", value: "Плакать" },
          { name: "Танцевать", value: "Танцевать" },
          { name: "Рукопожатие", value: "Рукопожатие" },
          { name: "Anal", value: "Anal" },
          { name: "Suck", value: "Suck" },
          { name: "Cum", value: "Cum" },
          { name: "Sex", value: "Sex" },
          { name: "Otliz", value: "Otliz" }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const gifLink = interaction.options.getString("gif");
    const category = interaction.options.getString("категория");

    const settingSchema =
      (await Settings.findOne({ id: 0 })) ?? (await Settings.create({ id: 0 }));

    switch (category) {
      case "Ударить":
        settingSchema.gifs.hitGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Обнять":
        settingSchema.gifs.hugGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Убить":
        settingSchema.gifs.killGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Поцеловать":
        settingSchema.gifs.kissGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Курить":
        settingSchema.gifs.smokeGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Есть":
        settingSchema.gifs.eatGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Плакать":
        settingSchema.gifs.cryGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Танцевать":
        settingSchema.gifs.danceGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Рукопожатие":
        settingSchema.gifs.handGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Anal":
        settingSchema.gifs.analGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Suck":
        settingSchema.gifs.suckGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Cum":
        settingSchema.gifs.cumGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Sex":
        settingSchema.gifs.sexGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
      case "Otliz":
        settingSchema.gifs.otlizGifs.push(gifLink);
        await settingSchema.save().catch(() => {});
        break;
    }
    await interaction.reply({
      content: "Новая гифка успешно добавлена!",
      ephemeral: true,
    });
  },
};
