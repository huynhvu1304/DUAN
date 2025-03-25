<?php 
switch($action){
    case 'admin':
        include "views/admin/Dashboard.php";
        break; 
        case "ordersdetaill":
            include "views/admin/ordersdetaill/index.php"; 
            break;
}

