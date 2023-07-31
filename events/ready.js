const { ActivityType } = require("discord.js");
const client = require("../index");

client.on("ready", async () => {
  console.log(`${client.user.username} 계정으로 로그인 됨`);
  client.user.setActivity({
    name: `${process.env.PREFIX}재생, ${process.env.PREFIX}play, ${process.env.PREFIX}p (노래)`,
    type: ActivityType.Listening,
  });

  // 데이터베이스 로딩
  await require("../handlers/Database")(client);

  // 대시보드 로딩
  require("../server");

  client.guilds.cache.forEach(async (guild) => {
    await client.updateembed(client, guild);
  });
});