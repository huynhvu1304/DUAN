interface Category {
    id: string;
    name: string;
}

interface Product {
    id:  string;
    name: string;
    idcate: number;
    img: string;
    price: number;
    hot: number; 
    description: string;
    quantity: number;
    imgnho: string[]; // Thêm danh sách ảnh nhỏ
}

const getProductIdFromURL = (): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
    
};

const loadCategories = async (selectedId: string): Promise<void> => {
    try {
        const response = await fetch("http://localhost:3000/categories");
        const categories: Category[] = await response.json();
        
        if (!categories.length) {
            alert("Không có danh mục nào!");
            return;
        }

        const categorySelect = document.getElementById("editCategory") as HTMLSelectElement;
        categorySelect.innerHTML = categories
            .map(cat => `<option value="${cat.id}" ${cat.id === selectedId ? "selected" : ""}>${cat.name}</option>`)
            .join("");
    } catch (error) {
        console.error("Lỗi tải danh mục:", error);
    }
};

const loadProductData = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        const product: Product = await response.json();
        
        if (!product) {
            alert("Không tìm thấy sản phẩm!");
            return;
        }

        (document.getElementById("editId") as HTMLInputElement).value = id;
        (document.getElementById("editName") as HTMLInputElement).value = product.name;
        (document.getElementById("editPrice") as HTMLInputElement).value = product.price.toString();
        (document.getElementById("editHot") as HTMLInputElement).checked = product.hot === 1;
        (document.getElementById("editDescription") as HTMLInputElement).value = product.description;
        (document.getElementById("oldImage") as HTMLImageElement).src = product.img ? `../img/${product.img}` : "default.jpg";
        
        for (let i = 0; i < 3; i++) {
            (document.getElementById(`oldImage${i + 1}`) as HTMLImageElement).src = product.imgnho[i] ? `../img/${product.imgnho[i]}` : "default.jpg";
        }
        
        await loadCategories(String(product.idcate)); 

    } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
    }
};

const initEditPage = async (): Promise<void> => {
    const id = getProductIdFromURL();
    if (!id) {
        alert("ID sản phẩm không hợp lệ!");
        return;
    }
    await loadProductData(id); // Bây giờ id là string
};

initEditPage();


const editProduct = async ():  Promise<void> => {
    const id = (document.getElementById("editId") as HTMLInputElement).value.trim(); // Giữ kiểu string
    const name = (document.getElementById("editName") as HTMLInputElement).value.trim();
    const category = parseInt((document.getElementById("editCategory") as HTMLSelectElement).value, 10);
    const fileInput = (document.getElementById("editImage") as HTMLInputElement).files?.[0] || null;
    const price = parseFloat((document.getElementById("editPrice") as HTMLInputElement).value.trim());
    const hot = (document.getElementById("editHot") as HTMLInputElement).checked ? 1 : 0;
    const description = (document.getElementById("editDescription") as HTMLInputElement).value.trim();

    if (!name || isNaN(price) || price <= 0 || !description) {
        alert("Vui lòng điền đầy đủ thông tin hợp lệ!");
        return;
    }

    let image = (document.getElementById("oldImage") as HTMLImageElement).src.split("/").pop() || "default.jpg";
    if (fileInput) {
        const formData = new FormData();
        formData.append("file", fileInput);

        await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        });

        image = fileInput.name;
    }

    const fileInputs = [
        (document.getElementById("editImage1") as HTMLInputElement).files?.[0] || null,
        (document.getElementById("editImage2") as HTMLInputElement).files?.[0] || null,
        (document.getElementById("editImage3") as HTMLInputElement).files?.[0] || null
    ];

    let imgnho: string[] = [];
    for (let i = 0; i < 3; i++) {
        if (fileInputs[i]) {
            const formData = new FormData();
            formData.append("file", fileInputs[i] as File);

            await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData,
            });

            imgnho[i] = fileInputs[i]!.name;
        }
    }

    const updatedProduct: Product = { id, name, idcate: category, img: image, price, hot, description, quantity: 0, imgnho };

    try {
        await fetch(`http://localhost:3000/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct),
        });

        alert("Cập nhật sản phẩm thành công!");
        window.location.href = "product.html";
    } catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
    }
};
