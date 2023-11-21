const users = require("../Model/Users");
const vacancies = require("../Model/Vacancies");

module.exports = async function (bot, message, user, vacancyId) {
  const userId = message.from.id;
  const text = message.contact ? message.contact.phone_number : message.text;
  const phoneNumberRegex = /^998(90|91|93|94|95|97|98|99|71|55|33|88)\d{7}$/;

  try {
    if (!phoneNumberRegex.test(parseInt(text))) {
      await bot.sendMessage(
        userId,
        "Telefon raqam son bo'lishi kerak qayta kiriting"
      );
      return;
    }

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `addVacancy#${vacancyId}#vacany`,
      }
    );

    await vacancies.findOneAndUpdate(
      {
        id: vacancyId,
      },
      {
        phone_number: text,
      }
    );

    await bot.sendMessage(
      userId,
      `🛠 <b>Bo'sh ish o'rini:</b> \n\nQaysi sohaga ishga topshirmoqchisiz nomni kiriting?\nMasalan, <b>Oshpaz</b>`,
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
