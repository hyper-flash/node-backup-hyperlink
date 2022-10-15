const { Telegraf } = require("telegraf"); // importing telegraf.js
require('dotenv').config();

var bot = new Telegraf(process.env.BOT_TOKEN); // We saved our bot token to the bot variable

bot.start((ctx) => {
  ctx.reply(
    `Hello ${ctx.chat.first_name} ${ctx.chat.last_name}\n\nBot Run By...`
  );

  //console.log(ctx.message);

  let doc_id = ctx.message.text.replace("/start ", "");

  if (doc_id != "/start") {
    
    data = {
      protect_content: true,
    };

    bot.telegram.copyMessage(ctx.chat.id, process.env.CH_ID, doc_id, data)
      .then(function () {
        ctx.reply("by ...");
      })
      .catch(() => {
        ctx.reply("file not found...");
      });
  }
});

bot.launch();
