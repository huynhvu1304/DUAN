<style>
/* Định dạng toàn trang */
#form {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
    height: 350px;
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
<h3>Thêm danh mục</h3>
<form action="postcategory" method="post" enctype="multipart/form-data" id="form">
    <input type="text" name="name" placeholder="Tên danh mục" value="<?= $name??"" ?>"> <br>
    <input type="file" name="image" value="<?= $image??"" ?>"> <br>
    <?php 
    if(isset($errors)): 
        echo "<ul style='color:red'>";
        foreach ($errors as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
    endif
    ?> 
    <button>Add</button>
</form>
<?php include "views/layouts/footer-admin.php"?>
