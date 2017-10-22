const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class SloppyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "sloppy",
      group: "ffxiv",
      memberName: "sloppy",
      description: "Ilberd's favorite word"
    });
  }

  async run(message) {
    message.delete();
    Utils.playFile(message, "sloppy.wav");
  }
}
