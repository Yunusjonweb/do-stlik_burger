const users = require("../Model/Users");
const vacancies = require("../Model/Vacancies");
const MenuController = require("./MenuController");

module.exports = async function (bot, message, user, vacanciesId) {
  try {
    const userId = message.from.id;
    const messageId = message.message.message_id;

    await vacancies.deleteOne({ id: vacanciesId });

    await users.findOneAndUpdate({ user_id: userId }, { step: 5 });

    await Promise.all([
      bot.deleteMessage(userId, messageId),
      bot.sendMessage(userId, "Ishga murojaat qo'shish bekor qilindi"),
      MenuController(bot, message, user),
    ]);
  } catch (err) {
    console.log(err + "");
  }
};
