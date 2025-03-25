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
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productResponse = yield fetch("http://localhost:3000/products");
        const products = yield productResponse.json();
        document.getElementById("totalProducts").textContent = products.length.toString();
        const categoryResponse = yield fetch("http://localhost:3000/categories");
        const categories = yield categoryResponse.json();
        document.getElementById("totalCategories").textContent = categories.length.toString();
        const userResponse = yield fetch("http://localhost:3000/users");
        const users = yield userResponse.json();
        document.getElementById("totalUsers").textContent = users.length.toString();
        // 🆕 Lấy doanh thu từ JSON Server
        const revenueResponse = yield fetch("http://localhost:3000/revenue");
        const revenueData = yield revenueResponse.json();
        document.getElementById("totalRevenue").textContent = revenueData.total.toLocaleString("vi-VN") + " VND";
    }
    catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}));
