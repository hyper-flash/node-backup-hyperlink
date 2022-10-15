var con = require('../../../config/database');
require("dotenv").config();
var common = require('../../../config/common');
var cryptoLib = require('cryptlib');
var asyncLoop = require('node-async-loop');
var shaKey = cryptoLib.getHashSha256(process.env.KEY, 32);
var moment = require('moment');
const { end } = require('../../../config/database');
food = {

    get_food_by_search: function (request, callback) {
        con.query(`SELECT id, name, image, location, avg_rating FROM tbl_restaurant WHERE name LIKE '%${request.search}%' AND is_active = 1`, (err, result) => {
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

    order: function (request, callback) {
        create_a_order(request, function (order_id) {
            if (order_id != null) {
                con.query(`SELECT * FROM tbl_order WHERE id = ${order_id}`, (err, result) => {
                    if (!err) {
                        callback('1', {
                            keyword: 'Order Created...',
                            components: {}
                        }, result);
                    } else {
                        callback('0', {
                            keyword: 'Order not Created...',
                            components: {}
                        }, null);
                    }
                });
            } else {
                callback('0', {
                    keyword: 'Order not Created...',
                    components: {}
                }, null);
            }
        })

        function create_a_order(request, callback) {
            order = {
                "user_id": request.user_id,
                "restaurant_id": request.restaurant_id,
                "address_id": request.address_id,
                "total": request.total,
                "service_charge": request.service_charge,
                "subtotal": request.subtotal,
                "discount_amount": request.discount_amount,
                "grand_total": request.grand_total,
                "promocode": request.promocode,
                "payment_method": request.payment_method,
                "status": request.status
            }
            con.query('INSERT INTO tbl_order SET ?', order, (err, result) => {
                if (!err) {
                    asyncLoop(request.dish, function (item, next) {
                        item.user_id = request.user_id
                        item.order_id = result.insertId

                        item.subtotal = item.qty * item.price


                        food.orderinsert(item, function (response) {
                            if (response != null) {
                                next();
                            } else {
                                callback(null);
                            }
                        })

                    }, function (err) {
                        console.log(err);
                        callback(result.insertId)
                    });
                } else {
                    callback(null)
                }

            });

        }

    },

    orderinsert: function (item, callback) {
        con.query('INSERT INTO tbl_order_details SET ?', item, (err, result) => {
            if (!err) {
                callback(result)
            } else {
                callback(null)
            }

        })
    },

    get_one_restaurant_info: function (request, callback) {

        restaurant_info(request, (restaurant_data) => {
            openclose(request, (openclose_data) => {
                category_data(request, (category_product_data) => {
                    object = {
                        restaurant: restaurant_data
                    }
                    restaurant_data.openclose = openclose_data
                    restaurant_data.category = category_product_data

                    callback('1', {
                        keyword: 'Details Found...',
                        components: {}
                    }, object);
                })
            })
        })

        function restaurant_info(request, callback) {
            con.query(`SELECT name, image, about, location, avg_rating, total_review FROM tbl_restaurant WHERE id = ${request.id} AND is_active = 1`, (err, result) => {
                if (!err) {
                    callback(result[0]);
                } else {
                    callback(err);
                }
            })
        }

        function openclose(request, callback) {
            con.query(`SELECT day, start_time, close_time FROM tbl_restaurant_time WHERE restaurant_id = ${request.id} AND is_active = 1`, (err, result) => {
                if (!err && result != undefined) {
                    var openclose = 'close';
                    asyncLoop(result, function (time, next) {
                        
                        let thisday = moment().format('ddd');

                        if (thisday == time.day) {
                            var current_time = moment();
                            var start_time = time.start_time;
                            var end_time = time.close_time;
                            
                            var format = 'hh:mm:ss';

                            var time = moment(current_time, format),
                                open_time = moment(start_time, format),
                                close_time = moment(end_time, format);

                            if (time.isBetween(open_time, close_time)) {
                                openclose = 'open';
                            } else {
                                openclose = 'close';
                            }
                        }
                        next();
                    }, () => {
                        callback(openclose);
                    });


                } else {
                    callback(err);
                }
            })
        }

        function category_data(request, callback) {
            con.query(`SELECT c.id, c.name FROM tbl_dish d JOIN tbl_category c on c.id = d.category_id WHERE d.restaurant_id = ${request.id} GROUP BY category_id;`, (err, result) => {

                asyncLoop(result, function (category, next) {
                    con.query(`SELECT id, name, image, about, price FROM tbl_dish WHERE category_id = ${category.id} AND is_active = 1`, (err, result) => {
                        if (!err) {
                            category.dish = result;
                        }
                        next();
                    })
                }, function () {
                    callback(result);
                });
            })

        }


    }

}

module.exports = food;