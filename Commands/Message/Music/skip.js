const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");
const { skip } = require("../../../handlers/functions");

module.exports = {
  name: "skip",
  aliases: ["s", "skp", "스킵", "ㄴ", "tmzlq", "나ㅑㅔ"],
  description: `현재 노래를 건너뛰고 대기열의 다음 노래를 재생합니다.`,
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
    await skip(queue);
    client.embed(message, `${client.config.emoji.SUCCESS} 노래를 스킵했습니다.`);
  },
};