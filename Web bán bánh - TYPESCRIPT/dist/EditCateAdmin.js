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
const getCateidFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};
// Load dữ liệu danh mục khi mở trang
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = getCateidFromURL();
    if (!categoryId) {
        alert("Không tìm thấy danh mục!");
        return;
    }
    try {
        const response = yield fetch(`http://localhost:3000/categories/${categoryId}`);
        if (!response.ok)
            throw new Error("Không tìm thấy danh mục!");
        const category = yield response.json();
        document.getElementById("editId").value = category.id.toString();
        document.getElementById("editName").value = category.name;
        document.getElementById("oldImage").src = category.img || "";
    }
    catch (error) {
        alert(error.message);
    }
}));
const editCate = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = getCateidFromURL();
    const name = document.getElementById("editName").value;
    const imageInput = (_a = document.getElementById("editImage").files) === null || _a === void 0 ? void 0 : _a[0];
    if (!id || !name) {
        alert("Vui lòng nhập tên danh mục!");
        return;
    }
    let imageUrl = document.getElementById("oldImage").src.split('/').pop() || "";
    if (imageInput) {
        imageUrl = imageInput.name; // Lưu tên file ảnh
    }
    const updatedCategory = { id, name, img: imageUrl };
    try {
        const response = yield fetch(`http://localhost:3000/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCategory),
        });
        if (!response.ok)
            throw new Error("Cập nhật thất bại!");
        alert("Cập nhật danh mục thành công!");
        window.location.href = "category.html";
    }
    catch (error) {
        alert(error.message);
    }
});
