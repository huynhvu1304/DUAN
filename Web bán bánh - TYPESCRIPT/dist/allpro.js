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
const showallpro = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch('http://localhost:3000/products')
        .then(response => response.json());
    let htmlallpro = "";
    data.forEach((p) => {
        htmlallpro += `
        <div class="col1">
                <a href="sanpham.html?id=${p.id}"><img src="img/${p.img}" alt="Sản phẩm 1"></a>              
                <h3 class="chu">${p.name}</h3>
                <p class="price">${p.price} VND</p>
                <div class="buy"><a href="sanpham.html">Mua ngay</a></div>
                     <div class="giohang"><a href="javascript:void(0)" onclick="addtocart(${p.id}); return false;">Thêm giỏ hàng</a></div>
            </div>`;
    });
    document.getElementById("allproducts").innerHTML = htmlallpro;
});
showallpro();
