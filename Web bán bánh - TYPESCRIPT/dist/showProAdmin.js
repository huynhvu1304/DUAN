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
let products = [];
let Cate = [];
const Fdata = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    if (!response.ok) {
        throw new Error(`Lỗi khi tải dữ liệu từ ${url}`);
    }
    const data = yield response.json();
    // Nếu dữ liệu là danh sách sản phẩm, chuyển đổi `idcate` về number
    if (Array.isArray(data)) {
        return data.map(item => (Object.assign(Object.assign({}, item), { id: Number(item.id), idcate: Number(item.idcate) })));
    }
    return data;
});
const showBodypro = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        products = yield Fdata('http://localhost:3000/products');
        Cate = yield Fdata('http://localhost:3000/categories');
        renderProducts(products);
        console.log(products);
    }
    catch (error) {
        console.error(error);
    }
});
// Hàm xóa sản phẩm khỏi JSON Server
const deletePro = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`http://localhost:3000/products/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Lỗi xóa sản phẩm: ${response.statusText}`);
        }
        // Cập nhật lại danh sách sau khi xóa
        products = products.filter(product => String(product.id) !== String(id));
        renderProducts(products);
        alert("Xóa sản phẩm thành công!");
    }
    catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể xóa sản phẩm!");
    }
});
const renderProducts = (productsToRender) => {
    let html = productsToRender.map((item, index) => {
        const category = Cate.find(c => Number(c.id) === item.idcate);
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${category ? category.name : "Không xác định"}</td>
                <td><img src="../img/${item.img}" alt="Product Image" width="50"></td>
                <td><input type="checkbox" ${item.hot ? "checked" : ""} ></td>
                <td>${item.description}</td>
                <td>
                    <a href="../product/editpro.html?id=${item.id}"><button>Sửa</button></a>
                    <button onclick="deletePro(${item.id})">Xóa</button>
                </td>
            </tr>
        `;
    }).join("");
    const showProElement = document.getElementById("showPro");
    if (showProElement) {
        showProElement.innerHTML = html;
    }
    else {
        console.error("Không tìm thấy phần tử 'showPro'");
    }
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (event) => {
        const target = event.target;
        const searchTerm = target.value.toLowerCase();
        const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm));
        renderProducts(filteredProducts);
    });
};
// Gọi hàm để tải dữ liệu khi trang tải
showBodypro();
