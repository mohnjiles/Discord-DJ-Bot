const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');
const config = require('../../config.json');
const unirest = require('unirest');
const _ = require('lodash');

module.exports = class GamesCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "games",
      group: "misc",
      memberName: "games",
      description: "Get games that people in your voice channel own.",
      aliases: ['']
    });
  }

  async run(message) {

    message.delete();

    const voiceChannel = message.member.voiceChannel;
    if (voiceChannel == null) {
      message.reply("Please be in a voice channel first");
    }

    const usersInChannel = voiceChannel.members;

    // map all users in voice channel to their steam IDs
    let steamIdsInChannel = usersInChannel.map(function(user) {
      switch (user.id) {
        case config.jesseDiscordId:
          return config.jesseSteamId;
        case config.marshallDiscordId:
          return config.marshallSteamId;
        case config.jtDiscordId:
          return config.jtSteamId;
        case config.nickDiscordId:
          return config.nickSteamId;
        case config.roryDiscordId:
          return config.rorySteamId;
        case config.kennyDiscordId:
          return config.kennySteamId;
        case config.grifDiscordId:
          return config.grifSteamId;
        case config.nathanDiscordId:
          return config.nathanSteamId;

        default:
          break;
      }
    });

    let gamesDict = {};
    let steamIdsToRemove = [];

    // get list of games for each player

    var getGames = steamIdsInChannel.map(function(id) {
      return new Promise(function(resolve, reject) {
        let url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${config.steamApiKey}&steamid=${id}&format=json`;
        return unirest.get(url)
          .end(function(response) {
            let games = response.body.response.games;

            if (games != null) {
              for (var i = 0; i < games.length; i++) {
                var game = games[i];
                if (gamesDict[game.appid] === undefined) {
                  gamesDict[game.appid] = 1;
                } else {
                  gamesDict[game.appid]++;
                }
              }
            } else {
              steamIdsToRemove.push(id);
            }

            resolve();
          });
      })
    });

    Promise.all(getGames).then(function() {
      // remove steamIds that we didn't get results for

      for (var i = 0; i < steamIdsToRemove.length; i++) {
        console.log(`Removing ${steamIdsToRemove[i]}`);
        var index = steamIdsInChannel.indexOf(steamIdsToRemove[i]);
        if (index > -1) {
          steamIdsInChannel.splice(index, 1);
        }
      }

      // find out which games all players own
      let appIdsAllPeopleOwn = Object.keys(gamesDict).reduce(function(filtered, key) {
        if (gamesDict[key] >= steamIdsInChannel.length) filtered[key] = gamesDict[key];
        return filtered;
      }, {});
      appIdsAllPeopleOwn = Object.keys(appIdsAllPeopleOwn);

      let appIdsMostPeopleHave = Object.keys(gamesDict).reduce(function(filtered, key) {
        if (gamesDict[key] >= steamIdsInChannel.length - 1) filtered[key] = gamesDict[key];
        return filtered;
      }, {});
      appIdsMostPeopleHave = Object.keys(appIdsMostPeopleHave);

      console.log(appIdsAllPeopleOwn);
      console.log(appIdsMostPeopleHave);

      message.channel.send(`**Games everyone owns:**\n\n${appIdsAllPeopleOwn.join('\n')}`);

      // find out what games actually are (name, etc)
      // check db first then pull from http://store.steampowered.com/api/appdetails?appids=XXX
    });


  }
}
