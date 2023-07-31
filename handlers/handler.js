const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { readdirSync } = require("fs");
const MAKEJOY = require("./Client");

/**
 * @param {MAKEJOY} client
 **/
module.exports = async (client) => {

  try {
    readdirSync("./Commands/Message").forEach((dir) => {
      const commands = readdirSync(`./Commands/Message/${dir}`).filter((f) =>
        f.endsWith(".js")
      );

      for (const cmd of commands) {
        const command = require(`../Commands/Message/${dir}/${cmd}`);
        if (command.name) {
          client.mcommands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases))
            command.aliases.forEach((a) => client.aliases.set(a, command.name));
        } else {
          console.log(`${cmd} 가 준비되지 않았습니다.`);
        }
      }
    });
    console.log(`${client.mcommands.size}개의 커멘드를 로딩했습니다.`);
  } catch (error) {
    console.log(error);
  }

  try {
    let eventCount = 0;
    readdirSync("./events")
      .filter((f) => f.endsWith(".js"))
      .forEach((event) => {
        require(`../events/${event}`);
        eventCount++;
      });
    console.log(`${eventCount}개의 이벤트를 로딩했습니다.`);
  } catch (e) {
    console.log(e);
  }
};