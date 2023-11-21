const orders = require("../Model/Orders");

module.exports = async function (bot, message, user, city) {
  try {
    const userId = message.from.id;

    const orderProducts = await orders.find();
    const orderText = getOrderText(orderProducts);

    if (orderProducts.length === 0) {
      await bot.sendMessage(userId, "🛍 Savatchada maxsulot yo'q.", {
        parse_mode: "HTML",
      });
    } else {
      const keyboard = {
        inline_keyboard: [
          [{ text: "♻️ Maxsulotni tasdiqlash", callback_data: "attribution" }],
        ],
      };

      // const deliveryTime = calculateDeliveryTime(city);

      // const messageToSend = `Sizning shahringiz: ${city}\nMaxsulotlar yetib borish vaqti: ${deliveryTime} daqiqa`;

      await bot.sendMessage(userId, orderText, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
      // await bot.sendMessage(userId, messageToSend);
    }
  } catch (err) {
    console.log(err + "");
  }
};

// Qolgan funktsiyalar

function getOrderText(orderProducts) {
  let orderText = "<b>🛒 Savatchada</b>:\n\n";
  orderProducts.forEach((item) => {
    orderText += `<b>${item.count}</b> ✖️ ${
      item.name
    }\n⏰ <b>Vaqti:</b> ${new Date(
      item.date
    )}\n<b>🧺 Maxsulotlar narxi:</b> ${formatPrice(item.totalPrice)}\n\n`;
  });
  orderText += `<b>🚚 Yetkazib berish:</b> ${formatPrice(9000)}\n`;
  orderText += `<b>💰 Jami:</b> <b>${formatPrice(
    getTotalPrice(orderProducts)
  )}</b>`;
  return orderText;
}

function getTotalPrice(orderProducts) {
  const totalPrice = orderProducts.reduce(
    (total, item) => total + item.count * item.totalPrice + item.delivery,
    0
  );
  return totalPrice;
}

function formatPrice(price) {
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedPrice + " so'm";
}
