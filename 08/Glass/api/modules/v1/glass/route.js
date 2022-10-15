var express = require('express');
var middleware = require('../../../middleware/headerValidator');
var common = require('../../../config/common');
var auth_model = require('../Auth/auth_model');
var glass_model = require('./glass');
var router = express.Router();

router.get("/category", function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            id: 'required'
        }

        const messages = {
            'required': req.language.required,
        }
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
                glass_model.get_by_id_category_details(request, function (responsecode, responsemsg, responsedata) {
                    middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
                });
        }
    });
});

// Route For Shop List API
router.get("/product", function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            category_id: 'required',
            sub_category_id: 'required'
        }

        const messages = {
            'required': req.language.required,
        }
        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
                glass_model.get_product_details(request, function (responsecode, responsemsg, responsedata) {
                    middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
                });
        }
    });
});

router.get("/productinfo", function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            id: 'required'
        }

        const messages = {
            'required': req.language.required,
        }

        if (middleware.checkValidationRules(request, res, rules, messages, {})) {
                glass_model.get_one_product_detail(request, function (responsecode, responsemsg, responsedata) {
                    middleware.sendresponse(req, res, 200, responsecode, responsemsg, responsedata);
                });
        }
    });
});



module.exports = router;