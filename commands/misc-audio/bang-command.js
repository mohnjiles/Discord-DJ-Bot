const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class BangCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "bang",
      group: "misc-audio",
      memberName: "bang",
      description: "I shot you"
    });
  }

  async run(message) {
    message.delete();
    Utils.playFile(message, "bang.wav");
  }
}
