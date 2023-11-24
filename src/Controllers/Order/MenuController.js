const { MenuMsg } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;

    const menuMsg = MenuMsg(user.lang);

    const keyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: menuMsg.keyboard.order,
          },
        ],
        [
          {
            text: menuMsg.keyboard.orders,
          },
          {
            text: menuMsg.keyboard.vacancy,
          },
        ],
        [
          {
            text: menuMsg.keyboard.comment,
          },
          {
            text: menuMsg.keyboard.settings,
          },
        ],
      ],
    };
    await bot.sendMessage(userId, menuMsg.text, {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.log(err.toString());
  }
};
