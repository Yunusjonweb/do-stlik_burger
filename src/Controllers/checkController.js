const users = require("../Model/Users");
const MenuController = require("./MenuController");
const { verLocation } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;

    if (message.location) {
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          longitude: message.location.longitude,
          latitude: message.location.latitude,
          step: "verLocation",
        }
      );
      let msg = verLocation(user.lang);
      await bot.sendMessage(userId, msg.text, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: msg.btns.no,
              },
              {
                text: msg.btns.yes,
              },
            ],
          ],
        },
      });
    } else if (text == "⬅️ Ortga" || text == "⬅️ Назад" || text == "⬅️ Back") {
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: 5,
        }
      );
      await MenuController(bot, message, user);
    }
  } catch (err) {
    console.log(err + "");
  }
};
