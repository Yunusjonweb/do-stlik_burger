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
        step: `addVacancy#${vacancyId}#done`,
      }
    );

    await vacancies.findOneAndUpdate(
      {
        id: vacancyId,
      },
      {
        goal: message.text,
      }
    );

    const vacancy = await vacancies.findOne({
      id: vacancyId,
    });

    await bot.sendMessage(
      userId,
      `<b>Ish izlayotgan xodim:</b>\n\n👨‍💼 Xodim: ${vacancy.name}\n🕑 Yosh: ${
        vacancy.age
      }\n🛠 Ish nomi: ${vacancy.vacany}\n🇺🇿 Telegram: @${
        message.chat.username
      }\n📞 Aloqa: +${vacancy.phone_number}\n🌐 Hudud: ${
        vacancy.city
      }\n🔎 Maqsad: ${vacancy.goal}\n\n#xodim #${
        vacancy.city.split(" ")[0]
      }\n\n👉 @Do'stlikBurger kanaliga ulanish @dustlikburger`,
      {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: "Saqlash",
              },
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
