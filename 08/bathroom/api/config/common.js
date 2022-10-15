var con = require('./database');
require("dotenv").config();

var Validate = {

    /**
     * Function to generate the random hash for token
     * 14-06-2021
     * @param {Login User ID} user_id 
     * @param {Function} callback 
     */
    generateSessionCode: function (user_id, user_type, callback) {
        
        var randtoken = require('rand-token').generator();
        var usersession = randtoken.generate(64, "0123456789abcdefghijklnmopqrstuvwxyz");
        
        Validate.checkDeviceInfo(user_id, user_type, function (DeviceInfo, Error) {
            
            if (DeviceInfo != null) {
                var params = {
                    token: usersession
                };
                Validate.updateDeviceInfo(user_id, user_type, params, function () {
                    callback(usersession);
                });
            } else {
                var params = {
                    token: usersession,
                    user_id: user_id,
                };
                Validate.addDeviceInformation(params, function () {
                    callback(usersession);
                });
            }
        });
    },

    /**
     * Function to check device information of any users
     * 24-08-2022
     * @param {Login User ID} user_id 
     * @param {Function} callback 
     */
    checkDeviceInfo: function (user_id, user_type, callback) {

        con.query("SELECT * FROM  tbl_user_device WHERE user_id = '" + user_id + "'  ", function (err, result) {
            if (!err && result[0] != undefined) {
                callback(result[0]);
            } else {
                callback(null, err);
            }
        });
    },

    /**
     * Function to update device information of any users
     * 14-06-2021
     * @param {Login User ID} user_id      
     * @param {Parameters} params 
     * @param {Function} callback 
     */
    updateDeviceInfo: function (user_id, user_type, params, callback) {
        con.query("UPDATE tbl_user_device SET ? WHERE user_id = '" + user_id + "'  ", params, function (err, result, fields) {
            callback(result);
        });
    },

    /**
     * Add Device Information for users
     * 14-06-2021
     * @param {Parameters} params 
     * @param {Function} callback 
     */
    addDeviceInformation: function (params, callback) {
        con.query('INSERT INTO  tbl_user_device SET ?', params, function (err, result, fields) {
            console.log(err)
            callback(result.insertId);
        });
    },

    /**
     * Function to check and update device information
     * 14-06-2021
     * @param {Login User ID} user_id      
     * @param {Parameters} params 
     * @param {Function} callback 
     */
    checkUpdateDeviceInfo: function (user_id, user_type, params, callback) {

        var upd_device = {
            uuid: (params.uuid != undefined) ? params.uuid : "",
            ip: (params.ip != undefined) ? params.ip : "",
            os_version: (params.os_version != undefined) ? params.os_version : "",
            model_name: (params.model_name != undefined) ? params.model_name : "",
            device_type: params.device_type,
            device_token: params.device_token,
        };

        Validate.checkDeviceInfo(user_id, user_type, function (DeviceInfo, error) {
            if (DeviceInfo != null) {
                Validate.updateDeviceInfo(user_id, user_type, upd_device, function (result, error) {
                    callback(result);
                });
            } else {
                upd_device.user_id = user_id;
                Validate.addDeviceInformation(upd_device, function (result, error) {
                    callback(result);
                });
            }
        });
    },

    
    /**
     * Function for common insertion function
     * 14-06-2021
     * @param {Table name} tablename 
     * @param {Parameters} parameters 
     * @param {Function} callback 
     */
    commonSingleInsert: function (tablename, parameters, callback) {

        con.query('INSERT INTO ' + tablename + ' SET ?', parameters, function (err, result, fields) {
            
            if (!err) {
                callback(result.insertId, err);
            } else {
                callback(null, err);
            }
        });
    },

    /*
     ** Common Single update operation
     ** 14-06-2021
     */
    commonSingleUpdate: function (tablename, parameters, condition, callback) {

        con.query("UPDATE " + tablename + " SET ? WHERE " + condition + " ", parameters, function (err, result, fields) {
            if (!err) {
                callback(result, err);
            } else {
                callback(null, err);
            }
        });
    },

    
    /*
     ** Common Delete function
     ** 14-06-2021
     */
    commonRemove: function (tablename, condition, callback) {

        con.query("DELETE FROM " + tablename + " WHERE " + condition + " ", function (error, result, fields) {
            if (!error) {
                callback(result, error);
            } else {
                callback(null, error);
            }
        });
    },

    /*
     ** Common function to send sms
     ** 14-06-2021
     */
    sendSMS: function (phone, message, callback) {
        if (phone != '' && phone != undefined) {
            callback(true);
        } else {
            callback(false);
        }
    },

    /**
     * Function to check if any object is empty or not
     * 14-06-2021
     * @param {Object} obj 
     */
    isEmptyObject: function(obj){
        return !Object.keys(obj).length;
    },

    /**
     * Function to send email to users
     * @param {subject} subject 
     * @param {to email} to_email 
     * @param {message} message 
     * @param {Function} callback 
     */
    send_email: function (subject, to_email, message, callback) {
        
        var transporter = require('nodemailer').createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        var mailOptions = {
            from: process.env.EMAIL_ID,
            to: to_email,
            subject: subject,
            html: message
        };
        transporter.sendMail(mailOptions, (error, info) => {
            
            if (error) {
                callback(false);
            } else {
                callback(true);
            }
        });
    },
}
module.exports = Validate;