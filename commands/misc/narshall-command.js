const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class NarshallCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "narshall",
      group: "misc",
      memberName: "narshall",
      description: "Enables Narshall Mode",
      aliases: ['n']
    });
  }

  async run(message) {
    let narshall = message.guild.members.find(x => x.id == 144923214538211329);
    try {
      Utils.playFile(message, "glados_prison.mp3");
      narshall.setMute(true);
      message.channel.send(":cop::skin-tone-5: :cop::skin-tone-5: :cop::skin-tone-5:")
      message.channel.send("***NARSHALL MODE ENGAGED***")
      message.channel.send(":cop::skin-tone-5: :cop::skin-tone-5: :cop::skin-tone-5:")
    } catch (e) {
      console.log("Narshall not found: " + e);
    }
  }
}
