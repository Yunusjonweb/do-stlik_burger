const comments = require("../../Model/Comments");
const users = require("../../Model/Users");
const MenuController = require("../Order/MenuController");
const { CommentSaved } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;
    const created_at = new Date();

    await comments.create({
      user_id: userId,
      text,
      created_at: created_at,
    });

    await users.findOneAndUpdate({ user_id: userId }, { step: 5 });

    const msg = CommentSaved(user.lang);

    await Promise.all([
      bot.sendMessage(userId, msg),
      MenuController(bot, message, user),
    ]);
  } catch (err) {
    console.log(err + "");
  }
};
