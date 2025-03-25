-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th12 08, 2024 lúc 04:25 PM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `novashop2`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `image` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `image`) VALUES
(1, 'Giày lining', 'Giày cầu lông Lining AYZU019-4.webp'),
(2, 'Giày yonex', 'Giày cầu lông Yonex SHB 510WCR.webp'),
(3, 'Giày Mizuno', 'Giày cầu lông Mizuno Gate Sky 2.webp'),
(4, 'Giày Victor', 'Giày cầu lông Victor Crayon Shinchan A39JRCS.webp');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderdetails`
--

CREATE TABLE `orderdetails` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  `order_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `customer` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `address` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(550) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `sale` int DEFAULT NULL,
  `image` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `views` int NOT NULL DEFAULT '0',
  `detail` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `category_id` int DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `title`, `description`, `price`, `sale`, `image`, `views`, `detail`, `category_id`, `status`) VALUES
(1, 'Giày cầu lông Mizuno Gate Sky Plus 3', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 1900000, 1800000, 'Giày Cầu Lông Mizuno Wave Claw Neo 2.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 3, 1),
(2, 'Giày Cầu Lông Mizuno Wave Claw 3', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 235000, NULL, 'Giày cầu lông Mizuno Gate Sky Plus 3.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 3, 1),
(3, 'Giày cầu lông Mizuno Wave Claw Neo 3', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 15000000, NULL, 'Giày cầu lông Mizuno Wave Claw Neo 3.jpg', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 3, 1),
(4, 'Giày cầu lông Mizuno Wave Fang El 2', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 250000, 200000, 'Giày cầu lông Mizuno Wave Fang El 2.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 3, 1),
(5, 'Giày Cầu Lông Yonex SHB 88 Dial 3', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 2290000, NULL, 'Giày Cầu Lông Yonex SHB 88 Dial 3.webp', 65, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 2, 1),
(6, 'Giày cầu lông Yonex 65Z3 New', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 2950000, NULL, 'Giày cầu lông Yonex 65Z3 New.webp', 36, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 2, 1),
(7, 'Giày cầu lông Yonex Eclipsion Z Men', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 2179000, NULL, 'Giày cầu lông Yonex Eclipsion Z Men.jpg', 234, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 2, 1),
(9, 'Giày cầu lông Lining AYAU007-4', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 2500000, NULL, 'Giày cầu lông Lining AYAU007-4.jpg', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 1, 1),
(10, 'Giày cầu lông Lining AYAU007-3', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 2500000, NULL, 'Giày cầu lông Lining AYAU007-3.jpg', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 1, 1),
(11, 'Giày cầu lông Lining AYAU007-1', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 3000000, NULL, 'Giày cầu lông Lining AYAU007-1.jpg', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 1, 1),
(12, 'Giày cầu lông Lining AYZU015-1', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 3500000, NULL, 'Giày cầu lông Lining AYZU015-1.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 1, 1),
(13, 'Giày cầu lông Lining AYAU007-2', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 900000, NULL, 'Giày cầu lông Lining AYAU007-2.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 1, 1),
(14, 'Giày cầu lông Yonex Comfort Z3 Men', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 3999999, NULL, 'Giày cầu lông Yonex Comfort Z3 Men.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 2, 1),
(15, 'Giày Cầu Lông Yonex SHB 34 LX', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 1670000, NULL, 'Giày Cầu Lông Yonex SHB 34 LX.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 2, 1),
(16, 'Giày cầu lông Yonex SHB-02 LX ', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 2354600, NULL, 'Giày cầu lông Yonex SHB-02 LX.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 2, 1),
(17, 'Giày cầu lông Mizuno Wave Thunderstorm - Đen Trắng Xanh chính hãng', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 1790000, NULL, 'Giày cầu lông Mizuno Wave Thunderstorm - Đen Trắng Xanh chính hãng.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 3, 1),
(18, 'Giày cầu lông Victor Crayon Shinchan A39JRCS 9', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 2345000, 1200000, 'Giày cầu lông Victor Crayon Shinchan A39JRCS 9.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 4, 1),
(19, 'Giày cầu lông Victor Crayon Shinchan A39CS - AF', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 2450000, 1300000, 'Giày cầu lông Victor Crayon Shinchan A39CS - AF.webp', 124, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 4, 1),
(20, 'Giày Cầu Lông Victor A230 AC - Trắng Chính Hãng', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 1390000, NULL, 'Giày cầu lông Victor A230 AC - Trắng.jpg', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 4, 1),
(24, 'Giày cầu lông Victor P9200TDF', 'Giày thể thao là loại giày được thiết kế đặc biệt để mang lại sự thoải mái và hỗ trợ cho người dùng trong các hoạt động thể chất như chạy, tập luyện, hoặc chơi thể thao. Với chất liệu bền và đế cao su, giày thể thao giúp bảo vệ đôi chân, tăng cường hiệu suất vận động và giữ cho người dùng luôn thoải mái.', 1350000, NULL, 'Giày cầu lông Victor P9200TDF.webp', 0, 'Giày thể thao được thiết kế với mục đích hỗ trợ tối đa cho các hoạt động thể chất, từ chạy bộ, bóng rổ, cho đến tập gym. Mỗi đôi giày thể thao thường có phần thân bằng vải hoặc da tổng hợp, mang lại độ bền cao và sự thoáng khí, giúp chân luôn khô ráo. Đế giày được làm từ cao su hoặc vật liệu chống trượt, tạo độ bám tốt và giảm thiểu chấn động khi di chuyển. Các công nghệ tiên tiến như đệm EVA, công nghệ chống sốc, và khả năng thấm hút mồ hôi giúp tăng cường sự thoải mái và bảo vệ trong suốt quá trình sử dụng. Bên cạnh đó, thiết kế ôm chân, hỗ trợ cổ chân và linh hoạt trong các chuyển động, giúp người dùng tự tin hơn khi tham gia vào các môn thể thao.', 4, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `block` tinyint(1) DEFAULT NULL,
  `role_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `phone`, `block`, `role_id`) VALUES
(1, 'admin', 'admin@gmail.com', 'e64b78fc3bc91bcbc7dc232ba8ec59e0', NULL, 0, 1),
(2, 'user1', 'phuc@gmail.com', 'ae0f3d2ec48c9c43f06b755e4ec95820', NULL, 0, NULL),
(3, 'user2', 'vu@gmail.com', 'e64b78fc3bc91bcbc7dc232ba8ec59e0', NULL, 0, NULL),
(6, 'user3', 'trieu@gmail.com', 'ae0f3d2ec48c9c43f06b755e4ec95820', NULL, 0, NULL),
(8, 'Test1', 'huynhquoctrieu58@gmail.com', 'cb7d47e6b8f45a51c7e029080d1b6cac', '0829159778', 0, NULL),
(9, 'vu            ', 'hvu1436@gmail.com', '7c860ef9e93781f63991c57d15da1afc', '0829159778', 0, NULL),
(10, 'vu123', 'hvu1435@gmail.com', '7c860ef9e93781f63991c57d15da1afc', '0829159778', 0, NULL),
(11, 'vu34567890', 'hvu@gmail.com', '7c860ef9e93781f63991c57d15da1afc', '0829159778', 1, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orderdetail_product_product_id` (`product_id`),
  ADD KEY `fk_orderdetail_order_order_id` (`order_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_users_user_id` (`user_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product_category_cate_id_id` (`category_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `fk_orderdetail_order_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `fk_orderdetail_product_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category_cate_id_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
