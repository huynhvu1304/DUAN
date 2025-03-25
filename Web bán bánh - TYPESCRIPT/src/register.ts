interface User {
    id: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    locked: number;
}

const registerForm = document.getElementById('register-form') as HTMLFormElement;

registerForm.addEventListener('submit', async (e: Event) => {
  e.preventDefault(); // Ngăn trang web tải lại khi submit

  // Lấy dữ liệu từ form
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const confirmPassword = (document.getElementById('nhaplai') as HTMLInputElement).value;

  // Kiểm tra sự khớp của mật khẩu
  if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
  }
   // Lấy danh sách users để kiểm tra email tồn tại
   const response: Response = await fetch("http://localhost:3000/users");
   const users: User[] = await response.json();

   // Kiểm tra email đã tồn tại chưa
   const emailExists: boolean = users.some(user => user.email === email);
   if (emailExists) {
       alert("Email này đã được đăng ký!");
       return;
   }
   // Kiểm tra email hợp lệ
   const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
       alert("Email không hợp lệ!");
       return;
   }
     // Tìm ID lớn nhất, nếu chưa có user nào thì ID = 1
     const newId: number = users.length > 0 ? Math.max(...users.map(user => Number(user.id))) + 1 : 1;
  // Tạo đối tượng người dùng với role mặc định là "user"
  const user: User = {
    id: newId.toString(),
    email,
    password,
    confirmPassword,
    role: "user", // Mặc định là user
    locked: 0
  };

  try {
      // Gửi yêu cầu đăng ký tới json-server
      const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
      });

      if (response.ok) {
          window.location.href = './dangnhap.html'; // Chuyển hướng đến trang đăng nhập
          alert('Đăng ký thành công!');
      } else {
          alert('Đăng ký thất bại. Vui lòng thử lại.');
      }
  } catch (error) {
      console.error('Lỗi kết nối đến server:', error);
      alert('Không thể kết nối đến server.');
  }
});
