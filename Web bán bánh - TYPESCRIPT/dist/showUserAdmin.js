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
// Hàm tải danh sách người dùng
const loadUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("http://localhost:3000/users");
        const users = yield response.json();
        const tableBody = document.getElementById("showUsers");
        if (!tableBody)
            return;
        tableBody.innerHTML = ""; // Xóa nội dung cũ
        users.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <input type="checkbox" id="lock-${user.id}" ${user.locked ? "checked" : ""}>
                </td>
            `;
            // Thêm sự kiện cho checkbox khóa/mở khóa
            const checkbox = row.querySelector(`#lock-${user.id}`);
            if (checkbox) {
                checkbox.addEventListener("change", () => toggleLock(user.id, checkbox.checked));
            }
            tableBody.appendChild(row);
        });
    }
    catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
    }
});
// Hàm khóa/mở khóa tài khoản
const toggleLock = (id, isLocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`http://localhost:3000/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locked: isLocked ? 1 : 0 })
        });
        if (response.ok) {
            alert(isLocked ? "Tài khoản đã bị khóa!" : "Tài khoản đã mở khóa!");
        }
        else {
            alert("Cập nhật trạng thái thất bại!");
        }
    }
    catch (error) {
        console.error("Lỗi khi cập nhật trạng thái tài khoản:", error);
    }
});
// Khi DOM load xong, tải danh sách users
document.addEventListener("DOMContentLoaded", loadUsers);
