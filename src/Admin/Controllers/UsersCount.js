module.exports = async function (bot, message, admin) {
  try {
    const userSet = new Set();
    const userId = message.from.id;
    const text = message.text;
    userSet.add(userId);

    // Get the number of unique users
    function getUniqueUserCount() {
      return userSet.size;
    }

    // Example usage
    await bot.sendMessage(
      userId,
      `Foydaluvchilar sonni: ${getUniqueUserCount()}`
    );
  } catch (error) {
    console.log(err + "");
  }
};
