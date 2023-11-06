const admins = require("../../Model/Admins");
const products = require("../../Model/Product");

module.exports = async function (bot, message, admin, productId) {
  try {
    const userId = message.from.id;
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
        pic: message.text,
      }
    );

    let product = await products.findOne({
      id: productId,
    });

    await bot.sendMessage(
      userId,
      `<b>Maxsulot nomi: </b> ${product.name}\n<b>Maxsulot narxi: </b> ${product.price} so'm\n<b>Maxsulot haqida malumot: </b> ${product.description}\n<b>Rasim:</b>${product.pic}`,
      {
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
        parse_mode: "HTML",
      }
    );
  } catch (err) {
    console.log(err + "");
  }
};
