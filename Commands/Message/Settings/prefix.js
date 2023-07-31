const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");
const { PREFIX } = require("../../../settings/config");

module.exports = {
  name: "prefix",
  aliases: ["prefix", "setprefix", "접두어"],
  description: `현재 서버의 명령어 접두어를 설정할 수 있습니다.`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageGuild,
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
    let options = args[0];
    switch (options) {
      case "set":
        {
          let nPrefix = args[1];
          if (!nPrefix) {
            return client.embed(
              message,
              `${client.config.emoji.ERROR} 새 접두어를 입력하세요.`
            );
          } else {
            await client.music.set(`${message.guildId}.prefix`, nPrefix);
            client.embed(
              message,
              `${client.config.emoji.SUCCESS} 접두어가 \`${nPrefix}\`로 변경되었습니다.`
            );
          }
        }
        break;
      case "reset":
        {
          await client.music.set(`${message.guildId}.prefix`, PREFIX);
          client.embed(
            message,
            `${client.config.emoji.SUCCESS} 접두어가 \`${PREFIX}\`로 변경되었습니다.`
          );
        }
        break;

      default:
        {
          client.embed(
            message,
            `** ${client.config.emoji.ERROR} 잘못된 사용입니다.\n ex) **  \n\n \`${prefix}prefix set <newprefix>\` \n\n \`${prefix}prefix reset\` `
          );
        }
        break;
    }
  },
};