const { startOrderMenu } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    let msg = startOrderMenu(user.lang);
    let { btns } = msg;
    let keyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: btns.change_location,
          },
          {
            text: btns.menu,
          },
        ],
        [
          {
            text: btns.orders,
          },
          {
            text: btns.vacancy,
          },
        ],
        [
          {
            text: btns.comment,
          },
          {
            text: btns.settings,
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
