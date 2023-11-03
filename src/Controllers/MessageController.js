const ad = require("../Admin/ad");
const admins = require("../Model/Admins");
const users = require("../Model/Users");
const checkController = require("./checkController");
const CommentController = require("./CommentController");
const CommentSave = require("./CommentSave");
const Menu = require("./Menu");
const MenuController = require("./MenuController");
const reqLocationController = require("./reqLocationController");
const SettingsController = require("./SettingsController");
const { reqPhone, reqCode } = require("./Texts");
const verLocationController = require("./verLocationController");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;
    const messageId = message.message_id;

    if (text == "/post") {
      if (message.reply_to_message) {
        let admin = await admins.findOne({
          user_id: user.user_id,
        });

        if (admin) {
          await ad(
            bot,
            message.reply_to_message.message_id,
            user.user_id,
            message.reply_to_message.reply_markup
          );
        }
      }
    }

    if (
      (text == "✍️ Fikr bildirish" ||
        text == "✍️ Обратная связь" ||
        text == "✍️ Leave comment") &&
      (user.step == 5 || user.step == 6)
    ) {
      await CommentController(bot, message, user);
    } else if (user.step == "comment") {
      if (text == "⬅️ Ortga" || text == "⬅️ Назад" || text == "⬅️ Back") {
        await users.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: 5,
          }
        );
        await MenuController(bot, message, user);
      } else {
        await CommentSave(bot, message, user);
      }
    } else if (
      (user.step == 5 || user.step == 6) &&
      (text == "⚙️ Sozlamalar" ||
        text == "⚙️ Настройки" ||
        text == "⚙️ Settings")
    ) {
      await SettingsController(bot, message, user);
    } else if (user.step == "phone") {
      let code = ("" + Math.random()).substring(2, 7);
      if (
        !Number(text) ||
        !(Number(text) <= 998999999999) ||
        !(Number(text) > 998000000000)
      ) {
        let msg = reqPhone(user.lang);
        await bot.sendMessage(userId, msg);
        return;
      }
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: "phone_code",
          phone_number: Number(text),
          code: code,
        }
      );
      let data = reqCode(user.lang);
      await bot.sendMessage(userId, data.text);
    } else if (user.step == "phone_code") {
      if (text == user.code) {
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
    } else if (
      (user.step == 5 || user.step == 6) &&
      (text == "🛒 Buyurtma qilish" ||
        text == "🛒 Заказать" ||
        text == "🛒 Order")
    ) {
      await reqLocationController(bot, message, user);
    } else if (user.step == "startOrder") {
      await checkController(bot, message, user);
    } else if (user.step == "verLocation") {
      await verLocationController(bot, message, user);
    } else if (user.step == 6 && text == "📍 Manzilni o'zgartirish") {
      await reqLocationController(bot, message, user);
    } else if (
      (user.step == 6 && text == "🍽 Menu") ||
      text == "🍽 Меню" ||
      text == "Menu"
    ) {
      await Menu(bot, message, user);
    }
  } catch (e) {
    console.log(e);
  }
};
