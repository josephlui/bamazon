var inquirer = require('inquirer');
var ProductRepo = require ('./database/database.js');


let productDB = new ProductRepo();

// print user menu
function printMenu(){

    console.log ("Select 'view' to View Products for Sale");
    console.log ("Select 'low' to View Low Inventory");
    console.log ("Select 'inv' to Add to Inventory");
    console.log ("Select 'prod' to Add New Product");
    console.log ("select 'quit' to exit");

    var question = [
        {
            message: "Please select an option",
            type: "input",
            name: "selection",
            validate: function (input) {
                return input === "quit" || input === "view"  || input === "low" || input === "inv" || input === "prod";
            }
        }
    ]
    inquirer.prompt(question).then(result => {

        switch (result.selection) {
            case 'view':
            getProductsOnSale();
            break;

            case "low":
            getProductsLowInventory();
            break;

            case "inv":
            addToInventory();
            break;

            case "quit":
            exit();
            break;

            default:
            addNewProduct();

        }
    });

}

// disconnect the db connection
function exit(){
    productDB.disconnect();
}

// get products on sale
function getProductsOnSale(){

    productDB.retrieveOnSaleItems().then(result =>{

        if (result.length == 0) {
            console.log ("We do not have an items on sale!");
        } else {
            result.forEach (item =>{
                  console.log ("Item ID: " + item.item_id);
                  console.log ("Product Name: " + item.product_name);
                  console.log ("Department Name: " + item.department_name);
                  console.log ("Stock Quantity: " + item.stock_quantity);
                  console.log ("Product Price: " + item.price);
                  console.log ("Sale Price: " + item.sales_price);
                  console.log ("");
            });
        }
        printMenu();
    });


}

// get products low in inventory
function  getProductsLowInventory(){

    productDB.retireveProductsLowInventory().then(result =>{

        if (result.length == 0) {
            console.log ("We do not have an items low in inventory!");
        } else {
            result.forEach (item =>{
                  console.log ("Item ID: " + item.item_id);
                  console.log ("Product Name: " + item.product_name);
                  console.log ("Stock Quantity: " + item.stock_quantity);
                  console.log ("");
            });
        }
        printMenu();
    });
    
}

// add products to inventory
function addToInventory(){
    var addProductQuestions = [
        {
            message: "Please specify the product to add to inventory",
            type: "input",
            name: "productID"
        },
        {
            message: "Please specify unit",
            type: "input",
            name: "unit",
            validate: function (value) {
                return !isNaN(value) && parseInt (value) > 0 
            }
        }
    ];
    inquirer.prompt(addProductQuestions).then(response => {
        productDB.updateProductQuantity (response.productID, response.unit ).then(result => {
            if (result.affectedRows && result.affectedRows != 0){
                console.log ("Product inventory has been updated");
            } else {
                console.log ("Product inventory has not been updated");
            }
            printMenu();
        });

    });  
}

// add new product to inventory
function addNewProduct(){
    var questions = [
        {
            message: "Please specify product name",
            type: "input",
            name: "product_name",
            validate: function (input) {
                return input && input.length > 0;
            }
        },
        {
            message: "Please specify department name",
            type: "input",
            name: "department_name",
            validate: function (input) {
                return input && input.length > 0;
            }
        },
        {
            message: "Please specify initial stock quantity",
            type: "input",
            name: "quantity",
            validate: function (value) {
                return !isNaN(value) && (value % 1 == 0) && parseInt (value) > 0 
            }
        },
        {
            message: "Please specify product price",
            type: "input",
            name: "price",
            validate: function (value) {
                return !isNaN(value) && parseFloat (value) > 0 ;
            }
        },
        {
            message: "Please specify sale price",
            type: "input",
            name: "sale",
            validate: function (value) {
                return !isNaN(value) && parseFloat (value) > 0 ;
            }
        },
    ]
    inquirer.prompt(questions).then(result => {
        productDB.addNewProduct(result.product_name, 
            result.department_name, 
            result.quantity, 
            result.price,
            result.sale).then (result => {
                if (result && result.insertId){
                    console.log ("Product has been added");
                } else {
                    console.log ("Product has not been added");
                }
                printMenu();
            })
            
    });
    
}

printMenu();





