const vacancies = require("../../Model/Vacancies");
const MenuController = require("../Order/MenuController");

module.exports = async function (bot, message, user, vacanciesId) {
  try {
    const { id: userId } = message.from;
    const { message_id: messageId } = message.message;

    await vacancies.findByIdAndDelete(vacanciesId);

    await Promise.all([
      bot.deleteMessage(userId, messageId),
      bot.sendMessage(userId, "Ishga murojaat qo'shish bekor qilindi"),
      MenuController(bot, message, user),
    ]);
  } catch (err) {
    console.log(err + "");
  }
};
