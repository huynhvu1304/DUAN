let all = document.getElementById('allproducts');
const fetchaAllProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/products');
        const data = await response.json();
        data.forEach(product => {
            all.innerHTML += `
                <div class="col1">
                <a href="sanpham.html?id=${product._id}"><img src="http://localhost:3000/img/${product.img}" alt="${product.name}"></a>              
                <h3 class="chu">${product.name}</h3>
                <p class="price">${product.price}</p>
                <div class="buy"><a href="sanpham.html?id=${product._id}">Mua ngay</a></div>
                <div class="giohang"><a href="sanpham.html?id=${product._id}">Thêm vào giỏ</a></div>
            </div>
            `;
        });
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
    }
}

fetchaAllProducts();


let html = document.querySelector('.row');
const fetchaHotProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/products?hot=1');
        const data = await response.json();
        data.forEach(product => {
            html.innerHTML += `
                <div class="col1">
                <a href="sanpham.html?id=${product._id}"><img src="http://localhost:3000/img/${product.img}" alt="${product.name}"></a>              
                <h3 class="chu">${product.name}</h3>
                <p class="price">${product.price}</p>
                <div class="buy"><a href="sanpham.html?id=${product._id}">Mua ngay</a></div>
                <div class="giohang"><a href="sanpham.html?id=${product._id}">Thêm vào giỏ</a></div>
            </div>
            `;      
        });
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
    }
}

fetchaHotProducts();


let html1 = document.getElementById('loadsp1');
const fetchaProduct1 = async (idcate) => {
    try {
        const response = await fetch(`http://localhost:3000/products?categoryId=${idcate}&limit=9`);
        const data = await response.json();
           // Lọc sản phẩm có category.id = "6789d2b79e9cee1fc7851b7b"
      
        
        console.log(data);
        data.forEach(product => {
            html1.innerHTML += `
                <div class="col1">
                <a href="sanpham.html?id=${product._id}"><img src="http://localhost:3000/img/${product.img}" alt="${product.name}"></a>              
                <h3 class="chu">${product.name}</h3>
                <p class="price">${product.price}</p>
                <div class="buy"><a href="sanpham.html?id=${product._id}">Mua ngay</a></div>
                <div class="giohang"><a href="sanpham.html?id=${product._id}">Thêm vào giỏ</a></div>
            </div>
            `;
        });
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
    }
}

fetchaProduct1("6789d2b79e9cee1fc7851b7b");

let html2 = document.getElementById('loadsp2');
const fetchaProduct2 = async (idcate) => {
    try {
        const response = await fetch(`http://localhost:3000/products?categoryId=${idcate}&limit=9`);
        const data = await response.json();
       
        
        console.log(data);
        data.forEach(product => {
            html2.innerHTML += `
                <div class="col1">
                <a href="sanpham.html?id=${product._id}"><img src="http://localhost:3000/img/${product.img}" alt="${product.name}"></a>              
                <h3 class="chu">${product.name}</h3>
                <p class="price">${product.price}</p>
                <div class="buy"><a href="sanpham.html?id=${product._id}">Mua ngay</a></div>
                <div class="giohang"><a href="sanpham.html?id=${product._id}">Thêm vào giỏ</a></div>
            </div>
            `;
        });
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
    }
}

fetchaProduct2('6789d3169e9cee1fc7851b7c');

window.onload = () => {
    const hash = window.location.hash; // Lấy phần sau dấu #
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100); // Đợi trang tải rồi cuộn
        }
    }
};

// 