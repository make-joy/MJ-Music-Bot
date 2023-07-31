const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "volume",
  aliases: ["vol", "볼륨", "qhffba"],
  description: `현재 대기열의 볼륨을 설정합니다.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   * @param {MAKEJOY} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   **/
  run: async (client, message, args, prefix, queue) => {
    let volume = Number(args[0]);
    if (!volume) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} 변경할 볼륨을 입력하세요.`
      );
    } else if (volume > 250) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} 1 과 250 사이의 숫자만 입력할 수 있습니다.`
      );
    } else {
      await queue.setVolume(volume);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} 볼륨을 ${queue.volume}% 로 설정했습니다.`
      );
    }
  },
};