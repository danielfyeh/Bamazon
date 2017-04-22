var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Gundam123",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;

});

var order = function() {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "What item would you like to buy? Enter Item ID"
    }, {
        name: "number",
        type: "input",
        message: "How many would you like to buy?"
    }]).then(function(answer) {

        console.log("You are ordering item number #" + answer.item);
        connection.query("SELECT * FROM products WHERE ?", { item_id: answer.item }, function(err, res) {
            console.log(res[0].product_name);
        });
        checkQuantity(answer.item, answer.number);

    });
};


var checkQuantity = function(productID, orderAmount) {
    connection.query("SELECT * FROM products WHERE ?", { item_id: productID }, function(err, res) {
        console.log("there is " + res[0].stock_quantity + " left");
        if (res[0].stock_quantity >= orderAmount) {
            console.log("placing order...");
            console.log("Your total order is " + orderAmount*res[0].price);
            placeOrder(productID, orderAmount, res[0].stock_quantity);
        } else {
            console.log("There is insufficient quantity!");
            order();
        }
    });


};
var placeOrder = function(productID, orderAmount, stock) {
    console.log("placing order...");
    var updateAmount = stock - orderAmount;
    connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [updateAmount, productID], function(err, res) {
    	
    	console.log("New stock quantity " + updateAmount);
    	
    	
    	connection.query("SELECT * FROM products WHERE ?", { item_id: productID }, function(err, res) {
            console.log(res);
            console.log("Update successful!")

        });
       
    });
};

order();
