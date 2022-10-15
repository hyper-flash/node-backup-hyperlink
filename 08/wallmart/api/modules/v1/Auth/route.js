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
            username: 'required',
            email: 'required',
            phone: 'required',
            password: 'required',
            device_type: 'required|in:A,I',
            device_token: 'required',
            login_type: 'required|in:S,F,G,A'
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

router.get("/productlist/:id", function (req, res) {
    if(req.params.id != undefined && req.params.id != ''){
        auth_model.get_store_details(req, function (responsecode, responsemsg, responsedata) {
            //res.send(responsedata)
            middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
        });
    }
});

router.post('/productlist', function (req, res) {
    middleware.decryption(req.body, function(request){
        var rules = {
            latitude: 'required',
            longitude: 'required',
            id: 'required',
        }
        const message = {
            'required': req.language.required,
        }

        if(middleware.checkValidationRules(request, res, rules, message, {})){
            auth_model.get_store_details(request, function(responsecode, responsemsg, responsedata){
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            })
        }
    })
});

router.get("/category", function (req, res) {
    middleware.decryption(req.body, function (request) {
        id = request.id;
        if(id != undefined && id != '' && id != 0){
            auth_model.get_by_id_category_details(id, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
        else{
            auth_model.get_category_details((responsecode, responsemsg, responsedata) =>{
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

// Route For Shop List API
router.get("/shopList", function(req, res){
    middleware.decryption(req.body, function (request) {
        var rules = {
            id: '',
            longitude: 'required',
            latitude: 'required'
        }

        const messages = {
            'required': req.language.required,
        }

        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            auth_model.shopList(request, function (responsecode, responsemsg, responsedata) {
                
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});


module.exports = router;