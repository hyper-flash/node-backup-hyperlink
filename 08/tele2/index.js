const { Telegraf } = require("telegraf"); // importing telegraf.js
require("dotenv").config();
var cryptLib = require("cryptlib");
key = cryptLib.getHashSha256(process.env.IV, 32);
var Workers = require("./functions");

//encryptedText = cryptLib.encrypt('425', key, process.env.IV);
//console.log(encryptedText)

var bot = new Telegraf("5365175921:AAG1MTo7Fi15NGk5Fml2ZAFmA2pwPkFSNr4"); // We saved our bot token to the bot variable

bot.start((ctx) => {
  let doc_id = ctx.message.text.replace("/start ", "");
  if (doc_id != "/start") {
    Workers.doc_id_check(doc_id, (doc_id_check) => {
      if (doc_id_check != false) {
        Workers.sendfile(ctx.chat.id, doc_id_check, (cb) => {
          if (cb == true) {
            ctx.reply("by ...");
          } else {
            ctx.reply("File not found...");
          }
        });
      } else {
        ctx.reply("Token Error...");
      }
    });
  } else {
    ctx.reply(`Hello ${ctx.chat.first_name} ${ctx.chat.last_name} 😄\n\n🤖 Bot Run By...`);
  }
});

bot.launch();
