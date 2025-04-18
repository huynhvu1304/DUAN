let html = document.getElementById('loadDetail');
const fetchData = async() => {
    let id = new URLSearchParams(window.location.search).get('id');
    console.log(id);
    const product = await fetch (`http://localhost:3000/products/${id}`)
    .then(response => response.json());
    console.log(product);
    html.innerHTML = `
        <div class="col6" >
          <div class="anh">
            <img id="mainImage" src="http://localhost:3000/img/${product.img}" alt="">
        </div>

        <div class="col30">
            <div class="imgg">
                <img src="http://localhost:3000/img/${product.imgnho[0]}" alt="" onclick="changeImage('${product.imgnho[0]}')">
            </div>
        </div>
        <div class="col30">
            <div class="imgg">
                <img src="http://localhost:3000/img/${product.imgnho[1]}" alt="" onclick="changeImage('${product.imgnho[1]}')">
            </div>
        </div>
        <div class="col30">
            <div class="imgg">
                <img src="http://localhost:3000/img/${product.imgnho[2]}" alt="" onclick="changeImage('${product.imgnho[2]}')">
            </div>
        </div>

           
        </div>

        <div class="col4" >
            <h1>${product.name}</h1>
            <span style="color: rgba(165, 42, 42, 0.627); margin: 20px; font-size: 20px;">${product.price}đ</span>
              <input type='number' id="quantity" value="1">
          
            <div class="themhang">
                <button type="button">THÊM VÀO GIỎ HÀNG</button>
            </div>
            <div class="muahang">
                <button type="button">MUA HÀNG</button>
            </div>
            <br>
            <hr>
            <div class="little">
            <p>SỰ MIÊU TẢ</p>
            <P>${product.description}</P>
                <hr>
            <p>VAT sẽ được thêm vào khi thanh toán.</p>
        </div>
    `;
}

fetchData();

function changeImage(imgSrc) {
    document.getElementById('mainImage').src = `http://localhost:3000/img/${imgSrc}`;
}
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
