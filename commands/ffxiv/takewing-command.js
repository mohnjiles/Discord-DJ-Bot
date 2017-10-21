const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class TakeWingCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "takewing",
      group: "ffxiv",
      memberName: "takewing",
      description: ""
    });
  }

  async run(message) {

  }
}
