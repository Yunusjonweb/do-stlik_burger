const users = require("../../Model/Users");
const MenuController = require("../Order/MenuController");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: 6,
      }
    );

    await bot.sendMessage(
      userId,
      `✅ Ishga murojaat qo'shish muvaffaqiyatli qo'shildi.`
    );

    await MenuController(bot, message, user);
  } catch (err) {
    console.log(err + "");
  }
};
