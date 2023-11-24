const users = require("../../Model/Users");
const { PhoneSend } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const messageId = message.message.message_id;
    const data = message.data;

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: "phone",
      }
    );

    await bot.deleteMessage(userId, messageId);

    let msg = PhoneSend(user);

    let keyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: msg.btns.back,
          },
        ],
      ],
    };

    await bot.sendMessage(userId, msg.text, {
      reply_markup: keyboard,
      parse_mode: "HTML",
    });
  } catch (e) {
    console.log(e);
  }
};
