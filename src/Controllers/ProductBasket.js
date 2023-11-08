const products = require("../Model/Product");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const messageId = message.message.message_id;
    const data = message.data;
    const productId = data.split("#")[1];
    const countId = data.split("#")[2];

    const productSelect = await products.findOne({
      id: productId,
    });

    function calculateTotalPrice(quantity, unitPrice) {
      var totalPrice = quantity * unitPrice + 9000;
      return totalPrice;
    }

    let totalPrice = calculateTotalPrice(countId, productSelect?.price);

    const totalPrices = (value) => {
      return value
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    if (user?.step.split("#")[0] === "count") {
      await bot.deleteMessage(userId, messageId);
      let keyboard = {
        inline_keyboard: [],
      };
      let text = `<b>🛒 Savatchada</b>:\n\n <b>${countId}</b> ✖️ ${
        productSelect?.name
      }\n\n<b>🧺 Maxsulot narxi:</b> ${totalPrices(
        productSelect?.price
      )} so'm\n<b>🚚 Yetkazib berish:</b> 9000 so'm\n<b>💰 Jami:</b> <b>${totalPrices(
        totalPrice
      )} so'm</b>`;

      keyboard.inline_keyboard.push([
        {
          text: "⬅️ Ortga",
          callback_data: `back#${productSelect.id}`,
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

      await bot.sendMessage(userId, text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }
  } catch (err) {
    console.log(err + "");
  }
};
