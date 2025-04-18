document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");
    

    // Hiện/tắt menu chính
    
    menuToggle.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    // Hiện/tắt menu con khi bấm vào mục cha
    const menuLinks = document.querySelectorAll("li > a");
    const isMobile = () => window.innerWidth <= 1024; // Xác định là mobile
    
    menuLinks.forEach(link => {
        let clickCount = 0; // Đếm số lần bấm
    
        link.addEventListener("click", function (e) {
            let submenu = this.nextElementSibling;
            let href = this.getAttribute("href");
    
            if (submenu && submenu.tagName === "UL") {
                if (isMobile()) { 
                    // Trên điện thoại: Bấm 1 lần mở menu, bấm lần 2 mới chuyển trang
                    clickCount++;
                    if (clickCount === 1) {
                        e.preventDefault(); // Ngăn chuyển trang lần đầu
                        submenu.classList.toggle("active"); // Mở/tắt menu con
                    } else {
                        window.location.href = href; // Chuyển trang lần 2
                    }
                } else { 
                    // Trên laptop: Mở menu và chuyển trang ngay
                    submenu.classList.add("active"); // Giữ menu mở
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                    e.preventDefault(); // Ngăn chặn hành vi mặc định ngay lập tức
                }
            }
        });
    });
    
    
});
