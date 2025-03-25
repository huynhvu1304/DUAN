// Định nghĩa kiểu dữ liệu
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
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

const orderTable = document.getElementById("orderTable") as HTMLTableElement;

const fetchOrders = async (): Promise<void> => {
    try {
        const response = await fetch("http://localhost:3000/orders");
        const orders: Order[] = await response.json();

        orderTable.innerHTML = orders
            .sort((a, b) => b.id - a.id) // Đơn hàng mới nằm trên đầu
            .map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.fullname}</td>
                    <td>${order.phone}</td>
                    <td>${order.address}</td>
                    <td>${calculateTotal(order.cart).toLocaleString()}đ</td>
                    <td>
                        <select class="status-select" data-id="${order.id}">
                            <option value="pending" ${order.status === "pending" ? "selected" : ""}>Chờ xác nhận</option>
                            <option value="shipping" ${order.status === "shipping" ? "selected" : ""}>Đang giao</option>
                            <option value="completed" ${order.status === "completed" ? "selected" : ""}>Hoàn thành</option>
                            <option value="canceled" ${order.status === "canceled" ? "selected" : ""}>Hủy</option>
                        </select>
                    </td>
                    <td>
                        <button class="detail-btn" data-id="${order.id}">Chi tiết</button>
                        <button class="delete-btn" data-id="${order.id}">Xóa</button>
                    </td>
                </tr>
            `)
            .join("");

        attachEventListeners();
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
};

const calculateTotal = (cart: CartItem[]): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

const attachEventListeners = (): void => {
    document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            const id = Number(target.dataset.id);
            const status = target.value as Order["status"];
            updateOrderStatus(id, status);
        });
    });

    document.querySelectorAll(".detail-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number((button as HTMLButtonElement).dataset.id);
            viewOrder(id);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number((button as HTMLButtonElement).dataset.id);
            deleteOrder(id);
        });
    });
};

const updateOrderStatus = async (id: number, status: Order["status"]): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:3000/orders/${id}`);
        const order: Order = await response.json();

        // Cập nhật trạng thái đơn hàng
        const updateResponse = await fetch(`http://localhost:3000/orders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        if (!updateResponse.ok) {
            alert("Lỗi cập nhật trạng thái!");
            return;
        }

        // Nếu đơn hàng hoàn thành, cộng vào doanh thu
        if (status === "completed") {
            const totalOrderValue = calculateTotal(order.cart);

            const revenueResponse = await fetch("http://localhost:3000/revenue");
            const revenueData = await revenueResponse.json();
            const newRevenue = revenueData.total + totalOrderValue;

            await fetch("http://localhost:3000/revenue", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ total: newRevenue }),
            });
        }

        alert("Cập nhật trạng thái thành công!");
        fetchOrders();
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
    }
};


const deleteOrder = async (id: number): Promise<void> => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
        const response = await fetch(`http://localhost:3000/orders/${id}`, { method: "DELETE" });
        if (response.ok) {
            alert("Đã xóa đơn hàng!");
            fetchOrders();
        } else {
            alert("Lỗi xóa đơn hàng!");
        }
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
    }
};

const viewOrder = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:3000/orders/${id}`);
        const order: Order = await response.json();
        alert(`Chi tiết đơn hàng:\nKhách hàng: ${order.fullname}\nEmail: ${order.email}\nĐịa chỉ: ${order.address}\nSĐT: ${order.phone}\nGhi chú: ${order.note}\n\nSản phẩm:\n${order.cart.map(item => `${item.name} - ${item.price.toLocaleString()}đ x ${item.quantity}`).join("\n")}\nTổng tiền: ${calculateTotal(order.cart).toLocaleString()}đ\nTrạng thái: ${order.status}`);
    } catch (error) {
        console.error("Lỗi khi xem chi tiết đơn hàng:", error);
    }
};

document.addEventListener("DOMContentLoaded", fetchOrders);
