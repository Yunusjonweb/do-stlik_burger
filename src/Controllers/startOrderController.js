const { startOrderMenu } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;

    let msg = startOrderMenu(user.lang);

    let keyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: msg.btns.change_location,
          },
          {
            text: msg.btns.menu,
          },
        ],
        [
          {
            text: msg.btns.orders,
          },
          {
            text: msg.btns.vacancy,
          },
        ],
        [
          {
            text: msg.btns.comment,
          },
          {
            text: msg.btns.settings,
          },
        ],
      ],
    };
    await bot.sendMessage(userId, msg.text, {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.log(err + "");
  }
};
