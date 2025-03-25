<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>MultiShop - Online Shop Website Template</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="Free HTML Templates" name="keywords">
    <meta content="Free HTML Templates" name="description">

    <!-- Favicon -->
    <link href="img/favicon.ico" rel="icon">

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">  

    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">

    <!-- Libraries Stylesheet -->
    <link href="public/lib/animate/animate.min.css" rel="stylesheet">
    <link href="public/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

    <!-- Customized Bootstrap Stylesheet -->
    <link href="../public/css/style.min.css" rel="stylesheet">
    <link href="public/css/stylee1.css" rel="stylesheet">
</head>

<body>
    <!-- Topbar Start -->
    <div class="container-fluid">
        <div class="row bg-secondary py-1 px-xl-5">
            <div class="col-lg-6 d-none d-lg-block">
                <div class="d-inline-flex align-items-center h-100">
                    <a class="text-body mr-3" href="<?=$baseurl?>/about">Giới thiệu</a>
                    <a class="text-body mr-3" href="">Trợ giúp</a>
                    <a class="text-body mr-3" href="">Đặt câu hỏi</a>
                </div>
            </div>
            <div class="col-lg-6 text-center text-lg-right">
                <div class="d-inline-flex align-items-center">
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">
                            <?php if(isset($_SESSION['login'])){?>
                                Chào <?php echo $get_users['username'] ?>
                            <?php }else{?>
                                Tài khoản
                            <?php }?>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <?php if(isset($_SESSION['login'])){ ?>
                            <?php if($get_users['role_id'] == 1) { ?>
                                <a href="<?=$baseurl?>/admin"><button class="dropdown-item" type="button">Quản lý</button></a>
                            <?php } ?>
                            
                            <?php if($get_users['role_id'] == 0) { ?>
                                <a href="<?=$baseurl?>/user"><button class="dropdown-item" type="button">Thông tin cá nhân</button></a>
                            <?php } ?>       
                            <form action="<?=$baseurl?>/logout" method="POST">
                                <button class="dropdown-item" type="submit">Đăng xuất</button>
                            </form>
                        <?php } else { ?>
                            <a class="dropdown-item" type="button" href="<?php echo $baseurl?>/register">Đăng kí</a>
                            <a class="dropdown-item" type="button" href="<?php echo $baseurl?>/login">Đăng nhập</a>
                        <?php } ?>

                           
                        </div>
                    </div>
                </div>
                <div class="d-inline-flex align-items-center d-block d-lg-none">
                    <a href="" class="btn px-0 ml-2">
                        <i class="fas fa-heart text-dark"></i>
                        <span class="badge text-dark border border-dark rounded-circle" style="padding-bottom: 2px;">0</span>
                    </a>
                    <a href="cart" class="btn px-0 ml-2">
                        <i class="fas fa-shopping-cart text-dark"></i>
                        <span class="badge text-dark border border-dark rounded-circle" style="padding-bottom: 2px;">
                          0
                        </span>
                    </a>
                </div>
            </div>
        </div>
        <div class="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
            <div class="col-lg-4">
                <a href="<?=$baseurl?>" class="text-decoration-none">
                    <span class="h1 text-uppercase text-primary bg-dark px-2">NOVA</span>
                    <span class="h1 text-uppercase text-dark bg-primary px-2 ml-n1">Shop</span>
                </a>
            </div>
            <div class="col-lg-4 col-6 text-left">
            
            </div>
            <div class="col-lg-4 col-6 text-right">
                <p class="m-0">Liên hệ với chúng tôi</p>
                <h5 class="m-0">+0794346995</h5>
            </div>
        </div>
    </div>
    <!-- Topbar End -->


    <!-- Navbar Start -->
    <div class="container-fluid bg-dark mb-30">
        <div class="row px-xl-5">
            <div class="col-lg-3 d-none d-lg-block">
                <a class="btn d-flex align-items-center justify-content-between bg-primary w-100" data-toggle="collapse" href="#navbar-vertical" style="height: 65px; padding: 0 30px;">
                    <h6 class="text-dark m-0"><i class="fa fa-bars mr-2"></i>Danh mục</h6>
                    <i class="fa fa-angle-down text-dark"></i>
                </a>
                <nav class="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light" id="navbar-vertical" style="width: calc(100% - 30px); z-index: 999;">
                    <div class="navbar-nav w-100"> 
                    <?php 
                        include_once "models/category.php"; 
                        $categories = getCategories(); 
                        ?>   
                        <?php foreach ($categories as $category) { ?>       
                            <a href="<?= $baseurl ?>/get_cate/<?= $category['id'] ?>" class="nav-item nav-link"><?= htmlspecialchars($category['name']) ?></a>
                        <?php } ?>
                    </div>
                </nav>
            </div>
            <div class="col-lg-9">
                <nav class="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
                    <a href="" class="text-decoration-none d-block d-lg-none">
                        <span class="h1 text-uppercase text-dark bg-light px-2">NOVA</span>
                        <span class="h1 text-uppercase text-light bg-primary px-2 ml-n1">Shop</span>
                    </a>
                    <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                        <div class="navbar-nav mr-auto py-0">
                            <a href="<?=$baseurl?>" class="nav-item nav-link active">Trang chủ</a>
                            <a href="<?=$baseurl?>/shop" class="nav-item nav-link">Sản phẩm</a>
                            <a href="<?=$baseurl?>/contact" class="nav-item nav-link">Liên hệ</a>
                        </div>
                            <a href="<?=$baseurl?>/cart" class="btn px-0 ml-3">
                                <i class="fas fa-shopping-cart text-primary"></i>
                                <span class="badge text-secondary border border-secondary rounded-circle" style="padding-bottom: 2px;">
                                    <?php if(isset($_SESSION['cart'])){echo count($_SESSION['cart']);} else{echo 0;} ?>
                                </span>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </div>
    <!-- Navbar End -->