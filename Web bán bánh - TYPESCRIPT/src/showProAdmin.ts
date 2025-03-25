interface Product {
    id: string;
    name: string;
    price: number;
    idcate: number;
    img: string;
    hot: number; 
    description: string;
    quantity: number;
    imgnho: string[];
}

interface Category {
    id: string;
    name: string;
}

let products: Product[] = [];  
let Cate: Category[] = []; 

const Fdata = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Lỗi khi tải dữ liệu từ ${url}`);
    }
    const data = await response.json();
    
    // Nếu dữ liệu là danh sách sản phẩm, chuyển đổi `idcate` về number
    if (Array.isArray(data)) {
        return data.map(item => ({
            ...item,
            id: Number(item.id),
            idcate: Number(item.idcate),
        })) as T;
    }
    
    return data as T;
};


const showBodypro = async (): Promise<void> => {
    try {
        products = await Fdata<Product[]>('http://localhost:3000/products');
        Cate = await Fdata<Category[]>('http://localhost:3000/categories');
        renderProducts(products);
        console.log(products);
    } catch (error) {
        console.error(error);
    }
};

// Hàm xóa sản phẩm khỏi JSON Server
const deletePro = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Lỗi xóa sản phẩm: ${response.statusText}`);
        }

        // Cập nhật lại danh sách sau khi xóa
        products = products.filter(product => String(product.id) !== String(id) );
        renderProducts(products);

        alert("Xóa sản phẩm thành công!");
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể xóa sản phẩm!");
    }
};

const renderProducts = (productsToRender: Product[]): void => {
    let html = productsToRender.map((item, index) => {
        const category = Cate.find(c => Number(c.id) === item.idcate);

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${category ? category.name : "Không xác định"}</td>
                <td><img src="../img/${item.img}" alt="Product Image" width="50"></td>
                <td><input type="checkbox" ${item.hot ? "checked" : ""} ></td>
                <td>${item.description}</td>
                <td>
                    <a href="../product/editpro.html?id=${item.id}"><button>Sửa</button></a>
                    <button onclick="deletePro(${item.id})">Xóa</button>
                </td>
            </tr>
        `;
    }).join("");

    const showProElement = document.getElementById("showPro");
    if (showProElement) {
        showProElement.innerHTML = html;
    } else {
        console.error("Không tìm thấy phần tử 'showPro'");
    }


    const searchInput = document.getElementById("search") as HTMLInputElement;
    searchInput.addEventListener("input", (event: Event) => {
    const target = event.target as HTMLInputElement;
    const searchTerm: string = target.value.toLowerCase();
    const filteredProducts: Product[] = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
});

};

// Gọi hàm để tải dữ liệu khi trang tải
showBodypro();

