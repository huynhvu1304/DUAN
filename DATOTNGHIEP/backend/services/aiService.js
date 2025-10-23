const fetch = require('node-fetch');
const dbHelpers = require('../utils/dbHelpers'); 


const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "gpt-3.5-turbo"; 
// Đặt một giá trị max_tokens mặc định an toàn hơn
const OPENROUTER_MAX_TOKENS = parseInt(process.env.OPENROUTER_MAX_TOKENS || '1000', 10); // Ví dụ: 1500 tokens

const sessions = new Map();

const tools = [
    {
        type: "function",
        function: {
            name: "getProductInfoForChatbot",
            description: "Tìm kiếm thông tin sản phẩm cầu lông trong cửa hàng theo tên, danh mục, giá, màu sắc, kích cỡ, thương hiệu hoặc lối chơi.",
            parameters: {
                type: "object",
                properties: {
                    productName: {
                        type: "string",
                        description: "Tên sản phẩm hoặc từ khóa tìm kiếm (ví dụ: 'Astrox 88D')."
                    },
                    category: {
                        type: "string",
                        enum: ["vợt", "giày", "quả cầu", "trang phục"],
                        description: "Loại sản phẩm (ví dụ: 'vợt', 'giày')."
                    },
                    minPrice: {
                        type: "number",
                        description: "Giá tối thiểu của sản phẩm (VNĐ)."
                    },
                    maxPrice: {
                        type: "number",
                        description: "Giá tối đa của sản phẩm (VNĐ)."
                    },
                    priceSort: {
                        type: "string",
                        enum: ["highest", "lowest", "median"],
                        description: "Cách sắp xếp sản phẩm theo giá ('highest', 'lowest', 'median')."
                    },
                    color: {
                        type: "string",
                        description: "Màu sắc của sản phẩm (ví dụ: 'xanh', 'đỏ', 'đen')."
                    },
                    size: {
                        type: "string",
                        description: "Kích cỡ của sản phẩm (ví dụ: '3U', '26.5cm', 'L')."
                    },
                    brand: {
                        type: "string",
                        description: "Thương hiệu của sản phẩm (ví dụ: 'Kumpoo', 'Yonex', 'Lining')."
                    },
                    playStyle: {
                        type: "string",
                        enum: ["tấn công", "phòng thủ", "cân bằng", "linh hoạt"],
                        description: "Lối chơi mà sản phẩm (đặc biệt là vợt) phù hợp (ví dụ: 'tấn công', 'phòng thủ')."
                    }
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "getFeaturedProductsForChatbot",
            description: "Lấy danh sách các sản phẩm nổi bật của cửa hàng."
        }
    },
     {
        type: "function",
        function: {
            name: "getFlashSaleProductsForChatbot",
            description: "Lấy danh sách các sản phẩm đang được giảm giá trong chương trình Flash Sale của cửa hàng, bao gồm giá gốc, giá khuyến mãi và số lượng còn lại."
        }
    },
    {
        type: "function",
        function: {
            name: "searchAcrossEntities",
            description: "Tìm kiếm tổng hợp theo từ khóa trên sản phẩm, thương hiệu, danh mục để hỗ trợ truy vấn mơ hồ/thiếu chính tả.",
            parameters: {
                type: "object",
                properties: {
                    query: { type: "string", description: "Từ khóa người dùng nhập" },
                    limit: { type: "number", description: "Số lượng kết quả tối đa mỗi loại" }
                },
                required: ["query"]
            }
        }
    }
];

const baseSystemPrompt = `Bạn là một trợ lý chatbot chuyên nghiệp, thân thiện và hữu ích của cửa hàng cầu lông tại Phước An, Đồng Nai.
Bạn có khả năng tìm kiếm sản phẩm, tư vấn và trả lời các câu hỏi về cửa hàng.

**CÁC CÔNG CỤ BẠN CÓ THỂ SỬ DỤNG:**

1.  **getProductInfoForChatbot(productName: string, category: string, minPrice: number, maxPrice: number, priceSort: string, color: string, size: string, brand: string, playStyle: string):**
    * **Mô tả:** Tìm kiếm thông tin sản phẩm cầu lông trong cửa hàng theo tên, danh mục, giá, màu sắc, kích cỡ, **thương hiệu** hoặc **lối chơi**.
    * **LƯU Ý QUAN TRỌNG:** Hàm này CÓ THỂ lọc trực tiếp theo thương hiệu (brand) và lối chơi (playStyle) từ database. Hãy sử dụng các tham số 'brand' và 'playStyle' khi người dùng yêu cầu các tiêu chí này. Bạn (AI) sẽ nhận kết quả đã được lọc từ công cụ.
    * **Các tham số:**
        * "productName" (string, tùy chọn): Tên sản phẩm hoặc từ khóa tìm kiếm (ví dụ: 'Astrox 88D').
        * "category" (string, tùy chọn): Loại sản phẩm (ví dụ: 'vợt', 'giày', 'quả cầu', 'trang phục').
        * "minPrice" (number, tùy chọn, mặc định 0): Giá tối thiểu (VNĐ).
        * "maxPrice" (number, tùy chọn, mặc định Infinity): Giá tối đa (VNĐ).
        * "priceSort" (string, tùy chọn): Cách sắp xếp sản phẩm theo giá ('highest', 'lowest', 'median').
        * "color" (string, tùy chọn): Màu sắc của sản phẩm (ví dụ: 'xanh', 'đỏ', 'đen').
        * "size" (string, tùy chọn): Kích cỡ của sản phẩm (ví dụ: '3U', '26.5cm', 'L').
        * "brand" (string, tùy chọn): Thương hiệu của sản phẩm (ví dụ: 'Kumpoo', 'Yonex', 'Lining').
        * "playStyle" (string, tùy chọn): Lối chơi mà sản phẩm (đặc biệt là vợt) phù hợp (ví dụ: 'tấn công', 'phòng thủ', 'cân bằng', 'linh hoạt').

2.  **getFeaturedProductsForChatbot():**
    * **Mô tả:** Lấy danh sách các sản phẩm nổi bật của cửa hàng.
3.  **getFlashSaleProductsForChatbot():**
    * **Mô tả:** Lấy danh sách các sản phẩm đang được giảm giá trong chương trình Flash Sale của cửa hàng, bao gồm giá gốc, giá khuyến mãi và số lượng còn lại.
    * **Khi sử dụng:** Hãy sử dụng công cụ này khi người dùng hỏi về "flash sale", "sản phẩm khuyến mãi", "giảm giá", "có ưu đãi gì không", hoặc các câu hỏi tương tự về chương trình ưu đãi.

**NGUYÊN TẮC PHẢN HỒI VÀ XỬ LÝ THÔNG TIN:**

1.  **Sử dụng công cụ (Function Calling):** Khi người dùng hỏi về sản phẩm với các tiêu chí (tên, loại, giá, màu, kích cỡ), hãy trích xuất tất cả các thông tin này và gọi công cụ "getProductInfoForChatbot". Nếu từ khóa mơ hồ/thiếu dấu/thiếu chính tả hoặc chỉ có 1-2 từ, hãy cân nhắc gọi "searchAcrossEntities" trước để gợi ý thực thể đúng (thương hiệu/danh mục/sản phẩm). 
2.  **Xử lý các tiêu chí nâng cao (Thương hiệu, Lối chơi, Độ bền, v.v.):**
    * Khi người dùng hỏi về **thương hiệu** (ví dụ: "vợt Kumpoo") hoặc **lối chơi** (ví dụ: "giày chống lật cổ chân", "vợt thiên công"), bạn (AI) phải ghi nhớ những tiêu chí này.
    * Sau khi công cụ "getProductInfoForChatbot" trả về kết quả, hãy **ĐỌC KỸ trường "description"** của từng sản phẩm được trả về.
    * **SỬ DỤNG THÔNG TIN TỪ "description"** để xác định xem sản phẩm có phù hợp với thương hiệu, lối chơi, hoặc các đặc tính cụ thể khác mà người dùng đã nêu ra hay không.
    * **PHẢN HỒI RÕ RÀNG:**
        * Nếu tìm thấy sản phẩm phù hợp **và** mô tả khớp với tiêu chí nâng cao của người dùng: Giới thiệu sản phẩm và nhấn mạnh các đặc điểm đó.
        * Nếu tìm thấy sản phẩm nhưng **mô tả KHÔNG ĐỀ CẬP HOẶC KHÔNG KHỚP** với tiêu chí nâng cao của người dùng: Thông báo cho người dùng rằng bạn đã tìm thấy sản phẩm nhưng không chắc chắn về tiêu chí đó, hoặc đề xuất các đặc điểm khác mà sản phẩm có.
3.  **Thông tin sản phẩm từ công cụ:** Khi công cụ trả về thông tin sản phẩm, hãy trình bày ngắn gọn, rõ ràng, bao gồm **TÊN SẢN PHẨM**, **GIÁ**, **THÔNG TIN ĐẶC ĐIỂM NỔI BẬT TRÍCH XUẤT TỪ DESCRIPTION**, và **ĐƯỜNG LINK (nếu có)**. **LUÔN KÈM ĐƯỜNG LINK**.
4.  **Xử lý trường hợp không tìm thấy (từ công cụ):** Nếu công cụ trả về "Không tìm thấy sản phẩm", hãy thông báo rõ ràng và **chủ động hỏi lại người dùng để làm rõ yêu cầu hoặc gợi ý các lựa chọn khác dựa trên các tiêu chí bạn đã nhận diện được** (ví dụ: "Rất tiếc, tôi không tìm thấy vợt Kumpoo 350k thiên công. Bạn có muốn xem các loại vợt Kumpoo khác, hoặc một loại vợt thiên công khác không?").
5.  **Tư vấn lối chơi/sự phù hợp:** Nếu người dùng hỏi về sự phù hợp của sản phẩm ("vợt này hợp em không?", "giày này dành cho ai?"), hãy đọc "description" để mô tả các đặc điểm kỹ thuật khách quan của sản phẩm và liên hệ chúng với lối chơi/nhu cầu. Sau đó, **luôn hỏi lại người dùng về lối chơi (tấn công, phòng thủ, cân bằng), trình độ hoặc tiêu chí ưu tiên của họ.**
6.  **Trả lời trực tiếp các câu hỏi về cửa hàng:**
    * **Địa chỉ/Liên hệ:** Cửa hàng chúng tôi tọa lạc tại **Ấp Bàu Bông xã Phước An, huyện Nhơn Trạch, Đồng Nai**. Bạn có thể liên hệ chúng tôi qua:
        * Hotline: **079434699**
        * Email: **novashopvn12@gmail.com**
        * Facebook: **facebook.com/novashop**
    * **Hàng chính hãng/fake:** Cửa hàng chúng tôi cam kết chỉ bán các sản phẩm cầu lông chính hãng từ các thương hiệu uy tín. Chúng tôi tuyệt đối không kinh doanh hàng giả, hàng nhái để đảm bảo chất lượng và quyền lợi cho quý khách hàng.
7.  **Tuyệt đối không bịa đặt** thông tin sản phẩm, giá, hoặc đường link.
8.  **Giữ cuộc hội thoại tự nhiên, hữu ích và chuyên nghiệp.**
`;


function getOrCreateConversation(sessionId) {
    if (!sessions.has(sessionId)) {
        console.log(`Khởi tạo lịch sử hội thoại mới cho Session ID: ${sessionId}`);
        sessions.set(sessionId, [
            { "role": "system", "content": baseSystemPrompt }
        ]);
    }
    return sessions.get(sessionId);
}

function clearConversation(sessionId) {
    console.log(`Xóa lịch sử hội thoại cho Session ID: ${sessionId}`);
    sessions.delete(sessionId);
}


function addMessageToConversation(sessionId, message) {
    const conversation = sessions.get(sessionId);
    if (conversation) {
        conversation.push(message);
      
    } else {
        console.warn(`Không tìm thấy cuộc trò chuyện cho Session ID: ${sessionId}. Không thể thêm tin nhắn.`);
    }
}

async function callToolFunction(toolCall) {
    const functionName = toolCall.function.name;
    const functionArgs = toolCall.function.arguments; 

    let args = {};
    try {
        args = JSON.parse(functionArgs);
    } catch (e) {
        console.error(`Lỗi phân tích cú pháp đối số cho hàm ${functionName}:`, e);
        return `Lỗi: Không thể phân tích đối số cho hàm ${functionName}.`;
    }

    console.log(`Đang gọi hàm: ${functionName} với đối số:`, args);

    if (functionName === "getProductInfoForChatbot") {
        return await dbHelpers.getProductInfoForChatbot(
            args.productName,
            args.category,
            args.minPrice,
            args.maxPrice,
            args.priceSort,
            args.color,
            args.size,
            args.brand,      
            args.playStyle   
        );
    } else if (functionName === "getFeaturedProductsForChatbot") {
        return await dbHelpers.getFeaturedProductsForChatbot();
    }else if (functionName === "getFlashSaleProductsForChatbot") { 
        return await dbHelpers.getFlashSaleProductsForChatbot();
    } else if (functionName === "searchAcrossEntities") {
        return await dbHelpers.searchAcrossEntities(args.query, args.limit);
    }
  

    return `Không tìm thấy hàm: ${functionName}.`;
}

/**
 * * @param {string} sessionId - ID phiên của client
 * @param {string} userMessage - Tin nhắn của người dùng
 * @returns {Promise<string>} Phản hồi của AI
 */
function buildPayload(messages) {
    return {
        model: OPENROUTER_MODEL,
        messages,
        tools,
        tool_choice: "auto",
        max_tokens: OPENROUTER_MAX_TOKENS,
    };
}


async function getAiResponse(sessionId, userMessage) {
    // Kiểm tra API Key trước khi thực hiện cuộc gọi
    if (!OPENROUTER_API_KEY) {
        console.error('Lỗi: OPENROUTER_API_KEY không được đặt.');
        const errorMessage = 'Rất tiếc, hệ thống đang gặp sự cố cấu hình. Vui lòng liên hệ quản trị viên.';
        addMessageToConversation(sessionId, { "role": "assistant", "content": errorMessage });
        return errorMessage;
    }

    let conversation = getOrCreateConversation(sessionId);

    // Thêm tin nhắn người dùng vào lịch sử
    addMessageToConversation(sessionId, { "role": "user", "content": userMessage });

    try {
    let payload = buildPayload(conversation);


        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Lỗi khi gọi OpenRouter API lần 1:', errorData);
            throw new Error(`API Error: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message;

        if (aiMessage.tool_calls) {
            console.log("AI yêu cầu gọi công cụ:", aiMessage.tool_calls);

            addMessageToConversation(sessionId, aiMessage);

            for (const toolCall of aiMessage.tool_calls) {
                const toolResult = await callToolFunction(toolCall);

                let contentForToolMessage;
                if (toolResult === null || toolResult === undefined) {
                    contentForToolMessage = "[]";
                } else if (typeof toolResult !== 'string') {
                    contentForToolMessage = JSON.stringify(toolResult);
                } else {
                    // Nếu toolResult đã là chuỗi (có thể là lỗi từ hàm), vẫn dùng nó
                    contentForToolMessage = toolResult;
                }

                addMessageToConversation(sessionId, {
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: toolCall.function.name,
                    content: contentForToolMessage
                });
                console.log(`Đã thêm kết quả công cụ '${toolCall.function.name}' (ID: ${toolCall.id}) vào lịch sử cho AI.`);
            }

            // Gọi API lần 2 sau khi có kết quả từ công cụ
           payload = buildPayload(conversation);


            const secondResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!secondResponse.ok) {
                const errorData = await secondResponse.json();
                console.error('Lỗi khi gọi OpenRouter API lần 2 (sau tool call):', errorData);
                if (errorData.error && errorData.error.message) {
                    throw new Error(`API Error (second call): ${errorData.error.message}`);
                } else {
                    throw new Error(`API Error (second call): ${secondResponse.statusText}`);
                }
            }

            const secondData = await secondResponse.json();
            const finalAiResponse = secondData.choices[0].message.content;
            addMessageToConversation(sessionId, { "role": "assistant", "content": finalAiResponse });
            return finalAiResponse;

        } else {
            const finalAiResponse = aiMessage.content;
            addMessageToConversation(sessionId, { "role": "assistant", "content": finalAiResponse });
            return finalAiResponse;
        }

    } catch (error) {
        console.error('Lỗi trong quá trình gọi AI hoặc xử lý:', error);
        let errorMessage = 'Rất tiếc, có lỗi xảy ra. Vui lòng thử lại sau.';
        if (error.message.includes('API Error')) {
            errorMessage = `Rất tiếc, có vấn đề với dịch vụ AI: ${error.message}. Vui lòng thử lại sau.`;
        }
        // Luôn thêm tin nhắn lỗi vào lịch sử để AI có thể "biết" đã có lỗi
        addMessageToConversation(sessionId, { "role": "assistant", "content": errorMessage });
        return errorMessage;
    }
}

module.exports = {
    getOrCreateConversation,
    clearConversation,
    addMessageToConversation, 
    getAiResponse,
    callToolFunction
};