const {
  Message,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const MAKEJOY = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "filter",
  aliases: ["fl", "filters", "필터", "vlfxj"],
  description: `대기열에 필터를 설정합니다. (실험기능)`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   * @param {MAKEJOY} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   **/
  run: async (client, message, args, prefix, queue) => {
    const filters = Object.keys(client.config.filters);
    const row = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("필터 메뉴")
        .setPlaceholder("필터를 선택하세요.")
        .addOptions(
          [
            {
              label: `비활성화`,
              description: `필터를 비활성화 합니다.`,
              value: "off",
            },
            filters
              .filter((_, index) => index <= 22)
              .map((value) => {
                return {
                  label: value.toLocaleUpperCase(),
                  description: `클릭하여 ${value} 필터 적용`,
                  value: value,
                };
              }),
          ].flat(Infinity)
        ),
    ]);
    let msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle(`필터를 사용하려면 선택합니다.`)
          .setFooter(client.getFooter(message.author))
          .setDescription(
            `> 아래 드롭다운 메뉴에서 대기열에서 적용할 필터를 선택합니다.`
          ),
      ],
      components: [row],
    });
    const collector = await msg.createMessageComponentCollector({
      // filter: (i) => i.user.id === message.author.id,
      time: 60000 * 10,
    });
    collector.on("collect", async (interaction) => {
      if (interaction.isStringSelectMenu()) {
        await interaction.deferUpdate().catch((e) => {});
        if (interaction.customId === "filter-menu") {
          if (interaction.user.id !== message.author.id) {
            return interaction.followUp({
              content: `명령어 사용자만 이용할 수 있습니다.`,
              ephemeral: true,
            });
          }
          let filter = interaction.values[0];
          if (filter === "off") {
            queue.filters.clear();
            interaction.followUp({
              content: `${client.config.emoji.SUCCESS} 대기열 필터를 비활성화 했습니다.`,
              ephemeral: true,
            });
          } else {
            if (queue.filters.has(filter)) {
              queue.filters.remove(filter);
            } else {
              queue.filters.add(filter);
            }
            interaction.followUp({
              content: `${
                client.config.emoji.SUCCESS
              } | 현재 대기열 필터 : \`${queue.filters.names.join(", ")}\``,
              ephemeral: true,
            });
          }
        }
      }
    });
  },
};