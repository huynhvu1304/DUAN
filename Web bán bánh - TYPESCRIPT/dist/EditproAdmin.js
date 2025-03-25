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
const getProductIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};
const loadCategories = (selectedId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("http://localhost:3000/categories");
        const categories = yield response.json();
        if (!categories.length) {
            alert("Không có danh mục nào!");
            return;
        }
        const categorySelect = document.getElementById("editCategory");
        categorySelect.innerHTML = categories
            .map(cat => `<option value="${cat.id}" ${cat.id === selectedId ? "selected" : ""}>${cat.name}</option>`)
            .join("");
    }
    catch (error) {
        console.error("Lỗi tải danh mục:", error);
    }
});
const loadProductData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`http://localhost:3000/products/${id}`);
        const product = yield response.json();
        if (!product) {
            alert("Không tìm thấy sản phẩm!");
            return;
        }
        document.getElementById("editId").value = id;
        document.getElementById("editName").value = product.name;
        document.getElementById("editPrice").value = product.price.toString();
        document.getElementById("editHot").checked = product.hot === 1;
        document.getElementById("editDescription").value = product.description;
        document.getElementById("oldImage").src = product.img ? `../img/${product.img}` : "default.jpg";
        for (let i = 0; i < 3; i++) {
            document.getElementById(`oldImage${i + 1}`).src = product.imgnho[i] ? `../img/${product.imgnho[i]}` : "default.jpg";
        }
        yield loadCategories(String(product.idcate));
    }
    catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
    }
});
const initEditPage = () => __awaiter(void 0, void 0, void 0, function* () {
    const id = getProductIdFromURL();
    if (!id) {
        alert("ID sản phẩm không hợp lệ!");
        return;
    }
    yield loadProductData(id); // Bây giờ id là string
});
initEditPage();
const editProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const id = document.getElementById("editId").value.trim(); // Giữ kiểu string
    const name = document.getElementById("editName").value.trim();
    const category = parseInt(document.getElementById("editCategory").value, 10);
    const fileInput = ((_a = document.getElementById("editImage").files) === null || _a === void 0 ? void 0 : _a[0]) || null;
    const price = parseFloat(document.getElementById("editPrice").value.trim());
    const hot = document.getElementById("editHot").checked ? 1 : 0;
    const description = document.getElementById("editDescription").value.trim();
    if (!name || isNaN(price) || price <= 0 || !description) {
        alert("Vui lòng điền đầy đủ thông tin hợp lệ!");
        return;
    }
    let image = document.getElementById("oldImage").src.split("/").pop() || "default.jpg";
    if (fileInput) {
        const formData = new FormData();
        formData.append("file", fileInput);
        yield fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        });
        image = fileInput.name;
    }
    const fileInputs = [
        ((_b = document.getElementById("editImage1").files) === null || _b === void 0 ? void 0 : _b[0]) || null,
        ((_c = document.getElementById("editImage2").files) === null || _c === void 0 ? void 0 : _c[0]) || null,
        ((_d = document.getElementById("editImage3").files) === null || _d === void 0 ? void 0 : _d[0]) || null
    ];
    let imgnho = [];
    for (let i = 0; i < 3; i++) {
        if (fileInputs[i]) {
            const formData = new FormData();
            formData.append("file", fileInputs[i]);
            yield fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData,
            });
            imgnho[i] = fileInputs[i].name;
        }
    }
    const updatedProduct = { id, name, idcate: category, img: image, price, hot, description, quantity: 0, imgnho };
    try {
        yield fetch(`http://localhost:3000/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct),
        });
        alert("Cập nhật sản phẩm thành công!");
        window.location.href = "product.html";
    }
    catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
    }
});
