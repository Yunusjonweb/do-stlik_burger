const admins = require("../../Model/Admins");

module.exports = async function (bot, message, admin) {
  try {
    const userId = message.from.id;
    const text = message.text;

    await admins.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: 0,
      }
    );

    let keyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: "➕ Kategoriyalar",
          },
          {
            text: "🧺 Maxsulot qo'shish",
          },
        ],
      ],
    };

    await bot.sendMessage(userId, `Quydagilardan birini tanlang`, {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.log(err + "");
  }
};
