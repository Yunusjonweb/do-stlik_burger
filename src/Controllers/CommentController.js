const users = require("../Model/Users");
const { CommentStart } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;
    const messageId = message.message_id;

    await users.findOneAndUpdate(
      { user_id: userId },
      {
        step: "comment",
      }
    );

    let msg = CommentStart(user.lang);

    await bot.sendMessage(userId, msg.text, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: msg.btn,
            },
          ],
        ],
      },
    });
  } catch (err) {
    console.log(err+"");
  }
};
