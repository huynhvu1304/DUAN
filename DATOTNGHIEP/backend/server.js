
require('dotenv').config({ path: './openrouter.env' }); 

const app = require("./app");
const http = require("http");
const WebSocket = require('ws');
const url = require('url');

const chatbotService = require('./services/aiService'); 
const dbHelpers = require('./utils/dbHelpers'); 

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    // ✅ Kiểm tra origin cho WebSocket
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:3000',    // backend local
        'http://localhost:4000',    // frontend Next.js local
        'http://localhost:4200',    // admin Angular local
        'https://novashop.io.vn',   // production frontend
        'http://novashop.io.vn',   // production frontend   
        'http://backend.novashop.io.vn',   // production frontend   
        'https://backend.novashop.io.vn',   // production frontend   
        'https://admin.novashop.io.vn', // production admin
        'http://admin.novashop.io.vn' // production admin
    ];

    if (origin && !allowedOrigins.includes(origin)) {
        console.warn(`❌ Origin ${origin} không được phép kết nối WebSocket`);
        ws.close(1008, 'Origin not allowed'); // 1008 = Policy Violation
        return;
    }

    // ⬇ Phần code cũ của bạn giữ nguyên từ đây
    const parameters = url.parse(req.url, true).query;
    const sessionId = parameters.sessionId;

    if (!sessionId) {
        console.error('Kết nối WebSocket không có sessionId. Đóng kết nối.');
        ws.close();
        return;
    }

    console.log(`Client đã kết nối với Session ID: ${sessionId}`);
   
    let conversation = chatbotService.getOrCreateConversation(sessionId);

    if (conversation.length === 1 && conversation[0].role === 'system') {
        const welcomeMessageContent = 'Xin chào! Tôi là chatbot hỗ trợ về các sản phẩm cầu lông của bạn. Tôi có thể giúp gì hôm nay?';
        ws.send(JSON.stringify({ type: 'welcome', content: welcomeMessageContent }));
        console.log(`Đã gửi tin nhắn chào mừng cho Session ID: ${sessionId}`);
        chatbotService.addMessageToConversation(sessionId, { role: 'assistant', content: welcomeMessageContent });
    } else {
        console.log(`Session ID: ${sessionId} đã có lịch sử (${conversation.length - 1} tin nhắn). Không gửi tin chào mừng.`);
    }

    ws.on('message', async function incoming(message) {
        console.log('Nhận được tin nhắn từ client:', message.toString());

        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
        } catch (e) {
            console.error('Lỗi phân tích cú pháp tin nhắn JSON từ client:', e);
            ws.send(JSON.stringify({ type: 'error', content: 'Lỗi: Định dạng tin nhắn không hợp lệ từ client.' }));
            return;
        }

        if (!parsedMessage.sessionId || !parsedMessage.message) {
            ws.send(JSON.stringify({ type: 'error', content: 'Lỗi: Tin nhắn phải chứa sessionId và message.' }));
            return;
        }

        try {
            const aiResponse = await chatbotService.getAiResponse(parsedMessage.sessionId, parsedMessage.message);
            ws.send(JSON.stringify({ type: 'chat', content: aiResponse }));
            console.log(`Đã gửi phản hồi AI về client cho Session ID: ${sessionId}: ${aiResponse.substring(0, 50)}...`);
        } catch (error) {
            console.error(`Lỗi khi lấy phản hồi AI cho Session ID ${sessionId}:`, error);
            ws.send(JSON.stringify({ type: 'error', content: `Lỗi xử lý yêu cầu: ${error.message || 'Không xác định.'}` }));
        }
    });

    ws.on('close', () => {
        console.log(`Client với Session ID: ${sessionId} đã ngắt kết nối.`);
    });

    ws.on('error', (error) => {
        console.error(`Lỗi WebSocket cho Session ID: ${sessionId}:`, error);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server của bạn đang chạy trên cổng ${PORT}`);
    console.log(`WebSocket server cũng đang lắng nghe trên ws://localhost:${PORT}`);
});