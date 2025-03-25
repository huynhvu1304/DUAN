<?php
require_once 'init/init.php'; 
require_once 'models/product.php'; 

// Kiểm tra quyền admin
if (!isset($_SESSION['login']) || $_SESSION['login']['role_id'] != 1) {
    $_SESSION['redirectto'] = $_SERVER['REQUEST_URI'];
    header("Location: $baseurl/login");
    exit;
}

?>


<!DOCTYPE html>
<html lang="en">
<head>
  <title>Admin Dashboard</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>

<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="<?= $baseurl ?>/admin">Dashboard</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mynavbar">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" href="<?= $baseurl ?>">Trang chủ</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="<?= $baseurl ?>/category">Quản lý Danh Mục</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="<?= $baseurl ?>/product">Quản lý Sản phẩm</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="<?= $baseurl ?>/userAdmin">Quản lý Người dùng</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="<?= $baseurl ?>/order">Quản lý Đơn hàng</a>
        </li>
      </ul>
      <form action="<?= $baseurl ?>/logout" method="POST" class="d-flex" style="color: white">
        <?php if (isset($_SESSION['login'])) { ?>
            Chào <?= $_SESSION['login']['username'] ?> |
           <button type="submit" class="btn btn-danger">Đăng xuất</button>
        <?php } ?>
      </form>
    </div>
  </div>
</nav>

<div class="container-fluid mt-3">

