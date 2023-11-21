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
        step: `addVacancy#${vacancyId}#goal`,
      }
    );

    await vacancies.findOneAndUpdate(
      {
        id: vacancyId,
      },
      {
        vacany: message.text,
      }
    );

    await bot.sendMessage(
      userId,
      `🔎 <b>Maqsad</b>: \n\n Maqsadingizni qisqacha yozib bering.`,
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
