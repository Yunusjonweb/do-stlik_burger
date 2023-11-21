const orders = require("../Model/Orders");
const products = require("../Model/Product");
const users = require("../Model/Users");

module.exports = async function (bot, message, user) {
  try {
    const data = message.data;
    const userId = message.from.id;
    const countId = data.split("#")[2];
    const productId = data.split("#")[1];
    const messageId = message.message.message_id;
    const currentDate = new Date();

    const productSelect = await products.findOne({
      id: productId,
    });

    function calculateTotalPrice(quantity, unitPrice) {
      var totalPrice = quantity * unitPrice + 9000;
      return totalPrice;
    }

    if (user?.step.split("#")[0] === "count") {
      await bot.deleteMessage(userId, messageId);
      let keyboard = {
        inline_keyboard: [],
      };

      let productPrices = productSelect ? countId * productSelect.price : 0;
      let totalPrices = calculateTotalPrice(countId, productSelect?.price);

      function formatPrice(price) {
        const formattedPrice = price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return formattedPrice + " so'm";
      }

      let text = `<b>🛒 Savatchada</b>:\n\n <b>${countId}</b> ✖️ ${
        productSelect?.name
      }\n\n<b>🧺 Maxsulot narxi:</b> ${
        productSelect?.price
      } so'm\n<b>🚚 Yetkazib berish:</b> 9000 so'm\n<b>💰 Jami:</b> <b>${formatPrice(
        totalPrices
      )} so'm</b>`;

      const existingOrder = await orders.findOneAndUpdate(
        {
          id: userId,
          name: productSelect?.name,
        },
        {
          $inc: { count: countId },
          totalPrice: productPrices,
          date: currentDate,
        },
        { new: true }
      );

      if (!existingOrder) {
        await orders.create({
          id: userId,
          name: productSelect?.name,
          price: productSelect?.price,
          pic: productSelect?.pic,
          totalPrice: productPrices,
          count: countId,
          delivery: 9000,
          date: currentDate,
        });
      }

      const product = await products.findOne({
        id: productId,
      });

      let backData = product.id ? `product#${product.id}` : `menu`;

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
          step: 7,
        }
      );

      await bot.sendMessage(userId, text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }
  } catch (err) {
    console.log(err + "");
  }
};
