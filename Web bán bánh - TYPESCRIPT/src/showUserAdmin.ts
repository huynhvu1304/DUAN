interface User {
    id: string;
    email: string;
    role: string;
    locked: number;
}

// Hàm tải danh sách người dùng
const loadUsers = async (): Promise<void> => {
    try {
        const response: Response = await fetch("http://localhost:3000/users");
        const users: User[] = await response.json();

        const tableBody: HTMLElement | null = document.getElementById("showUsers");
        if (!tableBody) return;

        tableBody.innerHTML = ""; // Xóa nội dung cũ

        users.forEach((user: User, index: number) => {
            const row: HTMLTableRowElement = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <input type="checkbox" id="lock-${user.id}" ${user.locked ? "checked" : ""}>
                </td>
            `;

            // Thêm sự kiện cho checkbox khóa/mở khóa
            const checkbox: HTMLInputElement | null = row.querySelector(`#lock-${user.id}`);
            if (checkbox) {
                checkbox.addEventListener("change", () => toggleLock(user.id, checkbox.checked));
            }

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
    }
};

// Hàm khóa/mở khóa tài khoản
const toggleLock = async (id: string, isLocked: boolean): Promise<void> => {
    try {
        const response: Response = await fetch(`http://localhost:3000/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locked: isLocked ? 1 : 0 })
        });

        if (response.ok) {
            alert(isLocked ? "Tài khoản đã bị khóa!" : "Tài khoản đã mở khóa!");
        } else {
            alert("Cập nhật trạng thái thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái tài khoản:", error);
    }
};

// Khi DOM load xong, tải danh sách users
document.addEventListener("DOMContentLoaded", loadUsers);
