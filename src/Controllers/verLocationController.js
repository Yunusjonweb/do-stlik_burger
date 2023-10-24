const users = require("../Model/Users");
const reqLocationController = require("./reqLocationController");
const startOrderController = require("./startOrderController");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;

    if (text == "✅ Ha" || text == "✅ Да" || text == "✅ Yes") {
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: 6,
        }
      );
      await startOrderController(bot, message, user);
    } else if (text == "❌ Yo'q" || text == "❌ Нет" || text == "❌ No") {
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: "startOrder",
        }
      );
      await reqLocationController(bot, message, user);
    }
  } catch (err) {
    console.log(err + "");
  }
};
