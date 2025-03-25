interface CartItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    fullname: string;
    address: string;
    phone: string;
    email: string;
    note: string;
    cart: CartItem[];
    status: "pending" | "shipping" | "completed" | "canceled";
}

document.addEventListener("DOMContentLoaded", () => {
    const orderSummary = document.querySelector(".order-summary") as HTMLElement;
    const cartData: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Dữ liệu giỏ hàng:", cartData);

    if (cartData.length > 0) {
        let total = 0;
        let html = "<h2>ĐƠN HÀNG CỦA BẠN</h2>";

        cartData.forEach((item: CartItem) => {
            html += `<p><strong>${item.name}:</strong> ${item.quantity} x ${item.price.toLocaleString('vi-VN')} đ</p>`;
            total += item.quantity * item.price;
        });

        html += `<div class="total">Tổng: ${total.toLocaleString('vi-VN')} đ</div>`;
        orderSummary.innerHTML = html + orderSummary.innerHTML;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const orderButton = document.getElementById("placeOrder") as HTMLButtonElement;
    if (!orderButton) {
        console.error("Không tìm thấy nút đặt hàng!");
        return;
    }

    orderButton.addEventListener("click", async (event: Event) => {
        event.preventDefault();

        const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart.length === 0) {
            alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi đặt hàng.");
            return;
        }

        const fullnameInput = document.getElementById("fullname") as HTMLInputElement;
        const addressInput = document.getElementById("address") as HTMLInputElement;
        const phoneInput = document.getElementById("phone") as HTMLInputElement;

        if (!fullnameInput.value.trim() || !addressInput.value.trim() || !phoneInput.value.trim()) {
            alert("Bạn chưa nhập thông tin đầy đủ!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/orders");
            const orders: Order[] = await response.json();
            
            const newOrderId = orders.length > 0 ? Math.max(...orders.map(order => order.id)) + 1 : 1;
            const order: Order = {
                id: newOrderId,
                fullname: fullnameInput.value.trim(),
                address: addressInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: (document.getElementById("email") as HTMLInputElement)?.value.trim() || "",
                note: (document.getElementById("note") as HTMLTextAreaElement)?.value.trim() || "",
                cart: cart,
                status: "pending" 
            };
            

            console.log("Dữ liệu gửi đi:", order);

            const postResponse = await fetch("http://localhost:3000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...order, id: newOrderId.toString() })
            });

            if (postResponse.ok) {
                window.location.href = "index.html";
                alert("Đơn hàng đã được đặt thành công!");
                localStorage.removeItem("cart");
                
            } else {
                throw new Error("Không thể đặt hàng");
            }
        } catch (error) {
            console.error("Lỗi khi gửi đơn hàng:", error);
            alert("Có lỗi xảy ra khi đặt hàng, vui lòng thử lại!");
        }
    });
});
