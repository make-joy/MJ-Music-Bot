const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "move",
  aliases: ["mv", "nvs", "이동", "dlehd"],
  description: `대기열에서 노래를 이동합니다.`,
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
    let position = Number(args[1]);
    if (!songIndex || !position) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} 잘못된 사용입니다. \n ex) ${prefix}move <songindex> <targetindex>`
      );
    }
    if (position >= queue.songs.length || position < 0) position = -1;
    if (songIndex > queue.songs.length - 1) {
      return client.embed(
        message,
        ` **대기열의 마지막 노래 인덱스 : \`${queue.songs.length}\`**`
      );
    } else if (position === 0) {
      return client.embed(message, `**노래를 재생하기 전에 노래를 이동할 수 없습니다.**`);
    } else {
      let song = queue.songs[songIndex];

      queue.songs.splice(songIndex); // 노래 제거

      queue.addToQueue(song, position); // 특정 위치에 추가
      client.embed(
        message,
        `📑 이동됨 : **${
          song.name
        }**to the **\`${position}th\`** Place right after **_${
          queue.songs[position - 1].name
        }_!**`
      );
    }
  },
};