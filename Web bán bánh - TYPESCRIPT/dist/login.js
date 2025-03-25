"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Chức năng login
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault(); // Ngăn load lại trang
    // Lấy dữ liệu từ form
    const formData = new FormData(loginForm);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
        // Gửi yêu cầu kiểm tra người dùng
        const response = yield fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        const users = yield response.json();
        // Xử lý kết quả
        if (users.length > 0) {
            const user = users[0]; // Lấy thông tin user đầu tiên
            if (user.locked === 1) {
                alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
                return;
            }
            alert("Đăng nhập thành công");
            // Lưu thông tin vào localStorage
            localStorage.setItem("loggedInEmail", email);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", user.role); // Lưu vai trò
            window.location.href = "./index.html"; // Chuyển hướng về trang chính
        }
        else {
            alert("Sai email hoặc mật khẩu!");
        }
    }
    catch (error) {
        console.error("Lỗi kết nối đến server:", error);
        alert("Không thể kết nối đến server.");
    }
}));
function sign() {
    window.location.href = "./dangki.html";
}
