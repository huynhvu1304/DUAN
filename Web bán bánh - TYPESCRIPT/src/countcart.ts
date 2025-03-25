// Hàm thêm sản phẩm vào giỏ hàng
const addtocart = async (id: number): Promise<void> => {
    // Lấy số lượng sản phẩm từ input
    let quantityInput = document.getElementById("quantity") as HTMLInputElement;
    let quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

    // Lấy giỏ hàng từ localStorage, nếu không có thì khởi tạo mảng rỗng
    let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let index = cart.findIndex(item => item.id === id);

    if (index >= 0) {
        // Nếu có rồi thì cộng thêm số lượng
        cart[index].quantity += quantity;
    } else {
        // Lấy dữ liệu sản phẩm từ API hoặc danh sách có sẵn
        try {
            let response = await fetch(`http://localhost:3000/products/${id}`);
            let product = await response.json();

            if (!product || !product.name || !product.price) {
                throw new Error("Dữ liệu sản phẩm không hợp lệ!");
            }

            // Thêm sản phẩm mới vào giỏ hàng
            cart.push({ id, quantity, name: product.name, price: product.price });
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
            return; // Thoát nếu có lỗi
        }
    }

    // Cập nhật giỏ hàng vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Thông báo cho người dùng
    alert(`Sản phẩm đã được thêm vào giỏ hàng: ${quantity}`);

    // In giỏ hàng ra console
    console.log(cart);

    // Cập nhật lại số lượng giỏ hàng
    countcart();
};

// Hàm tính toán và cập nhật số lượng sản phẩm trong giỏ hàng
const countcart = (): void => {
    let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // Tính tổng số lượng sản phẩm trong giỏ
    let countcart = cart.reduce((total, item) => total + item.quantity, 0);

    // Cập nhật số lượng sản phẩm trên giao diện
    (document.getElementById("idcart") as HTMLSpanElement).innerText = countcart.toString();
}

// Gọi hàm countcart để hiển thị số lượng giỏ hàng ban đầu
countcart();