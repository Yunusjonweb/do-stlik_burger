const users = require("../../Model/Users");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const messageId = message.message.message_id;

    let keyboard = {
      inline_keyboard: [
        [
          {
            text: "🇺🇿 O'zbekcha",
            callback_data: "uz",
          },
          {
            text: "🇷🇺 Русский",
            callback_data: "ru",
          },
          {
            text: "🇬🇧 English",
            callback_data: "eng",
          },
        ],
      ],
    };

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: "lang",
      }
    );

    await bot.editMessageReplyMarkup(keyboard, {
      chat_id: userId,
      message_id: messageId,
    });
  } catch (err) {
    console.log(err + "");
  }
};
