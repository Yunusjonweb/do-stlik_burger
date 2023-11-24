const { v4: uuidv4 } = require("uuid");
const users = require("../../Model/Users");
const vacancies = require("../../Model/Vacancies");
const { vacancyStart } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const vacancyId = uuidv4();

    await vacancies.create({
      id: vacancyId,
    });

    await users.findOneAndUpdate(
      { user_id: userId },
      { step: `addVacancy#${vacancyId}#name` }
    );

    const msg = vacancyStart(user.lang);
    const replyKeyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: "⬅️ Ortga",
          },
        ],
      ],
    };

    await bot.sendMessage(userId, msg.text, {
      parse_mode: "HTML",
    });

    await bot.sendMessage(userId, "👤 Ism, familiyangizni kiriting?", {
      reply_markup: replyKeyboard,
    });
  } catch (err) {
    console.log(err + "");
  }
};
