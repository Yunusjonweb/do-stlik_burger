const users = require("../Model/Users");
const { verAttribution } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;

    await users.findOneAndUpdate(
      { user_id: userId },
      {
        step: "verAttribution",
      }
    );

    const msg = verAttribution(user.lang);

    await bot.sendMessage(userId, msg.text, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [[{ text: msg.btns.no }, { text: msg.btns.yes }]],
      },
    });
  } catch (err) {
    console.log(err.toString());
  }
};
