const categories = require("../Model/Categories");
const products = require("../Model/Product");
const users = require("../Model/Users");
module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const channelId = -1002145163406;
    const messageId = message.message.message_id;
    const data = message.data;

    console.log(data, "888888");

    let type = data.split("#")[0];
    let id = data.split("#")[1];

    if (type != "product") {
      return;
    }

    let product = await products.findOne({
      id,
    });

    await bot.deleteMessage(userId, messageId);

    let productCaption = `Narxi: <b>${product.price} so'm</b>\nTarkibi: ${product.description}\nMiqdorini tanlang`;

    let keyboard = {
      inline_keyboard: [],
    };

    for (let i = 1; i < 8; i += 3) {
      keyboard.inline_keyboard.push([
        {
          text: i,
          callback_data: `count#${product.id}`,
        },
        {
          text: i + 1,
          callback_data: `count#${product.id}`,
        },
        {
          text: i + 2,
          callback_data: `count#${product.id}`,
        },
      ]);
    }

    keyboard.inline_keyboard.push([
      {
        text: "⬅️ Ortga",
        callback_data: `back#${product.id}`,
      },
      {
        text: "🔝 Davom etish",
        callback_data: `menu`,
      },
    ]);

    keyboard.inline_keyboard.push([
      {
        text: "🛒 Savatcha",
        callback_data: `menu`,
      },
    ]);

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `count#${product.id}`,
      }
    );

    await bot.sendPhoto(userId, product.pic, {
      cation: productCaption,
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  } catch (err) {
    console.log(err + "");
  }
};
