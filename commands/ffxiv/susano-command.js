const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

let susanoClips = ['8201365_en.scd.wav', '8201366_en.scd.wav', '8201367_en.scd.wav',
                    '8201368_en.scd.wav', '8201369_en.scd.wav', '8201370_en.scd.wav',
                    '8201371_en.scd.wav','8201372_en.scd.wav', '8201373_en.scd.wav',
                    '8201374_en.scd.wav', '8201375_en.scd.wav'];

module.exports = class SusanoCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "susano",
      group: "ffxiv",
      memberName: "susano",
      description: "",
      aliases: [''],
      args: [
        {
          key: 'clipNumber',
          prompt: 'Please enter a number between 0-9',
          type: 'integer',
          default: -1
        }
      ]
    });
  }

  async run(message, {clipNumber}) {

    message.delete();

    if (clipNumber == -1) {
      Utils.playMp3(message, susanoClips[Utils.getRandomIntInclusive(0, 9)]);
    } else if (clipNumber != -1 && clipNumber > 9) {
      message.reply("Please enter a number between 0-9");
    } else {
      Utils.playMp3(message, susanoClips[clipNumber]);
    }

  }
}
