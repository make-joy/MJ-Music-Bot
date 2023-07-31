const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "playprevious",
  aliases: ["pp", "playp", "이전"],
  description: `대기열의 이전 노래를 재생합니다.`,
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
    if (!queue.previousSongs.length) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} 이전의 재생 노래가 없습니다.`
      );
    } else {
      await queue.previous().then((m) => {
        client.embed(
          message,
          `${client.config.emoji.SUCCESS} 이전의 노래를 재생합니다.`
        );
      });
    }
  },
};