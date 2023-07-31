const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "shuffle",
  aliases: ["sfl", "셔플", "랜덤"],
  description: `대기열의 노래 순서를 셔플 및 취소 할 수 있습니다.`,
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
    if (!client.shuffleData.has(`shuffle-${queue.id}`)) {
      client.shuffleData.set(`shuffle-${queue.id}`, queue.songs.slice(1));
      queue.shuffle();
      client.embed(
          message,
          `${client.config.emoji.SUCCESS}  ${queue.songs.length}개의 노래를 셔플했습니다.`
      );
    } else {
      const shuffleData = client.shuffleData.get(`shuffle-${queue.id}`);
      queue.songs = [queue.songs[0], ...shuffleData];
      client.shuffleData.delete(`shuffle-${queue.id}`);
      client.embed(
          message,
          `${client.config.emoji.SUCCESS} ${queue.songs.length}개의 노래 셔플을 취소했습니다.`
      );
    }
  },
};