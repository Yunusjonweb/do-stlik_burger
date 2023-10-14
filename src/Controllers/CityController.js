const users = require("../Model/Users");
const { CityList } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const messageId = message.message.message_id;
    const data = message.data;

    let keyboard = {
      inline_keyboard: [],
    };

    let cities = (await CityList(user.lang)).cities;

    for (let city of cities) {
      keyboard.inline_keyboard.push([
        {
          text: city,
          callback_data: city,
        },
      ]);
    }

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: "city",
      }
    );

    await bot.editMessageReplyMarkup(keyboard, {
      chat_id: userId,
      message_id: messageId,
    });
  } catch (e) {
    console.log(e);
  }
};
