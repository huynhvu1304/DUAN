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
// Tải danh sách danh mục khi trang mở
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("http://localhost:3000/categories");
        if (!response.ok)
            throw new Error(`Lỗi tải danh mục: ${response.statusText}`);
        const categories = yield response.json();
        console.log("Danh sách danh mục:", categories);
    }
    catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
    }
}));
const addCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const nameInput = document.getElementById("name");
    const imageInput = document.getElementById("image");
    if (!nameInput || !imageInput) {
        console.error("Không tìm thấy input!");
        return;
    }
    const name = nameInput.value.trim();
    const file = (_a = imageInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!name || !file) {
        alert("Vui lòng nhập tên danh mục và chọn ảnh!");
        return;
    }
    try {
        // 🔹 Lấy danh sách categories từ API trước khi tính toán maxId
        const response = yield fetch("http://localhost:3000/categories");
        if (!response.ok)
            throw new Error(`Lỗi tải danh mục: ${response.statusText}`);
        const categories = yield response.json();
        // 🔹 Xác định ID lớn nhất rồi tăng thêm 1
        const maxId = categories.length > 0 ? Math.max(...categories.map(c => Number(c.id))) : 0;
        const newId = maxId + 1;
        // 🔹 Tạo object danh mục mới
        const newCategory = { id: String(newId), name, img: file.name };
        // 🔹 Gửi yêu cầu POST để thêm danh mục
        const postResponse = yield fetch("http://localhost:3000/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCategory),
        });
        if (!postResponse.ok)
            throw new Error(`Lỗi thêm danh mục: ${postResponse.statusText}`);
        alert("Thêm danh mục thành công!");
        window.location.href = "category.html";
    }
    catch (error) {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi!");
    }
});
