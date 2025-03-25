<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Đảm bảo đường dẫn đúng
require_once 'PHPMailer-master/src/PHPMailer.php';
require_once 'PHPMailer-master/src/SMTP.php';
require_once 'PHPMailer-master/src/Exception.php';

function gmail($cont, $sub, $email, $name)
{
    $mail = new PHPMailer(true);
try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'huynhquoctrieu58@gmail.com';
    $mail->Password   = 'vgukqbkbdddxsgbo';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Recipients
    $mail->setFrom('huynhquoctrieu58@gmail.com', 'trieu');
    $mail->addAddress($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';  // Đảm bảo mã hóa UTF-8 cho email
    $mail->Subject = $sub;
    $mail->Body    = $cont;

    // Send email
    $mail->send();
    return "Email đã được gửi thành công!";  // Thông báo thành công
} catch (Exception $e) {
    return "Lỗi khi gửi email: " . $mail->ErrorInfo;  // Thông báo lỗi
}

}
?>
