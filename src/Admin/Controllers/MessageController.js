const admins = require("../../Model/Admins");
const categories = require("../../Model/Categories");
const AddCategory = require("./AddCategory");
const CategoryController = require("./CategoryController");
const HomeController = require("./HomeController");
const SaveCategory = require("./SaveCategory");

module.exports = async function (bot, message, admin) {
  try {
    const userId = message.from.id;
    const text = message.text;

    if (text == "/start" && admin.step == 0) {
      await HomeController(bot, message, admin);
    } else if (text == "➕ Kategoriyalar") {
      await admins.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: `categories#all`,
        }
      );
       await CategoryController(bot, message, admin);
    } else if (admin.step?.split("#")[0] == "categories") {
      if (text == "➕ Qo'shish") {
        let categoryId =
          admin.step?.split("#")[1] == "all"
            ? undefined
            : admin.step?.split("#")[1];

        await AddCategory(bot, message, admin, categoryId);
      } else if (text == "⬅️ Ortga") {
        let stepId = admin.step?.split("#")[1];
        let category = await categories.findOne({
          id: stepId,
        });
        if (stepId == "all") {
          await admins.findOneAndUpdate(
            {
              user_id: userId,
            },
            {
              step: "0",
            }
          );

          await HomeController(bot, message, admin);
          await CategoryController(bot, message, admin, category.category.id);
          return;
        }
        await admins.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: `categories#${category?.category_id || "all"}`,
          }
        );
        await CategoryController(bot, message, admin, category?.category_id);
      } else if (text == "🗑 O'chirish") {
        let stepId = admin.step.split("#")[1];
        let category = await categories.findOne({
          id: stepId,
        });
        await admins.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: `categories#${category?.category_id || "all"}`,
          }
        );
        await categories.deleteOne({
          id: stepId,
        });
        // Sub categorys for delete function
        await categories.deleteMany({
          id: stepId,
        });
        await CategoryController(bot, message, admin, category?.category_id);
      } else {
        let category = await categories.findOne({
          name: text,
        });
        if (category) {
          await admins.findOneAndUpdate(
            {
              user_id: userId,
            },
            {
              step: `categories#${category.id}`,
            }
          );
          await CategoryController(bot, message, admin, category.id);
        }
      }
    } else if (admin.step?.split("#")[0] === "addCategory") {
      let categoryId =
        admin.step?.split("#")[1] === "all"
          ? undefined
          : admin.step?.split("#")[1];
      await SaveCategory(bot, message, admin, categoryId);
    }
  } catch (err) {
    console.log(err + "");
  }
};
