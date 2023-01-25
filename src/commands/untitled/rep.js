const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rep")
    .setDescription("Повысить репутацию пользователю")
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
        content: "Вы не можете повысить репутацию **себе**!",
        ephemeral: true,
      });
      return;
    }
    const userSchema2 =
      (await User.findOne({ userId: interaction.user.id })) ??
      (await User.create({ userId: interaction.user.id }));

    if(21600000 > Number(Date.now() - userSchema2.repCooldown)) {
      await interaction.reply({
        content: "Повторите данную команду позже!",
        ephemeral: true
      })
      return
    }

    const userSchema =
      (await User.findOne({ userId: user.id })) ??
      (await User.create({ userId: user.id }));


    function getRandomElem(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    const imageArray = [
      "https://media.discordapp.net/attachments/1050707431778439171/1050708051587518544/864D81E5-964E-491B-B34C-2492FCB60A1F.jpg?width=1193&height=671",
      "https://media.discordapp.net/attachments/894291467533688832/1045416663748714537/D59F3EBB-50DA-4F12-A80E-DB2DC46CB526.png",
      "https://media.discordapp.net/attachments/894291467533688832/1045416664835051551/FCC76988-109F-4D4D-917E-D631DD83A347.jpg",
      "https://media.discordapp.net/attachments/1050707431778439171/1050708408556322856/0BC0ADED-D644-4B70-A642-5C441D1FB928.jpg?width=1193&height=671",
      "https://media.discordapp.net/attachments/1050707431778439171/1050708586713587793/IMG_4599.jpg?width=1193&height=671",
    ];

    
    userSchema.repAmount += 1;
    userSchema2.repCooldown = Date.now()

    Promise.all([
    userSchema.save().catch((error) => console.log(error)),
    userSchema2.save().catch((error) => console.log(error))
    ])

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Повышение репутации — ${user.tag}`)
          .setDescription(`${interaction.user} **увеличил** репутацию ${user}!`)
          .setColor("#2f3136")
          .setImage(getRandomElem(imageArray)),
      ],
    });
  },
};
