const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class UnNarshallCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "unnarshall",
      group: "misc",
      memberName: "unnarshall",
      description: "Disengages Narshall mode",
      aliases: ['unn']
    });
  }

  async run(message) {
    let narshall = message.guild.members.find(x => x.id == 144923214538211329);
    try {
      Utils.playFile(message, "who_did_that.mp3");
      narshall.setMute(false);
    } catch (e) {
      console.log("Narshall not found: " + e);
    }
  }
}
