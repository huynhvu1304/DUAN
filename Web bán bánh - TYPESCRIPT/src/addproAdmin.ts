interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    idcate: number;
    img: string;
    imgnho: string[]; // Lưu danh sách ảnh nhỏ
    price: number;
    hot: number; 
    description: string;
    quantity: number; // Số lượng sản phẩm
}

// Tải danh mục từ API khi trang mở
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("http://localhost:3000/categories");
    const categories: Category[] = await response.json();
    const categorySelect = document.getElementById("category") as HTMLSelectElement;

    if (categorySelect) {
        categorySelect.innerHTML = categories
            .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
            .join('');
    }
});

const addPro = async (): Promise<void> => {
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const category = (document.getElementById('category') as HTMLSelectElement).value;
    const imageInput = (document.getElementById('image') as HTMLInputElement).files?.[0];
    const image1Input = (document.getElementById('image1') as HTMLInputElement).files?.[0];
    const image2Input = (document.getElementById('image2') as HTMLInputElement).files?.[0];
    const image3Input = (document.getElementById('image3') as HTMLInputElement).files?.[0];
    const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
    const hot = (document.getElementById('hot') as HTMLInputElement).checked ? 1 : 0;;
    const description = (document.getElementById('description') as HTMLInputElement).value;

    if (!name || !category || !price || !description || !imageInput || !image1Input || !image2Input || !image3Input) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Lấy danh sách sản phẩm để xác định ID mới
    const response = await fetch("http://localhost:3000/products");
    const products: Product[] = await response.json();
    const maxId = products.length > 0 ? Math.max(...products.map(p =>Number(p.id) )) : 0;

    // Tạo sản phẩm mới
    const newPro: Product = {
        id: (maxId + 1).toString(), 
        name: name,
        idcate: Number(category),
        img: imageInput.name, // Ảnh chính
        imgnho: [image1Input.name, image2Input.name, image3Input.name], // Ảnh nhỏ
        price: price,
        hot: hot, // Boolean chính xác
        description: description,
        quantity: 0 // Mặc định số lượng là 0
    };

    // Gửi yêu cầu POST lên API
    try {
        const postResponse = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPro)
        });

        if (postResponse.ok) {
            alert("Đã thêm sản phẩm!");
            window.location.href = "product.html";
        } else {
            throw new Error("Thêm sản phẩm thất bại!");
        }
    } catch (error) {
        console.error(error);
        alert("Lỗi khi thêm sản phẩm!");
    }
};

