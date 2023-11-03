const admins = require("../../Model/Admins");
const products = require("../../Model/Product");
const HomeController = require("./HomeController");

module.exports = async function (bot, message, admin) {
  try {
    const userId = message.from.id;
    const text = message.text;

    const productId = admin.step.split("#")[1];

    let product = await products.findOne({
      id: productId,
    });

    await admins.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: 0,
      }
    );

    await HomeController(bot, message, admin);
  } catch (err) {
    console.log(err + "");
  }
};
