var con = require('../../../config/database');
require("dotenv").config();
var common = require('../../../config/common');
var cryptoLib = require('cryptlib');
var asyncLoop = require('node-async-loop');
var moment = require('moment');
var shaKey = cryptoLib.getHashSha256(process.env.KEY, 32);
const { response, query } = require('express');

var Auth = {

    // get details of any users
    userdetails: function (user_id, callback) {

        con.query("SELECT u.*, IFNULL(ut.device_token,'') as device_token,IFNULL(ut.device_type,'') as device_type,IFNULL(ut.token,'') as token FROM tbl_user u LEFT JOIN tbl_user_device as ut ON u.id = ut.user_id WHERE u.id = '" + user_id + "' AND u.is_deleted='0' GROUP BY u.id", function (err, result, fields) {
            //console.log("Error of Users", err);
            if (!err && result.length > 0) {
                callback(result[0]);
            } else {
                callback(null);
            }
        });
    },

    // check email uniqueness
    checkUniqueEmail: function (user_id, request, callback) {

        if (request.email != undefined && request.email != '') {

            if (user_id != undefined && user_id != '') {
                var uniqueEmail = "SELECT * FROM tbl_user WHERE email = '" + request.email + "' AND is_deleted='0' AND id != '" + user_id + "' ";
            } else {
                var uniqueEmail = "SELECT * FROM tbl_user WHERE email = '" + request.email + "' AND is_deleted='0' ";
            }
            con.query(uniqueEmail, function (error, result, fields) {
                if (!error && result[0] != undefined) {
                    callback('0', {
                        keyword: 'rest_keywords_duplicate_email',
                        components: {}
                    }, false);
                } else {
                    callback('1', "Success", true);
                }
            });

        } else {
            callback('1', "Success", true);
        }
    },

    // update user details
    updateCustomer: function (user_id, upd_params, callback) {
        con.query("UPDATE tbl_user SET ? WHERE id = ? ", [upd_params, user_id], function (err, result, fields) {
            if (!err) {
                Auth.userdetails(user_id, function (response, err) {
                    callback(response);
                });
            } else {
                callback(null, err);
            }
        });
    },

    // sign Up Users
    signUpUsers: function (request, callback) {
        Auth.checkUniqueEmail('', request, function (uniquecode, uniquemsg, isUnique) {
            if (isUnique) {

                var customer = {
                    name: request.name,
                    email: (request.email != undefined && request.email != "") ? request.email : '',
                    phone: request.phone,
                    address: request.address,
                    password: cryptoLib.encrypt(request.password, shaKey, process.env.IV),
                    login_type: request.login_type,
                    social_id: (request.social_id != undefined && request.social_id != "") ? request.social_id : ''
                };

                if(request.password != ''){
                    request.password = cryptoLib.encrypt(request.password, shaKey, process.env.IV)
                }

                con.query('INSERT INTO tbl_user SET ?', customer, function (err, result, fields) {
                    if (!err) {

                        common.checkUpdateDeviceInfo(result.insertId, "Customer", request, function () {

                            Auth.userdetails(result.insertId, function (userprofile, err) {
                                common.generateSessionCode(result.insertId, "Customer", function (Token) {
                                    
                                    userprofile.token = Token;
                                    callback('1', {
                                        keyword: 'rest_keywords_user_signup_success',
                                        components: {}
                                    }, userprofile);
                                });
                            });
                        });
                    } else {
                        callback('0', {
                            keyword: 'rest_keywords_user_signup_failed',
                            components: {}
                        }, null);
                    }
                });

            } else {
                console.log(uniquecode, uniquemsg)
                callback(uniquecode, uniquemsg, null);
            }
        });
    },

    // check login details
    checkLogin: function (request, callback) {
        if (request.social_id != undefined && request.login_type != 'S') {
            var whereCondition = "social_id = '" + request.social_id + "' AND login_type = '" + request.login_type + "'";
        } else {
            var whereCondition = " email='" + request.email + "' ";
        }

        con.query("SELECT * FROM tbl_user where " + whereCondition + " AND is_deleted='0' ", function (err, result, fields) {
            console.log(result)
            if (!err) {

                if (result[0] != undefined) {

                    Auth.userdetails(result[0].id, function (userprofile) {

                        if (request.social_id != undefined && request.login_type != 'S') {
                            var flag = 1;
                        }//end if 
                        else {
                            
                            var password = cryptoLib.decrypt(result[0].password, shaKey, process.env.IV);
                            
                            if (password === request.password) {
                                var flag = 1;
                            } else {
                                var flag = 0;
                            }
                        }

                        if (flag == 1) {
                            var updparams = {
                                is_online: "1",
                                last_login: require('node-datetime').create().format('Y-m-d H:M:S'),

                            }
                            // update device information of user
                            common.checkUpdateDeviceInfo(result[0].id, "userprofile", request, function () {
                                Auth.updateCustomer(result[0].id, updparams, function (userprofile, error) {
                                    common.generateSessionCode(result[0].id, "customer", function (token) {
                                        userprofile.token = token;
                                        callback('1', {
                                            keyword: 'rest_keywords_user_login_success',
                                            components: {}
                                        }, userprofile);
                                    });
                                });
                            });
                        } else {
                            callback('0', {
                                keyword: 'rest_keywords_invalid_password',
                                components: {}
                            }, null);
                        }
                    });
                } else {
                    //social id
                    if (request.social_id != undefined && request.login_type != 'S') {
                        //chek email exitsts or not 
                        callback('11', {
                            keyword: 'text_user_login_new',
                            components: {}
                        }, null);
                    } else {
                        callback('0', {
                            keyword: 'text_user_login_fail',
                            components: {}
                        }, null);
                    }

                }
            } else {
                callback('0', {
                    keyword: 'text_user_login_fail',
                    components: {}
                }, null);
            }
        });
    },


    send_otp: function(request, callback){

        var OTP = Math.floor(1000 + Math.random() * 9000);
        //var OTP = '1234';
        
        con.query(`SELECT * FROM tbl_user_otp_details where mobile = '${request.mobile}'`, function (err, result, fields) {
            
            if(!err && result[0] != undefined){
                con.query(`UPDATE tbl_user_otp_details SET ? WHERE id = '${result[0].id}'`, {otp: OTP}, function (err, result, fields) {

                    request.OTP = OTP;
                    callback('1', {
                        keyword: 'otp re-send success',
                        components: {}
                    }, request);
                })
            }
            else {

                var params  = {
                    code: request.code,
                    mobile: request.mobile,
                    otp: OTP
                }
                con.query(`INSERT tbl_user_otp_details SET ?`, params, function (err, result, fields) {
                    console.log(this.sql)
                    request.OTP = OTP;
                    callback('1', {
                        keyword: 'otp send success',
                        components: {}
                    }, request);
                })
            }
        });

    },

    verify_otp: function(request, callback){

        con.query(`SELECT * FROM tbl_user_otp_details where mobile = '${request.mobile}' AND otp = '${request.otp}'`, function (err, result, fields) {

            if(!err && result[0] != undefined){

                con.query(`update tbl_user_otp_details SET otp='' WHERE id = ${result[0].id}`, function (err, result, fields) {
                    callback('1', {
                        keyword: 'otp verify success',
                        components: {}
                    }, null);
                })
            }
            else {
                callback('0', {
                    keyword: 'otp verify fail.',
                    components: {}
                }, null);
            }
        });

    },

}

module.exports = Auth;