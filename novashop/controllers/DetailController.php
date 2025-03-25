<?php
// Bao gồm model chứa hàm getProduct
include_once "models/Product.php";

switch ($action) {
    case 'detail':
        // Lấy ID sản phẩm từ URL
            if(isset($_GET['id'])){
            $id = $_GET['id'];
            // Lấy sản phẩm từ cơ sở dữ liệu
            $product = getProduct($id);
            include "views/detail/detail.php";
            // Kiểm tra nếu sản phẩm tồn tại
            }
        break;
}
