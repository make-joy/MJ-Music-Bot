const { Message, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");
const { links } = require("../../../settings/config");

module.exports = {
  name: "invite",
  aliases: ["inv", "addme", "초대"],
  description: `MJ Bot을 다른 서버에 초대합니다.`,
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
    client.embed(
      message,
      `[\`MJ Music Bot을 당신의 서버에 초대하려면 클릭하세요.\`](${links.inviteURL.replace(
        "BOTID",
        client.user.id
      )})`
    );
  },
};