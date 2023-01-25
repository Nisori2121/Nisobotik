const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duel")
    .setDescription("Предложить дуэль пользователю")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Выберите пользователя для дуэли")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("пользователь", true);

    if (user.id === interaction.user.id) {
      await interaction.reply({
        content: "Вы **не можете** начать дуэль с сами собой!",
        ephemeral: true,
      });
      return;
    }

    const invite = await interaction.reply({
      content: `<@${user.id}>`,
      embeds: [
        new EmbedBuilder()
          .setTitle("Предложение о дуэли")
          .setColor("#2f3136")
          .setDescription(`${interaction.user} пригласил **вас** на дуэль!`)
          .setFooter({ text: "Время на ответ даётся 30 секунд." })
          .setThumbnail(interaction.user.displayAvatarURL()),
      ],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel("Принять")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("accept"),

          new ButtonBuilder()
            .setLabel("Отклонить")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("decline"),
        ]),
      ],
    });
    const collector = invite.createMessageComponentCollector({
      filter: (i) => i.user.id === user.id,
      time: 31000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "accept") {
        await i.reply({
          content: "Вы согласились на дуэль!",
          ephemeral: true,
        });

        const weaponsArray = ["︻デ┳═ー", "/'̿̿ ̿ ̿̿", "︻╦╤─"];

        const damageTo = [
          "в ногу",
          "в руку",
          "в ногу",
          "в руку",
          "прямо в голову",
          "в шею",
          "в тело",
          "в тело",
        ];

        function getRandomElem(array) {
          return array[Math.floor(Math.random() * array.length)];
        }

        const damageToByUser = getRandomElem(damageTo);
        const damageToByInteractionUser = getRandomElem(damageTo);

        let damageByUser;
        let damageByInteractionUser;
        let array;

        if (damageToByUser === "в ногу") {
          array = [10, 20, 30, 40, 35, 22, 26, 38];
          damageByUser = getRandomElem(array);
        } else if (damageToByUser === "в руку") {
          array = [10, 15, 30, 35, 50, 45, 48, 18];
          damageByUser = getRandomElem(array);
        } else if (damageToByUser === "прямо в голову") {
          damageByUser = 100;
        } else if (damageToByUser === "в шею") {
          array = [99, 100];
          damageByUser = getRandomElem(array);
        } else if (damageToByUser === "в тело") {
          array = [30, 45, 35, 38, 42, 55, 67, 70, 69];
          damageByUser = getRandomElem(array);
        }

        if (damageToByInteractionUser === "в ногу") {
          array = [10, 20, 30, 40, 35, 22, 26, 38];
          damageByInteractionUser = getRandomElem(array);
        } else if (damageToByInteractionUser === "в руку") {
          array = [10, 15, 30, 35, 50, 45, 48, 18];
          damageByInteractionUser = getRandomElem(array);
        } else if (damageToByInteractionUser === "прямо в голову") {
          damageByInteractionUser = 100;
        } else if (damageToByInteractionUser === "в шею") {
          array = [99, 100];
          damageByInteractionUser = getRandomElem(array);
        } else if (damageToByInteractionUser === "в шею") {
          array = [30, 45, 35, 38, 42, 55, 67, 70, 69];
          damageByInteractionUser = getRandomElem(array);
        }

        const winner =
          damageByUser > damageByInteractionUser
            ? user.tag
            : damageByUser === damageByInteractionUser
            ? "Ничья"
            : interaction.user.tag;

        await interaction.editReply({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setTitle("Началась дуэль")
              .setColor("#2f3136")
              .setDescription(
                `${
                  damageByUser > damageByInteractionUser
                    ? `${user} наносит **${damageByUser}** урона **${damageToByUser}** ${
                        interaction.user
                      } используя ${getRandomElem(weaponsArray)}`
                    : damageByUser == damageByInteractionUser
                    ? "Оба участника дуэли нанесли **одинаковый урон**."
                    : `${
                        interaction.user
                      } наносит **${damageByInteractionUser}** урона ${damageToByInteractionUser} ${user} используя ${getRandomElem(
                        weaponsArray
                      )}`
                }`
              )
              .setFooter({ text: `Победитель: ${winner}` })
              .setThumbnail(interaction.user.displayAvatarURL()),
          ],
          components: [],
        });
        collector.stop("none");
      }

      if (i.customId === "decline") {
        await i.reply({
          content: "Вы отказались от дуэли.",
          ephemeral: true,
        });

        await interaction.editReply({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setTitle("Предложение о дуэли")
              .setColor("#2f3136")
              .setDescription(
                `${user} отказался от дуэли с ${interaction.user}!`
              )
              .setThumbnail(interaction.user.displayAvatarURL()),
          ],
          components: [],
        });
        collector.stop("canceled");
      }
    });
    collector.on("end", async (collected, reason) => {
      if (reason !== "time") return;
      await interaction.editReply({
        content: "",
        embeds: [
          new EmbedBuilder()
            .setTitle("Предложение о дуэли")
            .setColor("#2f3136")
            .setDescription(
              `${user} не успел ответить на предложение ${interaction.user}!`
            )
            .setThumbnail(interaction.user.displayAvatarURL()),
        ],
        components: [],
      });
    });
  },
};
