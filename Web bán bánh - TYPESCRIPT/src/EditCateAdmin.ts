interface Category {
    id: string;
    name: string;
    img: string;
}

const getCateidFromURL = (): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};

// Load dữ liệu danh mục khi mở trang
document.addEventListener("DOMContentLoaded", async () => {
    const categoryId = getCateidFromURL();
    if (!categoryId) {
        alert("Không tìm thấy danh mục!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/categories/${categoryId}`);
        if (!response.ok) throw new Error("Không tìm thấy danh mục!");

        const category: Category = await response.json();
        
        (document.getElementById("editId") as HTMLInputElement).value = category.id.toString();
        (document.getElementById("editName") as HTMLInputElement).value = category.name;
        (document.getElementById("oldImage") as HTMLImageElement).src = category.img || "";
    } catch (error) {
        alert((error as Error).message);
    }
});

const editCate = async (): Promise<void> => {
    const id = getCateidFromURL();
    const name = (document.getElementById("editName") as HTMLInputElement).value;
    const imageInput = (document.getElementById("editImage") as HTMLInputElement).files?.[0];

    if (!id || !name) {
        alert("Vui lòng nhập tên danh mục!");
        return;
    }

    let imageUrl: string = (document.getElementById("oldImage") as HTMLImageElement).src.split('/').pop() || "";

    if (imageInput) {
        imageUrl = imageInput.name; // Lưu tên file ảnh
    }
    

    const updatedCategory: Category = { id, name, img: imageUrl };

    try {
        const response = await fetch(`http://localhost:3000/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCategory),
        });

        if (!response.ok) throw new Error("Cập nhật thất bại!");

        alert("Cập nhật danh mục thành công!");
        window.location.href = "category.html";
    } catch (error) {
        alert((error as Error).message);
    }
};
