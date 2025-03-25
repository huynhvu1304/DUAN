<?php
require_once "models/Order.php"; 
require_once "models/Checkout.php"; 
include "views/layouts/header.php";

?>

<!-- Checkout Start -->
<div class="container-fluid">
    <div class="row px-xl-5">
        <div class="col-lg-8">
            <h5 class="section-title position-relative text-uppercase mb-3"><span class="bg-secondary pr-3">Địa chỉ thanh toán</span></h5>
            <div class="bg-light p-30 mb-5">
                <form action="" method="POST">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label>Tên khách hàng</label>
                            <input name="name" class="form-control" type="text" placeholder="Nhập tên khách hàng" required>
                        </div>                       
                        <div class="col-md-12 form-group">
                            <label>Điện thoại</label>
                            <input name="phone" class="form-control" type="text" placeholder="Nhập điện thoại" required>
                        </div>
                        <div class="col-md-12 form-group">
                            <label>Địa chỉ giao hàng</label>
                            <input name="address" class="form-control" type="text" placeholder="Nhập địa chỉ giao hàng" required>
                        </div>                        
                    </div>
                    <h5 class="section-title position-relative text-uppercase mb-3"><span class="bg-secondary pr-3">Phương thức thanh toán</span></h5>
                    <div class="bg-light p-30">
                        <div class="form-group">
                            <div class="custom-control custom-radio">
                                <input type="radio" class="custom-control-input" name="check" id="directcheck" checked>
                                <label class="custom-control-label" for="directcheck">Thu tiền nhận hàng</label>
                            </div>
                        </div>
                        <div class="form-group mb-4">
                            <div class="custom-control custom-radio">
                                <input type="radio" class="custom-control-input" name="check" id="banktransfer">
                                <label class="custom-control-label" for="banktransfer">Chuyển khoản</label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-block btn-primary font-weight-bold py-3">Đặt hàng</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="col-lg-4">
            <h5 class="section-title position-relative text-uppercase mb-3"><span class="bg-secondary pr-3">Tổng đơn hàng</span></h5>
            <div class="bg-light p-30 mb-5">
                <div class="border-bottom">
                    <h6 class="mb-3">Sản phẩm</h6>
                    <?php foreach($_SESSION['cart'] as $product) { ?>
                    <div class="d-flex justify-content-between">
                        <p><?= $product['title'] ?></p>
                        <p><?= number_format($product['price']) ?> VNĐ</p>
                    </div>   
                    <?php } ?>                  
                </div>
                <div class="border-bottom pt-3 pb-2">
    <div class="d-flex justify-content-between mb-3">
        <h6>Tổng tiền</h6>
        <h6>
            <?php 
                $total = 0;
                foreach($_SESSION['cart'] as $product) {
                    $total += $product['price'] * $product['quantity']; // Nhân giá với số lượng
                }
                echo number_format($total);
            ?> VNĐ
        </h6>
    </div>
    <div class="d-flex justify-content-between">
        <h6 class="font-weight-medium">Phí vận chuyển</h6>
        <h6 class="font-weight-medium">0 VNĐ</h6>
    </div>
</div>
                <div class="pt-2">
                    <div class="d-flex justify-content-between mt-2">
                        <h5>Tổng</h5>
                        <h5><?= number_format($total) ?> VNĐ</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Checkout End -->
<?php include "views/layouts/footer.php"; ?>
