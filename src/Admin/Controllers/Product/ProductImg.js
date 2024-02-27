const admins = require("../../../Model/Admins");
const products = require("../../../Model/Product");

module.exports = async function (bot, message, admin, productId) {
  try {
    const userId = message.from.id;
    const channelId = -1002145163406;
    await admins.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `addProduct#${productId}#done`,
      }
    );

    await products.findOneAndUpdate(
      {
        id: productId,
      },
      {
        pic: message.photo[0].file_id,
      }
    );

    let product = await products.findOne({
      id: productId,
    });

    bot.sendPhoto(channelId, message.photo[0].file_id);

    await bot.sendPhoto(userId, message.photo[0].file_id, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: "Saqlash",
            },
            {
              text: "⬅️ Ortga",
            },
          ],
        ],
      },
      caption: `<b>Maxsulot nomi: </b> ${product.name}\n<b>Maxsulot narxi: </b> ${product.price} so'm\n<b>Maxsulot haqida malumot: </b> ${product.description}\n`,
      parse_mode: "HTML",
    });
  } catch (err) {
    console.log(err + "");
  }
};
