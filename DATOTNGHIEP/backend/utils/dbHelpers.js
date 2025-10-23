const Product = require('../models/productModel');
const Variant = require('../models/variantModel');
const Brand = require('../models/brandModel'); 
const Category = require('../models/categoryModel');
const FlashSale = require('../models/flashsaleModel'); 
function generateProductUrl(productId) {
    return `${process.env.CLIENT_URL}/detail/${productId}`;
}

// ----------------------
// Helper: Vietnamese normalization and color synonyms
// ----------------------
function normalizeVietnamese(input) {
  if (!input) return '';
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getColorSynonyms(rawQuery) {
    const q = normalizeVietnamese(rawQuery);
    // Base synonym map (extendable)
    const synonyms = [
        ['xanh nuoc bien', 'xanh duong', 'xanh bien', 'xanh blue', 'blue', 'xanh', 'navy', 'xanh navy'],
        ['xanh la', 'xanh luc', 'green', 'xanh'],
        ['do', 'red'],
        ['den', 'black'],
        ['trang', 'white'],
        ['vang', 'vang dong', 'gold', 'yellow'],
        ['cam', 'orange'],
        ['tim', 'purple'],
        ['hong', 'pink']
    ];
    // If exact group matched, return that set; else fallback to tokens and the original
    for (const group of synonyms) {
        if (group.includes(q)) {
            return Array.from(new Set(group));
        }
    }
    // Fallback: include original plus any single-word broadenings like dropping trailing words
    const tokens = q.split(/\s+/).filter(Boolean);
    const broadened = new Set([q]);
    if (tokens.length > 1) {
        // Keep the most salient first token, often color family (e.g., 'xanh')
        broadened.add(tokens[0]);
    }
    return Array.from(broadened);
}

function buildRegexesForColors(rawQuery) {
    const terms = getColorSynonyms(rawQuery);
    // Create forgiving regexes that allow hyphens/whitespace between tokens
    return terms.map(t => {
        const pattern = t
            .split(/\s+/)
            .filter(Boolean)
            .map(tok => tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('[\\s-_/]*');
        return new RegExp(pattern, 'i');
    });
}

// ----------------------
// Helper: Infer category (e.g., 'giày', 'vợt', 'áo', 'quần', 'trang phục') from free text
// ----------------------
async function inferCategoryFromText(freeText) {
    const text = normalizeVietnamese(freeText || '');
    if (!text) return null;

    const tokens = new Set(text.split(/\s+/).filter(Boolean));

    // Heuristic token groups that map to category search keywords
    const categoryHints = [
        { keys: ['giay', 'giaythethao', 'dep'], query: 'giày' },
        { keys: ['vot', 'vot cau long', 'raket', 'votcau'], query: 'vợt' },
    ];

    for (const hint of categoryHints) {
        if (hint.keys.some(k => tokens.has(k))) {
            // Find the best matching category in DB using text search first, then regex as fallback
            let category = await Category.findOne({ $text: { $search: hint.query, $diacriticSensitive: false } });
            if (!category) {
                category = await Category.findOne({ name: { $regex: hint.query, $options: 'i' } });
            }
            if (category) return category._id;
        }
    }
    return null;
}
function parsePriceFromText(input) {
  if (!input) return null;

  let text = String(input).toLowerCase().replace(/\s+/g, '');

  // Nếu là số thuần (VD: 1000000)
  if (/^\d+$/.test(text)) {
    return parseInt(text, 10);
  }

  // Xử lý đơn vị "k", "ngàn", "nghìn"
  if (text.match(/k|ngan|ngàn|nghìn/)) {
    let num = parseFloat(text.replace(/k|ngan|ngàn|nghìn/g, ''));
    return Math.round(num * 1000);
  }

  // Xử lý "tr", "trieu", "triệu"
  if (text.match(/trieu|triệu|tr/)) {
    let num = parseFloat(text.replace(/trieu|triệu|tr/g, ''));
    return Math.round(num * 1000000);
  }

  // Xử lý "m" (million = triệu)
  if (text.endsWith('m')) {
    let num = parseFloat(text.replace('m', ''));
    return Math.round(num * 1000000);
  }

  // Nếu người dùng lỡ viết kiểu "500000k" (thừa đơn vị)
  if (/^\d+k$/.test(text)) {
    let num = parseFloat(text.replace('k', ''));
    if (num > 100000) {
      // Giả sử họ muốn viết "500k" nhưng gõ nhầm "500000k"
      return Math.round(num); 
    }
    return Math.round(num * 1000);
  }

  // Nếu user viết số lẻ "2.5tr" hoặc "2.5m"
  if (/^\d+(\.\d+)?$/.test(text)) {
    return Math.round(parseFloat(text));
  }

  return null;
}

async function getProductInfoForChatbot(
  productNameQuery,
  productCategoryQuery = null,
  minPrice = 0,
  maxPrice = Infinity,
  priceSort = null,
  color = null,
  size = null,
  brandNameQuery = null,
  playStyle = null
) {
  try {
    let productQuery = { status: 'active' };

    let categoryId = null;
    if (productCategoryQuery) {
      let category = await Category.findOne({
        name: { $regex: productCategoryQuery, $options: 'i' },
      });
      if (!category) {
        const categories = await Category.find({
          $text: { $search: productCategoryQuery, $diacriticSensitive: false },
        });
        category = categories && categories.length > 0 ? categories[0] : null;
      }
      if (category) {
        categoryId = category._id;
        productQuery.categoryId = categoryId;
      } else {
        return null;
      }
    } else if (!productCategoryQuery && productNameQuery) {
      const inferred = await inferCategoryFromText(productNameQuery);
      if (inferred) {
        categoryId = inferred;
        productQuery.categoryId = categoryId;
      }
    }

    if (productNameQuery) {
      productQuery.$text = {
        $search: productNameQuery,
        $diacriticSensitive: false,
      };
    }

    if (brandNameQuery) {
      let brand = await Brand.findOne({
        name: { $regex: brandNameQuery, $options: 'i' },
      });
      if (!brand) {
        const brands = await Brand.find({
          $text: { $search: brandNameQuery, $diacriticSensitive: false },
        });
        brand = brands && brands.length > 0 ? brands[0] : null;
      }
      if (brand) {
        productQuery.brand = brand._id;
      }
    }

    let products = await Product.find(productQuery)
      .sort(productQuery.$text ? { score: { $meta: 'textScore' } } : {})
      .populate('categoryId')
      .populate('brand')
      .lean();

    if ((!products || products.length === 0) && productNameQuery) {
      const fallbackQuery = { ...productQuery };
      delete fallbackQuery.$text;
      fallbackQuery.name = { $regex: productNameQuery, $options: 'i' };
      products = await Product.find(fallbackQuery)
        .populate('categoryId')
        .populate('brand')
        .lean();
    }

    if (!products || products.length === 0) {
      return null;
    }

    const productIds = products.map((p) => p._id);
    let variantFilter = { productID: { $in: productIds } };
    let colorRegexes = null;
    if (color) {
      colorRegexes = buildRegexesForColors(color);
      variantFilter.$or = colorRegexes.map((rx) => ({
        color: { $regex: rx },
      }));
    }
    if (size) {
      variantFilter.size = { $regex: size, $options: 'i' };
    }

    if (color && !productNameQuery && !brandNameQuery && !categoryId) {
      return null;
    }

    let filteredVariants = await Variant.find(variantFilter).select(
      'productID cost_price sale_price color size'
    );

    if (color && filteredVariants.length === 0) {
      const fallbackVariants = await Variant.find({
        productID: { $in: productIds },
      }).select('productID cost_price sale_price color size');
      const normalizedQueryTerms = getColorSynonyms(color).map(
        normalizeVietnamese
      );
      filteredVariants = fallbackVariants.filter((v) => {
        const nv = normalizeVietnamese(v.color || '');
        return normalizedQueryTerms.some((term) => nv.includes(term));
      });
    }

    products = products.map((p) => {
      p.variants = filteredVariants.filter((v) => v.productID.equals(p._id));
      if (p.variants.length > 0) {
        const prices = p.variants.map((v) => v.sale_price || v.cost_price);
        p.minPriceCalculated = Math.min(...prices);
        p.maxPriceCalculated = Math.max(...prices);
        p.avgPriceCalculated =
          prices.reduce((sum, price) => sum + price, 0) / prices.length;
      } else {
        p.minPriceCalculated = Infinity;
        p.maxPriceCalculated = 0;
        p.avgPriceCalculated = 0;
      }
      return p;
    });

    products = products.filter(
      (p) =>
        p.variants.length > 0 &&
        p.minPriceCalculated <= maxPrice &&
        p.maxPriceCalculated >= minPrice
    );

    if (products.length === 0) {
      return null;
    }

    if (productQuery.$text) {
      products.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    if (priceSort === 'highest') {
      products.sort((a, b) => b.maxPriceCalculated - a.maxPriceCalculated);
    } else if (priceSort === 'lowest') {
      products.sort((a, b) => a.minPriceCalculated - b.minPriceCalculated);
    } else if (priceSort === 'median') {
      products.sort((a, b) => a.avgPriceCalculated - b.avgPriceCalculated);
      const midIndex = Math.floor(products.length / 2);
      products = products.slice(
        Math.max(0, midIndex - 1),
        Math.min(products.length, midIndex + 1)
      );
    }

    const productsToShow = products.slice(0, 3);

    let productDetails = [];
    for (const product of productsToShow) {
      let priceInfo = 'Giá: Liên hệ';
      if (product.variants && product.variants.length > 0) {
        const minPriceProduct = product.minPriceCalculated;
        const maxPriceProduct = product.maxPriceCalculated;

        if (minPriceProduct === maxPriceProduct) {
          priceInfo = `Giá: ${minPriceProduct.toLocaleString('vi-VN')} VNĐ`;
        } else {
          priceInfo = `Giá từ: ${minPriceProduct.toLocaleString(
            'vi-VN'
          )} VNĐ đến ${maxPriceProduct.toLocaleString('vi-VN')} VNĐ`;
        }
      }
      const productUrl = generateProductUrl(product._id);
      const categoryName = product.categoryId ? product.categoryId.name : 'N/A';
      const brandName = product.brand ? product.brand.name : 'N/A';
      const productPlayStyle = product.playStyle
        ? `Lối chơi: ${product.playStyle}`
        : '';

      const availableColors = [...new Set(product.variants.map((v) => v.color))].join(', ');
      const availableSizes = [...new Set(product.variants.map((v) => v.size))].join(', ');

      productDetails.push(
        `- **${product.name}** (${categoryName}, Thương hiệu: ${brandName})\n  ${priceInfo}\n  ${productPlayStyle}\n  Màu sắc có sẵn: ${availableColors}\n  Kích cỡ có sẵn: ${availableSizes}\n  [**Xem chi tiết**](${productUrl})`
      );
    }

    if (productDetails.length > 0) {
      return `Đây là thông tin về các sản phẩm bạn có thể quan tâm:\n${productDetails.join(
        '\n\n'
      )}`;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      'Lỗi khi lấy thông tin sản phẩm cho chatbot (dbHelpers):',
      error
    );
    return null;
  }
}


/**
 * Generic search across products, brands, and categories.
 * Performs diacritic-insensitive, token-based search, with top N results.
 * @param {string} query
 * @param {number} limit
 */
async function searchAcrossEntities(query, limit = 5) {
    try {
        const [products, brands, categories] = await Promise.all([
            Product.find({ $text: { $search: query, $diacriticSensitive: false } }, { score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .lean(),
            Brand.find({ $text: { $search: query, $diacriticSensitive: false } }, { score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .lean(),
            Category.find({ $text: { $search: query, $diacriticSensitive: false } }, { score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .lean(),
        ]);

        return {
            products: (products || []).map(p => ({ id: p._id, name: p.name })),
            brands: (brands || []).map(b => ({ id: b._id, name: b.name })),
            categories: (categories || []).map(c => ({ id: c._id, name: c.name })),
        };
    } catch (error) {
        console.error('Lỗi khi tìm kiếm tổng hợp (dbHelpers):', error);
        return { products: [], brands: [], categories: [] };
    }
}
/**
 * 
 * @param {string} productTypeQuery 
 * @param {string} colorQuery 
 * @returns {Promise<string|null>} 
 */
async function getProductInfoForChatbotByColor(productTypeQuery, colorQuery) {
    try {
        let productQuery = { status: 'active' };
        if (productTypeQuery) {
            let category = await Category.findOne({ name: { $regex: productTypeQuery, $options: 'i' } }).lean();
            if (!category) {
                const categories = await Category.find({ $text: { $search: productTypeQuery, $diacriticSensitive: false } }).lean();
                category = categories && categories.length > 0 ? categories[0] : null;
            }
            if (!category) {
                // If user provided a specific type but we can't resolve, return empty to avoid cross-category leakage
                return null;
            }
            productQuery.categoryId = category._id;
        }

      
        const colorRegexes = buildRegexesForColors(colorQuery);
        let variantsWithColor = await Variant.find({ $or: colorRegexes.map(rx => ({ color: { $regex: rx } })) }).select('productID color');
        if (variantsWithColor.length === 0) {
            // Fallback: fetch a small set and filter in-memory with normalization
            const maybeVariants = await Variant.find({}).select('productID color');
            const normalizedTerms = getColorSynonyms(colorQuery).map(normalizeVietnamese);
            variantsWithColor = maybeVariants.filter(v => {
                const nv = normalizeVietnamese(v.color || '');
                return normalizedTerms.some(term => nv.includes(term));
            });
        }
        if (variantsWithColor.length === 0) {
            return null;
        }

        const productIdsWithColor = variantsWithColor.map(v => v.productID);

        let products = await Product.find({ 
            ...productQuery, 
            _id: { $in: productIdsWithColor }
        })
        .populate('categoryId')
        .populate('brand')
        .lean();

        if (!products || products.length === 0) {
            return null;
        }

      
        let allVariantsForProducts = await Variant.find({ 
            productID: { $in: products.map(p => p._id) },
            $or: colorRegexes.map(rx => ({ color: { $regex: rx } }))
        }).select('productID cost_price sale_price color');
        if (allVariantsForProducts.length === 0) {
            const normalizedTerms = getColorSynonyms(colorQuery).map(normalizeVietnamese);
            const allCandidates = await Variant.find({ productID: { $in: products.map(p => p._id) } }).select('productID cost_price sale_price color');
            allVariantsForProducts = allCandidates.filter(v => {
                const nv = normalizeVietnamese(v.color || '');
                return normalizedTerms.some(term => nv.includes(term));
            });
        }

        products = products.map(p => {
            p.variants = allVariantsForProducts.filter(v => v.productID.equals(p._id));
            if (p.variants.length > 0) {
                const prices = p.variants.map(v => v.sale_price || v.cost_price);
                p.minPrice = Math.min(...prices);
                p.maxPrice = Math.max(...prices);
            } else {
                p.minPrice = Infinity;
                p.maxPrice = 0;
            }
            return p;
        }).filter(p => p.variants.length > 0);

        const productsToShow = products.slice(0, 2); 

        if (productsToShow.length === 0) {
            return null;
        }

        const productDetails = productsToShow.map(product => {
            let priceInfo = "Giá: Liên hệ";
            if (product.variants && product.variants.length > 0) {
                const prices = product.variants.map(v => v.sale_price || v.cost_price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);

                if (min === max) {
                    priceInfo = `Giá: ${min.toLocaleString('vi-VN')} VNĐ`;
                } else {
                    priceInfo = `Giá từ: ${min.toLocaleString('vi-VN')} VNĐ đến ${max.toLocaleString('vi-VN')} VNĐ`;
                }
            }
            const productUrl = generateProductUrl(product._id);
            return `- **${product.name}** (Màu: ${colorQuery})\n  ${priceInfo}\n  [<span style="color: #10B981; font-weight: bold;">Xem chi tiết</span>](${productUrl})`;
        }).join('\n\n'); 

        return `Đây là các sản phẩm ${productTypeQuery ? productTypeQuery + ' ' : ''}màu "${colorQuery}" mà bạn có thể quan tâm:\n${productDetails}`;

    } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm theo màu sắc (dbHelpers):', error);
        return null;
    }
}

/**
 *
 * @returns {Promise<string>} 
 */
async function getFeaturedProductsForChatbot() {
    try {
        const products = await Product.find({ status: 'active' })
                                        .sort({ purchases: -1, createdAt: -1 }) 
                                        .limit(5) 
                                        .populate('brand')
                                        .lean();

        if (products.length === 0) {
            return 'Hiện tại không có sản phẩm nổi bật nào.';
        }

        const productList = products.map(p => {
            const productUrl = generateProductUrl(p._id);
            return `- **${p.name}** (Thương hiệu: ${p.brand ? p.brand.name : 'N/A'})\n  [<span style="color: #10B981; font-weight: bold;">Xem chi tiết</span>](${productUrl})`;
        }).join('\n');
        
        return `Các sản phẩm nổi bật của chúng tôi:\n${productList}`;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm nổi bật (dbHelpers):', error);
        return 'Không thể lấy thông tin sản phẩm nổi bật vào lúc này.';
    }
}

/**
 * Lấy danh sách các sản phẩm đang diễn ra trong chương trình Flash Sale.
 * @returns {Promise<Array|null>} Mảng các sản phẩm Flash Sale hoặc null nếu không có.
 */
async function getFlashSaleProductsForChatbot() {
    try {
        const now = new Date();
        // Tìm các flash sale đang diễn ra
        const activeFlashSales = await FlashSale.find({
            start_time: { $lte: now },
            end_time: { $gte: now },
            status: 'Đang diễn ra' // Đảm bảo trạng thái là 'Đang diễn ra'
        })
    .populate({
  path: 'products.product_id',
  model: 'products',
  select: 'name description images_main'
})
.populate({
  path: 'products.variant_id',
  model: 'variants',
  select: 'color size cost_price sale_price'
})
        .lean();

        if (!activeFlashSales || activeFlashSales.length === 0) {
            return null; // Không có flash sale đang diễn ra
        }

        const flashSaleDetails = [];

        for (const fs of activeFlashSales) {
            const discount = fs.discount_value || 0;

            for (const item of fs.products) {
                // Kiểm tra xem sản phẩm có tồn tại và còn hàng không
                if (item.product_id && item.quantity > 0) {
                    const originalPrice = item.product_id.cost_price || 0;
                    const salePrice = Math.round(originalPrice * (1 - discount / 100));
                    const basePrice = item.variant_id?.sale_price ?? item.variant_id?.cost_price ?? 0;
                    const productUrl = generateProductUrl(item.product_id._id);
                    const productName = item.product_id.name;
                    const productDescription = item.product_id.description;
                    const imageUrl = item.product_id.images && item.product_id.images.length > 0 ? item.product_id.images[0] : 'Không có hình ảnh'; // Lấy hình ảnh đầu tiên
                    const variantInfo = item.variant_id ? `(Màu: ${item.variant_id.color || 'N/A'}, Size: ${item.variant_id.size || 'N/A'})` : '';

                    flashSaleDetails.push({
                        name: productName,
                        variant: variantInfo,
                        originalPrice: originalPrice,
                        flashSalePrice: salePrice,
                        discount: discount,
                        remainingQuantity: item.quantity,
                        description: productDescription,
                        productUrl: productUrl,
                        imageUrl: imageUrl // Thêm URL hình ảnh vào đây
                    });
                }
            }
        }

        // Sắp xếp các sản phẩm flash sale nếu cần (ví dụ: theo tên, hoặc theo thời gian kết thúc)
        // flashSaleDetails.sort((a, b) => a.name.localeCompare(b.name));

        return flashSaleDetails;

    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm Flash Sale cho chatbot:', error);
        return null;
    }
}
module.exports = {
    getProductInfoForChatbot,
    getProductInfoForChatbotByColor, 
    getFeaturedProductsForChatbot,
    getFlashSaleProductsForChatbot,
    searchAcrossEntities
};