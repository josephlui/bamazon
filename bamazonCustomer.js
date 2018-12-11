

var inquirer = require('inquirer');

var ProductRepo = require ('./database/database.js');
productDB = new ProductRepo();


// validator to ensure the user input is a number and not decimal
function validateNum(value){
    return !isNaN(value) && (value % 1 == 0) && parseInt (value) > 0 
}


var questions = [
    {
        message: "Please provide the item ID of the product that you like to buy",
        type: "input",
        name: "productID",
        validate: validateNum
    },{
        message: "How many units?",
        type: "input",
        name: "unit",
        validate: validateNum
    }
    
];

// disconnect from the database
function exit(){
    productDB.disconnect();
}

// get response from user
function getResponseFromUser(){
    inquirer.prompt(questions).then(result => {
        userPurchase(result.productID, result.unit);
    });
}

// display product
displayProduct().then(()=>{
    getResponseFromUser() ;  
});

// get product data for an item
function fetchProduct (item){
    let searchResult = new ProductRepo();
    return new Promise (resolve => {
        productDB.retrieveByProduct(item).then(result =>{
            return resolve(result);
        });
    });
        
    ;
}

// updates the product table with user purchases
function userPurchase(item, unit){
    fetchProduct(item).then((productResult) => {
        if (productResult != null && productResult.length == 1){
            let product = productResult[0];
           
            if (product.stock_quantity >= unit){
                productDB.update (item,product.stock_quantity - unit );
                console.log ("Total purchase price is = "+ unit * product.price);
            } else {
                console.log ("Insufficient quantity, please try again!");          
            }
        } else {
            console.log ("Product not found, please try again!")
        }
        exit();
    });
}


// display product detail
function displayProduct(item){

    return new Promise (resolve =>{
        fetchProduct(item).then(result => {
            if (result.length == 0) console.log ("Sorry, item not found, please try again!");
            result.forEach (item =>{
              console.log ("Item ID: " + item.item_id);
              console.log ("Product Name: " + item.product_name);
              console.log ("Department Name: " + item.department_name);
              console.log ("Stock Quantity: " + item.stock_quantity);
              console.log ("Product Price: " + item.price);
              console.log ("Sale Price: " + item.sales_price);
              console.log ("");
            });
            resolve();
        });
    
    });
      

}
