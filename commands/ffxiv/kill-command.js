const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class KillCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "kill",
      group: "ffxiv",
      memberName: "kill",
      description: "Everyone's favorite golfer"
    });
  }

  async run(message) {
    message.delete();
    Utils.playMp3(message, "kill.wav");
  }
}
