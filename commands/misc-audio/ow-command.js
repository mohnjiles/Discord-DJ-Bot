const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class OwCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "ow",
      group: "misc-audio",
      memberName: "ow",
      description: "Oof ouch owie"
    });
  }

  async run(message) {
    message.delete();
    Utils.playFile(message, "ow.wav");
  }
}
