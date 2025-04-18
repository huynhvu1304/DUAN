// Đăng nhập
document.getElementById('my-frm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
     
        const data = await response.json();
        console.log("api", data);
        if (!response.ok) {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }

        console.log('Đăng nhập thành công:', data);

      localStorage.setItem('token', data.token);
    localStorage.setItem('email', email);  
    localStorage.setItem('role', data.role)
    if(data.role == "admin"){
        window.location.href = "./admin/dashboard.html";
    }
    if(data.role == "user"){
        window.location.href = "./index.html";
    }
    } catch (error) {
        alert(error.message);
        console.error('Lỗi đăng nhập:', error);
    }
});