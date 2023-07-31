const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "dj",
  aliases: ["setupdj", "setdj"],
  description: `DJ 권한을 활성화/비활성화 합니다.`,
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
      case "enable":
        {
          let role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]);
          if (!role) {
            return client.embed(
              message,
              `${client.config.emoji.ERROR} 역할ID 또는 사용자를 멘션하세요.`
            );
          } else {
            await client.music.set(`${message.guild.id}.djrole`, role.id);
            client.embed(
              message,
              `${client.config.emoji.SUCCESS} ${role} 역할에 DJ권한을 활성화 했습니다.`
            );
          }
        }
        break;
      case "disable":
        {
          await client.music.set(`${message.guild.id}.djrole`, null);
          client.embed(
            message,
            `${client.config.emoji.SUCCESS} DJ권한을 비활성화 했습니다.`
          );
        }
        break;
      case "cmds":
        {
          const djcommands = client.mcommands
            .filter((cmd) => cmd?.djOnly)
            .map((cmd) => cmd.name)
            .join(", ");

          client.embed(
            message,
            `**DJ 명령어** \n \`\`\`js\n${djcommands}\`\`\``
          );
        }
        break;

      default:
        {
          client.embed(
            message,
            `** ${client.config.emoji.ERROR} 잘못된 사용입니다. \n ex)**  \n\n \`${prefix}dj enable <@role>\` \n\n \`${prefix}dj disable\`  \n\n \`${prefix}dj cmds\` `
          );
        }
        break;
    }
  },
};