const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("history")
    .setDescription("История покупок")
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Посмотреть историю покупок у пользователя")
    ),
  async execute(interaction, client) {
    const backIdOFF = "1";
    const backId = "back";
    const forwardId = "forward";
    const forwardIdOFF = "2";

    const backButton = new ButtonBuilder()
      .setCustomId(backId)
      .setEmoji("◀️")
      .setStyle(ButtonStyle.Secondary);

    const backButtonOFF = new ButtonBuilder()
      .setCustomId(backIdOFF)
      .setEmoji("◀️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const forwardButton = new ButtonBuilder()
      .setCustomId(forwardId)
      .setEmoji("▶️")
      .setStyle(ButtonStyle.Secondary);

    const forwardButtonOFF = new ButtonBuilder()
      .setCustomId(forwardIdOFF)
      .setEmoji("▶️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    await interaction.deferReply();

    const target =
      interaction.options.getUser("пользователь") ?? interaction.user;

    const user =
      (await User.findOne({ userId: target.id })) ??
      (await User.create({ userId: target.id }));

    const history = user.purchasedHistory;

    const generateEmbed = async (start) => {
      const current =
        history.length > 5 ? history.slice(start, start + 5) : history;

      try {
        return new EmbedBuilder()
          .setTitle("История покупок")
          .setDescription(
            `${
              current.length
                ? current
                    .map(
                      (product, index) =>
                        `**${start + (index + 1)})** ${product} \n`
                    )
                    .join("\n")
                : `**Пока-что** ничего не куплено.`
            }`
          )
          .setColor("#2f3136")
          .setThumbnail(interaction.user.displayAvatarURL());
      } catch (err) {
        console.error(err.message);
      }
    };
    const canFitOnOnePage = history.length <= 6;

    let msg = await interaction.editReply({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage
        ? []
        : [
            new ActionRowBuilder({
              components: [backButtonOFF, forwardButton],
            }),
          ],
    });

    if (canFitOnOnePage) return;

    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
    });

    setTimeout(() => {
      msg.edit({
        embeds: [
          new EmbedBuilder()
            .setTitle("Магазин товаров")
            .setDescription("Время действия данного меню истекло.")
            .setColor("#2f3136")
            .setThumbnail(interaction.user.displayAvatarURL()),
        ],
        components: [
          new ActionRowBuilder().addComponents([
            backButton.setDisabled(true),
            forwardButton.setDisabled(true),
          ]),
        ],
      });
    }, 90 * 1000);

    let currentIndex = 0;

    collector.on("collect", async (i) => {
      if (i.customId === backId) {
        currentIndex -= 5;
        await i.update({
          embeds: [await generateEmbed(currentIndex)],
          components: [
            new ActionRowBuilder({
              components: [
                ...(currentIndex ? [backButton] : [backButtonOFF]),
                ...(currentIndex + 5 < history.length
                  ? [forwardButton]
                  : [forwardButtonOFF]),
              ],
            }),
          ],
        });
      } else if (i.customId === forwardId) {
        currentIndex += 5;
        await i.update({
          embeds: [await generateEmbed(currentIndex)],
          components: [
            new ActionRowBuilder({
              components: [
                ...(currentIndex ? [backButton] : [backButtonOFF]),
                ...(currentIndex + 5 < history.length
                  ? [forwardButton]
                  : [forwardButtonOFF]),
              ],
            }),
          ],
        });
      }
    });
    collector.on("ignore", async (i) => {
      await i.deferUpdate();
      console.log("ignored");
    });
    collector.on("end", (collected) => {
      console.log("end");
    });
  },
};
