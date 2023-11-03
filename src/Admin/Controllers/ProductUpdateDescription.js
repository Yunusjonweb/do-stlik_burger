const admins = require("../../Model/Admins");
const products = require("../../Model/Product");

module.exports = async function (bot, message, admin, productId) {
  try {
    const userId = message.from.id;
    const price = Number(message.text);

    if (price == NaN) {
      await bot.sendMessage(userId, "Narxi son bo'lishi kerak qayta kiriting");
      return;
    }
    await admins.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `addProduct#${productId}#des`,
      }
    );

    await products.findOneAndUpdate(
      {
        id: productId,
      },
      {
        price,
      }
    );

    await bot.sendMessage(userId, "Mahsulot haqida malumot kiriting", {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: "⬅️ Ortga",
            },
          ],
        ],
      },
      parse_mode: "HTML",
    });
  } catch (err) {
    console.log(err + "");
  }
};
