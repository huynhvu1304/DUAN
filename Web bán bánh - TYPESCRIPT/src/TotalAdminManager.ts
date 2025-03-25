interface Product {
    id: string;
    name: string;
    price: number;
    sold?: number;
}

interface Category {
    id: string;
    name: string;
}

interface User {
    email: string;
    password: string;
    confirmPassword: string;
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const productResponse = await fetch("http://localhost:3000/products");
        const products: Product[] = await productResponse.json();
        document.getElementById("totalProducts")!.textContent = products.length.toString();

        const categoryResponse = await fetch("http://localhost:3000/categories");
        const categories: Category[] = await categoryResponse.json();
        document.getElementById("totalCategories")!.textContent = categories.length.toString();

        const userResponse = await fetch("http://localhost:3000/users");
        const users: User[] = await userResponse.json();
        document.getElementById("totalUsers")!.textContent = users.length.toString();

        // 🆕 Lấy doanh thu từ JSON Server
        const revenueResponse = await fetch("http://localhost:3000/revenue");
        const revenueData = await revenueResponse.json();
        document.getElementById("totalRevenue")!.textContent = revenueData.total.toLocaleString("vi-VN") + " VND";

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }   
});
