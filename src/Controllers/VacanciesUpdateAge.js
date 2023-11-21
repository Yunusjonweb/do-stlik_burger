const users = require("../Model/Users");
const vacancies = require("../Model/Vacancies");

module.exports = async function (bot, message, user, vacancyId) {
  const userId = message.from.id;

  try {
    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `addVacancy#${vacancyId}#city`,
      }
    );

    await vacancies.findOneAndUpdate(
      {
        id: vacancyId,
      },
      {
        age: message.text,
      }
    );

    await bot.sendMessage(
      userId,
      "🌐 Hudud: \n\nQaysi hududdansiz?\nViloyat nomi, Toshkent shahar yoki Respublikani kiriting.",
      {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: "⬅️ Ortga",
              },
            ],
          ],
        },
        parse_mode: "HTML",
      }
    );
  } catch (err) {
    console.log(err.toString());
  }
};
