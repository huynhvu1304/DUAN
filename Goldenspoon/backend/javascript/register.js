document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('nhaplai').value;

    // Kiểm tra mật khẩu nhập lại
    if (password !== confirmPassword) {
        alert("Mật khẩu nhập lại không khớp!");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Đăng kí thất bại');
        }

        console.log('Đăng kí thành công:', data);

        // Chuyển hướng sau khi đăng ký thành công
        window.location.href = 'dangnhap.html';

    } catch (error) {
        alert(error.message);
        console.error('Lỗi đăng kí:', error);
    }
});
