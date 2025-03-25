interface Category {
    id: string;
    name: string;
    img: string;
}

// Tải danh sách danh mục khi trang mở
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response: Response = await fetch("http://localhost:3000/categories");
        if (!response.ok) throw new Error(`Lỗi tải danh mục: ${response.statusText}`);

        const categories: Category[] = await response.json();
        console.log("Danh sách danh mục:", categories);
    } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
    }
});

const addCategory = async (): Promise<void> => {
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const imageInput = document.getElementById("image") as HTMLInputElement;

    if (!nameInput || !imageInput) {
        console.error("Không tìm thấy input!");
        return;
    }

    const name: string = nameInput.value.trim();
    const file: File | undefined = imageInput.files?.[0];

    if (!name || !file) {
        alert("Vui lòng nhập tên danh mục và chọn ảnh!");
        return;
    }

    try {
        // 🔹 Lấy danh sách categories từ API trước khi tính toán maxId
        const response: Response = await fetch("http://localhost:3000/categories");
        if (!response.ok) throw new Error(`Lỗi tải danh mục: ${response.statusText}`);

        const categories: Category[] = await response.json();

        // 🔹 Xác định ID lớn nhất rồi tăng thêm 1
        const maxId = categories.length > 0 ? Math.max(...categories.map(c => Number(c.id))) : 0;
        const newId = maxId + 1;

        // 🔹 Tạo object danh mục mới
        const newCategory: Category = { id: String(newId), name, img: file.name };

        // 🔹 Gửi yêu cầu POST để thêm danh mục
        const postResponse: Response = await fetch("http://localhost:3000/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCategory),
        });

        if (!postResponse.ok) throw new Error(`Lỗi thêm danh mục: ${postResponse.statusText}`);

        alert("Thêm danh mục thành công!");
        window.location.href = "category.html";
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi!");
    }
};


