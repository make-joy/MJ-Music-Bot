const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "play",
  aliases: ["p", "song", "재생", "wotod", "p", "플레이", "ㅔ", "ㅔㅣ묘"],
  description: `노래의 검색어(제목,가수)/URL을 입력해 노래를 재생합니다.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: true,

  /**
   * @param {MAKEJOY} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   **/
  run: async (client, message, args, prefix, queue) => {
    let song = args.join(" ");
    if (!song) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} 재생할 노래의 검색어(제목,가수)/URL을 입력하세요.`
      );
    } else {
      const loadingMessage = await message.channel.send(`${client.config.emoji.SUCCESS} \`${song}\` 로딩중...`);
      let { channel } = message.member.voice;
      client.distube.play(channel, song, {
        member: message.member,
        textChannel: message.channel,
        message: message,
      });
      setTimeout(() => {
        loadingMessage.delete().catch(console.error);
      }, 5000);
    }
  },
};