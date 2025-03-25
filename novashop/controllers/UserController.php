<?php
include_once "models/User.php";  
switch ($action) {
    case 'userAdmin':
        $users = getAllUsers($conn); 
        include "views/admin/user/index.php"; 
        break;
        case 'user':
            {
                include "views/user/user.php";          
            }
            break;
        case 'edituser':
    {
        include "views/user/edituser.php";
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $errors = [];
            
            $username = $_POST['username'] ?? '';
            $phone = $_POST['phone'] ?? '';
            $email = $_POST['email'] ?? '';
    
            if (empty($username)) {
                $errors[] = "Tên người dùng không được để trống.";
            }
            if (empty($phone)) {
                $errors[] = "Số điện thoại không được để trống.";
            }
            if (strlen($phone) != 10) {
                $errors[] = "Số điện thoại chỉ được 10 số.";
            }
            if (!validateEmail($email)) {
                $errors[] = "Email sai định dạng";
            }
            
           
            
            // **Kiểm tra trùng email**
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email AND id != :userId");
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':userId', $_SESSION['login']['id']);
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                $errors[] = "Email này đã tồn tại. Vui lòng chọn email khác.";
            }
    
            if (empty($errors)) {
                // Thực hiện cập nhật nếu không có lỗi
                $address = $_POST['address'];
                $userId = $_SESSION['login']['id'];
                updateUser($userId, $username, $phone, $email, $address);
                header("Location: user"); // Chuyển hướng sau khi cập nhật
                exit();
            } 
             // Nếu có lỗi, hiển thị thông báo lỗi
             if (!empty($errors)) {
                foreach ($errors as $error) {
                    echo "<script>alert('$error');</script>";
                }
            }
        }
    }
    break;
      
}
?>
