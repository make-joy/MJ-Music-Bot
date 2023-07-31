const { Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "config",
  aliases: ["cnf", "설정"],
  description: `현재 서버의 설정을 표출합니다.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Settings",
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
    let data = await client.music.get(message.guild.id);

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setAuthor({
            name: `${message.guild.name} 서버 설정`,
            iconURL: message.guild.iconURL({ dynamic: true }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .addFields([
            {
              name: `명령어 접두어`,
              value: `\`${prefix}\``,
            },
            {
              name: `DJ`,
              value: `${
                data.djrole
                  ? `${client.config.emoji.SUCCESS} \`Enabled\``
                  : `${client.config.emoji.ERROR}  \`Disabled\``
              }`,
            },
            {
              name: `자동 일시정지 해제`,
              value: `${
                data.autoresume
                  ? `${client.config.emoji.SUCCESS} \`Enabled\``
                  : `${client.config.emoji.ERROR}  \`Disabled\``
              }`,
            },
            {
              name: `전용 채널 설정`,
              value: `${
                data.music.channel
                  ? `<#${data.music.channel}>`
                  : `${client.config.emoji.ERROR}  \`Disabled\``
              }`,
            },
          ])
          .setFooter(client.getFooter(message.author)),
      ],
    });
  },
};