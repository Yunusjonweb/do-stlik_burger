const users = require("../../Model/Users");
const {
  reqCity,
  reqPhone,
  reqCode,
  incorrectCode,
  finishReg,
} = require("../Texts");

module.exports = async function (bot, message, user) {
  const userId = message.from.id;
  const text = message.text;
  const phoneText = message.contact
    ? message.contact.phone_number
    : message.text;
  const phoneNumberRegex = /^998(90|91|93|94|95|97|98|99|71|55|33|88)\d{7}$/;
  try {
    if (!user) {
      user = await users.create({
        user_id: userId,
        step: "1",
      });

      await bot.sendMessage(
        userId,
        `🇺🇿 Assalomu alaykum, Men <b>Do'stlik Burger</b> yetkazib berish bot'iman!\n\n🇷🇺 Привет, я бот по доставке <b>Бургеров Дустлик</b>!\n\n🇬🇧 Hello, I am a <b>Do'stlik Burger</b> delivery bot!`,
        { parse_mode: "HTML" }
      );

      let langs = {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: "🇺🇿 O'zbekcha",
            },
          ],
          [
            {
              text: "🇷🇺 Русский",
            },
          ],
          [
            {
              text: "🇬🇧 English",
            },
          ],
        ],
      };

      await bot.sendMessage(
        userId,
        `🇺🇿 Muloqot tilini tanlang\n\n🇷🇺 Выберите язык общения\n\n🇬🇧 Choose a communication language`,
        {
          reply_markup: langs,
        }
      );
    } else if (user.step == "1") {
      if (text == `🇺🇿 O'zbekcha`) {
        user = await users.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            lang: "uz",
            step: "2",
          }
        );
        let data = reqCity("uz");
        let keyboard = [];
        for (let i = 0; i < data.cities.length; i += 2) {
          let newRow = [
            {
              text: data.cities[i],
            },
          ];
          if (data.cities[i + 1]) {
            newRow.push({
              text: data.cities[i + 1],
            });
          }
          keyboard.push(newRow);
        }
        await bot.sendMessage(userId, data.text, {
          reply_markup: {
            resize_keyboard: true,
            keyboard,
          },
        });
      } else if (text == `🇷🇺 Русский`) {
        user = await users.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            lang: "ru",
            step: "2",
          }
        );
        let data = reqCity("ru");
        let keyboard = [];
        for (let i = 0; i < data.cities.length; i += 2) {
          let newRow = [
            {
              text: data.cities[i],
            },
          ];
          if (data.cities[i + 1]) {
            newRow.push({
              text: data.cities[i + 1],
            });
          }
          keyboard.push(newRow);
        }
        await bot.sendMessage(userId, data.text, {
          reply_markup: {
            resize_keyboard: true,
            keyboard,
          },
        });
      } else if (text == `🇬🇧 English`) {
        user = await users.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            lang: "eng",
            step: "2",
          }
        );
        let data = reqCity("eng");
        let keyboard = [];
        for (let i = 0; i < data.cities.length; i += 2) {
          let newRow = [
            {
              text: data.cities[i],
            },
          ];
          if (data.cities[i + 1]) {
            newRow.push({
              text: data.cities[i + 1],
            });
          }
          keyboard.push(newRow);
        }
        await bot.sendMessage(userId, data.text, {
          reply_markup: {
            resize_keyboard: true,
            keyboard,
          },
        });
      }
    } else if (user.step == "2") {
      await users.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: "3",
          city: text,
        }
      );
      let msg = reqPhone(user.lang);

      await bot.sendMessage(userId, msg, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: "Share Contact",
                request_contact: true,
              },
            ],
          ],
        },
        parse_mode: "HTML",
      });
    } else if (user.step == "3") {
      let code = ("" + Math.random()).substring(2, 7);

      if (!phoneNumberRegex.test(parseInt(phoneText))) {
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
          step: "4",
          phone_number: phoneText,
          code: code,
        }
      );

      let data = reqCode(user.lang);
      let keyboard = {
        inline_keyboard: [
          [
            {
              text: data.btn,
              callback_data: `code-again`,
            },
          ],
        ],
      };
      await bot.sendMessage(userId, data.text, {
        reply_markup: keyboard,
      });
    } else if (user.step == "4") {
      if (text == user.code) {
        await users.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: "5",
          }
        );
        await bot.sendMessage(
          userId,
          finishReg(user.lang, message.from.first_name)
        );
      } else {
        await bot.sendMessage(userId, incorrectCode(user.lang));
      }
    }
  } catch (err) {
    console.log(err + "");
  }
};
