const users = require("../Model/Users");
const vacancies = require("../Model/Vacancies");
const MenuController = require("./MenuController");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const vacanciesId = user.step.split("#")[1];

    const vacancy = await vacancies.findOne({
      id: vacanciesId,
    });

    await users.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: 6,
      }
    );

    await bot.sendMessage(
      userId,
      `✅ Ishga murojaat qo'shish muvaffaqiyatli qo'shildi.`
    );

    await MenuController(bot, message, user);
  } catch (err) {
    console.log(err.toString());
  }
};
