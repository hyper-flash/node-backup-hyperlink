var express = require('express');
var middleware = require('../../../middleware/headerValidator');
var common = require('../../../config/common');
var auth_model = require('./auth_model');
const { request } = require('express');
var router = express.Router();

//Signup
router.post("/signup", function (req, res) {

    // request method d ecryption
    console.log(req.body)
    middleware.decryption(req.body, function (request) {
        var rules = {
            full_name: 'required',
            username: 'required',
            email: 'required',
            mobilenumber: 'required',
            password: 'required',
            device_type: 'required|in:A,I',
            device_token: 'required',
            login_type: 'required'
        }
        
        const messages = {
            'required': req.language.required,
            'in': req.language.in,
        }

        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.signUpUsers(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

// user login
router.post("/login", function (req, res) {

    middleware.decryption(req.body, function (request) {

        var request = request
        var rules = {
            device_token: 'required',
            device_type: 'required|in:A,I',
            email: 'required',
            password: '',
            login_type: 'required|in:S,F,G',
            social_id: ''
        }

        const messages = {
            'required': req.language.required,
            'in': req.language.in,
        }
        request.lang = req.lang
        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.checkLogin(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

// user details get
router.get("/userdetails", function (req, res) {
    // checks all validation rules defined above and if error send back response
    
        auth_model.userdetails(req.user_id, function (userProfile) {
            if (userProfile != null) {    
                        
         auth_model.get_pins(req.user_id, function (pinDetails) {
            userProfile.pin_list=pinDetails;
                   middleware.sendresponse(req, res, 200, '1', {
                        keyword: 'rest_keywords_user_data_successfound',
                        components: {}
                    }, userProfile);
                })                 
            } else {
                middleware.sendresponse(req, res, 200, '0', {
                    keyword: 'rest_keywords_userdetailsnot_found',
                    components: {}
                }, null);
            }
        });
});

// Forgot password
router.post("/forgotpassword", function (req, res) {

    middleware.decryption(req.body, function (request) {

        var request = request
        var rules = {
            email: 'required|email'
        }

        const messages = {
            'required': req.language.required,
            'email': req.language.email,
        }

        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.forgotPassword(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

// change password
router.post("/changepassword", function (req, res) {

    middleware.decryption(req.body, function (request) {

        var request = request
        var rules = {
            old_password: 'required',
            new_password: 'required',
        }

        const messages = {
            'required': req.language.required
        }

        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.changePassword(req.user_id, request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

// add place
router.post("/addplace", function (req, res) {

    // request method decryption
    middleware.decryption(req.body, function (request) {
        var rules = {
            location: 'required',
            latitude: 'required',
            longitude: 'required',
            about: 'required'
        }
        
        const messages = {
            'required': req.language.required,
            'in': req.language.in,
        }
        request.lang = req.lang;
        request.user_id = req.user_id;
        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.addplace(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

// logout
router.post("/logout", function (req, res) {

    var updusers = {
        is_online: "0"
    };
    auth_model.updateCustomer(req.user_id, updusers, function (userprofile, error) {
        if (userprofile != null) {
            var deviceparam = {
                token: "",
                device_token: ""
            };
            common.updateDeviceInfo(req.user_id, 'User', deviceparam, function (respond) {
                middleware.sendresponse(req, res, 200, '1', {
                    keyword: 'rest_keywords_userlogout_success',
                    components: {}
                }, null);
            });
        } else {
            middleware.sendresponse(req, res, 200, '0', {
                keyword: 'rest_keywords_something_went_wrong',
                components: {}
            }, null);
        }
    });
});

// place details
router.post("/placedetails", function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            place_id : 'required'
        }
        
        const messages = {
            'required': req.language.required,
            'in': req.language.in,
        }
        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.placeDetails(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

router.post("/addReview", function(req, res){
    middleware.decryption(req.body, function(request){
        var rules = {
            place_id: 'required',
            review: 'required',
            rating: 'required'
        }

        const messages = {
            'required': req.language.required,
            'in': req.language.in,
        }

        request.lang = req.lang;
        request.user_id = req.user_id;
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.addReview(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    })
});

// Edit Profile
router.post("/editProfile", function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            email: "email"
        }

        const messages = {
            'required': req.language.required
        }
        
        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.editProfile(req.user_id, request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

router.post("/placereview", function(req, res){
    middleware.decryption(req.body, function (request) {
        var rules = {
            place_id: 'required',   
        }

        const messages = {
            'required': req.language.required,
        }

        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.getplace_review(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

router.post("/findplace", function(req, res){
    middleware.decryption(req.body, function (request) {
        var rules = {
            latitude: 'required',   
            longitude: 'required' 
        }

        const messages = {
            'required': req.language.required,
        }

        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.findPlace(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
  
});


module.exports = router;