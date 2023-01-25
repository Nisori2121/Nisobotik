const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anti-rep")
    .setDescription("Повысить анти-репутацию пользователю")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Пользователь для повышение репутации")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("пользователь", true);
    if (user.id === interaction.user.id) {
      await interaction.reply({
        content: "Вы не можете повысить анти-репутацию **себе**!",
        ephemeral: true,
      });
      return;
    } else if (user.id === "852634898355454002") {
      await interaction.reply({
        content: "Этот человек слишком крут для того чтобы его антирепать",
        ephemeral: true,
      });
      return;
    }
    const userSchema2 =
      (await User.findOne({ userId: interaction.user.id })) ??
      (await User.create({ userId: interaction.user.id }));

    if (21600000 > Number(Date.now() - userSchema2.antirepCooldown)) {
      await interaction.reply({
        content: "Повторите данную команду позже!",
        ephemeral: true,
      });
      return;
    }

    const userSchema =
      (await User.findOne({ userId: user.id })) ??
      (await User.create({ userId: user.id }));

    function getRandomElem(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    const imageArray = [
      "https://media.discordapp.net/attachments/894291467533688832/1045416664352702464/6CBA2726-324F-408B-9584-DFB5E0B27993.jpg",
      "https://media.discordapp.net/attachments/1050707431778439171/1050708900321701928/9511DF02-ED3F-46E5-89A5-68448E907D47.jpg",
      "https://media.discordapp.net/attachments/1050707431778439171/1050708934354284595/39AC3F1B-ADF7-400F-9121-1FAB44412256.png?width=919&height=671",
      "https://media.discordapp.net/attachments/894291467533688832/1045416663136358440/01BACA72-19FC-4774-8D13-41A139F45E28.jpg?width=667&height=671",
      "https://media.discordapp.net/attachments/1050707431778439171/1050709081410777098/IMG_4604.jpg",
    ];

    userSchema.antirepAmount += 1;
    userSchema2.antirepCooldown = Date.now();

    Promise.all([
      userSchema2.save().catch((error) => console.log(error)),
      userSchema.save().catch((error) => console.log(error)),
    ]);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Повышение анти-репутации — ${user.tag}`)
          .setDescription(
            `${interaction.user} **увеличил** анти-репутацию ${user}!`
          )
          .setColor("#2f3136")
          .setImage(getRandomElem(imageArray)),
      ],
    });
  },
};
