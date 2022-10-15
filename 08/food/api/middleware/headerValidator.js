require("dotenv").config();
var con = require('../config/database');
var cryptoLib = require('cryptlib');
var shaKey = cryptoLib.getHashSha256(process.env.KEY, 32);
const {default: localizify} = require('localizify');
const en = require('../languages/en.js');
const {
    t
} = require('localizify');

var bypassMethod = new Array("sendnotification", "signup", "login", "forgotpassword", "countrylist","contactus","send_otp", "verify_otp");

var bypassHeaderKey = new Array("sendnotification");

var headerValidator = {
    extractHeaderLanguage: function (req, res, callback) {
        var language = (req.headers['accept-language'] != undefined && req.headers['accept-language'] != '') ? req.headers['accept-language'] : "en";       
        //console.log(language) 
        req.language = en;
        req.lang = language;
        localizify.add(language, en).setLocale('en');
        callback();
    },
    
    validateHeaderApiKey: function (req, res, callback) {
        var api_key = (req.headers['api-key'] != undefined && req.headers['api-key'] != '') ? cryptoLib.decrypt(req.headers['api-key'], shaKey, process.env.IV) : "";
        
        var path_data = req.path.split("/");

        if (bypassHeaderKey.indexOf(path_data[2]) === -1) {
            if (api_key == process.env.API_KEY) {
                callback();
            } else {
                headerValidator.sendresponse(req, res, 401, '-1', {keyword: 'rest_keywords_invalid_api_key',components: {}}, null);
            }
        } else {
            callback();
        }
    },

    validateHeaderToken: function (req, res, callback) {
        //console.log(req.headers['token'])
        var path_data = req.path.split("/");
        if (bypassMethod.indexOf(path_data[2]) === -1) {
            if (req.headers['token'] && req.headers['token'] != '') {
                var headtoken = cryptoLib.decrypt(req.headers['token'], shaKey, process.env.IV).replace(/\s/g, '');
                if (headtoken !== '') {
                    con.query("SELECT * FROM tbl_user_device WHERE token = ? ",[headtoken], function (err, result) {
                        if (!err && result[0] != undefined) {
                            // console.log(result[0])
                            req.user_id = result[0].user_id;
                            req.user_type = result[0].user_type;
                            callback();
                        } else {
                            headerValidator.sendresponse(req, res, 401, '-1', {keyword: 'rest_keywords_tokeninvalid',components: {}}, null);
                        }
                    });
                } else {
                    headerValidator.sendresponse(req, res, 401, '-1', {keyword: 'rest_keywords_tokeninvalid',components: {}}, null);
                }
            } else {
                headerValidator.sendresponse(req, res, 401, '-1', {keyword: 'rest_keywords_tokeninvalid',components: {}}, null);
            }
        } else {
            callback();
        }
    },

    checkValidationRules: function (request, response, rules, messages, keywords) {

        var v = require('Validator').make(request, rules, messages, keywords);
        if (v.fails()) {
            var Validator_errors = v.getErrors();
            for (var key in Validator_errors) {
                error = Validator_errors[key][0];
                break;
            }
            
            response_data = {
                code: '0',
                message: error
            };
            headerValidator.encryption(response_data, function (responseData) {
                response.status(200);
                response.json(responseData);
            });
            return false;
        } else {
            return true;
        }
    },

    sendresponse: function (req, res, statuscode, responsecode, responsemessage, responsedata) {
        headerValidator.getMessage(req.lang, responsemessage.keyword, responsemessage.components, function(formedmsg) {
            if (responsedata != null) {
                response_data = {code: responsecode, message: formedmsg, data: responsedata};
                headerValidator.encryption(response_data, function (response) {
                    res.status(statuscode);
                    res.json(response);
                });
            } else {
                response_data = {code: responsecode, message: formedmsg};
                console.log(response_data)
                headerValidator.encryption(response_data, function (response) {
                    res.status(statuscode);
                    res.json(response);
                });
            }
        });
    },


    emitresponse: function (responsecode, responsemessage, responsedata, callback) {

        headerValidator.getMessage('en', responsemessage.keyword, responsemessage.components, function(formedmsg) {
            if (responsedata != null) {
                response_data = {code: responsecode, message: formedmsg, data: responsedata};
                headerValidator.encryption(response_data, function (response) {
                    callback(response);
                });
            } else {
                response_data = {code: responsecode, message: formedmsg};
                headerValidator.encryption(response_data, function (response) {
                    callback(response);
                });
            }
        });
    },

    decryption: function (req, callback) {
        if (req != undefined && Object.keys(req).length !== 0) {
            //var request = JSON.parse(cryptoLib.decrypt(req, shaKey, process.env.IV)); [with encryption]
            var request = JSON.parse(req); // without enctyption
            //request.lang = req.lang;
            //console.log(request)
            callback(request);
        } else {
            callback({});
        }
    },

    encryption: function (req, callback) {
        var cryptoLib = require('cryptlib');
        var shaKey = cryptoLib.getHashSha256(process.env.KEY, 32);
        //var response = cryptoLib.encrypt(JSON.stringify(response_data), shaKey, process.env.IV);  [with encryption]
        var response = response_data; //  without enctyption
        callback(response);
    },

    getMessage: function(requestLanguage,keywords,components,callback){
        localizify
            .add('en', en)
            .setLocale(requestLanguage);
        var returnmessage = t(keywords,components);
        callback(returnmessage);
    },

    getClientIP: function(req, callback) {
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        callback(ipAddress);
    }
}
module.exports = headerValidator;