const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setPresence({
      activities: [
        {
          name: `${client.user.username}`,
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });
    console.log(`${client.user.tag} был запущен!`);
  },
};
