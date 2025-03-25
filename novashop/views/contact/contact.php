<?php include "views/layouts/header.php"; ?>
<?php
// Đảm bảo đường dẫn chính xác đến SentMailer.php
require_once "models/SentMailer.php";
// Kiểm tra khi form được gửi
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['sendMessageButton'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Kiểm tra nếu các trường không trống
    if (!empty($name) && !empty($email) && !empty($subject) && !empty($message)) {
        // Gọi hàm gửi email
        gmail($message, $subject, $email, $name);
        echo "<script> alert('Email đã được gửi thành công!')</script>";
    } else {
        echo "(<script> alert('Vui lòng điền đầy đủ thông tin!')</script>";
    }
}
?>
<!-- Contact Form HTML -->
<div class="container-fluid">
    <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Liên hệ</span></h2>
    <div class="row px-xl-5">
        <div class="col-lg-7 mb-5">
            <div class="contact-form bg-light p-30">
                <form method="POST" action="" name="sentMessage" id="contactForm" novalidate="novalidate">
                    <div class="control-group">
                        <input type="text" class="form-control" name="name" id="name" placeholder="Tên" required="required" />
                    </div>
                    <br>
                    <div class="control-group">
                        <input type="email" class="form-control" name="email" id="email" placeholder="Email" required="required" />
                    </div>
                    <br>
                    <div class="control-group">
                        <input type="text" class="form-control" name="subject" id="subject" placeholder="Tiêu đề" required="required" />
                    </div>
                    <br>
                    <div class="control-group">
                        <textarea class="form-control" rows="8" name="message" id="message" placeholder="Nội dung" required="required"></textarea>
                    </div>
                    <br>
                    <div>
                        <button class="btn btn-primary py-2 px-4" type="submit" name="sendMessageButton">Gửi</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="col-lg-5 mb-5">
            <div class="bg-light p-30 mb-30">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.444093308409!2d106.62348197355311!3d10.853788157765068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b6c59ba4c97%3A0x535e784068f1558b!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1sen!2sus!4v1732878822374!5m2!1sen!2sus" width="400" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div class="bg-light p-30 mb-3">
                <p class="mb-2"><i class="fa fa-map-marker-alt text-primary mr-3"></i>Ấp Bàu Bông, xã Phước An</p>
                <p class="mb-2">Vui lòng liên hệ qua:</p>
                <p class="mb-2"><i class="fa fa-envelope text-primary mr-3"></i>novashopvn12@gmail.com</p>
                <p class="mb-2"><i class="fa fa-phone-alt text-primary mr-3"></i>+0794346995</p>
            </div>
        </div>
    </div>
</div>
<?php include "views/layouts/footer.php"; ?>