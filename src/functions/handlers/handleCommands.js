const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

require("dotenv").config();

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
      }
    }
    const clientId = process.env.CLIENT_ID;

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    try {
      console.log("Слэш-команды начали перезагружаться (/) ");
      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });
      console.log("Слэш-команды были успешно перезагружены (/)");
    } catch (error) {
      console.log(error);
    }
  };
};