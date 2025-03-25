<?php
include_once "views/layouts/header.php"; 
include_once 'init/config.php'; 

// Lấy order_id từ URL (nếu có)
$order_id = isset($_GET['order_id']) ? $_GET['order_id'] : 0;

// Kiểm tra nếu order_id hợp lệ
if ($order_id > 0) {
    try {
        // Truy vấn để lấy đơn hàng từ bảng `orders`
        $sql = "SELECT * FROM orders WHERE order_id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        
        // Lấy thông tin đơn hàng
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($order) {
            echo "<h1>Chi tiết đơn hàng của bạn</h1>";
            echo "<table border='1'>
                    <tr>
                        <th>ID</th>
                        <th>Tên khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Ngày đặt</th>
                        <th>Chi tiết sản phẩm</th>
                    </tr>";
            
            // Lấy chi tiết sản phẩm từ bảng `orderdetails`
            $sqlDetails = "SELECT * FROM orderdetails WHERE order_id = :order_id";
            $stmtDetails = $conn->prepare($sqlDetails);
            $stmtDetails->bindParam(':order_id', $order_id, PDO::PARAM_INT);
            $stmtDetails->execute();
            $orderDetails = $stmtDetails->fetchAll(PDO::FETCH_ASSOC);
            
            // Hiển thị thông tin đơn hàng và chi tiết sản phẩm
            foreach ($orderDetails as $detail) {
                echo "<tr>
                        <td>{$order['order_id']}</td>
                        <td>{$order['customer']}</td>
                        <td>{$order['phone']}</td>
                        <td>{$order['address']}</td>
                        <td>{$order['create_at']}</td>
                        <td>
                            Sản phẩm ID: {$detail['product_id']}<br>
                            Giá: {$detail['price']}<br>
                            Số lượng: {$detail['quantity']}
                        </td>
                    </tr>";
            }
            
            echo "</table>";
        } else {
            echo "<p>Không tìm thấy đơn hàng với ID này.</p>";
        }
    } catch (PDOException $e) {
        // Nếu có lỗi trong quá trình truy vấn
        echo "Lỗi: " . $e->getMessage();
    }
} else {
    echo "<p>Không có ID đơn hàng.</p>";
}

include "views/layouts/footer.php";
?>
