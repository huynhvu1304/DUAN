<?php 
include_once "models/Product.php";
switch ($action) {
    case 'cart':
        include "views/cart/cart.php";
        break;
        case 'addtocart':
            $id = $_GET['id'];  // Lấy ID sản phẩm từ URL
            $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 1;  // Lấy số lượng từ POST
        
            // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
            if (isset($_SESSION['cart'][$id])) {
                // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên
                $_SESSION['cart'][$id]['quantity'] += $quantity;
            } else {
                // Nếu chưa có trong giỏ, lấy thông tin sản phẩm từ cơ sở dữ liệu
                $product = getProduct($id);  // Lấy thông tin sản phẩm từ DB
                $product['quantity'] = $quantity;  // Gán số lượng vào sản phẩm
                $_SESSION['cart'][$id] = $product;  // Thêm sản phẩm vào giỏ
            }
        
            // Điều hướng về trang giỏ hàng
            header("Location: $baseurl/cart");
            break;
           
        header("Location: $baseurl/cart");   
        break;
    case "pluscart":
        $id=$_GET['id'];
        $_SESSION['cart'][$id]['quantity']+=1;
        header("Location: $baseurl/cart");
        break;
    case "minuscart":
        $id=$_GET['id'];
        if($_SESSION['cart'][$id]['quantity']>1){
            $_SESSION['cart'][$id]['quantity']-=1;            
        }else{
            //$_SESSION['cart'][$id]['quantity']=1;
            unset($_SESSION['cart'][$id]);
        }        
        header("Location: $baseurl/cart");
        break;
    case "deletecart":
        $id=$_GET['id'];
        unset($_SESSION['cart'][$id]);
        header("Location: $baseurl/cart");
        break;
    case 'checkout': 
        $_SESSION['redirectto']=$_SERVER['REQUEST_URI'];
        if(!isset($_SESSION['login'])){
            header("Location: $baseurl/login");            
        }
        include "views/cart/checkout.php";
        break;
}