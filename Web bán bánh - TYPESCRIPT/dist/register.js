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
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault(); // Ngăn trang web tải lại khi submit
    // Lấy dữ liệu từ form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('nhaplai').value;
    // Kiểm tra sự khớp của mật khẩu
    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp!');
        return;
    }
    // Lấy danh sách users để kiểm tra email tồn tại
    const response = yield fetch("http://localhost:3000/users");
    const users = yield response.json();
    // Kiểm tra email đã tồn tại chưa
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        alert("Email này đã được đăng ký!");
        return;
    }
    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Email không hợp lệ!");
        return;
    }
    // Tìm ID lớn nhất, nếu chưa có user nào thì ID = 1
    const newId = users.length > 0 ? Math.max(...users.map(user => Number(user.id))) + 1 : 1;
    // Tạo đối tượng người dùng với role mặc định là "user"
    const user = {
        id: newId.toString(),
        email,
        password,
        confirmPassword,
        role: "user", // Mặc định là user
        locked: 0
    };
    try {
        // Gửi yêu cầu đăng ký tới json-server
        const response = yield fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            window.location.href = './dangnhap.html'; // Chuyển hướng đến trang đăng nhập
            alert('Đăng ký thành công!');
        }
        else {
            alert('Đăng ký thất bại. Vui lòng thử lại.');
        }
    }
    catch (error) {
        console.error('Lỗi kết nối đến server:', error);
        alert('Không thể kết nối đến server.');
    }
}));
