<?php
// Kiểm tra và chỉ gọi session_start nếu phiên chưa được khởi tạo
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Đảm bảo dùng require_once để tệp chỉ được nạp một lần
require_once 'PHPMailer-master/src/Exception.php';
require_once 'PHPMailer-master/src/PHPMailer.php';
require_once 'PHPMailer-master/src/SMTP.php';
require_once 'models/SentMailer.php';

// Kiểm tra nếu $action được định nghĩa
if (isset($action)) {
    switch ($action) {
        case 'contact':
            include "views/contact/contact.php"; // Nạp trang liên hệ
            break;
        // Thêm các case khác nếu cần
    }
} else {
    echo "Không có action được chỉ định!";
}
?>
