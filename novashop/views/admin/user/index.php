<?php
include "views/layouts/header-admin.php";
include "init/config.php";

// Kiểm tra và xử lý nếu có yêu cầu khóa hoặc mở khóa tài khoản
if (isset($_POST['userId']) && isset($_POST['blockStatus'])) {
    $userId = intval($_POST['userId']);
    $blockStatus = intval($_POST['blockStatus']);

    // Sử dụng Prepared Statements để tránh SQL Injection
    $sql = "UPDATE users SET block = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(1, $blockStatus, PDO::PARAM_INT);
    $stmt->bindValue(2, $userId, PDO::PARAM_INT);
    $stmt->execute();

    // Kiểm tra kết quả và thông báo
    if ($stmt->rowCount() > 0) {
        $message = $blockStatus == 1 ? "Tài khoản đã bị khóa thành công." : "Tài khoản đã được mở khóa.";
    } else {
        $message = "Lỗi khi thay đổi trạng thái tài khoản.";
    }

    // Đảm bảo bạn sẽ redirect lại để không gặp vấn đề session
    header("Location: " . $_SERVER['REQUEST_URI']);
    exit();
}

// Xử lý xóa người dùng
if (isset($_POST['deleteId'])) {
    $userIdToDelete = intval($_POST['deleteId']);
    $isDeleted = deleteUser($userIdToDelete);
    $message = $isDeleted ? "Người dùng đã được xóa thành công." : "Không thể xóa người dùng hoặc người dùng không tồn tại.";
    // Chuyển hướng sau khi xóa
    header("Location: " . $_SERVER['REQUEST_URI']);
    exit();
}

$users = getAllUsers($conn);
?>

<div class="container mt-3">
    <h2>Danh sách tài khoản</h2>

    <!-- Hiển thị thông báo -->
    <?php if (isset($message)): ?>
        <div class="alert alert-info"><?= htmlspecialchars($message) ?></div>
    <?php endif; ?>

    <table class="table table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Khóa</th>
                <th>Chức vụ</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            <?php if (!empty($users)): ?>
                <?php foreach ($users as $user): ?>
                    <tr>
                        <td><?= htmlspecialchars($user['id']) ?></td>
                        <td><?= htmlspecialchars($user['username']) ?></td>
                        <td><?= htmlspecialchars($user['email']) ?></td>
                        <td><?= $user['block'] ? 'Đã khóa' : 'Chưa khóa' ?></td>
                        <td><?= $user['role_id'] == 1 ? 'Quản trị viên' : 'Người dùng' ?></td>
                        <td>
                            <!-- Form xóa người dùng -->
                            <form method="POST" onsubmit="return confirm('Bạn có chắc muốn xóa người dùng này?')">
                                <input type="hidden" name="deleteId" value="<?= htmlspecialchars($user['id']) ?>" />
                                <!-- <button type="submit" class="btn btn-danger btn-sm">Xóa</button> -->
                            </form>
                            <!-- Form khóa/mở khóa -->
                            <form method="POST" onsubmit="return confirm('Bạn có chắc muốn thay đổi trạng thái khóa tài khoản này?')">
                                <input type="hidden" name="userId" value="<?= htmlspecialchars($user['id']) ?>" />
                                <input type="hidden" name="blockStatus" value="<?= $user['block'] == 1 ? 0 : 1 ?>" />
                                <button type="submit" class="btn btn-warning btn-sm">
                                    <?= $user['block'] == 1 ? 'Mở khóa' : 'Khóa' ?>
                                </button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="6">Không có người dùng nào.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?php include "views/layouts/footer-admin.php"; ?>
<style>

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
}


.container {
    width: 85%;
    margin: 0 auto;
    padding-top: 30px;
}


h2 {
    text-align: center;
    font-size: 2em;
    color: #333;
    margin-bottom: 20px;
}

.card {
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.card-header {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    background-color: #4CAF50;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 15px;
}

.card-body {
    text-align: center;
    padding: 20px;
    background-color: white;
    color: black;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.card-title {
    text-align: center;
    color: black;
    font-size: 30px;
    font-weight: bold;
}

.alert {
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    background-color: #d4edda;
    color: #155724;
    border-color: #c3e6cb;
}


.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}


.table th {
    padding: 12px;
    text-align: left;
    background-color: #f7f7f7;
    color: #333;
    font-size: 1.1em;
}

.table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    color: #555;
}

.btn {
    padding: 6px 12px;
    font-size: 0.9em;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.btn-danger {
    background-color: #dc3545;
    border: 1px solid #dc3545;
    color: #fff;
}

.btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
}

.btn-warning {
    background-color: #ffc107;
    border: 1px solid #ffc107;
    color: #fff;
}

.btn-warning:hover {
    background-color: #e0a800;
    border-color: #d39e00;
}


form {
    display: inline-block;
    margin: 0 5px;
}

table td form button {
    width: 100%;
}

</style>