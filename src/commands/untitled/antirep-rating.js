const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antirep-rating")
    .setDescription("Рейтинг пользователей по анти репутации")
    .setDMPermission(false),
  async execute(interaction, client) {
    const users = await User.find().filter((x) => x.antirepAmount > 0);
    let sort = users.sort((a, b) => b.antirepAmount - a.antirepAmount);
    let top30 = sort.slice(0, 30);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Рейтинг пользователей - Анти-репутация`)
          .setDescription(
            `**Топ 1 - 30** \n \n${
              top30.length
                ? top30
                    .map(
                      (user, index) =>
                        `**${index + 1}.** <@${user.userId}> — **${user.antirepAmount}**`
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