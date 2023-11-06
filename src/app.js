const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("../config");
const SignUp = require("./Controllers/SignUp");
const MessageController = require("./Controllers/MessageController");
const mongo = require("./Model/mongo");
const users = require("./Model/Users");
const MenuController = require("./Controllers/MenuController");
const LangController = require("./Controllers/LangController");
const LangSave = require("./Controllers/LangSave");
const CityController = require("./Controllers/CityController");
const CityChange = require("./Controllers/CityChange");
const PhoneController = require("./Controllers/PhoneController");
const admin = require("./Admin/admin");
const Menu = require("./Controllers/Menu");
const CallbackController = require("./Admin/Controllers/CallbackController");

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

mongo();

bot.on("message", async (message) => {
  let userId = message.from.id;

  let user = await users.findOne({
    user_id: userId,
  });

  if (message.text == "/id") {
    let admin = await users.findOne({
      user_id: userId,
    });
    if (admin) {
      if (message.reply_to_message) {
        if (message.reply_to_message.photo[0].file_id) {
          await bot.sendMessage(
            userId,
            message.reply_to_message.photo[0].file_id
          );
        }
      }
    }
  }

  if (!user || (Number(user.step) && Number(user.step) < 5)) {
    await SignUp(bot, message, user);
  } else {
    await MenuController(bot, message, user);
    await MessageController(bot, message, user);
  }
});

bot.on("callback_query", async (message) => {
  const userId = message.from.id;
  const data = message.data;

  let user = await users.findOne({
    user_id: userId,
  });

  if (data == "lang") {
    LangController(bot, message, user);
  } else {
    if (user.step == "lang") {
      await LangSave(bot, message, user);
    }
  }

  if (data == "city") {
    await CityController(bot, message, user);
  } else {
    if (user.step == "city") {
      await CityChange(bot, message, user);
    }
  }

  if (data == "phone") {
    await PhoneController(bot, message, user);
  } else if (user.step == "phone_code") {
    if (text == user.code) {
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: 5,
        }
      );
      await MenuController(bot, message, user);
    }
  }

  if (data == "menu") {
    await Menu(bot, message, user);
  }
  await CallbackController(bot, message, user);
});

(async () => {
  admin(bot);
})();
