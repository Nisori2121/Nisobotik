const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const Product = require("../../models/Product");
const Settings = require("../../models/Settings");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Магазин товаров"),
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

    const settingSchema =
      (await Settings.findOne({ id: 0 })) ?? (await Settings.create({ id: 0 }));

    const products = await Product.find();

    const generateBuyButtons = async (start) => {
      const current =
        products.length > 5 ? products.slice(start, start + 5) : products;

      try {
        return new ActionRowBuilder({
          components: current.length
            ? current.map((x) =>
                new ButtonBuilder()
                  .setLabel(`Купить ${x.content.name}`)
                  .setStyle(ButtonStyle.Primary)
                  .setCustomId(x._id.toString())
              )
            : [],
        });
      } catch (err) {
        console.error(err.message);
      }
    };
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
                        } \n Описание товара: **${
                          product.content.description
                        }** \n \n Цена: **${product.price}** ${
                          settingSchema.currencyName ?? "монет"
                        } \n`
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
        ? [
            new ActionRowBuilder({
              components: current.map((x) =>
                new ButtonBuilder()
                  .setLabel(`Купить ${x.content.name}`)
                  .setStyle(ButtonStyle.Primary)
                  .setCustomId(x._id.toString())
              ),
            }),
          ]
        : [
            new ActionRowBuilder({
              components: current.map((x) =>
                new ButtonBuilder()
                  .setLabel(`Купить ${x.content.name}`)
                  .setStyle(ButtonStyle.Primary)
                  .setCustomId(x._id.toString())
              ),
            }),
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
            await generateBuyButtons(currentIndex),
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
            await generateBuyButtons(currentIndex),
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
      } else {
        const findProduct = await Product.findOne({ _id: i.customId });
        if (!findProduct) {
          await i.reply({
            content: "Невозможно приобрести товар, товар не найден.",
            ephemeral: true,
          });
        } else if (findProduct) {
          const userSchema = await User.findOne({ userId: i.user.id });

          if (userSchema.currency < findProduct.price || !userSchema) {
            await i.reply({
              content: "У вас недостаточно средств!",
              ephemeral: true,
            });
          } else if (userSchema.currency >= findProduct.price) {
            userSchema.currency -= findProduct.price;
            userSchema.purchasedHistory.push(
              `${findProduct.content.name} - за ${findProduct.price} ${
                settingSchema.currencyName ?? "монет"
              }`
            );
            if (userSchema.currency < 0) userSchema.currency = 0;
            await userSchema.save().catch(() => {});

            await i.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Покупка товара")
                  .setDescription(
                    `${i.user}, вы **успешно** приобрели данный товар за **${
                      findProduct.price
                    }** ${
                      settingSchema.currencyName ?? "монет"
                    } \n \n Товар: **${findProduct.content.product}**`
                  )
                  .setColor("#2f3136")
                  .setThumbnail(interaction.user.displayAvatarURL()),
              ],
              ephemeral: true,
            });
            if (findProduct.roleAfterBought) {
              const role = await interaction.guild.roles.fetch(
                findProduct.roleAfterBought
              );
              await i.member.roles.add(role).catch(() => {});
            }
          }
        }
      }
    });
    collector.on("ignore", async (i) => {
      await i.deferUpdate();
    });
    collector.on("end", (collected) => {});
  },
};
