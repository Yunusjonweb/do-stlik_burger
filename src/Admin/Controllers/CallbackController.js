const MenuProduct = require("../../Controllers/Product/MenuProduct");
const ProductBasket = require("../../Controllers/Product/ProductBasket");
const MenuCategory = require("./Category/MenuCategory");

module.exports = async function (bot, message, user) {
  const data = message.data;
  try {
    await Promise.all([
      MenuCategory(bot, message, user),
      MenuProduct(bot, message, user),
      ProductBasket(bot, message, user),
    ]);
  } catch (err) {
    console.log(err + "");
  }
};
