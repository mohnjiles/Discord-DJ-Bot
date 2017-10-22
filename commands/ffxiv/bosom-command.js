const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class BosomCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "bosom",
      group: "ffxiv",
      memberName: "bosom",
      description: "Rest your weary soul",
    });
  }

  async run(message) {
    message.delete();
    Utils.playFile(message, "lakshmi.wav");
  }
}
