const { Client } = require("discord.js");
const { mongodb } = require("../settings/config");
const Josh = require("@joshdb/core");
// const provider = require("@joshdb/mongo"); // mongodb
const provider = require("@joshdb/sqlite"); // sqlite db

/**
 * @param {Client} client
 **/
module.exports = async (client) => {
  
  // 노래
  client.music = new Josh({
    name: "music",
    provider: provider,
    providerOptions: {
      url: mongodb,
      collection: "music",
      dbName: client.user.username.replace(" ", ""),
    },
  });

  // 자동 일시정지 해제
  client.autoresume = new Josh({
    name: "autoresume",
    provider: provider,
    providerOptions: {
      url: mongodb,
      collection: "autoresume",
      dbName: client.user.username.replace(" ", ""),
    },
  });

  // 길드 없을 경우 데이터 삭제
  client.on("guildDelete", async (guild) => {
    if (!guild) return;
    let music = await client.music.get(guild.id);
    if (!music) return;
    let requestchannel = guild.channels.cache.get(music?.music.channel);
    if (requestchannel) {
      await requestchannel
        .delete(`${client.user.username} 요청 채널 삭제 중`)
        .catch((e) => null);
    }
    await client.music.delete(guild.id);
  });
};