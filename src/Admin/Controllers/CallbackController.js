const MenuProduct = require("../../Controllers/MenuProduct");
const MenuCategory = require("./MenuCategory");

module.exports = async function (bot, message, user) {
  try {
    const data = message.data;

    await MenuCategory(bot, message, user);
    await MenuProduct(bot, message, user);
  } catch (err) {
    console.log(err + "");
  }
};
