DROP database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
    item_id int not null PRIMARY KEY AUTO_INCREMENT,
    product_name varchar(100),
    department_name varchar(100),
    stock_quantity int,
    price decimal (10,2),
    sales_price decimal (10,2)
);