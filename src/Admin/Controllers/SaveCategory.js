const { v4 } = require("uuid");
const admins = require("../../Model/Admins");
const categories = require("../../Model/Categories");
const CategoryController = require("./CategoryController");

module.exports = async function (bot, message, admin, categoryId) {
  try {
    const userId = message.from.id;
    const text = message.text;

    console.log(categoryId, 8888);
    await admins.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `categories#${categoryId ? categoryId : "all"}`,
      }
    );

    await categories.create({
      id: v4(),
      name: text,
      category_id: categoryId ? categoryId : undefined,
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
