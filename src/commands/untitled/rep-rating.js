const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rep-rating")
    .setDescription("Рейтинг пользователей по репутации")
    .setDMPermission(false),
  async execute(interaction, client) {
    const users = await User.find().filter((x) => x.repAmount > 0);
    let sort = users.sort((a, b) => b.repAmount - a.repAmount);
    let top30 = sort.slice(0, 30);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Рейтинг пользователей - Репутация`)
          .setDescription(
            `**Топ 1 - 30** \n \n${
              top30.length
                ? top30
                    .map(
                      (user, index) =>
                        `**${index + 1}.** <@${user.userId}> — **${user.repAmount}**`
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