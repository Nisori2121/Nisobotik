const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Settings = require("../../models/Settings");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("earn")
    .setDescription("Заработать валюту")
    .setDMPermission(false),
  async execute(interaction, client) {
    const userSchema =
      (await User.findOne({ userId: interaction.user.id })) ??
      (await User.create({ userId: interaction.user.id }));

    if (28800000 > Number(Date.now() - userSchema.earnCooldown)) {
      await interaction.reply({
        content: "Повторите данную команду позже!",
        ephemeral: true,
      });
      return;
    }
    const settingSchema =
      (await Settings.findOne({ id: 0 })) ?? (await Settings.create({ id: 0 }));

    let earned = 10;

    if (userSchema.repAmount >= 10) earned += 5;
    if (userSchema.repAmount >= 25) earned += 10;
    if (userSchema.repAmount >= 50) earned += 15;

    if (
      interaction.member.roles.cache.hasAny(
        "879633957841416204",
        "1051865743291072533"
      )
    ) {
      earned = earned * (1 + 25 / 100);
    }
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Заработок валюты")
          .setDescription(
            `${interaction.user}, вы смогли заработать **${Math.round(
              earned
            )}** ${settingSchema.currencyName ?? "монет"}!`
          )
          .setColor("#2f3136")
          .setImage(
            "https://cdn.discordapp.com/attachments/948283010627825704/1022890258943193238/20220923_181646.gif"
          )
          .setFooter({ text: "Возвращайся через 8 часов!" })
          .setThumbnail(interaction.user.displayAvatarURL()),
      ],
    });
    userSchema.currency += Math.round(earned);
    userSchema.earnCooldown = Date.now();
    userSchema.save().catch(() => {});
  },
};
