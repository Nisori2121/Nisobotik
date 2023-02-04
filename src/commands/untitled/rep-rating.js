const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rep-rating")
    .setDescription("Рейтинг пользователей по репутации")
    .setDMPermission(false),
  async execute(interaction, client) {
    const users = await User.find()
    const filteredUsers = users.filter((x) => x.repAmount > 0);
    let sort = filteredUsers.sort((a, b) => b.repAmount - a.repAmount);
    let top40 = sort.slice(0, 40);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Рейтинг пользователей - Репутация`)
          .setDescription(
            `**Топ 1 - 40** \n \n${
              top40.length
                ? top40
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