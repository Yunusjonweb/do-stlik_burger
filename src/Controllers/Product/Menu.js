const categories = require("../../Model/Categories");
const products = require("../../Model/Product");
const { Menu } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    let categoryList = await categories.find({
      category_id: null,
    });
    let productList = await products.find({
      category_id: null,
    });

    let keyboard = {
      inline_keyboard: [
        [
          {
            text: "Barcha menyular",
            url: "https://telegra.ph/Dostlik-Burger-11-03",
          },
        ],
      ],
    };

    if (categoryList.length > 0) {
      keyboard.inline_keyboard[0].push({
        text: categoryList[0].name,
        callback_data: `category#${categoryList[0].id}`,
      });
    }

    let total = [...categoryList, ...productList];

    for (let i = 1; i < total.length; i += 3) {
      let newRow = [];
      newRow.push({
        text: total[i].name,
        callback_data: `${total[i].price ? "product" : "category"}#${
          total[i].id
        }`,
      });
      if (total[i + 1]) {
        newRow.push({
          text: total[i + 1].name,
          callback_data: `${total[i + 1].price ? "product" : "category"}#${
            total[i + 1].id
          }`,
        });
      }
      keyboard.inline_keyboard.push(newRow);
    }

    let text = Menu(user.lang);

    await bot.sendMessage(
      userId,
      `${text},<a href="https://telegra.ph/Dostlik-Burger-11-03">.</a>`,
      {
        reply_markup: keyboard,
        parse_mode: "HTML",
      }
    );
  } catch (err) {
    console.log(err + "");
  }
};
