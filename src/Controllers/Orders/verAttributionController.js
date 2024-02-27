const orders = require("../../Model/Orders");
const users = require("../../Model/Users");
const MenuController = require("../Order/MenuController");

module.exports = async function (bot, message, user) {
  const userId = message.from.id;
  const text = message.text;
  const channelId = -1002145163406;

  try {
    if (["✅ Ha", "✅ Да", "✅ Yes"].includes(text)) {
      const orderProducts = await orders.find({ id: userId });
      const userData = await users.findOne({ user_id: userId });
      const orderText = getOrderText(orderProducts);

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

      if (userData.city === "Jizzax") {
        let count = 20;
        const sentMessage = await bot.sendMessage(userId, `⏳ ${count} minut`);
        const sentMessageId = sentMessage.message_id;

        const countdownInterval = setInterval(() => {
          if (count > 0) {
            count--;
            bot.editMessageText(
              `⏳ Maxsulotni yetkazib berish vaqti: ${count} minut qoldi...`,
              {
                chat_id: userId,
                message_id: sentMessageId,
              }
            );
            bot.pinChatMessage(userId, sentMessageId);
          } else {
            clearInterval(countdownInterval);
            bot.editMessageText("⌛️ Countdown tugadi!", {
              chat_id: userId,
              message_id: sentMessageId,
            });
            deleteDeliveredProducts(orderProducts);
          }
        }, 60000);
      } else {
        await bot.sendMessage(
          userId,
          "Sizning hududingizga yetkazib berish mavjud emas."
        );
      }
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
    }
  } catch (err) {
    console.log(err + "");
  }
};

async function deleteDeliveredProducts(orderProducts) {
  try {
    const deliveredProductIds = orderProducts.map((item) => item._id);
    await orders.deleteMany({ _id: { $in: deliveredProductIds } });
  } catch (err) {
    console.log("Yetkazib berilgan maxsulotlarni o'chirishda xato:", err + "");
  }
}

function getOrderText(orderProducts) {
  let orderText = "<b>🛍 Buyurtma qilingan maxsulotlar</b>:\n\n";
  orderProducts.forEach((item) => {
    const itemTotalPrice = item.price * item.count;
    orderText += `<b>${item.count}</b> ✖️ ${
      item.name
    }\n⏰ <b>Vaqti</b> ${new Date(
      item.date
    )}: \n<b>🧺 Maxsulotlar narxi:</b> ${formatPrice(itemTotalPrice)}\n\n`;
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
    return total + item.count * item.price + item.delivery;
  }, 0);
  return totalPrice;
}

function formatPrice(price) {
  if (typeof price === "undefined") {
    return "N/A";
  }

  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedPrice + " so'm";
}
