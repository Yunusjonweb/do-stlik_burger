const MenuProduct = require("../../Controllers/MenuProduct");
const ProductBasket = require("../../Controllers/ProductBasket");
const MenuCategory = require("./MenuCategory");

module.exports = async function (bot, message, user) {
  try {
    const data = message.data;

    await MenuCategory(bot, message, user);
    await MenuProduct(bot, message, user);
    await ProductBasket(bot, message, user);
  } catch (err) {
    console.log(err + "");
  }
};
