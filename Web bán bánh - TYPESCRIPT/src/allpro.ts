interface allpro {
    id: number; 
    name: string; 
    price: number; 
    img: string
}
const showallpro = async (): Promise<void> => {
    const data: allpro[] = 
        await fetch('http://localhost:3000/products')
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

    document.getElementById("allproducts")!.innerHTML = htmlallpro;
};

showallpro();   