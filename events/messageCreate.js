const { cooldown, check_dj, databasing } = require("../handlers/functions");
const client = require("..");
const { PREFIX: botPrefix, emoji } = require("../settings/config");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.id) return;
  await databasing(message.guildId, message.author.id);
  let settings = await client.music.get(message.guild.id);
  let prefix = settings?.prefix || botPrefix;
  let mentionprefix = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, nprefix] = message.content.match(mentionprefix);
  const args = message.content.slice(nprefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) {
    if (nprefix.includes(client.user.id)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(
              ` ${emoji.SUCCESS} 모든 명령어를 확인하려면  \`${prefix}도움말\`을 입력하세요.`
            ),
        ],
      });
    }
  }
  const command =
    client.mcommands.get(cmd) ||
    client.mcommands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
  if (!command) return;
  if (command) {
    let queue = client.distube.getQueue(message.guild.id);
    let voiceChannel = message.member.voice.channel;
    let botChannel = message.guild.members.me.voice.channel;
    let checkDJ = await check_dj(client, message.member, queue?.songs[0]);

    if (
      !message.member.permissions.has(
        PermissionsBitField.resolve(command.userPermissions)
      )
    ) {
      return client.embed(
        message,
        `\`${command.name}\`명령어를 사용할 권한이 없습니다.`
      );
    } else if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.botPermissions)
      )
    ) {
      return client.embed(
        message,
        `MJ Bot이 \`${command.name}\`명령어를 실행할 권한이 없습니다.`
      );
    } else if (cooldown(message, command)) {
      return client.embed(
        message,
        `[쿨다운 모드]\`${cooldown(
          message,
          command
        ).toFixed()}\` 초 뒤에 다시 시도하세요.`
      );
    } else if (command.inVoiceChannel && !voiceChannel) {
      return client.embed(
        message,
        `${emoji.ERROR} 먼저 음성채널에 접속하세요.`
      );
    } else if (
      command.inSameVoiceChannel &&
      botChannel &&
      !botChannel?.equals(voiceChannel)
    ) {
      return client.embed(
        message,
        `${emoji.ERROR} 다른 음성채널(${botChannel})에서 사용중입니다.`
      );
    } else if (command.Player && !queue) {
      return client.embed(message, `${emoji.ERROR} 노래 재생중이 아닙니다.`);
    } else if (command.djOnly && checkDJ) {
      return client.embed(
        message,
        `${emoji.ERROR} DJ권한이 있거나 노래 신청자만 가능합니다.`
      );
    } else {
      command.run(client, message, args, nprefix, queue);
    }
  }
});

function escapeRegex(newprefix) {
  return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}