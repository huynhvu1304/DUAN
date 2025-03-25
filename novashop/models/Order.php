<?php
// Hàm lấy tất cả đơn hàng
function getAllOrders($conn) {
    $sql = "SELECT * FROM orders ORDER BY id DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
//láy đơn hàng đang chờ xử lý
function getProcessingOrders($conn) {
    $sql = "SELECT * FROM orders WHERE status = 1 ORDER BY id DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
//lấy đơn hàng đang vận chuyển
function getShippingOrders($conn) {
    $sql = "SELECT * FROM orders WHERE status = 2 ORDER BY id ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//lấy đơn hàng đã hủy
function getCancelledOrders($conn) {
    $sql = "SELECT * FROM orders WHERE status = 3 ORDER BY id ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//lấy đơn hàng đã thanh toán
function getOrderPayment($conn) {
    $sql = "SELECT * FROM orders WHERE status = 4 ORDER BY id ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


// Hàm tính tổng số đơn hàng
function getTotalOrder($conn) {
    $sql = "SELECT COUNT(*) as total_orders FROM orders";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ? $result['total_orders'] : 0;
}

// Hàm thêm đơn hàng
// function addOrder($name, $phone, $address, $user_id, $create_id) {
//     global $conn;
//     $sql = "INSERT INTO orders (customer, phone, address, user_id, create_id) 
//             VALUES (:name, :phone, :address, :user_id, :create_id)";
//     $stmt = $conn->prepare($sql);
//     $stmt->bindParam(':name', $name);
//     $stmt->bindParam(':phone', $phone);
//     $stmt->bindParam(':address', $address);
//     $stmt->bindParam(':user_id', $user_id);
//     $stmt->bindParam(':create_id', $create_id);
//     $stmt->execute();
// }

// Hàm lấy chi tiết đơn hàng
// function getOrderDetails($order_id) {
//     global $conn;
//     try {
//         $sql = "SELECT * FROM orders WHERE id = :order_id";
//         $stmt = $conn->prepare($sql);
//         $stmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
//         $stmt->execute();
//         return $stmt->fetch(PDO::FETCH_ASSOC);
//     } catch (PDOException $e) {
//         echo "Lỗi khi lấy thông tin đơn hàng: " . $e->getMessage();
//         return null;
//     }
// }

// Hàm lấy tất cả chi tiết đơn hàng
function getAllOrdersdetails($conn) {
    $sql = "SELECT * FROM orderdetails";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC); // Trả về tất cả các chi tiết đơn hàng
}




function getUserOrdersdetails($conn, $user_id) {
    $sql = "SELECT 
        od.*, 
        o.create_at, 
        p.title AS product_name, 
        p.description AS product_description, 
        p.price AS product_price,
        o.status  
    FROM orderdetails od
    JOIN orders o ON od.order_id = o.id
    JOIN products p ON od.product_id = p.id
    WHERE o.user_id = :user_id";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}



// Lấy title 
function getAllOrdersDetailsWithProducts($conn) {
    $sql = "
        SELECT 
            od.*, 
            p.title AS title,  
            p.price AS price   
        FROM orderdetails od
        JOIN products p ON od.product_id = p.id 
     ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Cập nhật trang thái đơn hàng trong trang khách hàng
function updateOrderStatus($conn, $order_id, $new_status) {
    $sql = "UPDATE orders SET status = ? WHERE order_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $new_status, $order_id);
    $stmt->execute();
    return $stmt->affected_rows > 0; 
}

?>

