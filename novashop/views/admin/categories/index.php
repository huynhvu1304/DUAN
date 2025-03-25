<style>
    /* Định dạng toàn trang */
body {
    font-family: Arial, sans-serif;
    background-color: #f8f9fa;
    color: #333;
    margin: 0;
    padding: 0;
}

/* Định dạng tiêu đề và bảng */
h3 {
    color: #007bff;
    margin-top: 20px;
}

.card {
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.card-header {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    background-color: #4CAF50;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 15px;
}

.card-body {
    text-align: center;
    padding: 20px;
    background-color: white;
    color: black;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.card-title {
    text-align: center;
    color: black;
    font-size: 30px;
    font-weight: bold;
}

.table {
    width: 80%;
    margin: 20px auto;
    border-collapse: collapse;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.table th, .table td {
    padding: 12px 15px;
    text-align: left;
}

.table tr th {
    background-color: #212529;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
}

.table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.table img {
    border-radius: 5px;
}

/* Định dạng nút */
/* button, .btn {
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.3s;
} */

button {
    background-color: #007bff;
    color: #fff;
    border: none;
}

.btn-primary {
    background-color: #007bff;
    color: #fff;
    border: none;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-danger {
    background-color: #dc3545;
    color: #fff;
    border: none;
}

.btn-danger:hover {
    background-color: #c82333;
}

input {
    padding: 4px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 30%;
    margin-right: 5px;
}

/* Liên kết 'Thêm danh mục' */
a {
    color: #28a745;
    font-weight: bold;
    text-decoration: none;
}

a:hover {
    color: #dc3545;
}

</style>
<?php include "views/layouts/header-admin.php"?>
    <h3>Danh mục</h3>
    <form action="searchCategory" method="post">
        <input type="text" name="search" placeholder="Tìm kiếm danh mục" value="<?= $_POST['search']??"" ?>"> <button>Search</button>
    </form>
    <a href="<?=$baseurl ?>/addcategory">Thêm danh mục</a> <br>
    <table class="table table-hover">
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>image</th>
            <th>Action</th>
        </tr>
        <?php foreach ($categories as $category) {?>
            <tr>
                <td><?php echo $category['id']?></td>
                <td><?php echo $category['name']?></td>
                <td> <img src="public/images/<?=$category['image'] ?>" alt="" width=150px; height=200px> </td>
                <td><a href="<?=$baseurl?>/editcategory/<?=$category['id']?>" class="btn btn-primary">Edit</a>
                <a href="<?=$baseurl?>/deletecategory/<?=$category['id']?>" onclick="return confirm('Bạn có thực sự muốn xóa?')" class="btn btn-danger">Delete</a></td>
            </tr>
        <?php }?>
    </table>
<?php include "views/layouts/footer-admin.php"?>

