const users = require("../../Model/Users");
const reqLocationController = require("./reqLocationController");
const startOrderController = require("../startOrderController");

module.exports = async function (bot, message, user) {
  const userId = message.from.id;
  const text = message.text;

  try {
    if (["✅ Ha", "✅ Да", "✅ Yes"].includes(text)) {
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: 6,
        }
      );
      await startOrderController(bot, message, user);
    } else if (["❌ Yo'q", "❌ Нет", "❌ No"].includes(text)) {
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
    console.log(err.toString());
  }
};
