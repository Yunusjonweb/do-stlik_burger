const users = require("../../Model/Users");
const vacancies = require("../../Model/Vacancies");

module.exports = async function (bot, message, user, vacancyId) {
  const { id: userId } = message.from;
  const { text } = message;

  try {
    const step = `addVacancy#${vacancyId}#city`;

    await users.findOneAndUpdate({ user_id: userId }, { step });

    await vacancies.findOneAndUpdate({ id: vacancyId }, { city: text });

    await bot.sendMessage(
      userId,
      "🌐 Hudud:\n\nQaysi hududdansiz?\nViloyat nomi, Toshkent shahar yoki Respublikani kiriting.",
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
    console.log(err + "");
  }
};
