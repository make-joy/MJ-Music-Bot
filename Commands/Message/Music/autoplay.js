const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "autoplay",
  aliases: ["ap", "atp", "랜덤재생", "foseja", "random", "fosejawotod"],
  description: `랜덤재생을 활성화/비활성화 합니다.`,
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
    let autoplay = queue.toggleAutoplay();
    client.embed(
      message,
      `${client.config.emoji.SUCCESS} 랜덤재생 : \`${autoplay ? "활성화" : "비활성화"}\``
    );
  },
};