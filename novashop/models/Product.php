<?php
// Product.php
function getNewProducts() {
    global $conn;
    $sql = "SELECT * FROM products ORDER BY id DESC LIMIT 8";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $products;
}

function getViewProducts() {
    global $conn;
    $sql = "SELECT * FROM products ORDER BY views DESC LIMIT 4";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $products;
}


function getAllProducts() {
    global $conn;
    $sql = "SELECT products.*, categories.name AS category_name 
            FROM products 
            LEFT JOIN categories ON products.category_id = categories.id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $products;
}
function getProduct($id) {
    global $conn;
    $sql = "SELECT * FROM products WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    return $product;
}


function addProduct($title, $price, $sale, $image, $description, $detail, $category_id) {
    global $conn;
    if (empty($sale) || !is_numeric($sale)) {
        $sale = NULL; // Gán giá trị sale mặc định là NULL nếu không hợp lệ
    }
    $sql = "INSERT INTO products(title, price, sale, image, description, detail, category_id) VALUES(:title, :price, :sale, :image, :description, :detail, :category_id)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':sale', $sale);
    $stmt->bindParam(':image', $image);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':detail', $detail);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->execute();
    return $conn->lastInsertId();
}


function updateProduct($id, $title, $price, $sale, $image, $description, $detail, $category_id, $status) {
    global $conn;
    if (empty($sale) || !is_numeric($sale)) {
    $sale = NULL; // Gán giá trị sale mặc định là 0 nếu không hợp lệ
}
    $sql = "UPDATE products SET title = :title, price = :price, sale = :sale, image = :image, description = :description, detail = :detail, category_id = :category_id, status = :status WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':sale', $sale);
    $stmt->bindParam(':image', $image);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':detail', $detail);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->bindParam(':status', $status, PDO::PARAM_INT);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
}

function deleteProduct($id) {
    global $conn;  
    $sql = "UPDATE products SET status = 0 WHERE id = :id AND status = 1";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
}
function searchProduct($search) {
    global $conn;
    // $sql = "SELECT * FROM products WHERE title LIKE :search";
    $sql = "SELECT 
    products.*, 
    categories.name AS category_name 
    FROM products 
    LEFT JOIN categories ON products.category_id = categories.id 
    WHERE products.title LIKE :search";

    $stmt = $conn->prepare($sql);
    $searchTerm = '%' . $search . '%';
    $stmt->bindParam(':search', $searchTerm);
    $stmt->execute();
    $products = $stmt->fetchAll();
    return $products;
}

// Tổng sản phẩm
function getTotalProducts($conn) {
    $query = "SELECT COUNT(*) as total_products FROM products";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC); 
    return $result ? $result['total_products'] : 0; 
}

// Danh mục các sản phẩm khác
function getYonex() {
    global $conn;
    $sql = "SELECT * FROM products WHERE status = 1 AND category_id = 2 ORDER BY views DESC limit 4 ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $products;
}

function getMizu() {
    global $conn;
    $sql = "SELECT * FROM products WHERE status = 1 AND category_id = 3 ORDER BY views DESC limit 4 ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $products;
}
function getLining() {
    global $conn;
    $sql = "SELECT * FROM products WHERE status = 1 AND category_id = 1 ORDER BY views DESC limit 4 ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $products;
}
function getVictor() {
    global $conn;
    $sql = "SELECT * FROM products WHERE status = 1 AND category_id = 4 ORDER BY views DESC limit 4 ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $products;
}
