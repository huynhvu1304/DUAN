<?php 

function register($username,$phone, $email, $password ){
    global $conn;
    $sql = "INSERT INTO users(username,phone,email,password) VALUES(:username, :phone, :email, :password)";   
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':email',$email);
    $stmt->bindParam(':password',$password);
    $stmt->execute();
    return $conn->lastInsertId();
}

function checkExistUser($username, $email){
    global $conn;
    $sql = "SELECT * FROM users WHERE username = :username OR email = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch();
    return $user; 
}

function login($email, $password){
    global $conn;
    $sql = "SELECT * FROM users WHERE email = :email AND password = :password";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->execute();
    $user = $stmt->fetch();
    return $user;
}


function getUserById($userId) {
    global $conn;

    // Câu truy vấn SQL kết hợp LEFT JOIN để lấy thông tin người dùng và địa chỉ trong bảng orders
    $sql = "SELECT 
                u.*, 
                od.address AS order_address
            FROM users u
            LEFT JOIN orders od ON u.id = od.user_id
            WHERE u.id = :user_id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    
    // Trả về kết quả người dùng và địa chỉ (nếu có) hoặc false nếu không có dữ liệu
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

if (isset($_SESSION['login']) && isset($_SESSION['login']['id'])) {
    $userId = $_SESSION['login']['id'];
    $get_users = getUserById($userId);
} 
function updateUser($userId, $username, $phone, $email, $address) {
    global $conn;

    // Cập nhật thông tin người dùng trong bảng 'users'
    $sql = "UPDATE users 
            SET username = :username, phone = :phone, email = :email 
            WHERE id = :userId";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();

    // Cập nhật địa chỉ trong bảng 'orders'
    $sql = "UPDATE orders 
            SET address = :address 
            WHERE user_id = :userId";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
}

function validateEmail($email) {
    // Kiểm tra email có phải là định dạng hợp lệ và kết thúc bằng 'gmail.com'
    if (preg_match('/^[a-zA-Z0-9._%+-]+@gmail\.com$/', $email)) {
        return true;  // Nếu email đúng định dạng và kết thúc bằng gmail.com
    }
    return false;  // Nếu không phải email hợp lệ hoặc không kết thúc bằng gmail.com
}

// Tổng người dùng
function getTotalUser($conn) {
    $query = "SELECT COUNT(*) as total_users FROM users";
    $stmt = $conn->prepare($query);  // Chuẩn bị câu lệnh SQL
    $stmt->execute();  // Thực thi câu lệnh
    $result = $stmt->fetch(PDO::FETCH_ASSOC);  // Lấy kết quả
    return $result ? $result['total_users'] : 0;  // Trả về tổng số người dùng, nếu không trả về 0
}
function getAllUsers($conn) {
    $query = "SELECT id, username, email, phone, block, role_id FROM users";  
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);  
    return $users;  
}

// Delete users
function deleteUser($userId) {
    global $conn;
    $sql = "DELETE FROM users WHERE id = :userId";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    return $stmt->execute(); 
}

