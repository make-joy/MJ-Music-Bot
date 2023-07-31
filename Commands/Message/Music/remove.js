const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "remove",
  aliases: ["rem", "remsong", "예약취소"],
  description: `대기열에서 노래를 제거합니다.`,
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
    let songIndex = Number(args[0]);
    if (!songIndex) {
      return client.embed(
        message,
        `** ${
          client.config.emoji.ERROR
        } 제거할 노래 인덱스는 \`0\`-\`${
          queue.songs.length - 1
        }\`사이로만 설정할 수 있습니다.**`
      );
    } else if (songIndex === 0) {
      return client.embed(
        message,
        `** ${client.config.emoji.ERROR} 현재 노래를 제거할 수 없습니다.**`
      );
    } else {
      let track = queue.songs[songIndex];
      queue.songs.splice(track, track + 1);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} \`${track.name}\`가 대기열에서 제거되었습니다.`
      );
    }
  },
};