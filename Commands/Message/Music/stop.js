const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "stop",
  aliases: ["st", "destroy", "정지", "스톱", "wjdwl", "tmxhq", "off", "끄기", "종료", "꺼져"],
  description: `대기열을 비우고 연결을 종료합니다.`,
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
    queue.stop();
    client.embed(message, `${client.config.emoji.SUCCESS} 대기열을 비우고 연결을 종료했습니다.`);
  },
};