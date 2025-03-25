<?php include "views/layouts/header.php";?>  
    <!-- Breadcrumb Start -->
    <div class="container-fluid">
        <div class="row px-xl-5">
            <div class="col-12">
                <nav class="breadcrumb bg-light mb-30">
                    <a class="breadcrumb-item text-dark" href="<?=$baseurl?>">Trang chủ</a>
                    <a class="breadcrumb-item text-dark" href="<?=$baseurl?>/shop">Cửa hàng</a>
                    <span class="breadcrumb-item active">Giỏ hàng</span>
                </nav>
            </div>
        </div>
    </div>
    <!-- Breadcrumb End -->

    <?php if(isset($_SESSION['cart']) && count($_SESSION['cart'])>0):?>
    <!-- Cart Start -->
    <div class="container-fluid">
        <div class="row px-xl-5">
            <div class="col-lg-8 table-responsive mb-5">
                <table class="table table-light table-borderless table-hover text-center mb-0">
                    <thead class="thead-dark">
                        <tr>
                            <th>Sản phẩm</th>                            
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody class="align-middle">
                        <?php foreach($_SESSION['cart'] as $product){?>
                        <tr>
                            <td class="align-middle"><img src="public/images/<?= $product['image']?>" alt="" style="width: 80px; height: 80px">
                            <?= $product['title']?></td>
                            <td class="align-middle">$<?= number_format($product['price'])?></td>

                            <td class="align-middle">
                                <div class="input-group quantity mx-auto" style="width: 100px;">
                                    <div class="input-group-btn">
                                        <a href="minuscart/<?= $product['id'] ?>" class="btn btn-sm btn-primary btn-minus" >
                                        <i class="fa fa-minus"></i>
                                        </a>
                                    </div>
                                    <input type="text" class="form-control form-control-sm bg-secondary border-0 text-center" value="<?= $product['quantity']?>">
                                    <div class="input-group-btn">
                                        <a href="pluscart/<?= $product['id'] ?>" class="btn btn-sm btn-primary btn-plus">
                                            <i class="fa fa-plus"></i>
                                        </a>
                                    </div>
                                </div>
                            </td>
                            <td class="align-middle">$<?= number_format($product['price']*$product['quantity']) ?></td>
                            <td class="align-middle"><a href="deletecart/<?= $product['id'] ?>" class="btn btn-sm btn-danger"><i class="fa fa-times"></i></a></td>
                        </tr>   
                        <?php }?>       

                    </tbody>
                </table>
            </div>
            <div class="col-lg-4">
                <form class="mb-30" action="">
                    <div class="input-group">
                        <input type="text" class="form-control border-0 p-4" placeholder="Coupon Code">
                        <div class="input-group-append">
                            <button class="btn btn-primary">Apply Coupon</button>
                        </div>
                    </div>
                </form>
                <h5 class="section-title position-relative text-uppercase mb-3"><span class="bg-secondary pr-3">Thanh toán</span></h5>
                <div class="bg-light p-30 mb-5">
                    <div class="border-bottom pb-2">
                        <div class="d-flex justify-content-between mb-3">
                            <h6>Tổng tiền</h6>
                            <h6> 
                            $<?php 
                                    $total = 0;
                                    foreach($_SESSION['cart'] as $product){
                                        $total += $product['price']*$product['quantity'];
                                    }
                                    echo number_format($total)
                                ?>
                            </h6>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h6 class="font-weight-medium">Phí vận chuyển</h6>
                            <h6 class="font-weight-medium">$0</h6>
                        </div>
                    </div>
                    <div class="pt-2">
                        <div class="d-flex justify-content-between mt-2">
                            <h5>Tổng</h5>
                            <h5>
                                    $<?=number_format($total)?>
                            </h5>
                        </div>
                        <a href="<?=$baseurl?>/checkout" class="btn btn-block btn-primary font-weight-bold my-3 py-3">Thanh toán</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Cart End -->
    <?php else:?>
        <div class="alert alert-danger text-center">Không có sản phẩm nào trong giỏ hàng</div>
    <?php endif?>
<?php include "views/layouts/footer.php"?>