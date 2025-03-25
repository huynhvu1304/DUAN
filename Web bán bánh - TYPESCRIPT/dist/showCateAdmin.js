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
let categories = [];
const fetchData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    if (!response.ok) {
        throw new Error(`Lỗi khi tải dữ liệu từ ${url}`);
    }
    return response.json();
});
const showTbody = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        categories = yield fetchData('http://localhost:3000/categories');
        renderCategories(categories);
    }
    catch (error) {
        console.error(error);
    }
});
const renderCategories = (categoriesToRender) => {
    let html = categoriesToRender.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td><img src="../img/${item.img}" alt="Category Image" width="50"></td>
            <td>
                <a href="../category/editcate.html?id=${item.id}"><button>Sửa</button></a>
            <button onclick="deleteCate(${item.id})">Xóa</button>
            </td>
        </tr>
    `).join("");
    const showCateElement = document.getElementById("showCate");
    if (showCateElement) {
        showCateElement.innerHTML = html;
    }
    else {
        console.error("Không tìm thấy phần tử 'showCate'");
    }
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (event) => {
        const target = event.target;
        const searchTerm = target.value.toLowerCase();
        const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(searchTerm));
        renderCategories(filteredCategories);
    });
};
const deleteCate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`http://localhost:3000/categories/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Lỗi xóa danh mục: ${response.statusText}`);
        }
        // Cập nhật lại danh sách sau khi xóa
        categories = categories.filter(category => String(category.id) !== String(id));
        renderCategories(categories);
        alert("Xóa danh mục thành công!");
    }
    catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể xóa danh mục!");
    }
});
// Gọi hàm để tải dữ liệu khi trang tải
showTbody();
