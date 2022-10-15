var express = require('express');
var middleware = require('../../../middleware/headerValidator');
var common = require('../../../config/common');
var auth_model = require('./auth_model');
const { request } = require('express');
var router = express.Router();

//Signup
router.post("/signup", function (req, res) {

    // request method decryption
    middleware.decryption(req.body, function (request) {
        var rules = {
            name: 'required',
            email: 'required',
            phone: 'required',
            password: (request.login_type == 'S') ? 'required' : '',
            address: 'required',
            device_type: 'required|in:A,I',
            device_token: 'required',
            login_type: 'required|in:S,F,G,A',
            social_id: (request.login_type != 'S') ? 'required' : ''
        }
        
        const messages = {
            'required': req.language.required,
            'in': req.language.in,
        }

        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.signUpUsers(request, function (responsecode, responsemsg, responsedata) {
                //res.send(responsedata)
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


router.post("/send_otp",function(req,res){
        
    middleware.decryption(req.body,function(request){
        
        var rules = {
            code: 'required',
            mobile: 'required',
        }

        const messages = {
            'required': req.language.required
        }

        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.send_otp(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }

    });//end decryption
});


router.post("/verify_otp",function(req,res){
        
    middleware.decryption(req.body,function(request){
        
        var rules = {
            code: 'required',
            mobile: 'required',
            otp: 'required',
        }

        const messages = {
            'required': req.language.required
        }

        // checks all validation rules defined above and if error send back response
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.verify_otp(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
                
    });//end decryption
});


module.exports = router;