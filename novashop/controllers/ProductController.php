<?php 
// ProductController.php
include_once "models/Product.php";
include_once "models/Category.php";
switch($action){
    case "product":
        $products = getAllProducts();
        include "views/admin/products/index.php";
        break;
    case "addproduct":
        $categories = getCategories();
        include "views/admin/products/add.php";
        break;
    case "postproduct":
        $errors = [];
        $title=$_POST['title']??"";
        if($title == "") {
            array_push($errors, "Vui lòng nhập tên sản phẩm");
        }
        $price=$_POST['price']??"";
        if($price == "") {
            array_push($errors, "Vui lòng nhập giá");
        }
        $sale=$_POST['sale']??"";                
        $description=$_POST['description']??"";
        if($description == "") {
            array_push($errors, "Vui lòng nhập mô tả");
        }
        $detail=$_POST['detail']??"";
        if($detail == "") {
            array_push($errors, "Vui lòng nhập chi tiết sản phẩm");
        }
        $category=$_POST['category']??"";
        $image = $_FILES["image"]["name"]??"";
        $target_file = "public/images/$image";
        if ($image == "") {
            array_push($errors, "Ảnh không được để trống");
        } else {
            $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
            
            // Danh sách định dạng hỗ trợ
            if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
                && $imageFileType != "gif" && $imageFileType != "webp") {
                array_push($errors, "Ảnh không đúng định dạng. Chỉ hỗ trợ JPG, PNG, JPEG, GIF, WEBP.");
            }
        
            if (file_exists($target_file)) {
                array_push($errors, "Tên ảnh đã tồn tại");
            }
        
            if ($_FILES["image"]["size"] > 500000) { // Giới hạn kích thước file
                array_push($errors, "Kích thước ảnh quá lớn");
            }
        }
        
        $categories = getCategories();
        include "views/admin/products/add.php";
        if (count($errors) == 0) {      
            addProduct($title, $price, $sale, $image, $description, $detail, $category['id']);
            move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);
            header("Location: $baseurl/product");
        }          
        break;
    case "editproduct":
        $id = $_GET['id'] ?? "";
        $product = getProduct($id);
        $categories = getCategories();
        include "views/admin/products/edit.php";
        break;    


        case "updateproduct":
            $errors = [];
            
            // Lấy và kiểm tra dữ liệu từ form
            $title = $_POST['title'] ?? "";
            if ($title == "") {
                array_push($errors, "Vui lòng nhập tiêu đề");
            }
        
            $price = $_POST['price'] ?? "";
            if ($price == "") {
                array_push($errors, "Vui lòng nhập giá");
            }
        
            $sale = $_POST['sale'] ?? "";
            $description = $_POST['description'] ?? "";
            if ($description == "") {
                array_push($errors, "Vui lòng nhập mô tả");
            }
        
            $detail = $_POST['detail'] ?? "";
            if ($detail == "") {
                array_push($errors, "Vui lòng nhập chi tiết");
            }
        
            $category = $_POST['category'] ?? "";
            $status = $_POST['status'] ?? 1; // Lấy trạng thái từ form hoặc mặc định là 1 (Hiển thị)
        
            $image = $_FILES["image"]["name"] ?? "";
            $target_file = "public/images/$image";
        
            if ($image != "") {
                $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
                
                // Kiểm tra định dạng ảnh
                if (!in_array($imageFileType, ["jpg", "png", "jpeg", "gif"])) {
                    array_push($errors, "Ảnh không hợp lệ");
                }
                
                // Kiểm tra ảnh có tồn tại không
                if (file_exists($target_file)) {
                    array_push($errors, "Ảnh đã tồn tại");
                }
                
                // Kiểm tra kích thước ảnh
                if ($_FILES["image"]["size"] > 500000) {
                    array_push($errors, "Kích thước ảnh quá lớn");
                }
            }
        
            // Lấy ID sản phẩm từ URL
            $id = $_GET['id'];
        
            // Nếu có lỗi, hiển thị trang chỉnh sửa
            if (count($errors) > 0) {
                $products = getAllProducts();
                include "views/admin/products/edit.php";
                break;
            }
        
            // Nếu không có lỗi, tiến hành cập nhật
            if ($image == "") {
                $oldImage = $_POST['oldImage'];
                updateProduct($id, $title, $price, $sale, $oldImage, $description, $detail, $category, $status);
            } else {
                move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);
                updateProduct($id, $title, $price, $sale, $image, $description, $detail, $category, $status);
            }
        
            // Chuyển hướng sau khi cập nhật
            header("Location: $baseurl/product");
            exit;
            break;
        


    case "deleteproduct":
        $id = $_GET['id'] ?? "";
        deleteProduct($id);
        header("Location: $baseurl/product");
        break;
    case "searchProduct":
        $search = $_POST['search'] ?? "";
        $products = searchProduct($search);       
        include "views/admin/products/index.php";
        break;
}
