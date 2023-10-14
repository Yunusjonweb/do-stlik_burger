const comments = require("../Model/Comments");
const users = require("../Model/Users");
const MenuController = require("./MenuController");
const { CommentSaved } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;

    await comments.create({
      user_id: userId,
      text,
    });

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: 5,
      }
    );

    let msg = CommentSaved(user.lang);

    await bot.sendMessage(userId, msg);

    await MenuController(bot, message, user);
  } catch (e) {
    console.log(e);
  }
};
