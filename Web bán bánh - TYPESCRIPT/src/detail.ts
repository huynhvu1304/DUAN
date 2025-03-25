interface Product {
    id: string;
    img: string;
    imgnho: string[];
    price: number;
  }
  
  const showDetail = async (): Promise<void> => {
    const id: string | null = new URLSearchParams(window.location.search).get("id");
    
    if (id) {
      try {
        const response = await fetch(`http://localhost:3000/products?id=${id}`);
        const products: Product[] = await response.json(); // Sử dụng kiểu Product[]
        const product = products[0];
  
        const html = `
          <div class="col6">
              <div class="anh">
                  <img id="mainImg" src="img/${product.img}" alt="Ảnh chính">
              </div>
              ${product.imgnho.map((img: string) => `
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
        const thumbnails = document.querySelectorAll('.thumbnail') as NodeListOf<HTMLImageElement>;
        const mainImg = document.getElementById('mainImg') as HTMLImageElement;
  
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                if (mainImg) {
                    mainImg.src = thumbnail.src; // Change main image
                }
            });
        });
      } catch (error) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', error);
      }
    }
  };
  
  showDetail();
  