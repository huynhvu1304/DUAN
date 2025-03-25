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
const showDetail = () => __awaiter(void 0, void 0, void 0, function* () {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
        try {
            const response = yield fetch(`http://localhost:3000/products?id=${id}`);
            const products = yield response.json(); // Sử dụng kiểu Product[]
            const product = products[0];
            const html = `
          <div class="col6">
              <div class="anh">
                  <img id="mainImg" src="img/${product.img}" alt="Ảnh chính">
              </div>
              ${product.imgnho.map((img) => `
                  <div class="col30">
                      <div class="imgg">
                          <img class="thumbnail" src="img/${img}" alt="Ảnh con">
                      </div>
                  </div>
              `).join('')}
          </div>
          <div class="col4">
              <h1>Cannelé Caramel Ice Cream Cake I ⌀16cm</h1>
              <span style="color: rgba(165, 42, 42, 0.627); margin: 20px; font-size: 20px;font-weight: bold;">${product.price.toLocaleString('vi-VN')} vnđ</span>
              <input type='number' id="quantity" value="1">
              <div class="themhang">
                  <button onclick="addtocart(${product.id})">THÊM VÀO GIỎ HÀNG</button>
              </div>
              <div class="muahang">
                  <button type="button">MUA HÀNG</button>
              </div>
              <br>
              <hr>
              <div class="little">
                  <p>SỰ MIÊU TẢ</p>
                  <p>Cannelé ice cream, salted caramel sauce, vanilla parfait, lady fingers, cannelé cake, dulcey chocolate velvet.</p>
                  <p>No artificial flavors</p>
                  <p>Less sweet</p>
                  <p>⌀16cm</p>
                  <hr>
                  <p>VAT sẽ được thêm vào khi thanh toán.</p>
              </div>
          </div>
        `;
            const contentElement = document.getElementById("loadDetail");
            if (contentElement) {
                contentElement.innerHTML = html;
            }
            // Handle thumbnail images
            const thumbnails = document.querySelectorAll('.thumbnail');
            const mainImg = document.getElementById('mainImg');
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', () => {
                    if (mainImg) {
                        mainImg.src = thumbnail.src; // Change main image
                    }
                });
            });
        }
        catch (error) {
            console.error('Lỗi khi tải chi tiết sản phẩm:', error);
        }
    }
});
showDetail();
