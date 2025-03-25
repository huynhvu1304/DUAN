<?php 
include_once "models/Category.php";
include_once "models/Product.php";
include_once "models/Order.php";
include_once "models/User.php"; 
switch ($action) {
    case '':
        $categories=getCategories();
        $newProducts=getNewProducts();
        $yonexProducts=getYonex();
        $getMizu=getMizu();
        $liningProducts=getLining();
        $victorProducts=getVictor();
        $getALLOrders=getAllOrders($conn);
        
        include "views/welcome.php"; 
        break;    
}