const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class BoomCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "boom",
      group: "ffxiv",
      memberName: "boom",
      description: ""
    });
  }

  async run(message) {
    message.delete();
    Utils.playFile(message, "boom.wav");
  }
}
