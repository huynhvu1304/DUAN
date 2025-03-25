document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");
    

    // Hiện/tắt menu chính
    
    menuToggle.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
      // Tắt menu khi bấm ở ngoài menu
      document.addEventListener("click", function (e) {
        if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.classList.remove("active"); // Tắt menu nếu bấm ở ngoài
        }
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
                    }, 100);
                    e.preventDefault(); // Ngăn chặn hành vi mặc định ngay lập tức
                }
            }
        });
    });
    
    
});
window.onload = () => {
    const hash = window.location.hash; // Lấy phần sau dấu #
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100); // Đợi trang tải rồi cuộn
        }
    }
};

