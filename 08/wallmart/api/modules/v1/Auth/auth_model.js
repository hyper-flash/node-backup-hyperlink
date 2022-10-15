var con = require('../../../config/database');
require("dotenv").config();
var common = require('../../../config/common');
var cryptoLib = require('cryptlib');
var asyncLoop = require('node-async-loop');
var moment = require('moment');
var shaKey = cryptoLib.getHashSha256(process.env.KEY, 32);
var emailTemplate = require('../../../config/template');
const { response, query } = require('express');

var Auth = {

    // get details of any users
    userdetails: function (user_id, callback) {

        con.query("SELECT u.*,concat('" + process.env.S3_BUCKET_ROOT + process.env.USER_IMAGE + "','',u.profile_image) as profile_image,IFNULL(ut.device_token,'') as device_token,IFNULL(ut.device_type,'') as device_type,IFNULL(ut.token,'') as token FROM tbl_user u LEFT JOIN tbl_user_device as ut ON u.id = ut.user_id WHERE u.id = '" + user_id + "' AND u.is_deleted='0' GROUP BY u.id", function (err, result, fields) {
            //console.log("Error of Users", err);
            if (!err && result.length > 0) {
                callback(result[0]);
            } else {
                callback(null);
            }
        });
    },

    // check unique email and phone numbers for users
    checkUniqueFields: function (user_id, request, callback) {

        // Check in database for this email register
        Auth.checkUniqueEmail(user_id, request, function (emailcode, emailmsg, emailUnique) {
            if (emailUnique) {
                Auth.checkUniqueUsername(user_id, request, function (phonecode, phonemsg, phoneUnique) {
                    if (phoneUnique) {
                        callback(phonecode, phonemsg, phoneUnique);
                    } else {
                        callback(phonecode, phonemsg, phoneUnique);
                    }
                });
            } else {
                callback(emailcode, emailmsg, emailUnique);
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

    // check username uniqueness
    checkUniqueUsername: function (user_id, request, callback) {

        if (request.username != undefined && request.username != '') {

            if (user_id != undefined && user_id != '') {
                var uniqueUsername = "SELECT * FROM tbl_user WHERE username = '" + request.username + "' AND is_deleted='0' AND id != '" + user_id + "' ";
            } else {
                var uniqueUsername = "SELECT * FROM tbl_user WHERE username = '" + request.username + "' AND is_deleted='0' ";
            }
            con.query(uniqueUsername, function (error, result, fields) {
                if (!error && result[0] != undefined) {
                    callback('0', {
                        keyword: 'rest_keywords_duplicate_username',
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
        Auth.checkUniqueFields('', request, function (uniquecode, uniquemsg, isUnique) {
            if (isUnique) {

                var customer = {
                    name: request.name,
                    username: request.username,
                    email: (request.email != undefined && request.email != "") ? request.email : '',
                    phone: request.phone,
                    password: cryptoLib.encrypt(request.password, shaKey, process.env.IV),
                    login_type: "S",
                    social_id: request.social_id,
                    profile_image: request.profile_image,
                    role: 'U'
                };

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
                        console.log(err)
                        callback('0', {
                            keyword: 'rest_keywords_user_signup_failed',
                            components: {}
                        }, null);
                    }
                });

            } else {
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

    // forgot password
    forgotPassword: function (request, callback) {

        con.query("SELECT * FROM tbl_user where email='" + request.email + "' AND is_deleted='0' ", function (err, result, fields) {
            if (!err & result[0] != undefined) {

                var updparams = {
                    forgotpassword_token: process.env.APP_NAME + result[0].id,
                    forgotpassword_date: require('node-datetime').create().format('Y-m-d H:M:S')
                }
                Auth.updateCustomer(result[0].id, updparams, function (isupdated) {
                    result[0].encoded_user_id = Buffer.from(result[0].id.toString()).toString('base64');
                    emailTemplate.forgot_password(result[0], function (forgotTemplate) {
                        common.send_email("Forgot Password", request.email, forgotTemplate, function (isSend) {
                            if (isSend) {
                                callback('1', {
                                    keyword: 'rest_keywords_user_forgot_password_success',
                                    components: {}
                                }, result[0]);
                            } else {
                                callback('0', {
                                    keyword: 'rest_keywords_user_forgot_password_failed',
                                    components: {}
                                }, result[0]);
                            }
                        });
                    });
                });
            } else {
                callback('0', {
                    keyword: 'rest_keywords_user_doesnot_exist',
                    components: {}
                }, null);
            }
        });
    },
    // change password
    changePassword: function (user_id, request, callback) {
        Auth.userdetails(user_id, function (userprofile) {
            if (userprofile != null) {
                var currentpassword = cryptoLib.decrypt(userprofile.password, shaKey, process.env.IV);
                if (currentpassword != request.old_password) {
                    callback('0', {
                        keyword: 'rest_keywords_user_old_password_incorrect',
                        components: {}
                    }, null);
                } else if (currentpassword == request.new_password) {
                    callback('0', {
                        keyword: 'rest_keywords_user_newold_password_similar',
                        components: {}
                    }, null);
                } else {
                    var password = cryptoLib.encrypt(request.new_password, shaKey, process.env.IV);
                    var updparams = {
                        password: password
                    };
                    Auth.updateCustomer(user_id, updparams, function (userprofile) {
                        if (userprofile == null) {
                            callback('0', {
                                keyword: 'rest_keywords_something_went_wrong',
                                components: {}
                            }, null);
                        } else {
                            callback('1', {
                                keyword: 'rest_keywords_user_change_password_success',
                                components: {}
                            }, null);
                        }
                    });
                }
            } else {
                callback('0', {
                    keyword: 'rest_keywords_userdetailsnot_found',
                    components: {}
                }, null);
            }
        });
    },

    // save contact us details
    saveContactUs: function (request, callback) {
        var contactparams = {
            user_id: (request.user_id != undefined) ? request.user_id : '',
            full_name: request.full_name,
            subject: request.subject,
            email: request.email,
            description: (request.description != undefined) ? request.description : '',
        }
        con.query('INSERT INTO tbl_contactus SET ?', contactparams, function (err, result, fields) {
            if (!err) {

                request.encoded_user_id = (request.user_id != undefined) ? Buffer.from(request.user_id.toString()).toString('base64') : 0;
                emailTemplate.contactus(request, function (contactTemplate) {
                    common.send_email("Contact Us", request.email, contactTemplate, function (isSend) {
                        callback('1', {
                            keyword: 'rest_keywords_contactus_success',
                            components: {}
                        }, null);
                    });
                });
            } else {
                callback('0', {
                    keyword: 'rest_keywords_something_went_wrong',
                    components: {}
                }, null);
            }
        });
    },

    // edit profile
    editProfile: function (user_id, request, callback) {
        Auth.userdetails(user_id, function (userprofile) {
            if (userprofile != null) {

                var updparams = {
                    full_name: (request.full_name != undefined) ? request.full_name : userprofile.full_name,
                    username: (request.username != undefined) ? request.username : userprofile.username,
                    about: (request.about != undefined) ? request.about : userprofile.about,
                    email: (request.email != undefined) ? request.email : userprofile.email,
                    mobilenumber: (request.mobilenumber != undefined) ? request.mobilenumber : userprofile.mobilenumber,
                    profile_image: (request.profile_image != undefined) ? request.profile_image : userprofile.profile_image,
                };

                Auth.updateCustomer(user_id, updparams, function (userprofile) {
                    if (userprofile == null) {
                        callback('0', {
                            keyword: 'rest_keywords_something_went_wrong',
                            components: {}
                        }, null);


                    } else {
                        callback('1', {
                            keyword: 'rest_keywords_profileupdate_success',
                            components: {}
                        }, userprofile);
                    }
                });

            } else {
                callback('0', {
                    keyword: 'rest_keywords_userdetailsnot_found',
                    components: {}
                }, null);
            }
        });
    },


    get_store_details: function (request, callback) {
        var response = {};
        con.query(`SELECT s.name, s.address, (3959 * 2 * ASIN(SQRT(POWER(SIN(('${request.latitude}' - s.latitude) * pi()/180 / 2), (2))+ COS('${request.latitude}' * pi()/180) * COS(s.latitude * pi()/180) * POWER(SIN(('${request.longitude}' - s.longitude) * pi()/180 / 2), (2))))) as miles_away, s.avg_rating, s.email, s.phone from tbl_store s where s.id= '${request.id}';`, function (err, result) {
            if(!err && result.length > 0){
                response.store_details = result[0];
    
                Auth.product_category_list(request, function (code, message, responsedata) {
                    response.product_details = responsedata;
                    callback('1',{
                        keyword: 'rest_keywords_get_product_success',
                        components: {}
                    }, response)
                });
            } else {
                callback('0',{
                    keyword: 'rest_keywords_get_product_failed',
                    components: {}
                }, null);
            }
        })
    },

    product_category_list: function (request, callback) {
        con.query(`SELECT pc.id, pc.name as name FROM tbl_product p 
        JOIN tbl_product_category pc ON pc.id = p.product_category_id 
        WHERE p.store_id = '${request.id}' GROUP BY name ORDER BY pc.id ASC`, function (err, result) {
            if (!err) {
      
                asyncLoop(result, function (item, next)
                {
                    
                    Auth.get_categoty_product(item.id, function (code, message,data) {
                        item.product = data;
                        next();
                    })
                }, () => {
                    callback('1',{
                        keyword: 'rest_keywords_get_product_success',
                        components: {}
                    }, result);
                });
            } else {
                callback('0',{
                    keyword: 'rest_keywords_get_product_failed',
                    components: {}
                }, null);
            }
        })      
    },

    get_categoty_product: function (id, callback) {
        con.query(`SELECT * FROM tbl_product WHERE id = '${id}'`, function (err, result) {
            if (!err) {
                callback('1',{
                    keyword: 'rest_keywords_get_product_success',
                    components: {}
                }, result);    
            } else {
                callback('0',{
                    keyword: 'rest_keywords_get_product_failed',
                    components: {}
                }, null);
            }
        })      
    },

    get_category_details: function (callback) {
        con.query(`SELECT * FROM tbl_store_category`, function (err, result) {
            if (!err) {
                callback("1", {
                    keyword: "category list Found...",
                    components: {},
                }, result);
            } else {
                callback("0", {
                    keyword: "category list Not Found...",
                    components: {},
                }, null);
            }
        });
    },

    get_by_id_category_details: function (id, callback) {
        con.query(`SELECT * FROM tbl_store_category WHERE id = ?`, [id], function (err, result) {
            if (!err) {
                callback("1", {
                    keyword: "category list Found...",
                    components: {},
                }, result);
            } else {
                callback("0", {
                    keyword: "category list Not Found...",
                    components: {},
                }, null);
            }
        });
    },

    // Category wise Shop list
    shopList: function(request, callback){
        var condition = '';
        if (request.id != undefined && request.id != ''){
            condition = `tc.store_category_id = "`+request.id+`" and`;
        }
        con.query(`Select c.name, tc.name, tc.image, tc.phone, tc.email, tc.address, tc.location, (6371 * 2 * ASIN(SQRT(POWER(SIN(('`+request.latitude+`' - tc.latitude) * pi()/180 /2),(2) ) + COS('`+request.latitude+`' * pi() / 180) * COS(tc.latitude * pi()/180) * POWER(SIN(('`+request.longitude+`' - tc.longitude) * pi()/180 /2), (2))))) as distance from tbl_store as tc LEFT JOIN tbl_store_category as c ON tc.store_category_id = c.id WHERE `+ condition +` tc.is_active = 1;`,  function(err, result){
            if (!err && result != undefined){
                callback('1', {
                    keyword: 'text_user_category_success',
                    components: {}
                }, result);
            }
            else{
                callback('0', {
                    keyword: 'text_user_category_failed',
                    components: {}
                }, null);
            }
        });
    },    

    // add review
    addReview: function (request, callback, err) {
        if (!err) {
            var addReview = {
                user_id: request.user_id,
                place_id: request.place_id,
                review: request.review,
                rating: request.rating
            }

            con.query('INSERT INTO tbl_review SET ?', addReview, function (err, result, fields) {
                if (!err) {
                    callback('1', {
                        keyword: 'Add Review success',
                        components: {}
                    }, addReview);
                } else {
                    console.log(err)
                    callback('0', {
                        keyword: 'add Review failed',
                        components: {}
                    }, addReview);
                }
            });

        }
    },

    getplace_review: function (request, callback) {
        var review = {
            place_id: request.place_id,
        };
        // console.log(review);
        con.query(`SELECT u.id,u.full_name,u.profile_image,r.review,r.rating,r.created_at FROM tbl_user as u LEFT JOIN tbl_review as r ON r.user_id = u.id WHERE r.place_id = ?`, review.place_id, function (err, result) {
            // console.log(err);
            // console.log(result);
            if (!err) {
                callback("1", {
                    keyword: "rest_keywords_review_add_success",
                    components: {},
                }, result);
            } else {
                callback("0", {
                    keyword: "rest_keywords_review_add_failed",
                    components: {},
                }, null);
            }
        });
    },

    // Find Place
    findPlace: function (request, callback) {
        console.log("------------------>>>>", request)
        if (request.search != undefined && request.search != '') {
            var where = `AND (p.name LIKE '%` + request.search + `%')`;
        }
        else {
            var where = '';
        }

        var q = con.query(`SELECT p.*,(3959 * 2 * ASIN(SQRT(POWER(SIN(('` + request.latitude + `' - p.latitude) * pi()/180 /2),(2) ) + COS('` + request.latitude + `' * pi() / 180) * COS(p.latitude * pi()/180) * POWER(SIN(('` + request.longitude + `' - p.longitude) * pi()/180 /2), (2))))) as distance FROM tbl_place as p WHERE p.is_active='1'` + where + ` HAVING distance <= 40`, function (err, result, fields) {
            if (!err) {
                callback('1', {
                    keyword: 'rest_keywords_get_location_success',
                    components: {}
                }, result);
            }
            else {
                callback('0', {
                    keyword: 'rest_keywords_get_location_failed',
                    components: {}
                }, null);
            }
        });
    },
}

module.exports = Auth;