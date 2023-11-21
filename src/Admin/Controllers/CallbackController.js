const MenuProduct = require("../../Controllers/MenuProduct");
const ProductBasket = require("../../Controllers/ProductBasket");
const MenuCategory = require("./MenuCategory");

module.exports = async function (bot, message, user) {
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
