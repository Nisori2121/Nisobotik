const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Помощь по командам бота")
    .setDMPermission(true),
  async execute(interaction, client) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Помощь по командам")
          .setDescription(
            `**Репутация и анти-репутация** \n \n ${inlineCode(
              "/rep"
            )} — повысить репутацию пользователю \n ${inlineCode(
              "/anti-rep"
            )} — повысить **анти**-репутацию пользователю \n \n **Развлечение** \n \n ${inlineCode(
              "/hit"
            )} — ударить пользователя \n ${inlineCode(
              "/hug"
            )} — обнять пользователя \n ${inlineCode(
              "/kiss"
            )} — поцеловать пользователя \n ${inlineCode(
              "/kill"
            )} — убить пользователя \n ${inlineCode(
              "/eat"
            )} — начать есть \n ${inlineCode(
              "/cry"
            )} — начать плакать \n ${inlineCode(
              "/dance"
            )} — начать танцевать \n ${inlineCode(
              "/hand"
            )} — пожать руку \n ${inlineCode(
              "/anal"
            )} — вставить пользователю \n ${inlineCode(
              "/cum"
            )} — кончить на пользователя \n ${inlineCode(
              "/sex"
            )} — заняться сексом \n ${inlineCode(
              "/otliz"
            )} — отлизать у пользователя \n ${inlineCode(
              "/suck"
            )} — начать сосать у пользователя \n ${inlineCode(
              "/smoke"
            )} — покурить \n ${inlineCode(
              "/duel"
            )} — предложить дуэль пользователю \n \n **Экономика** \n \n ${inlineCode(
              "/earn"
            )} — заработать валюту \n ${inlineCode(
              "/balance"
            )} — посмотреть счёт пользователя`
          )
          .setColor("#2f3136")
          .setImage(
            "https://cdn.discordapp.com/attachments/948283010627825704/1022890258943193238/20220923_181646.gif"
          )
          .setThumbnail(interaction.user.displayAvatarURL())
          .setFooter({ text: "@ Все права защищены сервером Nisorinka" }),
      ],
      ephemeral: true,
    });
  },
};
