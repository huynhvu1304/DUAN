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
// Tải danh mục từ API khi trang mở
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("http://localhost:3000/categories");
    const categories = yield response.json();
    const categorySelect = document.getElementById("category");
    if (categorySelect) {
        categorySelect.innerHTML = categories
            .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
            .join('');
    }
}));
const addPro = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const imageInput = (_a = document.getElementById('image').files) === null || _a === void 0 ? void 0 : _a[0];
    const image1Input = (_b = document.getElementById('image1').files) === null || _b === void 0 ? void 0 : _b[0];
    const image2Input = (_c = document.getElementById('image2').files) === null || _c === void 0 ? void 0 : _c[0];
    const image3Input = (_d = document.getElementById('image3').files) === null || _d === void 0 ? void 0 : _d[0];
    const price = parseFloat(document.getElementById('price').value);
    const hot = document.getElementById('hot').checked ? 1 : 0;
    ;
    const description = document.getElementById('description').value;
    if (!name || !category || !price || !description || !imageInput || !image1Input || !image2Input || !image3Input) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }
    // Lấy danh sách sản phẩm để xác định ID mới
    const response = yield fetch("http://localhost:3000/products");
    const products = yield response.json();
    const maxId = products.length > 0 ? Math.max(...products.map(p => Number(p.id))) : 0;
    // Tạo sản phẩm mới
    const newPro = {
        id: (maxId + 1).toString(),
        name: name,
        idcate: Number(category),
        img: imageInput.name, // Ảnh chính
        imgnho: [image1Input.name, image2Input.name, image3Input.name], // Ảnh nhỏ
        price: price,
        hot: hot, // Boolean chính xác
        description: description,
        quantity: 0 // Mặc định số lượng là 0
    };
    // Gửi yêu cầu POST lên API
    try {
        const postResponse = yield fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPro)
        });
        if (postResponse.ok) {
            alert("Đã thêm sản phẩm!");
            window.location.href = "product.html";
        }
        else {
            throw new Error("Thêm sản phẩm thất bại!");
        }
    }
    catch (error) {
        console.error(error);
        alert("Lỗi khi thêm sản phẩm!");
    }
});
