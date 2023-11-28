const { v4 } = require("uuid");
const admins = require("../../../Model/Admins");
const categories = require("../../../Model/Categories");
const CategoryController = require("./CategoryController");

module.exports = async function (bot, message, admin, categoryId) {
  try {
    const userId = message.from.id;
    const text = message.text;
    await admins.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `categories#${categoryId != "undefined" ? undefined : "all"}`,
      }
    );

    await categories.create({
      id: v4(),
      name: text,
      category_id: categoryId != "undefined" ? categoryId : undefined,
    });

    await CategoryController(
      bot,
      message,
      admin,
      categoryId == "undefined" ? undefined : categoryId
    );
  } catch (err) {
    console.log(err + "");
  }
};
