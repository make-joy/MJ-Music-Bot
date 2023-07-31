const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "removedupes",
  aliases: ["rmdupes", "rmd", "중복제거"],
  description: `대기열에서 중복된 노래를 제거합니다.`,
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
    let tracks = queue.songs;
    const newtracks = [];
    for (let i = 0; i < tracks.length; i++) {
      let exists = false;
      for (j = 0; j < newtracks.length; j++) {
        if (tracks[i].url === newtracks[j].url) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        newtracks.push(tracks[i]);
      }
    }
    queue.remove(); // 대기열 초기화

    // 이제 모든 중복되지 않는 노래를 다시 추가
    await newtracks.map((song, index) => {
      queue.addToQueue(song, index);
    });

    client.embed(
      message,
      `** ${client.config.emoji.SUCCESS}  \`${newtracks.length}\` 개의 중복 노래를 제거했습니다. **`
    );
  },
};