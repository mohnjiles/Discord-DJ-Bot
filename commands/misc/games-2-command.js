const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');
const config = require('../../config.json');
const unirest = require('unirest');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  dialect: 'mysql',
  host: config.dbServer
});

const SteamGames2 = sequelize.define('SteamGames2', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  app_id: {
    type: Sequelize.BIGINT
  },
  discord_id: {
    type: Sequelize.BIGINT
  }
}, {
  timestamps: false,
  freezeTableName: true
});

//select json from SteamGames where id in (select app_id from SteamGames2 where app_id in (select app_id from SteamGames2 group by app_id having count(*) >= 2) and discord_id in (144923214538211329, 144923097894486017) group by app_id);


module.exports = class Games2Command extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "games2",
      group: "misc",
      memberName: "games2",
      aliases: ["g"],
      description: "Get games that people in your voice channel own.",
    });
  }

  async run(message) {
    message.delete();

    let discordToSteamIds = {};
    discordToSteamIds[config.nathanDiscordId] = config.nathanSteamId;

    // get all steam games for each player
    Object.keys(discordToSteamIds).map(function(discordId) {
      let steamId = discordToSteamIds[discordId];
      let url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${config.steamApiKey}&steamid=${steamId}&format=json`;
      unirest.get(url).end(function(response) {
        let games = response.body.response.games;
        if (games == null) return;

        let map = games.map((game) => {
          return {discord_id: discordId, app_id: game.appid};
        });

        SteamGames2.bulkCreate(map);
      });
    });


  }
}
