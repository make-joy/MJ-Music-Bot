const { Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");
const findLyrics = require("simple-find-lyrics");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "lyrics",
  aliases: ["lr", "가사", "rktk"],
  description: `현재 노래의 가사를 표출합니다.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
  djOnly: false,

  /**
   * @param {MAKEJOY} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   **/
  run: async (client, message, args, prefix, queue) => {
    let song = queue.songs[0];
    let songname = song.name.substring(0, 20);
    const { lyrics } = await findLyrics(songname);

    let string = [];
    if (lyrics.length > 3000) {
      string.push(lyrics.substring(0, 3000));
      string.push(lyrics.substring(3000, Infinity));
    } else {
      string.push(lyrics);
    }

    if (!lyrics)
      return client.embed(message, `\`${songname}\`의 가사를 찾지 못했습니다.`);

    let embeds = string.map((str) => {
      return new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setAuthor({ name: `${songname}의 가사`, iconURL: song.thumbnail })
        .setDescription(`${str || `\`${songname}\`의 가사를 찾지 못했습니다.`}`)
        .setFooter(client.getFooter(song.user));
    });

    swap_pages(message, embeds);
  },
};