interface Category {
    id: string;
    name: string;
    img: string;
}

let categories: Category[] = []; 

const fetchData = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Lỗi khi tải dữ liệu từ ${url}`);
    }
    return response.json() as Promise<T>;
};

const showTbody = async (): Promise<void> => {
    try {
        categories = await fetchData<Category[]>('http://localhost:3000/categories');
        renderCategories(categories);
    } catch (error) {
        console.error(error);
    }
};

const renderCategories = (categoriesToRender: Category[]): void => {
    let html = categoriesToRender.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td><img src="../img/${item.img}" alt="Category Image" width="50"></td>
            <td>
                <a href="../category/editcate.html?id=${item.id}"><button>Sửa</button></a>
            <button onclick="deleteCate(${item.id})">Xóa</button>
            </td>
        </tr>
    `).join("");

    const showCateElement = document.getElementById("showCate");
    if (showCateElement) {
        showCateElement.innerHTML = html;
    } else {
        console.error("Không tìm thấy phần tử 'showCate'");
    }
    
    const searchInput = document.getElementById("search") as HTMLInputElement;
    searchInput.addEventListener("input", (event: Event) => {
    const target = event.target as HTMLInputElement;
    const searchTerm: string = target.value.toLowerCase();
    const filteredCategories: Category[] = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm)
    );
    renderCategories(filteredCategories);
});
};
const deleteCate = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:3000/categories/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Lỗi xóa danh mục: ${response.statusText}`);
        }

        // Cập nhật lại danh sách sau khi xóa
        categories = categories.filter(category => String(category.id) !== String(id) );
        renderCategories(categories);

        alert("Xóa danh mục thành công!");
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể xóa danh mục!");
    }
};
// Gọi hàm để tải dữ liệu khi trang tải
showTbody();
