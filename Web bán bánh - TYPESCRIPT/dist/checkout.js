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
document.addEventListener("DOMContentLoaded", () => {
    const orderSummary = document.querySelector(".order-summary");
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Dữ liệu giỏ hàng:", cartData);
    if (cartData.length > 0) {
        let total = 0;
        let html = "<h2>ĐƠN HÀNG CỦA BẠN</h2>";
        cartData.forEach((item) => {
            html += `<p><strong>${item.name}:</strong> ${item.quantity} x ${item.price.toLocaleString('vi-VN')} đ</p>`;
            total += item.quantity * item.price;
        });
        html += `<div class="total">Tổng: ${total.toLocaleString('vi-VN')} đ</div>`;
        orderSummary.innerHTML = html + orderSummary.innerHTML;
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const orderButton = document.getElementById("placeOrder");
    if (!orderButton) {
        console.error("Không tìm thấy nút đặt hàng!");
        return;
    }
    orderButton.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart.length === 0) {
            alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi đặt hàng.");
            return;
        }
        const fullnameInput = document.getElementById("fullname");
        const addressInput = document.getElementById("address");
        const phoneInput = document.getElementById("phone");
        if (!fullnameInput.value.trim() || !addressInput.value.trim() || !phoneInput.value.trim()) {
            alert("Bạn chưa nhập thông tin đầy đủ!");
            return;
        }
        try {
            const response = yield fetch("http://localhost:3000/orders");
            const orders = yield response.json();
            const newOrderId = orders.length > 0 ? Math.max(...orders.map(order => order.id)) + 1 : 1;
            const order = {
                id: newOrderId,
                fullname: fullnameInput.value.trim(),
                address: addressInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: ((_a = document.getElementById("email")) === null || _a === void 0 ? void 0 : _a.value.trim()) || "",
                note: ((_b = document.getElementById("note")) === null || _b === void 0 ? void 0 : _b.value.trim()) || "",
                cart: cart,
                status: "pending"
            };
            console.log("Dữ liệu gửi đi:", order);
            const postResponse = yield fetch("http://localhost:3000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(Object.assign(Object.assign({}, order), { id: newOrderId.toString() }))
            });
            if (postResponse.ok) {
                window.location.href = "index.html";
                alert("Đơn hàng đã được đặt thành công!");
                localStorage.removeItem("cart");
            }
            else {
                throw new Error("Không thể đặt hàng");
            }
        }
        catch (error) {
            console.error("Lỗi khi gửi đơn hàng:", error);
            alert("Có lỗi xảy ra khi đặt hàng, vui lòng thử lại!");
        }
    }));
});
