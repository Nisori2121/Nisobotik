const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Settings = require("../../models/Settings");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("money-rating")
    .setDescription("Рейтинг пользователей по балансу")
    .setDMPermission(false),
  async execute(interaction, client) {
    const users = await User.find().filter((x) => x.currency > 0);

    const settingSchema =
    (await Settings.findOne({ id: 0 })) ?? (await Settings.create({ id: 0 }));

    let sort = users.sort((a, b) => b.currency - a.currency);
    let top30 = sort.slice(0, 30);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Рейтинг пользователей - Баланс`)
          .setDescription(
            `**Топ 1 - 30** \n \n${
              top30.length
                ? top30
                    .map(
                      (user, index) =>
                        `**${index + 1}.** <@${user.userId}> — **${user.currency}** ${settingSchema.currencyName}`
                    )
                    .join("\n")
                : "Пользователей в списке нет."
            }`
          )
          .setColor("#2f3136")
      ],
    });
  },
};
