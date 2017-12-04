const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const Utils = require('../../utils.js');
const config = require('../../config.json');
const unirest = require('unirest');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  dialect: 'mysql',
  host: config.dbServer
});

const SteamGames = sequelize.define('SteamGames', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  json: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

module.exports = class GamesCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "games",
      group: "misc",
      memberName: "games",
      description: "Get games that people in your voice channel own.",
    });

    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }

  async run(message) {

    const voiceChannel = message.member.voiceChannel;
    //const voiceChannel = message.guild.channels.find(x => x.id == 177544520446115840);
    if (voiceChannel == null) {
      message.reply("Please be in a voice channel first");
    }

    const usersInChannel = voiceChannel.members;

    // map all users so we only get the most frequent users

    let discordIdsInChannel = usersInChannel.reduce((result, user) => {
      switch (user.id) {
        case config.jesseDiscordId:
        case config.marshallDiscordId:
        case config.jtDiscordId:
        case config.nickDiscordId:
        case config.roryDiscordId:
        case config.kennyDiscordId:
        case config.grifDiscordId:
        case config.nathanDiscordId:
        case config.shawnDiscordId:
          result.push(user.id);
      }
      return result;
    }, []);

    let sql = `select id, json from SteamGames where id in (select app_id from
        SteamGames2 where app_id in (select app_id from SteamGames2 where discord_id
        in (${discordIdsInChannel.toString()}) group by app_id having
        count(*) >= ${discordIdsInChannel.length})  group by app_id);`;

    // get from db
    let steamGames = await sequelize.query(sql, {
      model: SteamGames
    });

    // parse stored JSON and get the appId index because steam's JSON is kinda silly.
    let gameInfos = steamGames.map(game => {
      let appId = game.id;
      return JSON.parse(game.json)[appId];
    });

    // filter out non-multiplayer games
    let multiplayerGames = gameInfos.filter(game => {
      return game != null &&
        game.success != false &&
        game.data.categories != null &&
        game.data.categories.some(category => {
          return category.description == "Multi-player" ||
            category.description == "Co-op";
        });
    });

    // get the names
    let results = multiplayerGames.map(game => {
      return game.data.name;
    });

    // get games almost everyone owns
    sql = `select id, json from SteamGames where id in (select app_id from
        SteamGames2 where app_id in (select app_id from SteamGames2 where discord_id
        in (${discordIdsInChannel.toString()}) group by app_id having
        count(*) >= ${discordIdsInChannel.length - 1})  group by app_id);`;

    let almostEveryoneResults = (await sequelize.query(sql, {
        model: SteamGames
      }))
      .map(game => {
        let appId = game.id;
        return JSON.parse(game.json)[appId];
      }).filter(game => {
        return game != null &&
          game.success != false &&
          game.data.categories != null &&
          game.data.categories.some(category => {
            return category.description == "Multi-player" ||
              category.description == "Co-op";
          });
      }).filter(game => {
        return results.indexOf(game.data.name) < 0;
      });

    let firstFiveShuffledResults = shuffle(almostEveryoneResults).slice(0, 4);
    let discordEmbeds = firstFiveShuffledResults.map(game => {

      let price = '';
      if (game.data.price_overview != null) {
        price = `$${game.data.price_overview.final / 100.0}`;
      } else {
        price = 'Free'
      }

      let embed = new Discord.RichEmbed()
        .setTitle(game.data.name)
        //.setDescription(game.data.short_description)
        .setThumbnail(game.data.header_image)
        .setFooter("Price data may be inaccurate. Sorry.")
        .setURL(`http://store.steampowered.com/app/${game.data.steam_appid}`)
        .setColor([Utils.getRandomIntInclusive(0, 255),Utils.getRandomIntInclusive(0, 255),Utils.getRandomIntInclusive(0, 255)])
        .addField("Price", price, true);

      if (game.data.metacritic != null) {
        embed.addField("Metacritic Score", game.data.metacritic.score, true);
      }

      if (game.data.genres != null) {
        embed.addField("Genre", game.data.genres.map(cat => {
          return cat.description
        }).join(', '), true);
      }

      if (game.data.publishers != null) {
        embed.addField("Publisher", game.data.publishers.join(", "), true);
      }

      if (game.data.platforms != null) {

        let windows = game.data.platforms.windows ? "Windows" : "";
        let mac = game.data.platforms.mac ? "Mac" : "";
        let linux = game.data.platforms.linux ? "Linux" : "";

        embed.addField("Platforms", `${windows} ${mac} ${linux}`, true);
      }

      return embed;

    });

    message.channel.sendMessage("**Games everyone in channel owns:**\n\n" + results.join("\n") + "\n\n**Games almost everyone in channel owns:**\n\n");

    discordEmbeds.map(embed => {
      message.channel.send({
        embed
      });
    });
  }
}



function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
