const { Telegraf } = require("telegraf"); // importing telegraf.js
require('dotenv').config();
var cryptLib = require('cryptlib');
key = cryptLib.getHashSha256(process.env.IV, 32)
var bot = new Telegraf("5365175921:AAG1MTo7Fi15NGk5Fml2ZAFmA2pwPkFSNr4");

Workers = {
    doc_id_check: function(doc_id, callback){
        try {
            callback(cryptLib.decrypt(doc_id, key, process.env.IV))
          } catch (err) {
            //console.log(err)
            callback(false)
          }
    },

    sendfile: function(chat_id, doc_id, callback){
            config = {
                protect_content: true,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                "text": "\ud83d\udd01 Share URL",
                                "url": "https://telegram.dog/"
                            }
                        ]
                    ]
                }
              };

            bot.telegram.copyMessage(chat_id, -1001541823762, doc_id, config)
              .then(function (){
                callback(true);
              })
              .catch((err) => {
                console.log(err)
                callback(false);
              });
    }
}

module.exports = Workers;