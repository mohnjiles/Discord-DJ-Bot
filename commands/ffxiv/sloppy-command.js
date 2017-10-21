const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class SloppyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "sloppy",
      group: "ffxiv",
      memberName: "sloppy",
      description: ""
    });
  }

  async run(message) {

  }
}
