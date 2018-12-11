let config = require ("../config/config.js");
var mysql = require("mysql");

let connection = mysql.createConnection({
    host: config.dbhost,
  
    // Your port; if not 3306
    port: config.dbport,
  
    // Your username
    user: config.dbusername,
  
    // Your password
    password: config.dbpassword,
    database: "bamazon"
});



let ProductRepo = function (){
   
    this.connect = function (){
        connection.connect(function(err) {
            if (err) reject (new Error(err));
        });
    }

    this.disconnect = function (){
        connection.end();
    }

    // retrieve products low in inventory
    this.retireveProductsLowInventory = function () {
        let sql = "select * from products where stock_quantity < 5";
        return new Promise((resolve) =>{
            connection.query(sql, function(error, result) {
                if (error) throw (new Error(error));
                    return resolve(result);
            });  
        });
    }

    // retrieve on sale items from the product table
    this.retrieveOnSaleItems = function (){
        let sql = "select * from products where price - sales_price > 0";
        return new Promise((resolve) =>{
            connection.query(sql, function(error, result) {
                if (error) throw (new Error(error));
                    return resolve(result);
            });  
        });
    }

    // retrieve product by ID or all products
    this.retrieveByProduct = function (productID){

        let sql = "select * from products";
        if (productID){
            // retrieve all products if product not specified
            sql += " where item_id = '"+ productID +"'";
        } 

        return new Promise((resolve) =>{
            connection.query(sql, function(error, result) {
                if (error) throw (new Error(error));
                    return resolve(result);
            });  
        });
        
    }

    // updates quantity of a product by productID 
    this.updateProductQuantity = function (productID, quantity){

        return this.retrieveByProduct (productID).then(result =>{
            if (result.length == 0 ){
                return Promise.resolve (-1);
            } else {
                
                return this.update (productID, parseInt(quantity) + parseInt(result[0].stock_quantity));
            }
        });
        
    }

    // updates quantity of a product by productID 
    this.update = function (productID, quantity){

        let sql = 'UPDATE products SET stock_quantity = "'+ 
                quantity +'" where item_id = "' +productID +'"';

        return new Promise ((resolve) =>{
            connection.query(sql, function(error, result) {
           
                if (error) throw new Error (error);
    
                return resolve(result);
            });
        });
    }

    // add new product to the products table
    this.addNewProduct = function (product_name, department_name, stock, price, sale){

        let sql = 'INSERT INTO products (product_name, department_name, stock_quantity, price, sales_price)'+
        'VALUES (?,?,?,?,?)';
        var inserts = [product_name, department_name, stock, price, sale];
        sql = mysql.format(sql, inserts);
        return new Promise ((resolve, reject) =>{
            connection.query(sql, function(error, result) {
           
                if (error) reject (new Error (error));
    
                return resolve(result);
            });
        });
    }

}

module.exports = ProductRepo;