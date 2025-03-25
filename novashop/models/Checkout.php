<?php 
    // Xử lý đặt hàng
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $customer = $_POST['name'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
// nơi bạn đang lấy user_id từ session
    $user_id = $_SESSION['login']['id'] ?? null;

    try {
        // Thêm đơn hàng vào bảng orders
        $sql = "INSERT INTO orders (customer, phone, address, user_id, create_at)
                VALUES (:customer, :phone, :address, :user_id, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':customer' => $customer,
            ':phone' => $phone,
            ':address' => $address,
            ':user_id' => $user_id
        ]);

        $order_id = $conn->lastInsertId(); // Lấy ID đơn hàng vừa thêm

        // Thêm sản phẩm từ giỏ hàng vào bảng orderdetails
        $sqlDetail = "INSERT INTO orderdetails (order_id, product_id, price, quantity) 
                      VALUES (:order_id, :product_id, :price, :quantity)";
        $stmtDetail = $conn->prepare($sqlDetail);

        foreach ($_SESSION['cart'] as $product) {
            $stmtDetail->execute([
                ':order_id' => $order_id,
                ':product_id' => $product['id'],
                ':price' => $product['price'],
                ':quantity' => $product['quantity']
            ]);
        }
        // Xóa giỏ hàng
        unset($_SESSION['cart']);

// Hiển thị thông báo bằng alert box
        echo "<script>
            alert('Đơn hàng đã đặt thành công.');
            window.location.href = '{$baseurl}/user?order_id={$order_id}';
        </script>";
        exit;
    } catch (PDOException $e) {
        echo "Lỗi: " . $e->getMessage();
    }
}



// Tổng doanh thu nếu đơn hàng đã đc nhận
function getTotalRevenue($orders, $orderdetails) {
    $totalRevenue = 0;

    foreach ($orders as $order) {
        // Kiểm tra trạng thái của đơn hàng, chỉ tính cho đơn hàng đã thanh toán (trạng thái = 4)
        if ($order['status'] == 4) {
            // Lọc chi tiết đơn hàng tương ứng với order_id
            $orderDetailsForCurrentOrder = array_filter($orderdetails, function($orderdetail) use ($order) {
                return $orderdetail['order_id'] == $order['id'];
            });

            // Tính doanh thu cho mỗi đơn hàng với status là 4 ( có nghĩa là đã đc thanh toán)
            foreach ($orderDetailsForCurrentOrder as $orderdetail) {
                $productPrice = $orderdetail['price']; 
                $quantity = $orderdetail['quantity']; 
                $totalRevenue += $productPrice * $quantity; 
            }
        }
    }

    return $totalRevenue;
}
?>