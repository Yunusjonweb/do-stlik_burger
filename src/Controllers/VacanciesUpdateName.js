const users = require("../Model/Users");
const vacancies = require("../Model/Vacancies");

module.exports = async function (bot, message, user, vacancyId) {
  const userId = message.from.id;
  const text = message.text;

  try {
    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `addVacancy#${vacancyId}#age`,
      }
    );

    await vacancies.findOneAndUpdate(
      {
        id: vacancyId,
      },
      {
        name: text,
      }
    );

    await bot.sendMessage(
      userId,
      `🕑 Yosh: \n\n Yoshingizni kiriting?\n Masalan, 19`,
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
