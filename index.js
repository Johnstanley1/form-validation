const express = require("express");
const path = require("path");
const { check, validationResult } = require("express-validator");
const mongoose = require('mongoose');

const juiceShop = express();

juiceShop.set("views", path.join(__dirname, 'views'));
juiceShop.use(express.static(__dirname +'/public'));
juiceShop.set("view engine", "ejs");
juiceShop.use(express.urlencoded({extended:true}));


mongoose.connect('mongodb://127.0.0.1:27017/juiceshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Order = mongoose.model('Order', {
    name: String,
    phone: String,
    purchasedItems: [mongoose.Schema.Types.Mixed], // Save only the purchased items
    tax: Number,
    totalAfterTax: Number,
});

juiceShop.get('/', function(req, res){
    res.render('forms');
});

juiceShop.post('/', [
    check('name', 'please enter a first and last name').matches(/^[a-zA-Z]+\s[a-zA-Z]+$/),
    check('phone', 'please enter a valid phone number in the format 123-456-7890').matches(/^\d{3}-\d{3}-\d{4}$/)
], function(req, res){

    var errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.render('forms', {errors: errors.array()})
    }
    else{

        const purchasedItemsArray = [];

        var prdct1 = 'Mango Juice';
        var prdct2 = 'Berry Juice';
        var prdct3 = 'Apple Juice';

        var unitPrice1 = "$ 2.99";
        var unitPrice2 = "$ 1.99";
        var unitPrice3 = "$ 2.49";

        var name = req.body.name;
        var phone = req.body.phone;

        var prdQuantity1 = parseFloat(req.body.quantity1);
        var prdQuantity2 = parseFloat(req.body.quantity2);
        var prdQuantity3 = parseFloat(req.body.quantity3);

        if (isNaN(prdQuantity1) && isNaN(total1)) {
            prdQuantity1 = 0;
            total1 = 0
        }
      
        if (isNaN(prdQuantity2) && isNaN(total2)) {
            prdQuantity2 = 0;
            total2 = 0
        }

        if (isNaN(prdQuantity3) && isNaN(total3)) {
            prdQuantity3 = 0;
            total3 = 0
        }

        var total1 = prdQuantity1 * 2.99;
        var total2 = prdQuantity2 * 1.99;
        var total3 = prdQuantity3 * 2.49;

        var total = total1 + total2 + total3

        if (prdQuantity1 > 0) {
            purchasedItemsArray.push({
                prdct1: prdct1,
                prdQuantity1: prdQuantity1,
                unitPrice1: unitPrice1,
                total1: total1,
            });
        }
    
        if (prdQuantity2 > 0) {
            purchasedItemsArray.push({
                prdct2: prdct2,
                prdQuantity2: prdQuantity2,
                unitPrice2: unitPrice2,
                total2: total2,
            });
        }
   
        if (prdQuantity3 > 0) {
            purchasedItemsArray.push({
                prdct3: prdct3,
                prdQuantity3: prdQuantity3,
                unitPrice3: unitPrice3,
                total3: total3,
            });
        }

        tax = total * 0.13
        totalAfterTax = total + tax;
        
        orderData ={
            name: name,
            phone: phone,
            prdQuantity1: prdQuantity1,
            prdQuantity2: prdQuantity2,
            prdQuantity3: prdQuantity3,
            unitPrice1: unitPrice1,
            unitPrice2: unitPrice2,
            unitPrice3: unitPrice3,
            total1: total1.toFixed(2),
            total2: total2.toFixed(2),
            total3: total3.toFixed(2),
            tax: tax.toFixed(2),
            totalAfterTax: totalAfterTax.toFixed(2),
            prdct1: prdct1,
            prdct2: prdct2,
            prdct3: prdct3
        }

        var myOrders = new Order({
            name: name,
            phone: phone,
            purchasedItems: purchasedItemsArray, // Save only the purchased items
            tax: tax.toFixed(2),
            totalAfterTax: totalAfterTax.toFixed(2)
        });
        
        myOrders.save().then(function(){
            
            console.log("New order created")
    
            }).catch(function (err) {
                console.error("Error saving order:", err);
                res.render('form', { errors: "Error saving order" });
            });

        res.render('receipt', orderData);

    }

    
})

juiceShop.get("/allOrders", function(req, res){
    Order.find({}).then((orders) => {
        console.log("Orders :::", orders);
        res.render("allOrders", {orders:orders});
    })
    .catch((err)=>{
        console.log("Errors :::", err);
    })

})

juiceShop.listen(8080, function(){
    console.log("Application started and listening on port 8080");
});