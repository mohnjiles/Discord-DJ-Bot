const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class MariachiCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "mariachi",
      group: "misc-audio",
      memberName: "mariachi",
      description: "Mariachi time!"
    });
  }

  async run(message) {
    message.delete();
    Utils.playFile(message, "mariachi.mp3");
  }
}
