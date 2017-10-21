const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class SicknessCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "sickness",
      group: "ffxiv",
      memberName: "sickness",
      description: ""
    });
  }

  async run(message) {

  }
}
