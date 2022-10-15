var con = require('../../../config/database');
require("dotenv").config();
var common = require('../../../config/common');
var cryptoLib = require('cryptlib');
var asyncLoop = require('node-async-loop');
var shaKey = cryptoLib.getHashSha256(process.env.KEY, 32);
const { response, query } = require('express');
const { callbackPromise } = require('nodemailer/lib/shared');


glass = {
    get_by_id_category_details: function (request, callback) {
        con.query('SELECT name, image FROM tbl_sub_category WHERE category_id = ?', request.id, (err, result) => {
            if (!err) {
                callback('1', {
                    keyword: 'categoty found...',
                    components: {}
                }, result);
            } else {
                callback('0', {
                    keyword: 'categoty not found...',
                    components: {}
                }, null);
            }
        })
    },

    get_product_details: function (request, callback) {
        con.query('SELECT g.name, i.image, g.avg_rating, g.price FROM tbl_glasses as g join tbl_sub_category as sc ON sc.category_id = g.sub_category_id join tbl_category as c ON c.id = sc.category_id join tbl_img as i ON i.glasses_id = g.id WHERE c.id = ? AND sc.id = ? GROUP BY g.id;', [request.category_id, request.sub_category_id], (err, result) => {
            if (!err) {
                callback('1', {
                    keyword: 'products found...',
                    components: {}
                }, result);
            } else {
                callback('0', {
                    keyword: 'products not found...',
                    components: {}
                }, null);
            }
        })
    },

    get_one_product_detail: function (request, callback) {
        get_product_details(request.id, function (product_details) {
            product_color_list(request.id, function (color_data) {
                product_image_list(request.id, function (image_data) {
                    object = {
                        glass: product_details
                    }
                    product_details.image = image_data;
                    product_details.color = color_data;
                    callback('1', {
                        keyword: 'store details Found...',
                        components: {}
                    }, object);
                });
            });
        });

        function get_product_details(glass_id, callback) {
            con.query('SELECT * FROM tbl_glasses WHERE id = ?', glass_id, (err, result, fields) => {
                product_details = {
                    name: result[0].name,
                    about: result[0].about,
                    avg_rating: result[0].avg_rating,
                    frame_size: result[0].frame_size,
                    frame_width: result[0].frame_width,
                    price: result[0].price,
                    discount_price: result[0].discount_price,
                    discount_type: result[0].discount_type
                }
                callback(product_details)
            });

        }

        function product_color_list(glass_id, callback) {

            con.query(`SELECT * FROM tbl_color WHERE glass_id = ?`, glass_id, (err, result, fields) => {
                var color_data = [];
                for (var i = 0; i < result.length; i++) {
                    var a = {name : result[i].name , code: result[i].color_code};
                    color_data.push(a);
                }
                
                callback(color_data);

            });
        }

        function product_image_list(glass_id, callback) {

            con.query(`SELECT image FROM tbl_img WHERE glasses_id = ?`, glass_id, (err, result, fields) => {
                console.log(result)
                var image_data = [];
                for (var i = 0; i < result.length; i++) {
                    var a = result[i].image;
                    image_data.push(a);
                }

                img_data = Object.assign({}, image_data);
                
                callback(img_data);

            });
        }

    }

}

module.exports = glass;