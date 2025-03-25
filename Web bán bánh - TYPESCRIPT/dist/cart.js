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
var _a, _b;
let cartproducts = [];
const showCart = () => __awaiter(void 0, void 0, void 0, function* () {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const fetchPromises = cart.map((item) => fetch(`http://localhost:3000/products?id=${item.id}`)
        .then((res) => {
        if (!res.ok)
            throw new Error(`Lỗi tải sản phẩm ${item.id}`);
        return res.json();
    })
        .then((data) => {
        if (!data.length)
            throw new Error(`Không tìm thấy sản phẩm ${item.id}`);
        return data[0];
    })
        .catch((error) => {
        console.error(error);
        return null;
    }));
    if (cart.length === 0) {
        document.getElementById("cart").innerHTML = "Giỏ hàng của bạn trống!";
        document.getElementById("total").innerText = "0"; // Cập nhật tổng tiền về 0
        return;
    }
    cartproducts = (yield Promise.all(fetchPromises)).filter((p) => p !== null);
    let newCart = cartproducts.map((product, index) => {
        var _a;
        return (Object.assign(Object.assign({}, product), { quantity: ((_a = cart[index]) === null || _a === void 0 ? void 0 : _a.quantity) || 1 }));
    });
    let innerHTML = "";
    let totalAmount = 0;
    console.log(localStorage.getItem("cart"));
    newCart.forEach((product) => {
        let formattedPrice = product.price.toLocaleString('vi-VN'); // Định dạng tiền VND
        let { id, name, img, price, quantity } = product;
        innerHTML += `
            <tr>
                <td><input type="checkbox" class="select_product" data-id="${id}"></td>
                <td>${name}</td>
                <td><img src="img/${img}" alt="Product Image" width="50"></td>
                <td class="price">${formattedPrice} VND</td>
                <td><input type="number" class="quantity" min="1" value="${quantity}" data-id="${id}"></td>
                <td class="price">${(quantity * price).toLocaleString('vi-VN')} VND</td>
                <td><button class="delete" data-id="${id}">Xóa</button></td>
            </tr>
        `;
        totalAmount += quantity * price;
    });
    document.getElementById("cart").innerHTML = innerHTML;
    document.getElementById("total").innerText = totalAmount.toLocaleString('vi-VN');
    // Gắn sự kiện onchange để cập nhật số lượng và tổng tiền
    document.querySelectorAll(".quantity").forEach((input) => {
        input.addEventListener("change", (e) => {
            const target = e.target;
            let newQuantity = parseInt(target.value, 10) || 1;
            if (newQuantity < 1)
                newQuantity = 1;
            updateQuantity(parseInt(target.dataset.id || "0", 10), newQuantity);
        });
    });
    // Gắn sự kiện click cho nút xóa từng sản phẩm
    document.querySelectorAll(".delete").forEach((button) => {
        button.addEventListener("click", () => {
            deleteProduct(parseInt(button.dataset.id || "0", 10));
        });
    });
});
// Cập nhật số lượng sản phẩm
const updateQuantity = (productId, newQuantity) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.map((item) => (item.id === productId ? Object.assign(Object.assign({}, item), { quantity: newQuantity }) : item));
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
};
// Xóa sản phẩm khỏi giỏ hàng
const deleteProduct = (productId) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
};
// Xóa tất cả sản phẩm đã chọn
(_a = document.getElementById("delete_selected")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".select_product:checked");
    if (checkboxes.length === 0)
        return alert("Vui lòng chọn sản phẩm để xóa!");
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let selectedIds = Array.from(checkboxes).map((checkbox) => parseInt(checkbox.dataset.id || "0", 10));
    cart = cart.filter((item) => !selectedIds.includes(item.id));
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
});
// Chức năng chọn tất cả sản phẩm
(_b = document.getElementById("select_all")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (e) => {
    const target = e.target;
    document.querySelectorAll(".select_product").forEach((checkbox) => {
        checkbox.checked = target.checked;
    });
});
showCart();
function redirectToCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
        alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
    }
    else {
        window.location.href = "thanhtoan.html"; // Chuyển hướng đến trang thanh toán
    }
}
// Gán sự kiện cho nút
const checkoutButton = document.getElementById("checkoutButton");
if (checkoutButton) {
    checkoutButton.addEventListener("click", redirectToCheckout);
}
