const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("../config");
const users = require("./Model/Users");
const MessageController = require("./Controllers/MessageController");
const mongo = require("./Model/mongo");
const LangController = require("./Controllers/Settings/LangController");
const LangSave = require("./Controllers/Settings/LangSave");
const CityController = require("./Controllers/Settings/CityController");
const CityChange = require("./Controllers/Settings/CityChange");
const PhoneController = require("./Controllers/Settings/PhoneController");
const admin = require("./Admin/admin");
const Menu = require("./Controllers/Product/Menu");
const CallbackController = require("./Admin/Controllers/CallbackController");
const AttributionController = require("./Controllers/Orders/AttributionController");
const SignUp = require("./Controllers/SignUp/SignUp");
const MenuController = require("./Controllers/Order/MenuController");
const products = require("./Model/Product");

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

mongo();

bot.on("message", async (message) => {
  try {
    let userId = message.from.id;

    let user = await users.findOne({
      user_id: userId,
    });

    if (!user || (Number(user.step) && Number(user.step) < 5)) {
      await SignUp(bot, message, user);
    } else {
      await MenuController(bot, message, user);
      await MessageController(bot, message, user);
    }
  } catch (err) {
    console.log(err + "");
  }
});

bot.on("channel_post", async (message) => {
  try {
    const data = message?.data;
    const type = data?.split("#")[0];
    const id = data?.split("#")[1];

    if (type !== "product") {
      return;
    }

    const product = await products.findOne({
      id,
    });

    await products.findOneAndUpdate({
      pic: product.pic,
    });
  } catch (e) {
    console.log(e + "");
  }
});

bot.on("callback_query", async (message) => {
  try {
    const userId = message.from.id;
    const data = message.data;

    let user = await users.findOne({ user_id: userId });

    if (data === "lang") {
      LangController(bot, message, user);
    } else if (user.step === "lang") {
      await LangSave(bot, message, user);
    }

    if (data === "city") {
      await CityController(bot, message, user);
    } else if (user.step === "city") {
      await CityChange(bot, message, user);
    }

    if (data === "phone") {
      await PhoneController(bot, message, user);
    } else if (user.step === "phone_code" && message.text === user.code) {
      await users.findOneAndUpdate({ user_id: userId }, { step: 5 });
      await MenuController(bot, message, user);
    }

    if (data === "menu") {
      await Menu(bot, message, user);
    }

    if (data === "attribution") {
      await AttributionController(bot, message, user);
    }

    await CallbackController(bot, message, user);
  } catch (err) {
    console.log(err + "");
  }
});

(async () => {
  await admin();
})();
