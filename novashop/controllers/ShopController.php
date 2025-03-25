<?php
include_once "models/Product.php";
switch ($action) {
    case 'shop':
        {
            $getallproducts = getAllProducts();
            include "views/shop/shop.php";            
        }
        break;
}
