const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "queue",
  aliases: ["q", "list", "대기열", "플레이리스트", "pl", "eorlduf"],
  description: `현재 대기열을 표출합니다.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
  djOnly: false,

  /**
   * @param {MAKEJOY} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   **/
  run: async (client, message, args, prefix, queue) => {
    if (!queue.songs.length) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} 대기열이 비어있습니다.`
      );
    } else {
      let embeds = await client.getQueueEmbeds(queue);
      await swap_pages(message, embeds);
    }
  },
};