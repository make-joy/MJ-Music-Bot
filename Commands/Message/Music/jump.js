const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "jump",
  aliases: ["jmp", "jp", "점프"],
  description: `대기열에서 특정 노래로 점프합니다.`,
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
    let index = Number(args[0]);
    if (!index) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} 노래 인덱스를 입력하세요.`
      );
    }
    let song = queue.songs[index];
    if (index > queue.songs.length - 1 || index < 0) {
      return client.embed(
        message,
        `${
          client.config.emoji.ERROR
        } **인덱스는 \`0\` 과 \`${
          queue.songs.length - 1
        }\` 사이 숫자만 입력할 수 있습니다.`
      );
    } else {
      queue.jump(index).then((q) => {
        client.embed(
          message,
          `** ${client.config.emoji.SUCCESS} 다음 노래로 점프 했습니다.\n [\`${song.name}\`](${song.url}) **`
        );
      });
    }
  },
};