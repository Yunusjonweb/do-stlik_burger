const categories = require("../Model/Categories");
const products = require("../Model/Product");
const users = require("../Model/Users");
const ProductBasket = require("./ProductBasket");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const messageId = message.message.message_id;
    const data = message.data;

    const type = data.split("#")[0];
    const id = data.split("#")[1];

    if (type !== "product") {
      return;
    }

    const product = await products.findOne({
      id,
    });

    await bot.deleteMessage(userId, messageId);

    const productCaption = `💰 Narxi: <b>${formatPrice(
      product?.price
    )}</b>\n✍️ Tarkibi: ${product?.description}\n🔄 Miqdorini tanlang`;

    const keyboard = {
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

    const category = await categories.findOne({
      id: product.category_id,
    });

    let backData = category.id ? `category#${category.id}` : `menu`;

    keyboard.inline_keyboard.push([
      {
        text: "⬅️ Ortga",
        callback_data: backData,
      },
      {
        text: "🔝 Davom etish",
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

function formatPrice(price) {
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedPrice + " so'm";
}
