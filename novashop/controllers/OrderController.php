<?php
include_once "models/Order.php";
include_once 'init/config.php';  

switch ($action) {
    case "order":
        $orders = getAllOrders($conn);
        include "views/admin/orders/index.php"; 
    break;

       case "orderdetail":
        include "views/orderdetail/oderdetails.php"; 
    break;

    case "orderdetailAdmin":
        include "views/admin/orderdetail/index.php"; 
    break;  

    case "orderproces":
        $getProcessingOrders=getProcessingOrders($conn);
        include "views/admin/orders/orderproces.php";
    break;

    case"ordertransit":
        $getOrderTransit = getShippingOrders($conn);
        include "views/admin/orders/ordertransit.php";
    break;

    case "ordercancelled":
        $getOrderCancelled = getCancelledOrders($conn);
        include "views/admin/orders/ordercancelled.php";
    break;

    case "orderpayment":
        $getOrderPayment = getOrderPayment($conn);
        include "views/admin/orders/orderpayment.php";
    break;
    
}

?>