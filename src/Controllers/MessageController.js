const ad = require("../Admin/ad");
const admins = require("../Model/Admins");
const users = require("../Model/Users");
const vacancies = require("../Model/Vacancies");
const checkController = require("./checkController");
const CommentController = require("./CommentController");
const CommentSave = require("./CommentSave");
const DeleteVacancies = require("./DeleteVacancies");
const Menu = require("./Menu");
const MenuController = require("./MenuController");
const OrdersController = require("./OrdersController");
const reqLocationController = require("./reqLocationController");
const SettingsController = require("./SettingsController");
const { reqPhone, reqCode } = require("./Texts");
const VacanciesController = require("./VacanciesController");
const VacanciesSaveController = require("./VacanciesSaveController");
const VacanciesUpdateAge = require("./VacanciesUpdateAge");
const VacanciesUpdateCity = require("./VacanciesUpdateCity");
const VacanciesUpdateDone = require("./VacanciesUpdateDone");
const VacanciesUpdateGoal = require("./VacanciesUpdateGoal");
const VacanciesUpdateName = require("./VacanciesUpdateName");
const VacanciesUpdatePhone = require("./VacanciesUpdatePhone");
const verAttributionController = require("./verAttributionController");
const verLocationController = require("./verLocationController");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;

    if (text == "/post") {
      if (message.reply_to_message) {
        let admin = await admins.findOne({
          user_id: user.user_id,
        });

        if (admin) {
          await ad(
            bot,
            message.reply_to_message.message_id,
            user.user_id,
            message.reply_to_message.reply_markup
          );
        }
      }
    }

    if (
      (text == "✍️ Fikr bildirish" ||
        text == "✍️ Обратная связь" ||
        text == "✍️ Leave comment") &&
      (user.step == 5 || user.step == 6 || user.step == 7)
    ) {
      await CommentController(bot, message, user);
    } else if (user.step == "comment") {
      if (text == "⬅️ Ortga" || text == "⬅️ Назад" || text == "⬅️ Back") {
        await users.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: 5,
          }
        );
        await MenuController(bot, message, user);
      } else {
        await CommentSave(bot, message, user);
      }
    } else if (
      (user.step == 5 || user.step == 6 || user.step == 7) &&
      (text == "⚙️ Sozlamalar" ||
        text == "⚙️ Настройки" ||
        text == "⚙️ Settings")
    ) {
      await SettingsController(bot, message, user);
    } else if (user.step == "phone") {
      let code = ("" + Math.random()).substring(2, 7);
      if (
        !Number(text) ||
        !(Number(text) <= 998999999999) ||
        !(Number(text) > 998000000000)
      ) {
        let msg = reqPhone(user.lang);
        await bot.sendMessage(userId, msg);
        return;
      }
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: "phone_code",
          phone_number: Number(text),
          code: code,
        }
      );
      let data = reqCode(user.lang);
      await bot.sendMessage(userId, data.text);
    } else if (user.step == "phone_code") {
      if (text == user.code) {
        await users.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: 5,
          }
        );
        await MenuController(bot, message, user);
      }
    } else if (
      (user.step == 5 || user.step == 6 || user.step == 7) &&
      (text == "🛒 Buyurtma qilish" ||
        text == "🛒 Заказать" ||
        text == "🛒 Order")
    ) {
      await reqLocationController(bot, message, user);
    } else if (user.step == "startOrder") {
      await checkController(bot, message, user);
    } else if (user.step == "verLocation") {
      await verLocationController(bot, message, user);
    } else if (user.step == 6 && text == "📍 Manzilni o'zgartirish") {
      await reqLocationController(bot, message, user);
    } else if (
      (user.step == 6 && text == "🍽 Menu") ||
      text == "🍽 Меню" ||
      text == "Menu"
    ) {
      await Menu(bot, message, user);
    } else if (
      (user.step == 5 || user.step == 6 || user.step == 7) &&
      text == "🛍 Buyurtmalarim"
    ) {
      await OrdersController(bot, message, user);
      // bot.onText(/countdown ([0-9]+)/, (msg, match) => {
      //   let count = parseInt(match[1]);
      //   bot
      //     .sendMessage(userId, `⏳ ${count.toString()} minut`)
      //     .then((sentMessage) => {
      //       const messageId = sentMessage.message_id;

      //       const countdownInterval = setInterval(() => {
      //         if (count > 0) {
      //           count--;
      //           bot.editMessageText(`⏳ ${count.toString()} minut qoldi...`, {
      //             chat_id: userId,
      //             message_id: messageId,
      //           });
      //         } else {
      //           clearInterval(countdownInterval);
      //           bot.editMessageText("⌛️ Countdown finished!", {
      //             chat_id: userId,
      //             message_id: messageId,
      //           });
      //         }
      //       }, 60000);
      //     });
      // });
    } else if (user.step === "verAttribution") {
      await verAttributionController(bot, message, user);
    } else if (
      ((user.step == 5 || user.step == 6 || user.step == 7) &&
        text == "👪 Bosh ish o'rni") ||
      text == "👪 Главная работа" ||
      text == "👪 Head job"
    ) {
      await VacanciesController(bot, message, user);
    }
    if (text == "⬅️ Ortga" || text == "⬅️ Назад" || text == "⬅️ Back") {
      let stepId = user.step.split("#")[1];
      await vacancies.deleteOne({
        id: stepId,
      });
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: 5,
        }
      );
      await MenuController(bot, message, user);
    } else if (user?.step?.split("#")[0] == "addVacancy") {
      let vacancyId = user.step.split("#")[1];
      let step = user.step.split("#")[2];
      if (text == "⬅️ Ortga" || text == "⬅️ Назад" || text == "⬅️ Back") {
        let vacanciesId = user.step.split("#")[1];
        await vacancies.deleteOne({
          id: vacanciesId,
        });
        await users.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: 5,
          }
        );
        await DeleteVacancies(bot, message, user, vacanciesId);
      } else if (step == "name") {
        await VacanciesUpdateName(bot, message, user, vacancyId);
      } else if (step == "age") {
        await VacanciesUpdateAge(bot, message, user, vacancyId);
      } else if (step == "city") {
        await VacanciesUpdateCity(bot, message, user, vacancyId);
      } else if (step == "phone") {
        await VacanciesUpdatePhone(bot, message, user, vacancyId);
      } else if (step == "vacany") {
        await VacanciesUpdateGoal(bot, message, user, vacancyId);
      } else if (step == "goal") {
        await VacanciesUpdateDone(bot, message, user, vacancyId);
      } else if (step == "done" && text == "Saqlash") {
        await VacanciesSaveController(bot, message, user);
      }
    }
  } catch (e) {
    console.log(e + "");
  }
};
