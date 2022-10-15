var express = require('express');
var middleware = require('../../../middleware/headerValidator');
var common = require('../../../config/common');
var food_model = require('./food_model');
var router = express.Router();
var moment = require('moment');

router.get("/search", function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            search: 'required'
        }

        const messages = {
            'required': req.language.required,
        }
        request.user_id = req.user_id;
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            food_model.get_food_by_search(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

// Route For Shop List API
router.get("/order", function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            "restaurant_id": "required",
            "address_id": "required",
            "total": "required",
            "service_charge": "required",
            "subtotal": "required",
            "discount_amount": "required",
            "grand_total": "required",
            "promocode": "required",
            "payment_method": "required",
            "status": "required",
            "dish": "required"
        }
        const messages = {
            'required': req.language.required,
        }
        request.user_id = req.user_id;
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            food_model.order(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});

router.get("/restaurant_info", function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            id: 'required'
        }

        const messages = {
            'required': req.language.required,
        }

        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
            food_model.get_one_restaurant_info(request, function (responsecode, responsemsg, responsedata) {
                middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
            });
        }
    });
});



module.exports = router;