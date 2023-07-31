const { ChannelType, PermissionFlagsBits } = require("discord.js");
const client = require("../index");

client.on("voiceStateUpdate", async (os, ns) => {
  if (!ns.guild || ns.member.user.bot) return;

  // 전용 채널에서 자동 재생
  if (
    ns.channelId &&
    ns.channel.type === ChannelType.GuildStageVoice &&
    ns.guild.members.me.voice.suppress
  ) {
    if (
      ns.guild.members.me.permissions.has(PermissionFlagsBits.Speak) ||
      (ns.channel &&
        ns.channel
          .permissionsFor(ns.guild.members.me)
          .has(PermissionFlagsBits.Speak))
    ) {
      ns.guild.members.me.voice.setSuppressed(false).catch((e) => {});
    }
  }
});