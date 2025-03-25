<?php 
include_once "models/Category.php";
include_once "models/User.php";
switch ($action) {
    case "category":
        $categories = getCategories();
        include "views/admin/categories/index.php";
        break;

    case 'get_cate':
        {
            $categoryId = $_GET['id'] ?? 0;
            // Lấy danh sách sản phẩm thuộc danh mục
            $products = getProductsByCategory($categoryId);
            include "views/category/catepro.php";
        }
    break;

    case "addcategory":
        include "views/admin/categories/add.php";
        break;
    case "postcategory":
        $name = $_POST['name'] ?? "";
        $image = $_FILES["image"]["name"];
        $target_file = "public/images/$image";
        $errors = [];
        if ($name == "") {
            array_push($errors, "Không được để trống tên");
        }
        if ($image == "") {
            array_push($errors, "Ảnh không được để trống");
        } else {

            $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
            
            // Danh sách định dạng hỗ trợ
            if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
                && $imageFileType != "gif" && $imageFileType != "webp") {
                array_push($errors, "Ảnh không đúng định dạng. Chỉ hỗ trợ JPG, PNG, JPEG, GIF, WEBP.");
            }
        
            if ($_FILES["image"]["size"] > 500000) { // Giới hạn kích thước file
                array_push($errors, "Kích thước ảnh quá lớn");
            }
        }       
        
        include "views/admin/categories/add.php";
        if (count($errors) == 0) {
            addCategory($name, $image);
            move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);
            header("Location: $baseurl/category");
        }
        break;
    case "editcategory":
        $id = $_GET['id'] ?? "";
        $category = getCategory($id);
        include "views/admin/categories/edit.php";
        break;


    case "updatecategory":
        $errors = [];
        $name = $_POST['name'] ?? "";
        if($name == "") {
            array_push($errors, "Không được để trống tên");
        }
        $image = $_FILES["image"]["name"];
        $target_file = "public/images/$image";
        if ($image != "") {            
            $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
            if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
                && $imageFileType != "gif" && $imageFileType != "webp") {
                array_push($errors, "Ảnh không đúng định dạng");
            }            
            if (file_exists($target_file)) {
                array_push($errors, "Tên ảnh đã tồn tại");                
            }
            if ($_FILES["image"]["size"] > 500000) {
                array_push($errors, "Kích thước ảnh quá lớn");
            }
        }
        $id = $_GET['id'];
        if(count($errors) == 0) {            
            if($image == "") {
                $oldImage=$_POST['oldImage'];
                updateCategory($id, $name, $oldImage);
            } else {
                updateCategory($id, $name, $image);
                move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);
            }           
            header("Location: $baseurl/category");
        }
        $category = getCategory($id);
        include "views/categories/edit.php";        
        break;
    case "deletecategory":
        $id = $_GET['id'];
        deleteCategory($id);
        header("Location: $baseurl/category");
        break;
        
    case "searchCategory":
        $search = $_POST['search'] ?? "";
        $categories = searchCategory($search);       
        include "views/admin/categories/index.php";
        break;
}
