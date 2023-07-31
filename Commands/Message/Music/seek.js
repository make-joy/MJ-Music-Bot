const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "seek",
  aliases: ["sk", "시간변경", "탐색"],
  description: `현재 노래의 재생 구간(시간)을 변경합니다.`,
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
    let seek = Number(args[0]);
    if (!seek) {
      return client.embed(message, `탐색할 시간을 초 단위로 입력하세요.`);
    } else {
      queue.seek(seek);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} \`${seek}\` 초 부터 재생합니다.`
      );
    }
  },
};