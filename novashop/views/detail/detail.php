<?php include "views/layouts/header.php"?>
    <!-- Shop Detail Start -->
    <div class="container-fluid pb-5">
        <div class="row px-xl-5">
            <div class="col-lg-5 mb-30">
                <div id="product-carousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner bg-light">
                        <div class="carousel-item active">
                            <img class="w-100 h-100" src="../public/images/<?=$product['image']?>" alt="Image">
                        </div>
                        <div class="carousel-item">
                            <img class="w-100 h-100" src="../public/images/<?=$product['image']?>" alt="Image">
                        </div>
                        <div class="carousel-item">
                            <img class="w-100 h-100" src="../public/images/<?=$product['image']?>" alt="Image">
                        </div>
                        <div class="carousel-item">
                            <img class="w-100 h-100" src="../public/images/<?=$product['image']?>" alt="Image">
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#product-carousel" data-slide="prev">
                        <i class="fa fa-2x fa-angle-left text-dark"></i>
                    </a>
                    <a class="carousel-control-next" href="#product-carousel" data-slide="next">
                        <i class="fa fa-2x fa-angle-right text-dark"></i>
                    </a>
                </div>
            </div>

            <div class="col-lg-7 h-auto mb-30">
                <div class="h-100 bg-light p-30">
                    <h3><?=$product['title']?></h3>
                    <div class="d-flex mb-3">
                        <div class="text-primary mr-2">
                            <small class="fas fa-star"></small>
                            <small class="fas fa-star"></small>
                            <small class="fas fa-star"></small>
                            <small class="fas fa-star-half-alt"></small>
                            <small class="far fa-star"></small>
                        </div>
                        <small class="pt-1">(99 lượt xem)</small>
                    </div>
                    <?php
                        if (isset($product['sale'])) {
                            // Nếu có giảm giá, hiển thị giá giảm và giá gốc
                            echo '<h5 style="color: red;" >' . number_format((float)$product['sale'], 0, ',', '.') . 'đ</h5>'.'<h6 class="font-weight-semi-bold mb-4"><del>' . number_format((float)$product['price'], 0, ',', '.') . 'đ</del></h6>';
                            } else {
                            // Nếu không có giảm giá, hiển thị giá gốc
                            echo '<h5 style="color: red;">' . number_format((float)$product['price'], 0, ',', '.') . 'đ</h5>';
                            }
                    ?>                        
                 
                    <p class="mb-4"></p>
                    <div class="d-flex mb-3">
                        <strong class="text-dark mr-3">Kích thước:</strong>
                        <form>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="size-1" name="size">
                                <label class="custom-control-label" for="size-1">38</label>
</div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="size-2" name="size">
                                <label class="custom-control-label" for="size-2">39</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="size-3" name="size">
                                <label class="custom-control-label" for="size-3">40</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="size-4" name="size">
                                <label class="custom-control-label" for="size-4">41</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="size-5" name="size">
                                <label class="custom-control-label" for="size-5">42</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="size-5" name="size">
                                <label class="custom-control-label" for="size-5">43</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="size-5" name="size">
                                <label class="custom-control-label" for="size-5">44</label>
                            </div>
                        </form>
                    </div>
                    <div class="d-flex mb-4">
                        <strong class="text-dark mr-3">Màu sắc:</strong>
                        <form>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="color-1" name="color">
                                <label class="custom-control-label" for="color-1">Đen</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="color-2" name="color">
                                <label class="custom-control-label" for="color-2">Trắng</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="color-3" name="color">
                                <label class="custom-control-label" for="color-3">Đỏ</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="color-4" name="color">
                                <label class="custom-control-label" for="color-4">Cam</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" class="custom-control-input" id="color-5" name="color">
                                <label class="custom-control-label" for="color-5">Vàng</label>
                            </div>
                        </form>
                    </div>
                    <div class="d-flex align-items-center mb-4 pt-2">
                         <form action="<?= $baseurl ?>/addtocart/<?= $product['id'] ?>" method="POST" class="form-inline">
                             <!-- Ô nhập số lượng -->
                             <input type="number" name="quantity" value="1" min="1" class="form-control quantity-input">
                             <!-- Nút thêm vào giỏ hàng -->
                             <button type="submit" class="btn btn-warning add-to-cart-btn">Thêm vào giỏ hàng</button>
                         </form>
                    </div>

                    <div class="d-flex pt-2">
                        <strong class="text-dark mr-2">Chia sẻ:</strong>
                        <div class="d-inline-flex">
                            <a class="text-dark px-2" href="">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a class="text-dark px-2" href="">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a class="text-dark px-2" href="">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a class="text-dark px-2" href="">
                                <i class="fab fa-pinterest"></i>
</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row px-xl-5">
            <div class="col">
                <div class="bg-light p-30">
                    <div class="nav nav-tabs mb-4">
                        <a class="nav-item nav-link text-dark active" data-toggle="tab" href="#tab-pane-1">Mô tả</a>
                        <a class="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-2">Thông tin chi tiết</a>
                        <a class="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-3">Đánh giá (1)</a>
                    </div>
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="tab-pane-1">
                            <h4 class="mb-3">Mô tả ngắn</h4>
                            <p><?=$product['description']?></p>
                        </div>
                        <div class="tab-pane fade" id="tab-pane-2">
                            <h4 class="mb-3">Mô tả chi tiết</h4>
                            <p><?=$product['detail']?></p>
                        
                        </div>
                        <div class="tab-pane fade" id="tab-pane-3">
                            <div class="row">
                                <div class="col-md-6">
                                    <h4 class="mb-4">1 lượt bình luận</h4>
                                    <div class="media mb-4">
                                        <img src="../public/img/cat-1.jpg" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">
                                        <div class="media-body">
                                            <h6>Khoa<small> - <i>11 09 2005</i></small></h6>
                                            <div class="text-primary mb-2">
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star-half-alt"></i>
                                                <i class="far fa-star"></i>
                                            </div>
                                            <p>Giày mang phá ok nha, giá lại rẻ.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h4 class="mb-4">Để lại đánh giá</h4>
                                    <small>Địa chỉ email của bạn sẽ không được công bố. Các trường bắt buộc được đánh dấu *</small>
                                    <div class="d-flex my-3">
                                        <p class="mb-0 mr-2">Đánh giá của bạn *</p>
<div class="text-primary">
                                            <i class="far fa-star"></i>
                                            <i class="far fa-star"></i>
                                            <i class="far fa-star"></i>
                                            <i class="far fa-star"></i>
                                            <i class="far fa-star"></i>
                                        </div>
                                    </div>
                                    <form>
                                        <div class="form-group">
                                            <label for="message">Để lại bình luận *</label>
                                            <textarea id="message" cols="30" rows="5" class="form-control"></textarea>
                                        </div>
                                        <div class="form-group">
                                            <label for="name">Tên của bạn *</label>
                                            <input type="text" class="form-control" id="name">
                                        </div>
                                        <div class="form-group">
                                            <label for="email">Email *</label>
                                            <input type="email" class="form-control" id="email">
                                        </div>
                                        <div class="form-group mb-0">
                                            <input type="submit" value="Đăng bài đánh giá" class="btn btn-primary px-3">
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Shop Detail End -->

<?php include('views/layouts/footer.php')?>
<style>
    /* Tùy chỉnh ô nhập số lượng */
.quantity-input {
    width: 60px;
    text-align: center;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

/* Tùy chỉnh nút thêm vào giỏ hàng */
.add-to-cart-btn {
    background-color: #FFD333; /* Màu vàng chủ đạo */
    border: none;
    color: #000;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.add-to-cart-btn:hover {
    background-color: #FFC107; /* Màu vàng đậm hơn khi hover */
}

/* Căn chỉnh form để 2 nút nằm ngang */
.form-inline {
    display: flex;
    align-items: center;
    gap: 10px;
}

</style>