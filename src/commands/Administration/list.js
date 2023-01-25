const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Product = require("../../models/Product");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("products-list")
    .setDescription("Список всех товаров")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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

    const products = await Product.find();

    const generateEmbed = async (start) => {
      const current =
        products.length > 5 ? products.slice(start, start + 5) : products;

      try {
        return new EmbedBuilder()
          .setTitle("Магазин товаров")
          .setDescription(
            `${
              current.length
                ? current
                    .map(
                      (product, index) =>
                        `**${start + (index + 1)})** ${
                          product.content.name
                        } \n ID: **${
                          product._id.toString()
                        }** \n \n Цена: **${product.price}** \n`
                    )
                    .join("\n")
                : `**Пока-что** ничего нет.`
            }`
          )
          .setColor("#2f3136")
          .setThumbnail(interaction.user.displayAvatarURL());
      } catch (err) {
        console.error(err.message);
      }
    };
    const current = products.length > 5 ? products.slice(0, 0 + 5) : products;
    const canFitOnOnePage = products.length <= 6;

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
                ...(currentIndex + 5 < products.length
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
                ...(currentIndex + 5 < products.length
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
