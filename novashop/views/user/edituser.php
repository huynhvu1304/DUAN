<!-- Form chỉnh sửa thông tin người dùng -->

<?php if (isset($get_users)): ?>
    <form method="POST" action="">
        <div class="form-group">
            <label for="username">Tên người dùng:</label>
            <input type="text" id="username" name="username" class="form-control" value="<?= $get_users['username']?> " required>
        </div>
        <div class="form-group">
            <label for="phone">Số điện thoại:</label>
            <input type="text" id="phone" name="phone" class="form-control" value="<?= $get_users['phone'] ?>" required>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" class="form-control" value="<?= $get_users['email'] ?>" required>
        </div>
        <div class="form-group">
            <label for="address">Địa chỉ:</label>
            <input type="address" id="address" name="address" class="form-control" value="<?= $get_users['order_address'] ?>" required>
        </div>


        <button type="submit" class="btn btn-primary">Cập nhật</button>
        <a href="<?=$baseurl?>/user">Quay trở lại</a>
    </form>
<?php else: ?>
    <p>Không tìm thấy thông tin người dùng.</p>
<?php endif; ?>
<style>
    /* Đặt nền cho toàn bộ trang */
body {
    background-color: #f4f4f9; /* Màu nền sáng */
    font-family: Arial, sans-serif; /* Font chữ dễ đọc */
    margin: 0;
    padding: 0;
}

/* Container form */
form {
    width: 100%;
    max-width: 600px; /* Chiều rộng tối đa của form */
    margin: 50px auto; /* Căn giữa form */
    background-color: #fff; /* Nền trắng cho form */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ cho form */
}

/* Style cho các nhóm form */
.form-group {
    margin-bottom: 20px; /* Khoảng cách giữa các nhóm */
}

/* Style cho nhãn (label) */
.form-group label {
    font-size: 16px; /* Kích thước chữ nhãn */
    color: #333; /* Màu chữ tối */
    display: block; /* Đảm bảo label chiếm hết chiều rộng */
    margin-bottom: 5px; /* Khoảng cách giữa label và input */
}

/* Style cho input */
.form-control {
    width: 100%; /* Chiều rộng đầy đủ */
    padding: 10px; /* Đệm trong input */
    border: 1px solid #ccc; /* Viền màu xám nhạt */
    border-radius: 5px; /* Bo tròn góc */
    font-size: 14px; /* Kích thước chữ */
    color: #333; /* Màu chữ input */
    box-sizing: border-box; /* Đảm bảo chiều rộng chính xác */
}

/* Style cho nút submit */
button[type="submit"] {
    width: 100%; /* Chiều rộng nút bấm */
    padding: 12px; /* Đệm trong nút */
    background-color: #FFD336; /* Màu nền vàng */
    color: #3D464D; /* Màu chữ tối */
    border: none; /* Xóa viền nút */
    border-radius: 5px; /* Bo tròn góc */
    font-size: 16px; /* Kích thước chữ */
    cursor: pointer; /* Hiển thị con trỏ chuột khi hover */
    transition: background-color 0.3s; /* Hiệu ứng chuyển màu */
}

button[type="submit"]:hover {
    background-color: #3D464D; /* Chuyển màu khi hover */
    color: #FFD336; /* Chuyển màu chữ khi hover */
}

/* Style cho thông báo lỗi */
p {
    color: #d9534f; /* Màu đỏ cho thông báo lỗi */
    font-size: 14px; /* Kích thước chữ thông báo lỗi */
}

</style>