const {
  Interaction,
  Collection,
  Client,
  GuildMember,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const client = require("../index");
const { Song } = require("distube");

/**
 * @param {Interaction} interaction
 * @param {String} cmd
 **/
function cooldown(interaction, cmd) {
  if (!interaction || !cmd) return;
  let { client, member } = interaction;
  if (!client.cooldowns.has(cmd.name)) {
    client.cooldowns.set(cmd.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(cmd.name);
  const cooldownAmount = cmd.cooldown * 1000;
  if (timestamps.has(member.id)) {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000; // lefttime 불러오기
      // true 반환
      return timeLeft;
    } else {
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
      return false;
    }
  } else {
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    return false;
  }
}

/**
 * @param {Client} client
 * @param {GuildMember} member
 * @param {Song} song
 * @returns
 **/
async function check_dj(client, member, song = null) {

  if (!client) return false;

  // 관리자 권한
  let roleid = await client.music.get(`${member.guild.id}.djrole`);

  // dj 역할이 false가 아니면 진행됨
  let isdj = false;
  if (!roleid) return false;

  // 역할이 존재하지 않으면 현재 루프 실행을 건너뜀
  if (!member.guild.roles.cache.get(roleid)) {
    await client.music.set(`${member.guild.id}.djrole`, null);
    return;
  }

  // true 설정 시
  if (member.roles.cache.has(roleid)) isdj = true;

  // DJ 또는 관리자인 경우 false를 반환 (cmd 진행됨)
  if (
    !isdj &&
    !member.permissions.has(PermissionFlagsBits.Administrator) &&
    song?.user.id !== member.id
  ) {
    return true;
  } else {
    return false;
  }
}

async function databasing(guildID, userID) {
  await client.music.ensure(guildID, {
    prefix: client.config.PREFIX,
    djrole: null,
    vc: {
      enable: false,
      channel: null,
    },
    music: {
      channel: null,
      pmsg: null,
      qmsg: null,
    },
    autoresume: false,
  });
  await client.autoresume.ensure(guildID, {
    guild: guildID,
    voiceChannel: null,
    textChannel: null,
    songs: [],
    volume: client.config.options.defaultVolume,
    repeatMode: 0,
    playing: null,
    currentTime: null,
    autoplay: null,
  });
}

async function swap_pages(interaction, embeds) {
  let currentPage = 0;
  let allbuttons = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("0")
      .setLabel("<<"),
    // .setEmoji(`⏪`),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("1")
      .setLabel("<"),
    // .setEmoji(`◀️`),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId("2")
      .setLabel("⛔️"),
    // .setEmoji(`🗑`),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("3")
      .setLabel(">"),
    // .setEmoji(`▶️`),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("4")
      .setLabel(">>"),
    // .setEmoji(`⏩`),
  ]);
  if (embeds.length === 1) {
    if (interaction.deferred) {
      return interaction.followUp({
        embeds: [embeds[0]],
        fetchReply: true,
      });
    } else {
      return interaction.reply({
        embeds: [embeds[0]],
        fetchReply: true,
      });
    }
  }

  // 메시지 버튼 추가
  embeds = embeds.map((embed, index) => {
    return embed.setColor(client.config.embed.color).setFooter({
      text: `페이지 ${index + 1} / ${embeds.length}`,
      iconURL: interaction.guild.iconURL({ dynamic: true }),
    });
  });
  let swapmsg;
  if (interaction.deferred) {
    swapmsg = await interaction.followUp({
      embeds: [embeds[0]],
      components: [allbuttons],
    });
  } else {
    swapmsg = await interaction.reply({
      embeds: [embeds[0]],
      components: [allbuttons],
    });
  }

  // 메시지 수집기
  const collector = swapmsg.createMessageComponentCollector({
    time: 2000 * 60,
  });
  collector.on("collect", async (b) => {
    if (b.isButton()) {
      await b.deferUpdate().catch((e) => {});

      // 첫페이지
      if (b.customId == "0") {
        if (currentPage !== 0) {
          currentPage = 0;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        }
      }
      // 이전
      if (b.customId == "1") {
        if (currentPage !== 0) {
          currentPage -= 1;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        } else {
          currentPage = embeds.length - 1;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        }
      }
      // 홈
      else if (b.customId == "2") {
        try {
          allbuttons.components.forEach((btn) => btn.setDisabled(true));
          swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        } catch (e) {}
      }
      // 이전
      else if (b.customId == "3") {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        } else {
          currentPage = 0;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        }
      }
      // 마지막 페이지
      if (b.customId == "4") {
        currentPage = embeds.length - 1;
        await swapmsg
          .edit({
            embeds: [embeds[currentPage]],
            components: [allbuttons],
          })
          .catch((e) => null);
      }
    }
  });

  collector.on("end", () => {
    allbuttons.components.forEach((btn) => btn.setDisabled(true));
    swapmsg.edit({ components: [allbuttons] }).catch((e) => null);
  });
}

function shuffle(array) {
  try {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function createBar(total, current, size = 25, line = "▬", slider = "🔷") {
  try {
    if (!total) throw "MISSING MAX TIME";
    if (!current) return `**[${slider}${line.repeat(size - 1)}]**`;
    let bar =
      current > total
        ? [line.repeat((size / 2) * 2), (current / total) * 100]
        : [
            line
              .repeat(Math.round((size / 2) * (current / total)))
              .replace(/.$/, slider) +
              line.repeat(size - Math.round(size * (current / total)) + 1),
            current / total,
          ];
    if (!String(bar).includes(slider)) {
      return `**[${slider}${line.repeat(size - 1)}]**`;
    } else {
      return `**[${bar[0]}]**`;
    }
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function msToDuration(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let months = Math.floor(days / 30);
  let years = Math.floor(days / 365);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;
  days %= 24;
  months %= 12;

  years = years ? `${years} 년 ` : "";
  months = months ? `${months} 개월 ` : "";
  days = days ? `${days} 일 ` : "";
  hours = hours ? `${hours} 시간 ` : "";
  minutes = minutes ? `${minutes} 분 ` : "";
  seconds = seconds ? `${seconds} 초 ` : "";

  return years + months + days + hours + minutes + seconds;
}

async function skip(queue) {
  if (queue.songs.length <= 1) {
    if (!queue.autoplay) {
      await queue.stop().catch((e) => null);
    } else {
      await queue.skip().catch((e) => null);
    }
  } else {
    await queue.skip().catch((e) => null);
  }
}

function formatBytes(x) {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

module.exports = {
  cooldown,
  check_dj,
  databasing,
  swap_pages,
  shuffle,
  createBar,
  msToDuration,
  skip,
  formatBytes,
};