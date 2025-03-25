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
const showHot = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch('http://localhost:3000/products?hot=1&_limit=9')
        .then(response => response.json());
    let htmlProHot = "";
    data.forEach((p) => {
        let formattedPrice = p.price.toLocaleString('vi-VN'); // Định dạng tiền VND
        htmlProHot += `
        <div class="col1">
                <a href="sanpham.html?id=${p.id}"><img src="img/${p.img}" alt="Sản phẩm 1"></a>              
                <h3 class="chu">${p.name}</h3>
                <p class="price">${formattedPrice} VND</p>
                <div class="buy"><a href="sanpham.html?id=${p.id}">Mua ngay</a></div>
                 <div class="giohang"><a href="javascript:void(0)" onclick="addtocart(${p.id}); return false;">Thêm giỏ hàng</a></div>
            </div>`;
    });
    document.getElementById("loadsp").innerHTML = htmlProHot;
});
showHot();
const showbanhkem = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch('http://localhost:3000/products?idcate=2&_limit=6')
        .then(response => response.json());
    let htmlProbanhkem = "";
    data.forEach((p) => {
        let formattedPrice = p.price.toLocaleString('vi-VN'); // Định dạng tiền VND
        htmlProbanhkem += `
        <div class="col1">
                <a href="sanpham.html?id=${p.id}"><img src="img/${p.img}" alt="Sản phẩm 1"></a>              
                <h3 class="chu">${p.name}</h3>
                <p class="price">${formattedPrice} VND</p>
                <div class="buy"><a href="sanpham.html?id=${p.id}">Mua ngay</a></div>
                 <div class="giohang"><a href="javascript:void(0)" onclick="addtocart(${p.id}); return false;">Thêm giỏ hàng</a></div>
            </div>`;
    });
    document.getElementById("loadsp1").innerHTML = htmlProbanhkem;
});
showbanhkem();
const showbanhsinhnhat = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch('http://localhost:3000/products?idcate=1&_limit=6')
        .then(response => response.json());
    let htmlProbanhsinhnhat = "";
    data.forEach((p) => {
        let formattedPrice = p.price.toLocaleString('vi-VN'); // Định dạng tiền VND
        htmlProbanhsinhnhat += `
        <div class="col1">
                <a href="sanpham.html?id=${p.id}"><img src="img/${p.img}" alt="Sản phẩm 1"></a>              
                <h3 class="chu">${p.name}</h3>
                <p class="price">${formattedPrice} VND</p>
                <div class="buy"><a href="sanpham.html?id=${p.id}">Mua ngay</a></div>
                <div class="giohang"><a href="javascript:void(0)" onclick="addtocart(${p.id}); return false;">Thêm giỏ hàng</a></div>
            </div>`;
    });
    document.getElementById("loadsp2").innerHTML = htmlProbanhsinhnhat;
});
showbanhsinhnhat();
document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("loggedInEmail");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole"); // Lấy vai trò
    const userNameElement = document.getElementById("userName");
    const userNameElement1 = document.getElementById("userName1");
    const logoutBtn = document.getElementById("logoutBtn");
    const adminPanel = document.getElementById("adminPanel"); // Panel quản lý
    if (email && isLoggedIn === "true") {
        const userName = getUserNameFromEmail(email);
        if (role === "admin") {
            userNameElement.textContent = `Xin chào, Admin!`;
            adminPanel.style.display = "block"; // Hiện khu vực quản lý
        }
        else {
            userNameElement1.textContent = `Xin chào, ${userName}!`;
            adminPanel.style.display = "none"; // Ẩn khu vực quản lý
        }
        logoutBtn.style.display = "inline-block"; // Hiện nút đăng xuất
    }
    else {
        userNameElement.textContent = "";
        logoutBtn.style.display = "none";
        adminPanel.style.display = "none"; // Ẩn luôn khu vực quản lý
    }
    // Xử lý đăng xuất
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInEmail");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        window.location.href = "index.html";
    });
});
// Hàm lấy tên trước dấu @ từ email
function getUserNameFromEmail(email) {
    return email.split("@")[0];
}
