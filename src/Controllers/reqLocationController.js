const users = require("../Model/Users");
const MenuController = require("./MenuController");
const { reqLocation } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;
    const messageId = message.message_id;

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: "startOrder",
      }
    );
    let msg = reqLocation(user.lang);
    await bot.sendMessage(userId, msg.text, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: msg.btns.location,
              request_location: true,
            },
          ],
          [
            {
              text: msg.btns.back,
            },
          ],
        ],
      },
    });
  } catch (err) {
    console.log(err + "");
  }
};
