const users = require("../Model/Users");
const MenuController = require("./MenuController");
const { LangChange } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const data = message.data;
    const messageId = message.message.message_id;

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        lang: data,
        step: 5,
      }
    );

    user.lang = data;
    let msg = LangChange(data);

    await bot.deleteMessage(userId, messageId);
    await bot.sendMessage(userId, msg);
    await MenuController(bot, message, user);
  } catch (err) {
    await MenuController(bot, message, user);
    console.log(err + "");
  }
};
