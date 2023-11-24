const users = require("../../Model/Users");
const vacancies = require("../../Model/Vacancies");

module.exports = async function (bot, message, user, vacancyId) {
  const userId = message.from.id;

  try {
    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `addVacancy#${vacancyId}#phone`,
      }
    );

    await vacancies.findOneAndUpdate(
      {
        id: vacancyId,
      },
      {
        city: message.text,
      }
    );

    await bot.sendMessage(
      userId,
      `📞 Aloqa : \n\nBog'lanish uchun raqamingizni kiriting?\nViloyat nomi, Toshkent shahar yoki Respublikani kiriting.`,
      {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: "Share Contact",
                request_contact: true,
              },
            ],
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
