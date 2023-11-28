const orders = require("../../Model/Orders");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const order = await orders.find({ id: userId });
    const orderText = getOrderText(order);

    if (order.length === 0) {
      await bot.sendMessage(userId, "🛍 Savatchada maxsulot yo'q.", {
        parse_mode: "HTML",
      });
    } else {
      const keyboard = {
        inline_keyboard: [
          [{ text: "♻️ Maxsulotni tasdiqlash", callback_data: "attribution" }],
        ],
      };

      await bot.sendMessage(userId, orderText, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }
  } catch (err) {
    console.log(err + "");
  }
};

function getOrderText(orderProducts) {
  let orderText = "<b>🛒 Savatchada</b>:\n\n";
  orderProducts.forEach((item) => {
    const itemTotalPrice = item.price * item.count;
    orderText += `<b>${item.count}</b> ✖️ ${
      item.name
    }\n⏰ <b>Vaqti:</b> ${new Date(
      item.date
    )}\n<b>🧺 Maxsulotlar narxi:</b> ${formatPrice(itemTotalPrice)}\n\n`;
  });
  orderText += `<b>🚚 Yetkazib berish:</b> ${formatPrice(9000)}\n`;
  orderText += `<b>💰 Jami:</b> <b>${formatPrice(
    getTotalPrice(orderProducts)
  )}</b>`;
  return orderText;
}

function getTotalPrice(orderProducts) {
  const totalPrice = orderProducts.reduce(
    (total, item) => total + item?.count * item?.price + item?.delivery,
    0
  );
  return totalPrice;
}

function formatPrice(price) {
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedPrice + " so'm";
}
