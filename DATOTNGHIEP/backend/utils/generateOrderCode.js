const ALPHANUM = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 

const randomString = (length = 3) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length));
    }
    return result;
};

const generateOrderCode = () => {
    const now = new Date();
    const yyyyMMdd = now.toISOString().slice(0,10).replace(/-/g, '');
    const random = randomString(3);
    return `NOVASHOP-${yyyyMMdd}-${random}`;
};

module.exports = generateOrderCode;