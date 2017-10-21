const Commando = require('discord.js-commando');
const Music = require('discord.js-music-v11');
const sqlite = require('sqlite');
const path = require('path');
const config = require('./config.json');

const client = new Commando.Client({
  owner: config.owner,
  disableEveryone: true
});

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.on('ready', () => {
  console.log(`[Start] ${new Date()}`);
});

client.registry.registerGroups([
  ['ffxiv', 'Final Fantasy XIV Commands']
]).registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

let music = Music(client, {
  prefix: "!",
  maxQueueSize: 100,
  clearInvoker: false,
  anyoneCanSkip: true,
  volume: 40
});

client.login(config.token);
