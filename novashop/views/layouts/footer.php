<!-- Footer Start -->
<div class="container-fluid bg-dark text-secondary mt-5 pt-5">
        <div class="row px-xl-5 pt-5">
            <div class="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
                <h5 class="text-secondary text-uppercase mb-4">Liên hệ</h5>
                <p class="mb-2"><i class="fa fa-map-marker-alt text-primary mr-3"></i>huyện Nhơn Trạch, tỉnh Đồng Nai</p>
                <p class="mb-2"><i class="fa fa-envelope text-primary mr-3"></i>vudomdom@gmail.com</p>
                <p class="mb-0"><i class="fa fa-phone-alt text-primary mr-3"></i>012 345 67890</p>
            </div>
            <div class="col-lg-8 col-md-12">
                <div class="row">
                    <div class="col-md-4 mb-5">
                        <h5 class="text-secondary text-uppercase mb-4">Cửa hàng</h5>
                        <div class="d-flex flex-column justify-content-start">
                            <a class="text-secondary mb-2" href="<?=$baseurl?>"><i class="fa fa-angle-right mr-2"></i>Trang chủ</a>
                            <a class="text-secondary mb-2" href="<?=$baseurl?>/shop"><i class="fa fa-angle-right mr-2"></i>Cửa hàng</a>
                            <a class="text-secondary mb-2" href="<?=$baseurl?>/cart"><i class="fa fa-angle-right mr-2"></i>Giỏ hàng</a>
                            <a class="text-secondary" href="<?=$baseurl?>/contact"><i class="fa fa-angle-right mr-2"></i>Liên hệ với chúng tôi</a>
                        </div>
                    </div>
                    <div class="col-md-4 mb-5">
                        <h5 class="text-secondary text-uppercase mb-4">Tài khoản của tôi</h5>
                        <div class="d-flex flex-column justify-content-start">
                            <a class="text-secondary mb-2" href="<?=$baseurl?>"><i class="fa fa-angle-right mr-2"></i>Trang chủ</a>
                            <?php if (!isset($_SESSION['login'])) { ?>
                                    <!-- Nếu chưa đăng nhập, hiển thị liên kết đăng nhập -->
                                <a href="<?=$baseurl?>/login" class="text-secondary mb-2"><i class="fa fa-user mr-2"></i> Thông tin của tôi</a>
                            <?php } else { ?>
                                <!-- Nếu đã đăng nhập, hiển thị liên kết thông tin cá nhân -->
                                <a class="text-secondary mb-2" href="<?=$baseurl?>/user"><i class="fa fa-angle-right mr-2"></i>Thông tin của tôi</a>
                            <?php } ?>

                        </div>
                    </div>
                    <div class="col-md-4 mb-5">
                        <h5 class="text-secondary text-uppercase mb-4">Đăng kí nhận khuyến mãi</h5>
                        <form action="">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Nhập địa chỉ Email">
                                <div class="input-group-append">
                                    <button class="btn btn-primary">Đăng kí</button>
                                </div>
                            </div>
                        </form>
                        <h6 class="text-secondary text-uppercase mt-4 mb-3">Theo dõi chúng tôi</h6>
                        <div class="d-flex">
                            <a class="btn btn-primary btn-square mr-2" href="#"><i class="fab fa-twitter"></i></a>
                            <a class="btn btn-primary btn-square mr-2" href="#"><i class="fab fa-facebook-f"></i></a>
                            <a class="btn btn-primary btn-square mr-2" href="#"><i class="fab fa-linkedin-in"></i></a>
                            <a class="btn btn-primary btn-square" href="#"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row border-top mx-xl-5 py-4" style="border-color: rgba(256, 256, 256, .1) !important;">
            <div class="col-md-6 px-xl-0">
                <p class="mb-md-0 text-center text-md-left text-secondary">
                    &copy; <a class="text-primary" href="#">NovaShop</a>
                    <a class="text-primary" href="https://htmlcodex.com"></a>
                </p>
            </div>
            <div class="col-md-6 px-xl-0 text-center text-md-right">
                <img class="img-fluid" src="img/payments.png" alt="">
            </div>
        </div>
    </div>
    <!-- Footer End -->


    <!-- Back to Top -->
    <a href="#" class="btn btn-primary back-to-top"><i class="fa fa-angle-double-up"></i></a>


    <!-- JavaScript Libraries -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>
    <script src="public/lib/easing/easing.min.js"></script>
    <script src="public/lib/owlcarousel/owl.carousel.min.js"></script>

    <!-- Contact Javascript File
    <script src="public/mail/jqBootstrapValidation.min.js"></script>
    <script src="public/mail/contact.js"></script> -->

    <!-- Template Javascript -->
    <script src="public/js/main.js"></script>
</body>

</html>