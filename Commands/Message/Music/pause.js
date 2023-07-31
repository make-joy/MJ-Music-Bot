const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "pause",
  aliases: ["pu", "pj", "일시정지", "dlftlwjdwl"],
  description: `현재 대기열 일시정지를 활성화/비활성화 합니다.`,
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
    if (!queue.paused) {
      queue.pause();
      client.embed(message, `${client.config.emoji.SUCCESS} 대기열 일시정지 활성화`);
    } else {
      queue.resume();
      client.embed(message, `${client.config.emoji.SUCCESS} 대기열 일시정지 비활성화`);
    }
  },
};