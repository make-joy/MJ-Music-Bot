const MAKEJOY = require("./Client");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  Message,
  CommandInteraction,
} = require("discord.js");
const { Queue } = require("distube");

/**
 * @param {MAKEJOY} client
 **/
module.exports = async (client) => {

  /**
   * @param {Queue} queue
   **/
  client.buttons = (state) => {
    let raw = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("skip")
        .setLabel("스킵")
        .setEmoji(client.config.emoji.skip)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("pauseresume")
        .setLabel("재생/일시정지")
        .setEmoji(client.config.emoji.pause_resume)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("loop")
        .setLabel("반복")
        .setEmoji(client.config.emoji.loop)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("stop")
        .setLabel("종료")
        .setEmoji(client.config.emoji.stop)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("autoplay")
        .setLabel("랜덤재생")
        .setEmoji(client.config.emoji.autoplay)
        .setDisabled(state),
    ]);
    return raw;
  };

  client.editPlayerMessage = async (channel) => {
    let ID = client.temp.get(channel.guild.id);
    if (!ID) return;
    let playembed = channel.messages.cache.get(ID);
    if (!playembed) {
      playembed = await channel.messages.fetch(ID).catch((e) => {});
    }
    if (!playembed) return;
    if (client.config.options.nowplayingMsg == true) {
      playembed.delete().catch((e) => {});
    } else {
      let embeds = playembed?.embeds ? playembed?.embeds[0] : null;
      if (embeds) {
        playembed
          ?.edit({
            embeds: [
              embeds.setFooter({
                text: `⛔️ 대기열을 비우고 노래 재생을 종료했습니다.`,
                iconURL: channel.guild.iconURL({ dynamic: true }),
              }),
            ],
            components: [client.buttons(true)],
          })
          .catch((e) => {});
      }
    }
  };

  /**
   * @param {Queue} queue
   * @returns
   **/
  client.getQueueEmbeds = async (queue) => {
    let guild = client.guilds.cache.get(queue.textChannel.guildId);
    let quelist = [];
    var maxTracks = 10; // 대기열 페이지
    let tracks = queue.songs;
    for (let i = 0; i < tracks.length; i += maxTracks) {
      let songs = tracks.slice(i, i + maxTracks);
      quelist.push(
        songs
          .map(
            (track, index) =>
              `\` ${i + ++index}. \` ** ${track.name.substring(0, 35)}** - \`${
                track.isLive
                  ? `LIVE STREAM`
                  : track.formattedDuration.split(` | `)[0]
              }\` \`${track.user.tag}\``
          )
          .join(`\n`)
      );
    }
    let limit = quelist.length <= 5 ? quelist.length : 5;
    let embeds = [];
    for (let i = 0; i < quelist.length; i++) {
      let desc = String(quelist[i]).substring(0, 2048);
      await embeds.push(
        new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} 대기열  -  [ 총 ${tracks.length} 개의 노래 ]`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .addFields([
            {
              name: `**\` N. \` *${
                tracks.length > maxTracks
                  ? tracks.length - maxTracks
                  : tracks.length
              } 개의 노래가 더 있음...***`,
              value: `\u200b`,
            },
            {
              name: `**\` 0. \` __현재 재생 노래__**`,
              value: `**${queue.songs[0].name.substring(0, 35)}** - \`${
                queue.songs[0].isLive
                  ? `LIVE STREAM`
                  : queue.songs[0].formattedDuration.split(` | `)[0]
              }\` \`${queue.songs[0].user.tag}\``,
            },
          ])
          .setColor(client.config.embed.color)
          .setDescription(desc)
      );
    }
    return embeds;
  };

  client.status = (queue) =>
    `볼륨 : ${queue.volume}% • 상태 : ${
      queue.paused ? "일시정지" : "재생"
    } • 반복모드 :  ${
      queue.repeatMode === 2 ? `대기열 전체` : queue.repeatMode === 1 ? `현재 노래` : `비활성화`
    } • 랜덤재생 : ${queue.autoplay ? `활성화` : `비활성화`} `;

  /**
   * @param {Guild} guild
   **/
  client.queueembed = (guild) => {
    let embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`MJ Bot | 대기열`);
    return embed;
  };

  /**
   * @param {Guild} guild
   **/
  client.playembed = (guild) => {
    let embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: `음성채널에 참여 후, 재생할 노래 이름/URL 입력`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setImage(
        guild.banner
          ? guild.bannerURL({ size: 4096 })
          : process.env.BG_IMG
      )
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL(),
      });

    return embed;
  };

  /**
   * @param {Client} client
   * @param {Guild} guild
   * @returns
   **/
  client.updateembed = async (client, guild) => {
    let data = await client.music.get(`${guild.id}.music`);
    if (!data) return;
    let musicchannel = guild.channels.cache.get(data.channel);
    if (!musicchannel) return;

    let playmsg = musicchannel.messages.cache.get(data.pmsg);
    if (!playmsg) {
      playmsg = await musicchannel.messages.fetch(data.pmsg).catch((e) => {});
    }

    let queuemsg = musicchannel.messages.cache.get(data.qmsg);
    if (!queuemsg) {
      queuemsg = await musicchannel.messages.fetch(data.qmsg).catch((e) => {});
    }
    if (!queuemsg || !playmsg) return;
    await playmsg
      .edit({
        embeds: [client.playembed(guild)],
        components: [client.buttons(true)],
      })
      .then(async (msg) => {
        await queuemsg
          .edit({ embeds: [client.queueembed(guild)] })
          .catch((e) => {});
      })
      .catch((e) => {});
  };

  /**
   * @param {Queue} queue
   * @returns
   **/
  client.updatequeue = async (queue) => {
    let guild = client.guilds.cache.get(queue.textChannel.guildId);
    if (!guild) return;
    let data = await client.music.get(`${guild.id}.music`);
    if (!data) return;
    let musicchannel = guild.channels.cache.get(data.channel);
    if (!musicchannel) return;
    let queueembed = musicchannel.messages.cache.get(data.qmsg);
    if (!queueembed) {
      queueembed = await musicchannel.messages
        .fetch(data.qmsg)
        .catch((e) => {});
    }
    if (!queueembed) return;
    let currentSong = queue.songs[0];
    let string = queue.songs
      ?.filter((t, i) => i < 10)
      ?.map((track, index) => {
        return `\` ${index + 1}. \` ** ${track.name.substring(0, 35)}** - \`${
          track.isLive ? `LIVE STREAM` : track.formattedDuration.split(` | `)[0]
        }\` \`${track.user.tag}\``;
      })
      ?.reverse()
      .join("\n");
    queueembed.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setAuthor({
            name: `대기열  -  [ ${queue.songs.length} 개의 노래 ]`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(string.substring(0, 2048))
          .addFields([
            {
              name: `**\` 0. \` __현재 재생 노래__**`,
              value: `**${currentSong.name.substring(0, 35)}** - \`${
                currentSong.isLive
                  ? `LIVE STREAM`
                  : currentSong.formattedDuration.split(` | `)[0]
              }\` \`${currentSong.user.tag}\``,
            },
          ])
          .setFooter({
            text: guild.name,
            iconURL: guild.iconURL({ dynamic: true }),
          }),
      ],
    });
  };

  /**
   * @param {Queue} queue
   * @returns
   **/
  client.updateplayer = async (queue) => {
    let guild = client.guilds.cache.get(queue.textChannel.guildId);
    if (!guild) return;
    let data = await client.music.get(`${guild.id}.music`);
    if (!data) return;
    let musicchannel = guild.channels.cache.get(data.channel);
    if (!musicchannel) return;
    let playembed = musicchannel.messages.cache.get(data.pmsg);
    if (!playembed) {
      playembed = await musicchannel.messages.fetch(data.pmsg).catch((e) => {});
    }
    if (!playembed || !playembed.id) return;
    let track = queue.songs[0];
    if (!track.name) queue.stop();
    playembed.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setImage(track.thumbnail)
          .setTitle(track?.name)
          .setURL(track.url)
          .addFields([
            {
              name: `** 신청자 **`,
              value: `\`${track.user.tag}\``,
              inline: true,
            },
            {
              name: `** 업로더 **`,
              value: `\`${track.uploader.name || "😏"}\``,
              inline: true,
            },
            {
              name: `** 재생시간 **`,
              value: `\`${track.formattedDuration}\``,
              inline: true,
            },
          ])
          .setFooter(client.getFooter(track.user)),
      ],
      components: [client.buttons(false)],
    });
  };

  client.joinVoiceChannel = async (guild) => {
    let db = await client.music?.get(`${guild.id}.vc`);
    if (!db?.enable) return;
    if (!guild.members.me.permissions.has(PermissionFlagsBits.Connect)) return;
    let voiceChannel = guild.channels.cache.get(db.channel);
    setTimeout(() => {
      client.distube.voices.join(voiceChannel);
    }, 2000);
  };

  /**
   * @param {CommandInteraction} interaction
   **/
  client.handleHelpSystem = async (interaction) => {

    const send = interaction?.deferred ? interaction.followUp.bind(interaction) : interaction.reply.bind(interaction);
    const user = interaction.member.user;

    // 명령어
    const commands = interaction?.user ? client.commands : client.mcommands;

    // 카테고리
    const categories = interaction?.user ? client.scategories : client.mcategories;

    const emoji = {
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };

    let allcommands = client.mcommands.size;
    let allguilds = client.guilds.cache.size;
    let botuptime = `<t:${Math.floor(
      Date.now() / 1000 - client.uptime / 1000
    )}:R>`;
    let buttons = [
      new ButtonBuilder()
        .setCustomId("home")
        .setStyle(ButtonStyle.Success)
        .setEmoji("🏘️"),
      categories
        .map((cat) => {
          return new ButtonBuilder()
            .setCustomId(cat)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emoji[cat]);
        })
        .flat(Infinity),
    ].flat(Infinity);
    let row = new ActionRowBuilder().addComponents(buttons);

    let help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(`** MJ Music Bot - 2023/07 **`)
      .addFields([
        {
          name: `Stats`,
          value: `>>> ** :전체 명령어 : \`${allcommands}\` \n :file_folder: \`${allguilds}\` 서버에서 이용중 \n ⌚️ 업타임 : ${botuptime} \n 🏓 네트워크 속도 : \`${client.ws.ping}\`  \n  Made by [\` makejoy \`](https://makejoy.com.kr/mjbot/discord) **`,
        },
      ])
      .setFooter(client.getFooter(user));

    let main_msg = await send({
      embeds: [help_embed],
      components: [row],
      ephemeral: true,
    });

    let filter = async (i) => {
      if (i.user.id === user.id) {
        return true;
      } else {
        await i
          .deferReply()
          .then(() => {
            i.followUp({
              content: `명령어 사용자만 이용할 수 있습니다.`,
              ephemeral: true,
            });
          })
          .catch((e) => {});

        return false;
      }
    };
    let colector = await main_msg.createMessageComponentCollector({
      filter: filter,
    });

    colector.on("collect", async (i) => {
      if (i.isButton()) {
        await i.deferUpdate().catch((e) => {});
        let directory = i.customId;
        console.log("CustomId", directory);
        if (directory == "home") {
          main_msg.edit({ embeds: [help_embed] }).catch((e) => {});
        } else {
          main_msg
            .edit({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.embed.color)
                  .setTitle(
                    `${emoji[directory]} ${directory} 명령어 ${emoji[directory]}`
                  )
                  .setDescription(
                    `>>> ${commands
                      .filter((cmd) => cmd.category === directory)
                      .map((cmd) => `\`${cmd.name}\``)
                      .join(",  ")}`
                  )
                  .setThumbnail(client.user.displayAvatarURL())
                  .setFooter(client.getFooter(user)),
              ],
            })
            .catch((e) => null);
        }
      }
    });

    colector.on("end", async (c, i) => {
      row.components.forEach((c) => c.setDisabled(true));
      main_msg.edit({ components: [row] }).catch((e) => {});
    });
  };

  /**
   * @param {CommandInteraction} interaction
   **/
  client.HelpCommand = async (interaction) => {
    const send = interaction?.deferred ? interaction.followUp.bind(interaction) : interaction.reply.bind(interaction);
    const user = interaction.member.user;

    // 명령어
    const commands = interaction?.user ? client.commands : client.mcommands;

    // 카테고리
    const categories = interaction?.user ? client.scategories : client.mcategories;

    const emoji = {
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };

    let allCommands = categories.map((cat) => {
      let cmds = commands
        .filter((cmd) => cmd.category == cat)
        .map((cmd) => `\`${process.env.PREFIX}${cmd.name}\``)
        .join(" , ");
      return {
        name: `${emoji[cat]} ${cat}`,
        value: cmds,
      };
    });

    let help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: `MJ BOT 명령어`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(allCommands)
      .setFooter(client.getFooter(user));
    send({
      embeds: [help_embed],
    });

  };
};