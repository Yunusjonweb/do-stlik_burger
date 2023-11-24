const { Settings } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;
    const messageId = message.message_id;

    let msg = Settings(user);

    let keyboard = {
      inline_keyboard: [
        [
          {
            text: msg.btns.lang,
            callback_data: "lang",
          },
          {
            text: msg.btns.city,
            callback_data: "city",
          },
          {
            text: msg.btns.phone,
            callback_data: "phone",
          },
        ],
      ],
    };

    await bot.sendMessage(userId, msg.text, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  } catch (err) {
    console.log(err + "");
  }
};
