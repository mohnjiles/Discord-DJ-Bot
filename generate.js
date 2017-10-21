// Commando command generator


const fs = require('fs');
const path = require('path');

var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

let groupIndex = myArgs.indexOf('-g') + 1;
let nameIndex = myArgs.indexOf('-n') + 1;
let argsIndex = myArgs.indexOf('--args') + 1;

let group = myArgs[groupIndex];
let name = myArgs[nameIndex];

// hardcoded for now ¯\_(ツ)_/¯
let fileName = `commands\\${group.toLowerCase()}\\${name.toLowerCase()}-command.js`;

// these names tho
let argVars = [];
let argVarsString = "";
let args = "";

if (myArgs.length == 2 || groupIndex == 0 || nameIndex == 0) {
  console.log("Please use the following syntax:\n > node generate -g groupName -n commandName [--args arg1 arg2]");
  return;
}

if (myArgs.length > 2 && argsIndex != 0) {
  for (; argsIndex < myArgs.length; argsIndex++) {
    argVars.push(myArgs[argsIndex]);
  }
  argVarsString = `, {${argVars.join(', ')}}`;
}

for (var i = 0; i < argVars.length; i++) {
  args += `{
          key: '${argVars[i]}',
          prompt: '',
          type: ''
        }`

  if (i != argVars.length - 1) {
    args += ',';
  }
}

var template = `const Commando = require('discord.js-commando');
const Utils = require('../../utils.js');

module.exports = class ${name}Command extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "${name.toLowerCase()}",
      group: "${group.toLowerCase()}",
      memberName: "${name.toLowerCase()}",
      description: "",
      aliases: [''],
      args: [
        ${args}
      ]
    });
  }

  async run(message${argVarsString}) {

  }
}
`;

if (!fs.existsSync(path.join(__dirname, "commands", group.toLowerCase()))) {
  fs.mkdir(path.join(__dirname, "commands", group.toLowerCase()));
}

fs.writeFile(fileName, template, (err) => {
  if (err) throw err;

  console.log(`Saved file ${fileName}`);
});
