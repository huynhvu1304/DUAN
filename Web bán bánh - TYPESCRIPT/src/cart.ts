// Định nghĩa kiểu dữ liệu cho item trong giỏ hàng
interface CartItem {
    name: string;
    price: number;
    id: number;
    quantity: number;
}


interface Product {
    id: string
    name: string;
    img: string;
    price: number;
    quantity: number;
}

let cartproducts: Product[] = [];

const showCart = async (): Promise<void> => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const fetchPromises = cart.map((item) =>
        fetch(`http://localhost:3000/products?id=${item.id}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Lỗi tải sản phẩm ${item.id}`);
                return res.json();
            })
            .then((data) => {
                if (!data.length) throw new Error(`Không tìm thấy sản phẩm ${item.id}`);
                return data[0] as Product;
            })
            .catch((error) => {
                console.error(error);
                return null;
            })
    );
    
    if (cart.length === 0) {
        document.getElementById("cart")!.innerHTML = "Giỏ hàng của bạn trống!";
        document.getElementById("total")!.innerText = "0"; // Cập nhật tổng tiền về 0
        return;
    }
    
    cartproducts = (await Promise.all(fetchPromises)).filter((p) => p !== null);


    let newCart = cartproducts.map((product, index) => ({
        ...product,
        quantity: cart[index]?.quantity || 1,
    }));

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

    document.getElementById("cart")!.innerHTML = innerHTML;
    document.getElementById("total")!.innerText = totalAmount.toLocaleString('vi-VN');

    // Gắn sự kiện onchange để cập nhật số lượng và tổng tiền
    document.querySelectorAll<HTMLInputElement>(".quantity").forEach((input) => {
        input.addEventListener("change", (e) => {
            const target = e.target as HTMLInputElement;
            let newQuantity = parseInt(target.value, 10) || 1;
            if (newQuantity < 1) newQuantity = 1;
            updateQuantity(parseInt(target.dataset.id || "0", 10), newQuantity);
        });
    });

    // Gắn sự kiện click cho nút xóa từng sản phẩm
    document.querySelectorAll<HTMLButtonElement>(".delete").forEach((button) => {
        button.addEventListener("click", () => {
            deleteProduct(parseInt(button.dataset.id || "0", 10));
        });
    });
};

// Cập nhật số lượng sản phẩm
const updateQuantity = (productId: number, newQuantity: number): void => {
    let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item));
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
};

// Xóa sản phẩm khỏi giỏ hàng
const deleteProduct = (productId: number): void => {
    let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart)); 
    showCart();
};

// Xóa tất cả sản phẩm đã chọn
document.getElementById("delete_selected")?.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(".select_product:checked");
    if (checkboxes.length === 0) return alert("Vui lòng chọn sản phẩm để xóa!");

    let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    let selectedIds = Array.from(checkboxes).map((checkbox) => parseInt(checkbox.dataset.id || "0", 10));

    cart = cart.filter((item) => !selectedIds.includes(item.id));
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
});

// Chức năng chọn tất cả sản phẩm
document.getElementById("select_all")?.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    document.querySelectorAll<HTMLInputElement>(".select_product").forEach((checkbox) => {
        checkbox.checked = target.checked;
    });
});

showCart();
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

function redirectToCheckout(): void {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    if (cart.length === 0) {
        alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
    } else {
        window.location.href = "thanhtoan.html"; // Chuyển hướng đến trang thanh toán
    }
}

// Gán sự kiện cho nút
const checkoutButton = document.getElementById("checkoutButton") as HTMLButtonElement;
if (checkoutButton) {
    checkoutButton.addEventListener("click", redirectToCheckout);
}