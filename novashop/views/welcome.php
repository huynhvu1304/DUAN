<?php include "layouts/header.php"?>
  <!-- Carousel Start -->
  <div class="container-fluid mb-3">
        <div class="row px-xl-5">
            <div class="col-lg-8">
                <div id="header-carousel" class="carousel slide carousel-fade mb-30 mb-lg-0" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li data-target="#header-carousel" data-slide-to="0" class="active"></li>
                        <li data-target="#header-carousel" data-slide-to="1"></li>
                        <li data-target="#header-carousel" data-slide-to="2"></li>
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item position-relative active" style="height: 430px;">
                            <img class="position-absolute w-100 h-100" src="public/images/bannergiay1.jpg" style="object-fit: cover;">
                            <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                <div class="p-3" style="max-width: 700px;">
                                    <h1 class="display-4 text-white mb-3 animate__animated animate__fadeInDown">Giày Yonex</h1>
                                    <p class="mx-md-5 px-5 animate__animated animate__bounceIn">Giày Yonex được thiết kế chuyên biệt với công nghệ tiên tiến, mang đến sự ổn định, thoải mái và hiệu suất tối ưu cho các môn thể thao như cầu lông và tennis.</p>
                                    <a class="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="<?=$baseurl?>/get_cate/2">Mua ngay</a>
                                </div>
                            </div>
                        </div>
                        <div class="carousel-item position-relative" style="height: 430px;">
                            <img class="position-absolute w-100 h-100" src="public/images/bannergiay2.jpg" style="object-fit: cover;">
                            <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                <div class="p-3" style="max-width: 700px;">
                                    <h1 class="display-4 text-white mb-3 animate__animated animate__fadeInDown">Giày Mizuno</h1>
                                    <p class="mx-md-5 px-5 animate__animated animate__bounceIn">Giày Mizuno nổi bật với công nghệ tiên tiến, mang lại sự thoải mái tối đa và hiệu suất vượt trội, là lựa chọn lý tưởng cho các vận động viên và người yêu thích thể thao.</p>
                                    <a class="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="<?=$baseurl?>/get_cate/3">Mua ngay</a>
                                </div>
                            </div>
                        </div>
                        <div class="carousel-item position-relative" style="height: 430px;">
                            <img class="position-absolute w-100 h-100" src="public/images/bannergiay3.webp" style="object-fit: cover;">
                            <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                <div class="p-3" style="max-width: 700px;">
                                    <h1 class="display-4 text-white mb-3 animate__animated animate__fadeInDown">Giày Lining</h1>
                                    <p class="mx-md-5 px-5 animate__animated animate__bounceIn">Giày Li-Ning mang đến sự kết hợp hoàn hảo giữa thiết kế hiện đại và hiệu suất vượt trội, phù hợp cho mọi hoạt động thể thao và thời trang hàng ngày</p>
                                    <a class="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="<?=$baseurl?>/get_cate/1">Mua ngay</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="product-offer mb-30" style="height: 200px;">
                    <img class="img-fluid" src="public/images/bannergiay4.jpg" alt="">
                    <div class="offer-text">
                        <h6 class="text-white text-uppercase">Giảm giá 20%</h6>
                        <h3 class="text-white mb-3" >Sản phẩm Yonex</h3>
                        <a class="btn btn-primary"  href="<?=$baseurl?>/get_cate/2">Mua ngay</a>
                    </div>
                </div>
                <div class="product-offer mb-30" style="height: 200px;">
                    <img class="img-fluid" src="public/images/bannergiay5.webp" alt="">
                    <div class="offer-text">
                        <h6 class="text-white text-uppercase">Giảm giá 10%</h6>
                        <h3 class="text-white mb-3">Sản phẩm Lining</h3>
                        <a href="<?=$baseurl?>/get_cate/1" class="btn btn-primary"  >Mua ngay</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Carousel End -->


    <!-- Featured Start -->
    <div class="container-fluid pt-5">
        <div class="row px-xl-5 pb-3">
            <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div class="d-flex align-items-center bg-light mb-4" style="padding: 30px;">
                    <h1 class="fa fa-check text-primary m-0 mr-3"></h1>
                    <h5 class="font-weight-semi-bold m-0">Số lượng sản phẩm</h5>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div class="d-flex align-items-center bg-light mb-4" style="padding: 30px;">
                    <h1 class="fa fa-shipping-fast text-primary m-0 mr-2"></h1>
                    <h5 class="font-weight-semi-bold m-0">Miễn phí vận chuyển</h5>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div class="d-flex align-items-center bg-light mb-4" style="padding: 30px;">
                    <h1 class="fas fa-exchange-alt text-primary m-0 mr-3"></h1>
                    <h5 class="font-weight-semi-bold m-0">Hoàn trả trong vòng 14 ngày</h5>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div class="d-flex align-items-center bg-light mb-4" style="padding: 30px;">
                    <h1 class="fa fa-phone-volume text-primary m-0 mr-3"></h1>
                    <h5 class="font-weight-semi-bold m-0">Hỗ trợ 24/7</h5>
                </div>
            </div>
        </div>
    </div>
    <!-- Featured End -->


    <!-- Categories Start -->
    <div class="container-fluid pt-5">
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Danh Mục</span></h2>
        <div class="row px-xl-5 pb-3">
            
        <?php foreach ($categories as $category) { ?>
    <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
        <!-- Đường dẫn chuyển đến trang danh mục dựa vào id -->
        <a class="text-decoration-none" href="<?= $baseurl ?>/get_cate/<?= $category['id'] ?>">
            <div class="cat-item d-flex align-items-center mb-4">
                <div class="overflow-hidden" style="width: 100px; height: 100px;">
                    <img class="img-fluid" src="public/images/<?= htmlspecialchars($category['image']) ?>" alt="">
                </div>
                <div class="flex-fill pl-3">
                    <h6><?= htmlspecialchars($category['name']) ?></h6>
                </div>
            </div>
        </a>
    </div>
<?php } ?>
        
        </div>
    </div>
    <!-- Categories End -->


    <!-- Products Start -->
    <div class="container-fluid pt-5 pb-3">
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Sản phẩm mới</span></h2>
        <div class="row px-xl-5">
            <?php foreach ($newProducts as $newProduct) {?>
                <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
                    <div class="product-item bg-light mb-4">
                        <div class="product-img position-relative overflow-hidden">
                            <img class="img-fluid w-100" style="height: 300px;" src="public/images/<?= $newProduct['image']?>" alt="">
                            <div class="product-action">
                                <a class="btn btn-outline-dark btn-square" href="addtocart/<?= $newProduct['id'] ?>"><i class="fa fa-shopping-cart"></i></a>
                            </div>
                        </div>
                        <div class="text-center py-4">
                            <a class="h6 text-decoration-none text-truncate" href="detail/<?= $newProduct['id']?>"><?= $newProduct['title'] ?></a>
                            <div class="d-flex align-items-center justify-content-center mt-2">
                            <?php
                             if (isset($newProduct['sale'])) {
                                // Nếu có giảm giá, hiển thị giá giảm và giá gốc
                                echo '<h5 style="color: red;">' . number_format((float)$newProduct['sale'], 0, ',', '.') . 'đ</h5>';
                                echo '<h6 class="text-muted ml-2"><del>' . number_format((float)$newProduct['price'], 0, ',', '.') . 'đ</del></h6>';
                                } else {
                                // Nếu không có giảm giá, hiển thị giá gốc
                                echo '<h5 style="color: red;">' . number_format((float)$newProduct['price'], 0, ',', '.') . 'đ</h5>';
                                }
                                ?>
                            </div>
                            <div class="d-flex align-items-center justify-content-center mb-1">
                                <small class="fa fa-star text-primary mr-1"></small>
                                <small class="fa fa-star text-primary mr-1"></small>
                                <small class="fa fa-star text-primary mr-1"></small>
                                <small class="fa fa-star text-primary mr-1"></small>
                                <small class="fa fa-star text-primary mr-1"></small>
                                <!-- <small>(99)</small> -->
                            </div>
                        </div>
                    </div>
                </div>      
            <?php }?>
        </div>
    </div>
    <!-- Products End -->


    <!-- Offer Start -->
    <div class="container-fluid pt-5 pb-3">
        <div class="row px-xl-5">
            <div class="col-md-6">
                <div class="product-offer mb-30" style="height: 300px;">
                    <img class="img-fluid" src="public/images/bannergiay6.webp" alt="">
                    <div class="offer-text">
                        <!-- <h6 class="text-white text-uppercase">Save 20%</h6>
                        <h3 class="text-white mb-3">Special Offer</h3> -->
                        <!-- <a href="" class="btn btn-primary">Shop Now</a> -->
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="product-offer mb-30" style="height: 300px; ">
                    <img class="img-fluid" src="public/images/bannergiay7.webp" alt="">
                    <div class="offer-text">
                        <!-- <h6 class="text-white text-uppercase">Save 20%</h6>
                        <h3 class="text-white mb-3">Special Offer</h3>
                        <a href="" class="btn btn-primary">Shop Now</a> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Offer End -->

    <!-- Products Start -->
    <div class="container-fluid pt-5 pb-3">
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Sản phẩm Yonex</span></h2>
        <div class="row px-xl-5">
            <?php foreach ($yonexProducts as $yonexProduct) {?>
            <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
                <div class="product-item bg-light mb-4">
                    <div class="product-img position-relative overflow-hidden">
                        <img class="img-fluid w-100" style="height: 300px;" src="public/images/<?= $yonexProduct['image']?>" alt="">
                        <div class="product-action">
                            <a class="btn btn-outline-dark btn-square" href="addtocart/<?= $yonexProduct['id'] ?>"><i class="fa fa-shopping-cart"></i></a>
                            
                        </div>
                    </div>
                    <div class="text-center py-4">
                    <a class="h6 text-decoration-none text-truncate" href="detail/<?= $yonexProduct['id']?>"><?= $yonexProduct['title'] ?></a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <?php
                            if (isset($yonexProduct['sale'])) {
                                // Nếu có giảm giá, hiển thị giá giảm và giá gốc
                                echo '<h5 style="color: red;">' . number_format((float)$yonexProduct['sale'], 0, ',', '.') . 'đ</h5>';
                                echo '<h6 class="text-muted ml-2"><del>' . number_format((float)$yonexProduct['price'], 0, ',', '.') . 'đ</del></h6>';
                                } else {
                                // Nếu không có giảm giá, hiển thị giá gốc
                                echo '<h5 style="color: red;">' . number_format((float)$yonexProduct['price'], 0, ',', '.') . 'đ</h5>';
                                }
                                ?>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <!-- <small>(99)</small> -->
                        </div>
                    </div>
                </div>
            </div>     
            <?php }?>
        </div>
    </div>
    <!-- Products End -->

<!-- Show sp mizuno -->
    <!-- Products Start -->
    <div class="container-fluid pt-5 pb-3">
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Sản phẩm Mizuno</span></h2>

        <div class="row px-xl-5">
            <?php foreach ($getMizu as $mizu) {?>
            <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
                <div class="product-item bg-light mb-4">
                    <div class="product-img position-relative overflow-hidden">
                        <img class="img-fluid w-100" style="height: 300px;" src="public/images/<?= $mizu['image']?>" alt="">
                        <div class="product-action">
                            <a class="btn btn-outline-dark btn-square" href="addtocart/<?= $mizu['id'] ?>"><i class="fa fa-shopping-cart"></i></a>
                        </div>
                    </div>
                    <div class="text-center py-4">
                    <a class="h6 text-decoration-none text-truncate" href="detail/<?= $mizu['id']?>"><?= $mizu['title'] ?></a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                    <?php
                             if (isset($mizu['sale'])) {
                                // Nếu có giảm giá, hiển thị giá giảm và giá gốc
                                echo '<h5 style="color: red;">' . number_format((float)$mizu['sale'], 0, ',', '.') . 'đ</h5>';
                                echo '<h6 class="text-muted ml-2"><del>' . number_format((float)$mizu['price'], 0, ',', '.') . 'đ</del></h6>';
                                } else {
                                // Nếu không có giảm giá, hiển thị giá gốc
                                echo '<h5 style="color: red;">' . number_format((float)$mizu['price'], 0, ',', '.') . 'đ</h5>';
                                }
                                ?>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <!-- <small>(99)</small> -->
                        </div>
                    </div>
                </div>
            </div>     
            <?php }?>
        </div>
    </div>
    <!-- Products End -->

<!-- Show sp Lining -->
    <!-- Products Start -->
    <div class="container-fluid pt-5 pb-3">
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Sản phẩm Lining</span></h2>
        <div class="row px-xl-5">
            <?php foreach ($liningProducts as $liningProduct) {?>
            <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
                <div class="product-item bg-light mb-4">
                    <div class="product-img position-relative overflow-hidden">
                        <img class="img-fluid w-100" style="height: 300px;" src="public/images/<?= $liningProduct['image']?>" alt="">
                        <div class="product-action">
                            <a class="btn btn-outline-dark btn-square" href="addtocart/<?= $liningProduct['id'] ?>"><i class="fa fa-shopping-cart"></i></a>
                            
                        </div>
                    </div>
                    <div class="text-center py-4">
                    <a class="h6 text-decoration-none text-truncate" href="detail/<?= $liningProduct['id']?>"><?= $liningProduct['title'] ?></a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                    <?php
                             if (isset($liningProduct['sale'])) {
                                // Nếu có giảm giá, hiển thị giá giảm và giá gốc
                                echo '<h5 style="color: red;">' . number_format((float)$liningProduct['sale'], 0, ',', '.') . 'đ</h5>';
                                echo '<h6 class="text-muted ml-2"><del>' . number_format((float)$liningProduct['price'], 0, ',', '.') . 'đ</del></h6>';
                                } else {
                                // Nếu không có giảm giá, hiển thị giá gốc
                                echo '<h5 style="color: red;">' . number_format((float)$liningProduct['price'], 0, ',', '.') . 'đ</h5>';
                                }
                                ?>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small>(99)</small>
                        </div>
                    </div>
                </div>
            </div>     
            <?php }?>
        </div>
    </div>
    <!-- Products End -->


<!-- Show sp Victor -->
    <!-- Products Start -->
    <div class="container-fluid pt-5 pb-3">
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Sản phẩm Victor</span></h2>
        <div class="row px-xl-5">
            <?php foreach ($victorProducts as $victorProduct) {?>
            <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
                <div class="product-item bg-light mb-4">
                    <div class="product-img position-relative overflow-hidden">
                        <img class="img-fluid w-100" style="height: 300px;" src="public/images/<?= $victorProduct['image']?>" alt="">
                        <div class="product-action">
                            <a class="btn btn-outline-dark btn-square" href="addtocart/<?= $victorProduct['id'] ?>"><i class="fa fa-shopping-cart"></i></a>
                            
                        </div>
                    </div>
                    <div class="text-center py-4">
                    <a class="h6 text-decoration-none text-truncate" href="detail/<?= $victorProduct['id']?>"><?= $victorProduct['title'] ?></a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <?php
                            if (isset($victorProduct['sale'])) {
                               // Nếu có giảm giá, hiển thị giá giảm và giá gốc
                               echo '<h5 style="color: red;">' . number_format((float)$victorProduct['sale'], 0, ',', '.') . 'đ</h5>';
                               echo '<h6 class="text-muted ml-2"><del>' . number_format((float)$victorProduct['price'], 0, ',', '.') . 'đ</del></h6>';
                               } else {
                               // Nếu không có giảm giá, hiển thị giá gốc
                               echo '<h5 style="color: red;">' . number_format((float)$victorProduct['price'], 0, ',', '.') . 'đ</h5>';
                               }
                            ?>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small>(99)</small>
                        </div>
                    </div>
                </div>
            </div>     
            <?php }?>
        </div>
    </div>
    <!-- Products End -->


    <!-- Vendor Start -->
    <div class="container-fluid py-5">
        <div class="row px-xl-5">
            <div class="col">
                <div class="owl-carousel vendor-carousel">
                    <div class="bg-light p-4">
                        <img src="public/images/vendor-1.jpg" alt="">
                    </div>
                    <div class="bg-light p-4">
                        <img src="public/images/vendor-2.jpg" alt="">
                    </div>
                    <div class="bg-light p-4">
                        <img src="public/images/vendor-3.jpg" alt="">
                    </div>
                    <!-- <div class="bg-light p-4">
                        <img src="public/images/vendor-4.jpg" alt="">
                    </div>
                    <div class="bg-light p-4">
                        <img src="public/images/vendor-5.jpg" alt="">
                    </div>
                    <div class="bg-light p-4">
                        <img src="public/images/vendor-6.jpg" alt="">
                    </div>
                    <div class="bg-light p-4">
                        <img src="public/images/vendor-7.jpg" alt="">
                    </div>
                    <div class="bg-light p-4">
                        <img src="public/images/vendor-8.jpg" alt="">
                    </div> -->
                </div>
            </div>
        </div>
    </div>
    <!-- Vendor End -->
<?php include "layouts/footer.php"?>