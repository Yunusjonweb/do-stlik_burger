const admins = require("../../Model/Admins");
const categories = require("../../Model/Categories");

module.exports = async function (bot, message, admin, category_id) {
  try {
    const userId = message.from.id;
    let categoryList = [];

    if (category_id) {
      categoryList = await categories.find({ category_id: category_id });
    } else {
      categoryList = await categories.find();
    }

    let keyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: "➕ Qo'shish",
          },
        ],
      ],
    };

    for (let category of categoryList) {
      keyboard.keyboard.push([
        {
          text: category.name,
        },
      ]);
    }

    keyboard.keyboard.push([
      {
        text: "⬅️ Ortga",
      },
    ]);

    if (category_id) {
      keyboard.keyboard[keyboard.keyboard.length - 1].push({
        text: "🗑 O'chirish",
      });
    }

    if (categoryList.length) {
      await bot.sendMessage(userId, `Quydagi kategoriyalardan birini tanlang`, {
        reply_markup: keyboard,
      });
    } else {
      await bot.sendMessage(userId, `❗️ Ma'\lumot topilmadi`, {
        reply_markup: keyboard,
      });
    }
  } catch (err) {
    console.log(err + "");
  }
};
