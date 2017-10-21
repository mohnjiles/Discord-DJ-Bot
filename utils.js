module.exports = class Utils {

  static playMp3(message, fileName) {
    let voiceChannel = message.member.voiceChannel;
    voiceChannel.join().then(connection => {
      let dispatcher = connection.playFile(`./audio-clips/${fileName}`);
      dispatcher.on("end", end => {
        voiceChannel.leave();
      });
    }).catch(err => console.log(err));
  }

  static getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

}
