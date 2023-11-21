const orders = require("../Model/Orders");
const users = require("../Model/Users");
const MenuController = require("./MenuController");
const reqLocationController = require("./reqLocationController");

module.exports = async function (bot, message, user) {
  const userId = message.from.id;
  const text = message.text;
  const channelId = -1002145163406;

  try {
    if (["✅ Ha", "✅ Да", "✅ Yes"].includes(text)) {
      const orderProducts = await orders.find();
      const orderText = getOrderText(orderProducts);

      const userData = await users.findOne({ user_id: userId });
      const userText = getUserText(userData, message);

      const messageText = userText + "\n\n" + orderText;

      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: 6,
        }
      );

      await bot.sendMessage(channelId, messageText, {
        parse_mode: "HTML",
      });

      await MenuController(bot, message, user);
    } else if (["❌ Yo'q", "❌ Нет", "❌ No"].includes(text)) {
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        { 
          step: "startOrder",
        }
      );

      await reqLocationController(bot, message, user);
    }
  } catch (err) {
    console.log(err + "");
  }
};

function getOrderText(orderProducts) {
  let orderText = "<b>🛍 Buyurtma qilingan maxsulotlar</b>:\n\n";
  orderProducts.forEach((item) => {
    orderText += `<b>${item.count}</b> ✖️ ${
      item.name
    }\n⏰ <b>Vaqti</b> ${new Date(
      item.date
    )}: \n<b>🧺 Maxsulotlar narxi:</b> ${formatPrice(item.totalPrice)}\n\n`;
  });
  orderText += `<b>🚚 Yetkazib berish:</b> ${formatPrice(9000)} \n`;
  orderText += `<b>💰 Jami:</b> <b>${formatPrice(
    getTotalPrice(orderProducts)
  )}</b>`;
  return orderText;
}

function getUserText(userData, message) {
  let userText = "<b>Foydalanuvchi ma'lumotlari:</b>\n\n";
  userText += `<b>👤 Ism:</b> ${message.from.first_name}\n`;
  userText += `<b>📞 Telefon raqami:</b> +${userData?.phone_number}\n`;
  userText += `<b>📍 Joylashuvi: </b>https://www.google.com/maps?q=${userData?.latitude},${userData?.longitude}`;
  return userText;
}

function getTotalPrice(orderProducts) {
  const totalPrice = orderProducts.reduce((total, item) => {
    return total + item.count * item.totalPrice + item.delivery;
  }, 0);
  return totalPrice;
}

function formatPrice(price) {
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedPrice + " so'm";
}
