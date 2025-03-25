<?php include "views/layouts/header.php"?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tài khoản của bạn - NovaShop</title>
    <style>
    body {
        background-color: #f5f5f5;
        color: #3D464D;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
    }

    .highlight {
        color: #FFD336;
        font-weight: bold;
    }

    .btn-custom {
        background-color: #FFD336;
        color: #3D464D;
        border: none;
        padding: 12px 25px;
        border-radius: 5px;
        transition: background-color 0.3s, transform 0.2s;
        font-size: 1.1rem;
    }

    .btn-custom:hover {
        background-color: #E5C12C;
        transform: scale(1.05);
    }

    .table th {
        background-color: #FFD336;
        color: #3D464D;
        font-weight: bold;
        padding: 15px;
        font-size: 1.1rem;
    }

    .table {
        border-collapse: collapse;
        width: 100%;
        max-width: 1200px; /* Điều chỉnh độ rộng tối đa của bảng */
        margin: 20px auto;
    }

    .table td, .table th {
        padding: 15px;
        text-align: center;
        font-size: 1rem;
    }

    .table-bordered {
        border: 1px solid #ddd;
    }

    .table-responsive {
        margin-top: 20px;
        overflow-x: auto;
    }

    .card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 20px;
        max-width: 1000px; /* Điều chỉnh độ rộng tối đa của thẻ card */
        margin: 0 auto;
    }

    .list-group-item {
        border: 1px solid #ddd;
        padding: 15px;
        background-color: #f9f9f9;
        font-size: 1rem;
    }

    .list-group-item strong {
        color: #FFD336;
    }

    .text-end {
        text-align: right;
    }

    h1, h2 {
        font-weight: bold;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 15px;
    }

    h2 {
        font-size: 1.8rem;
        margin-bottom: 20px;
    }

    .lead {
        font-size: 1.4rem;
        margin-bottom: 30px;
    }

    /* Thêm khoảng cách trên và dưới các phần để giao diện không bị quá chật */
    .container {
        padding: 40px;
    }

    .container py-5 {
        padding-top: 40px;
        padding-bottom: 40px;
    }

    /* Chỉnh sửa nút "Chỉnh sửa thông tin" */
    .btn-custom {
        font-size: 1.2rem;
    }
</style>
</head>
<body>
    <div class="container py-5">
        <!-- Header -->
        <header class="text-center mb-4">
        <?php if(isset($_SESSION['login'])){?>
           <h1> <p class="highlight">Chào mừng <?php echo $get_users['username'] ?></p></h1>
            <?php }?>
            <p class="lead">Quản lý tài khoản của bạn tại NovaShop</p>
        </header>

        <!-- User Info Section -->
        <section class="mb-5">
            <h2 class="h4 text-uppercase mb-3">Thông tin tài khoản</h2>
            <?php if(isset($get_users)): ?>
                <div class="card p-3 shadow-sm">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Họ và tên:</strong> <?= $get_users['username'] ?></li>
                        <li class="list-group-item"><strong>Số điện thoại:</strong> <?= $get_users['phone'] ?></li>
                        <li class="list-group-item"><strong>Email:</strong> <?= $get_users['email']?></li>
                        <li class="list-group-item"><strong>Địa chỉ:</strong> <?= $get_users['order_address']?></li>
                    </ul>
                </div>
            <?php endif; ?>

            <div class="mt-3 text-end">
                <a href="<?=$baseurl?>/edituser" ><button class="btn btn-custom">Chỉnh sửa thông tin</button></a>
            </div>
        </section>

        <?php 
        //ID của người dùng đang đăng nhập từ phiên làm việc ($_SESSION) và lưu nó vào biến $user_id.
            $user_id = $_SESSION['login']['id'];
            $userdetails = getUserOrdersdetails($conn, $user_id);
        ?>

        <!-- Order History Section -->
        <section class="mb-5">
            <h2 class="h4 text-uppercase mb-3">Lịch sử đơn hàng</h2>
            <div class="table-responsive">
                <table class="table table-bordered text-center align-middle">
                    <thead>
                        <tr>
                            <th>Mã Đơn Hàng</th>
                            <th>Ngày Đặt</th>
                            <th>Sản Phẩm</th>
                            <th>Số Lượng</th>
                            <th>Tổng</th>
                            <th>Trạng Thái</th>
                        </tr>
                    </thead>
                    <!-- Hiển thị các chi tiết đơn hàng -->
                    <?php foreach ($userdetails as $userdetail) : ?>
                        <tr>
                            <td><?= ($userdetail['order_id']) ?></td>
                            <td><?= date('d-m-Y', strtotime($userdetail['create_at'])) ?></td> <!-- Ngày đặt -->
                            <td><?= ($userdetail['product_name']) ?></td>
                            <td><?= ($userdetail['quantity']) ?></td>
                            <td>
                                <?php 
                                $total_price = number_format($userdetail['price'] * $userdetail['quantity'], 0, ',', '.');
                                echo "{$total_price}đ";
                                ?>
                            </td>
                            <td>
                                <?php
                                if (isset($userdetail['status'])) {
                                    switch ($userdetail['status']) {
                                        case 1:
                                            echo "Đơn hàng đang xử lý";
                                            break;
                                        case 2:
                                            echo "Đơn hàng đang giao hàng";
                                            break;
                                        case 3:
                                            echo "Đơn hàng đã được hủy";
                                            break;
                                        case 4:
                                            echo "Đơn hàng đã được thanh toán";
                                            break;
                                        default:
                                            echo "Chưa xác định"; 
                                    }
                                } else {
                                    echo "Chưa xác định"; 
                                }
                                ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </table>
            </div>
        </section>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
<?php include "views/layouts/footer.php"?>
