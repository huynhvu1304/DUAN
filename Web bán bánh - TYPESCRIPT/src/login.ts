// Chức năng login
const loginForm = document.getElementById("login-form") as HTMLFormElement;

loginForm.addEventListener("submit", async (e: SubmitEvent): Promise<void> => {
    e.preventDefault(); // Ngăn load lại trang

    // Lấy dữ liệu từ form
    const formData: FormData = new FormData(loginForm);
    const email: string = formData.get("email") as string;
    const password: string = formData.get("password") as string;

    try {
        // Gửi yêu cầu kiểm tra người dùng
        const response: Response = await fetch(
            `http://localhost:3000/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        );

        const users: { email: string; password: string; role: string; locked: number }[] = await response.json();

        // Xử lý kết quả
        if (users.length > 0) {
            const user = users[0]; // Lấy thông tin user đầu tiên
            if (user.locked === 1) {
                alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
                return;
            }
            alert("Đăng nhập thành công");

            // Lưu thông tin vào localStorage
            localStorage.setItem("loggedInEmail", email);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", user.role); // Lưu vai trò

            window.location.href = "./index.html"; // Chuyển hướng về trang chính
        } else {
            alert("Sai email hoặc mật khẩu!");
        }
    } catch (error) {
        console.error("Lỗi kết nối đến server:", error);
        alert("Không thể kết nối đến server.");
    }
});
function sign(){
    window.location.href = "./dangki.html";   
}