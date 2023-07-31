const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "loop",
  aliases: ["lp", "lop", "반복", "repeat", "qksqhr", "ㄱ덷ㅁㅅ"],
  description: `반복모드(대기열 전체/현재 노래/비활성화)를 설정합니다.`,
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
    let loopmode = args[0];
    let mods = ["현재노래", "대기열", "끄기"];
    if (!mods.includes(loopmode)) {
      return client.embed(
        message,
        `잘못 된 사용입니다.\nex) /반복 (\`\`\`${mods.join(" ' ")}\`\`\`)`
      );
    }
    if (loopmode === "off" || loopmode === "끄기" || loopmode === "종료" || loopmode === "정지" || loopmode === "비활성화") {
      await queue.setRepeatMode(0);
      return client.embed(
        message,
        `** ${client.config.emoji.ERROR} 반복 모드 : 비활성화 **`
      );
    } else if (loopmode === "song" || loopmode === "s" || loopmode === "현재노래" || loopmode === "노래") {
      await queue.setRepeatMode(1);
      return client.embed(
        message,
        `** ${client.config.emoji.SUCCESS} 반복 모드 : 현재 노래 반복 **`
      );
    } else if (loopmode === "queue" || loopmode === "q" || loopmode === "대기열" ) {
      await queue.setRepeatMode(2);
      return client.embed(
        message,
        `** ${client.config.emoji.SUCCESS} 반복 모드 : 대기열 전체 반복 **`
      );
    }
  },
};