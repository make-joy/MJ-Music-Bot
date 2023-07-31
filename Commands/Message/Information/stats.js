const {
  Message,
  EmbedBuilder,
  version,
  PermissionFlagsBits,
} = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");
const { msToDuration, formatBytes } = require("../../../handlers/functions");
const os = require("systeminformation");

module.exports = {
  name: "stats",
  aliases: ["status", "botinfo", "상태", "봇상태", "봇정보"],
  description: `봇 상태를 표출합니다.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   * @param {MAKEJOY} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   **/
  run: async (client, message, args, prefix, queue) => {

    let memory = await os.mem();
    let cpu = await os.cpu();
    let cpuUsage = await (await os.currentLoad()).currentLoad;
    let osInfo = await os.osInfo();
    let TotalRam = formatBytes(memory.total);
    let UsageRam = formatBytes(memory.used);

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle("__**상태:**__")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `> ** Made by [\` makejoy \`](https://makejoy.co.kr/mjbot/discord) **`
          )
          .addFields([
            {
              name: `⏳ 메모리 사용량`,
              value: `\`${UsageRam}\` / \`${TotalRam}\``,
            },
            {
              name: `⌚️ 업타임`,
              value: `\`${msToDuration(client.uptime)}\``,
            },
            {
              name: `📁 사용자`,
              value: `\`${client.guilds.cache.size} \``,
              inline: true,
            },
            {
              name: `📁 서버`,
              value: `\`${client.guilds.cache.size}\``,
              inline: true,
            },
            {
              name: `📁 채널`,
              value: `\`${client.channels.cache.size}\``,
              inline: true,
            },
            {
              name: `👾 Discord.JS`,
              value: `\`v${version}\``,
              inline: true,
            },
            {
              name: `🤖 Node`,
              value: `\`${process.version}\``,
              inline: true,
            },
            {
              name: `🏓 네트워크 지연`,
              value: `\`${client.ws.ping}ms\``,
              inline: true,
            },
            {
              name: `🤖 CPU 사용량`,
              value: `\`${Math.floor(cpuUsage)}%\``,
              inline: true,
            },
            {
              name: `🤖 OS 정보`,
              value: `\`${osInfo.arch}\``,
              inline: true,
            },
            {
              name: `💻 플랫폼`,
              value: `\`\`${osInfo.platform}\`\``,
              inline: true,
            },
            {
              name: `🤖 CPU`,
              value: `\`\`\`${cpu.brand}\`\`\``,
            },
          ])
          .setFooter(client.getFooter(message.author)),
      ],
    });
  },
};