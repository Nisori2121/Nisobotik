const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const { connect } = require("mongoose");
const fs = require("fs");
require("dotenv").config();

//Создание клиента; Добавление нужных интентов боту.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message],
});
//

//Хандлинг команд, кнопок и тд.
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}
//

client.handleEvents();
client.handleCommands();

client.login(process.env.TOKEN);

//Присоединение к базе-данных
(async function () {
  await connect(process.env.MONGO_URL).catch((error) =>
    console.log(error.message)
  );
})();
//

//Отлавливание различных ошибок и предупреждений
client.on("error", (error) => {
  console.log("[ON ERROR] => Ошибка", error);
});
client.on("warn", (warn) => {
  console.log("[ON WARN] => Предупреждение", warn);
});
process.on("unhandledRejection", (error) => {
  console.log("[ON UNHANDLE ERROR] => Ошибка вне модуля", error);
});
