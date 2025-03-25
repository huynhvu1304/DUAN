<style>
/* Định dạng toàn trang */
#form {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
    min-height: 350px;
    margin: auto;
}
#form input[type="text"], form input[type="file"] {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
}

/* Định dạng nút */
#form button {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s;
}
#form button:hover {
    background-color: #218838;
}
h3 {
    color: #007bff;
    text-align: center;
    margin-top: 10px;
    font-size: 1.8em;
}
</style>
<?php include "views/layouts/header-admin.php"?>
<!-- edit.php -->
<h3>Sửa sản phẩm</h3>
<form action="<?= $baseurl?>/updateproduct/<?= $product['id'] ?? "" ?>" method="post" enctype="multipart/form-data" id="form">
    <input type="text" name="title" placeholder="title" value="<?= $product['title'] ?? "" ?>"> <br>
    <input type="number" name="price" placeholder="price" value="<?= $product['price'] ?? "" ?>"> <br>
    <input type="number" name="sale" placeholder="sale" value="<?= $product['sale'] ?? "" ?>"> <br>
    <textarea name="description" id="" cols="30" rows=2><?= $product['description'] ?? "" ?>
    </textarea> <br>
    <input type="file" name="image" placeholder="image"> <br>
    <img src="<?= $baseurl?>/public/images/<?= $product['image'] ?? "" ?>" alt="" width=100px> <br>
    <textarea name="detail" id="" cols="30" rows=2><?= $product['detail'] ?? "" ?>
    </textarea> <br>
    <select name="category" id="">
        <?php foreach ($categories as $category) { ?>
            <option value="<?= $category['id'] ?>" <?= $product['category_id'] == $category['id'] ? "selected" : "" ?>>
                <?= $category['name'] ?>
            </option>
        <?php } ?>
    </select> <br>
    <select name="status">
        <option value="1" <?= isset($product['status']) && $product['status'] == 1 ? 'selected' : '' ?>>Hiển thị</option>
        <option value="0" <?= isset($product['status']) && $product['status'] == 0 ? 'selected' : '' ?>>Ẩn</option>
    </select>


    <?php
    if(isset($errors)):
        echo "<ul style='color:red'>";
        foreach ($errors as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
    endif
    ?>
     <input type="hidden" name="oldImage" value="<?= $product['image'] ?>">
    <button>Sửa</button>
</form>
<?php include "views/layouts/footer-admin.php"?>
