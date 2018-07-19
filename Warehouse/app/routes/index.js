'use strict';

var express = require('express');
var router = express.Router();
var logger = require('../logger');
var fs = require('fs');
var {List} = require('immutable')
var request = require('request');


router.get('/', function (req, res, next) {
    next();
});


router.get('/kho', function (req, res, next) {
    res.render('./kho', {
        title: 'Consolidate.js'
    });
});


router.get('/sync/warehouse/:id/:size', function (req, res, next) {
    var inventory_quantity = 0;
    var id = req.params.id;
    var size = req.params.size;
    var obj_269 = JSON.parse(fs.readFileSync('./product_269.txt', 'utf8'));
    for (var i = 0; i < obj_269.length; i++) {
        var key = obj_269[i].option2.substring(3, obj_269[i].option2.length);
        if (key === id && size === obj_269[i].option1) {
            inventory_quantity = obj_269[i].inventory_quantity;
            break;
        }
    }
    res.send(inventory_quantity);
});


router.get('/sync/products', function (req, res, next) {
    var product = new List();
    var obj_136 = JSON.parse(fs.readFileSync('./product_136.txt', 'utf8'));
    for (var i = 0; i < obj_136.length; i++) {
        if (obj_136[i].inventory_quantity < 10) {
            var item = {
                "id": obj_136[i].option2,
                "size": obj_136[i].option1,
                "inventory_quantity": obj_136[i].inventory_quantity
            };
            product = product.push(item);
        }
    }
    res.send(product.valueSeq().toArray());
});

router.get('/api/products', function (req, res, next) {
    // If user is already logged in, then redirect to rooms page
    console.log("Sync .... ");
    const idBo1362018 = '1013406668';
    const idBo2692018 = '1016093264';
    var products = req.body;
    var products136, products269;
    var result = Object.keys(products).map(function (key) {
        return [Number(key), products[key]];
    });
    for (var i = 0; i < result.length; i++) {
        if (result[i][1].id === idBo1362018)
            products136 = result[i]
        if (result[i][1].id === idBo2692018)
            products269 = result[i]
    }
    var myJsonString136 = JSON.stringify(products136[1].variants);
    var myJsonString269 = JSON.stringify(products269[1].variants);
    fs.writeFile("./product_136.txt", myJsonString136, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file 136  was saved!");
    });
    fs.writeFile("./product_269.txt", myJsonString269, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file 269 was saved!");
    });


    res.send('1');
});


module.exports = router;