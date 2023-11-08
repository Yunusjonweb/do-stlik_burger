const products = require("../Model/Product");
const users = require("../Model/Users");
const ProductBasket = require("./ProductBasket");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const channelId = -1002145163406;
    const messageId = message.message.message_id;
    const data = message.data;

    let type = data.split("#")[0];
    let id = data.split("#")[1];

    if (type != "product") {
      return;
    }

    let product = await products.findOne({
      id,
    });

    await bot.deleteMessage(userId, messageId);

    let productCaption = `💰 Narxi: <b>${product.price} so'm</b>\n✍️ Tarkibi: ${product.description}\n🔄 Miqdorini tanlang`;

    let keyboard = {
      inline_keyboard: [],
    };

    for (let i = 1; i < 8; i += 3) {
      keyboard.inline_keyboard.push([
        {
          text: i,
          callback_data: `count#${product.id}#${i}`,
        },
        {
          text: i + 1,
          callback_data: `count#${product.id}#${i + 1}`,
        },
        {
          text: i + 2,
          callback_data: `count#${product.id}#${i + 2}`,
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
      parse_mode: "HTML",
      reply_markup: keyboard,
      caption: productCaption,
    });
  } catch (err) {
    console.log(err + "");
  }
};
