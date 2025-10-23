//chèn multer để upload file
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/imagesUsers')
  },
filename: function(req, file, cb){
  const uniqueName = Date.now() + '-' + file.originalname;
  cb(null, uniqueName);
}
})
const checkfile = (req, file, cb) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
    return cb(new Error('Bạn chỉ được upload file ảnh'))
  }
  return cb(null, true)
}
const upload = multer({storage: storage, fileFilter: checkfile})

const {userModel, userAddress}= require('../models/userModel')
const productModel = require('../models/productModel');
const variantModel = require('../models/variantModel');
const FavoriteModel = require('../models/favoriteModel');

const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const admin = require('firebase-admin'); // Import firebase-admin
// Thêm đường dẫn đến file service account key của bạn
const serviceAccount = require('../config/firebase-admin-key.json'); // ĐIỀU CHỈNH ĐƯỜNG DẪN NÀY

// Khởi tạo Firebase Admin SDK nếu chưa được khởi tạo
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: "https://<DATABASE_NAME>.firebaseio.com" // Tùy chọn nếu bạn dùng Realtime Database
  });
}
const getAllUsers = async (req, res) => {
  try {
      const Users = await userModel.find();
      res.status(200).json(Users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


//thêm người dùng
const register = [
  upload.single('img'), 
  async (req, res, next) => {
    try {
      const { name, email, password, confirmPassword, phone } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!name || !email || !password || !confirmPassword || !phone) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
      }

      // Kiểm tra email định dạng Gmail và kết thúc bằng .com
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email phải là Gmail và kết thúc bằng .com" });
      }

      // Kiểm tra password và confirmPassword có giống nhau không
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Mật khẩu và xác nhận mật khẩu không khớp" });
      }
      // Kiểm tra phone
      if (!phone) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
      }

      const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ. Phải gồm 10 số và bắt đầu bằng 03, 05, 07, 08 hoặc 09" });
      }
      console.log(req.body);

      // Kiểm tra email đã đăng ký chưa
      const checkuser = await userModel.findOne({ email });
      if (checkuser) {
        return res.status(400).json({ message: "Email đã đăng ký" });
      }
      // kiểm tra số điện thoại đã đăng ký chưa
      const checkPhone = await userModel.findOne({ phone });
      if (checkPhone) {
        return res.status(400).json({ message: "Số điện thoại đã được đăng ký" });
      }

      // Kiểm tra tệp tin hình ảnh
      const imageUrl = req.file ? `${req.file.filename}` : "";

      // Mã hóa mật khẩu bằng bcrypt
      const hashPassword = await bcrypt.hash(password, 10);

      // Tạo một instance mới của userModel
      const newuser = new userModel({
        name,
        email,
        password: hashPassword,
        phone,
        img: imageUrl
      });

      const data = await newuser.save();
      res.json(data);
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

//Bảo mật token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Không có token hoặc token không hợp lệ' });
  }

  const token = authHeader.slice(7); 
  console.log(token);

  jwt.verify(token, 'hello', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token đã hết hạn' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token không hợp lệ' });
      }
      return res.status(401).json({ message: 'Lỗi xác thực token' });
    }
    req.user = decoded;
    req.userId = decoded.id;
    console.log(req.userId);
    next();
  });
};
// HÀM XỬ LÝ ĐĂNG NHẬP GOOGLE MỚI
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body; // Firebase ID Token từ frontend

        if (!idToken) {
            return res.status(400).json({ message: 'Không có Firebase ID Token được cung cấp.' });
        }

        // 1. Xác minh Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken; // uid là Firebase UID, email, name, picture từ Google Profile

        // 2. Tìm hoặc tạo người dùng trong database của bạn
        let user = await userModel.findOne({ email });

        if (user) {
           // ✅ Kiểm tra nếu tài khoản đã bị chặn thì không cho login
    if (user.status === "Đã chặn" || user.status === "đã chặn" || user.status === "blocked") {
        return res.status(403).json({ message: "Tài khoản đã bị chặn" });
    }
            // Tài khoản đã tồn tại với email này (có thể là đăng ký truyền thống hoặc đã liên kết Google)
            if (!user.googleId) {
                // Nếu tài khoản tồn tại nhưng chưa có googleId, thì đây là tài khoản truyền thống
                // Liên kết tài khoản Google này với tài khoản hiện có
                user.googleId = uid;
                user.img = user.img || picture; // Cập nhật ảnh đại diện nếu chưa có
                await user.save();
                console.log(`Tài khoản hiện có (${email}) đã được liên kết với Google ID: ${uid}`);
            } else if (user.googleId !== uid) {
                // Email này đã liên kết với một Google ID khác
                // Trường hợp này không nên xảy ra nếu email duy nhất và googleId duy nhất
                // Nhưng nếu xảy ra, có thể là do vấn đề đồng bộ hoặc user có nhiều tài khoản Google với cùng 1 email
                // Hoặc email này đã được sử dụng bởi một tài khoản Google khác trong Firebase Auth.
                // Firebase thường xử lý lỗi này ở tầng auth/account-exists-with-different-credential
                // Tuy nhiên, nếu bạn muốn bảo mật cao hơn, bạn có thể cân nhắc gửi lỗi.
                console.warn(`Cảnh báo: Email ${email} đã có googleId khác. Firebase UID mới: ${uid}, UID cũ: ${user.googleId}`);
                // return res.status(400).json({ message: "Email này đã được liên kết với một tài khoản Google khác." });
            }
            // Nếu user.googleId == uid, thì tài khoản đã được liên kết chính xác
        } else {
            // Tài khoản chưa tồn tại với email này, tạo tài khoản mới
            user = new userModel({
                name: name || email.split('@')[0], // Sử dụng tên từ Google hoặc tạo từ email
                email: email,
                // password: Không cần password vì đây là tài khoản Google
                password: "", // Bạn có thể để rỗng hoặc null, nhưng Schema của bạn là required:true
                           // -> Cân nhắc đặt password: {type: String, required: false} trong schema User
                           // Nếu giữ required: true, bạn phải đặt một giá trị mặc định nào đó.
                           // Hoặc tạo một password random mã hóa.
                phone: "", // Firebase không cung cấp phone mặc định. Cần hỏi user sau nếu bắt buộc.
                           // Nếu phone là required: true, bạn sẽ phải xử lý lỗi hoặc thu thập thông tin sau.
                           // Tạm thời, tôi sẽ để rỗng nếu schema cho phép.
                img: picture,
                googleId: uid,
                role: 'user', // Vai trò mặc định
                status: 'Hoạt động',
                statuscomment: 'Cho phép bình luận',
                statusquestion: 'Cho phép đặt câu hỏi'
            });
            await user.save();
            console.log(`Đã tạo tài khoản mới từ Google Login cho: ${email}`);
        }

        // 3. Tạo JWT riêng của bạn cho người dùng (giống như hàm login truyền thống)
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                name: user.name,
                img: user.img
            },
            'hello', // Sử dụng SECRET KEY từ môi trường (vd: process.env.JWT_SECRET) thay vì 'hello'
            { expiresIn: '24h' }
        );

        // 4. Trả về token và thông tin người dùng
        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                img: user.img || '',
                name: user.name || '',
                role: user.role || 'user',
                status: user.status || 'Hoạt động',
                statuscomment: user.statuscomment || 'Cho phép bình luận',
                statusquestion: user.statusquestion || 'Cho phép đặt câu hỏi'
              }
        });

    } catch (error) {
        console.error('Lỗi khi xử lý Google Login Backend:', error);
        // Firebase Auth errors có thể có code riêng, bạn có thể xử lý chi tiết hơn
        if (error.code === 'auth/id-token-expired') {
          return res.status(401).json({ message: 'Token đã hết hạn. Vui lòng đăng nhập lại.' });
        }
        if (error.code === 'auth/invalid-id-token') {
          return res.status(401).json({ message: 'Token không hợp lệ.' });
        }
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập bằng Google.', error: error.message });
    }
};


// lấy thông tin user khi có token
const getUser = async (req, res) => {
  try{
    const user = await userModel.findById(req.userId, {password: 0}).populate('address');
    if(!user){
      throw new Error('không tìm thấy user');
    }
    res.json(user);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
}

// sửa thông tin
const editUser = [
  upload.single('img'),
  async (req, res) => {
    try {
      const updateData = {
        ...req.body
      };

      if (req.file) {
        updateData.img = req.file.filename;
      }

    const updatedUser = await userModel.findByIdAndUpdate(
  req.userId,
  updateData,
  { new: true, runValidators: true }
);

if (!updatedUser) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

// Chuyển _id thành id
const userWithId = {
  ...updatedUser.toObject(),
  id: updatedUser._id.toString()
};
delete userWithId._id; // xóa _id nếu muốn

res.json(userWithId);


    } catch (error) {
      // Bắt lỗi trùng lặp key (E11000) từ MongoDB
      if (error.code === 11000) {
        // Trả về lỗi 409 Conflict với thông báo rõ ràng
        return res.status(409).json({ message: 'Email này đã được sử dụng bởi một tài khoản khác.' });
      }
      
      // Bắt các lỗi validation khác (nếu có)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }

      // Xử lý các lỗi khác
      console.error(error); // Nên log lỗi đầy đủ để dễ debug
      res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ không xác định.' });
    }
  }
];
const isValidPassword = (password) => {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

// xử lý logic mật khẩu
const changePassword = [
  verifyToken,
  async (req, res) => {
    try {
      const user = await userModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      const { oldPassword, newPassword, confirmPassword } = req.body;

      // if (!isValidPassword(newPassword)) {
      //   return res.status(400).json({ message: 'Mật khẩu mới không đủ mạnh' });
      // }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: 'Mật khẩu mới không được trùng mật khẩu cũ' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashPassword;
      await user.save();

      res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// đang nhập
const login = [
  async (req, res, next) => {
    try {
      console.log(req.body);

      // Kiểm tra email đã đăng ký chưa
      const checkuser = await userModel.findOne({ email: req.body.email });
      if (!checkuser) {
        throw new Error("Email không tồn tại");
      }

      // Kiểm tra trạng thái tài khoản
      if (checkuser.status === 'đã chặn' || checkuser.status === 'blocked') {
        return res.status(403).json({ message: "Tài khoản đã bị chặn" });
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(req.body.password, checkuser.password);
      if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
      }

      // Tạo token JWT
      const token = jwt.sign(
        {
          id: checkuser._id,
          role: checkuser.role,
          email: checkuser.email,
          name: checkuser.name,
          img: checkuser.img
        },
        'hello',
        { expiresIn: '24h' }
      );

      // Trả về token và thông tin user
      res.json({
        token,
        user: {
          id: checkuser._id,
          email: checkuser.email,
          img: checkuser.img || '',
          name: checkuser.name || '',
          role: checkuser.role || 'user',
          status: checkuser.status || 'hoạt động',
          statuscomment: checkuser.statuscomment || 'Cho phép bình luận',
          statusquestion: checkuser.statusquestion // Không gán mặc định ở đây!
        }
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

const verifyAdmin = async (req, res, next) => {
   try{
    const user = await userModel.findById(req.userId);
    if(!user){
      throw new Error('không tìm thấy user');
    }
    if(user.role !== 'admin'){
      throw new Error('không có quyền truy cập');
    }
    next();
   }
   catch(error){
    res.status(500).json({ message: error.message });
   }
  
};

// Lấy danh sách productId favorites của user
const getFavorites = async (req, res) => {
  try {
    // Lấy tất cả favorite của user hiện tại
    const favorites = await FavoriteModel.find({ user_id: req.userId }).select('product_id');
    const productIds = favorites.map(f => f.product_id);

    // Lấy thông tin sản phẩm
    const favoriteProducts = await productModel.find({ _id: { $in: productIds } }).populate('variants');
    res.json(favoriteProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm vào favorites
const addFavorite = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    const productId = req.params.productId;

    // Đảm bảo product có variants
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    if (!product.variants || product.variants.length === 0) {
      // Nếu variants rỗng thì tìm các variant theo productID
      const variants = await variantModel.find({ productID: productId });
      const variantIds = variants.map(variant => variant._id);

      // Cập nhật vào product
      await productModel.findByIdAndUpdate(productId, { variants: variantIds });
    }

    // Chỉ kiểm tra và thêm vào bảng FavoriteModel
    const exists = await FavoriteModel.findOne({ user_id: req.params.userId, product_id: req.params.productId });
    if (exists) return res.status(400).json({ message: 'Sản phẩm đã được yêu thích' });

    await FavoriteModel.create({ user_id: req.params.userId, product_id: req.params.productId });
    res.json({ message: 'Thêm sản phẩm vào yêu thích thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm khỏi favorites
const removeFavorite = async (req, res) => {
  try {
    const result = await FavoriteModel.findOneAndDelete({
      user_id: req.userId,
      product_id: req.params.productId,
    });
    // Không cần kiểm tra nếu không tìm thấy, vẫn trả về thành công
    res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    const productId = req.params.productId;
    const isFavorite = await FavoriteModel.exists({
  user_id: req.params.userId,
  product_id: req.params.productId
});

res.json({ isFavorite: !!isFavorite });

    res.json({ isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavorite = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    alert("Bạn chưa đăng nhập");
    return;
  }

  try {
    let res;
    if (!isFavorite) {
      res = await fetch(`http://localhost:3000/users/${user.id}/favorites/${product._id}`, {
        method: "POST"
      });
    } else {
      res = await fetch(`http://localhost:3000/users/${user.id}/favorites/${product._id}`, {
        method: "DELETE"
      });
    }

    if (!res.ok) throw new Error("Không thể cập nhật yêu thích");

    // Cập nhật lại trạng thái
    const check = await fetch(`http://localhost:3000/users/${user.id}/favorites/${product._id}/check`);
    const data = await check.json();
    setIsFavorite(data.isFavorite);
  } catch (error) {
    console.error(error);
  }
};

// Add this new controller function
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// lưu nhiều địa chỉ vào usseraddress
//Thêm địa chỉ mớ
const addUserAddress = async (req, res) => {
    const userId = req.userId; // userId lấy từ token xác thực
    const { name, phone, useraddress, setDefault } = req.body; // `setDefault` từ frontend

    try {
        // 1. Đếm số lượng địa chỉ hiện có của người dùng
        const existingAddressesCount = await userAddress.countDocuments({ userId: userId });

        // 2. Kiểm tra nếu số lượng địa chỉ đã đạt giới hạn
        if (existingAddressesCount >= 3) {
            return res.status(400).json({ message: "Bạn chỉ có thể lưu tối đa 3 địa chỉ." });
        }

        let isDefaultForNewAddress = setDefault;

        // Nếu setDefault từ frontend là TRUE, hoặc đây là địa chỉ đầu tiên của người dùng
        // thì đảm bảo nó trở thành mặc định và các cái khác không phải.
        if (setDefault || existingAddressesCount === 0) {
            // Đặt tất cả các địa chỉ hiện có của người dùng về isDefault: false
            await userAddress.updateMany(
                { userId: userId, isDefault: true },
                { $set: { isDefault: false } }
            );
            isDefaultForNewAddress = true; // Địa chỉ mới sẽ là mặc định
        }

        // Tạo địa chỉ mới với trạng thái isDefault đã xác định
        const newAddress = new userAddress({ 
            userId, 
            name, 
            phone, 
            useraddress, 
            isDefault: isDefaultForNewAddress 
        });
        await newAddress.save();

        // Cập nhật số điện thoại cho userModel nếu user chưa có phone
        const currentUser = await userModel.findById(userId);
        if (phone && (!currentUser.phone || currentUser.phone === "")) {
            currentUser.phone = phone;
            await currentUser.save();
            console.log(`Đã cập nhật số điện thoại cho user ${userId} từ địa chỉ mới.`);
        }
        
        // Cập nhật trường `address` trong userModel để trỏ tới địa chỉ mặc định
        // Đây là cách userModel biết địa chỉ mặc định là gì.
        // Luôn cập nhật userModel.address nếu địa chỉ mới là mặc định hoặc nếu nó là địa chỉ duy nhất
        if (isDefaultForNewAddress || !currentUser.address) {
             await userModel.findByIdAndUpdate(userId, { address: newAddress._id });
        }


        res.status(201).json(newAddress); // Trả về địa chỉ mới tạo
    } catch (error) {
        console.error("Lỗi khi thêm địa chỉ người dùng:", error); // Log lỗi chi tiết hơn
        res.status(500).json({ message: "Đã xảy ra lỗi khi thêm địa chỉ." });
    }
};
//Lấy địa chỉ mặc định
const getDefaultAddress = async (req, res) => {
    const userId = req.userId; // Lấy userId từ token xác thực

    try {
        const user = await userModel.findById(userId).populate('address');

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        if (!user.address) {
            return res.status(200).json({ message: 'Không có địa chỉ mặc định nào được thiết lập', address: null });
        }

        res.status(200).json(user.address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Lấy tất cả địa chỉ của User
const getAllUserAddresses = async (req, res) => {
    const userId = req.userId; // Lấy userId từ token xác thực

    try {
        const addresses = await userAddress.find({ userId: userId });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Cập nhật địa chỉ mặc định
const setDefaultUserAddress = async (req, res) => {
    const userId = req.userId; 
    const { addressId } = req.body; 

    try {
        const newDefaultAddress = await userAddress.findOne({ _id: addressId, userId: userId });

        if (!newDefaultAddress) {
            return res.status(404).json({ message: 'Địa chỉ không tìm thấy hoặc không thuộc về người dùng này.' });
        }

        await userAddress.updateMany(
            { userId: userId, isDefault: true }, 
            { $set: { isDefault: false } }       
        );

        newDefaultAddress.isDefault = true;
        await newDefaultAddress.save();

        await userModel.findByIdAndUpdate(userId, { address: newDefaultAddress._id });


        res.status(200).json({ message: 'Địa chỉ mặc định đã được cập nhật thành công.' });
    } catch (error) {
        console.error("Lỗi trong setDefaultUserAddress:", error); // Log lỗi chi tiết hơn
        res.status(500).json({ message: error.message || 'Đã có lỗi xảy ra khi cập nhật địa chỉ mặc định.' });
    }
};


// Cập nhật địa chỉ số điện thoại tên
const updateAddress = async (req, res) => {
    const userId = req.userId;
    const addressId = req.params.id; 
    const { name, phone, useraddress } = req.body;

    try {
        const updatedAddress = await userAddress.findOneAndUpdate(
            { _id: addressId, userId: userId }, 
            { name, phone, useraddress },
            { new: true } 
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Địa chỉ không tìm thấy hoặc không thuộc về người dùng này' });
        }

        res.status(200).json(updatedAddress);
    } catch (error) {
        console.error("Lỗi khi cập nhật địa chỉ:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật địa chỉ." });
    }
};

const deleteAddress = async (req, res) => {
    const userId = req.userId;
    const addressId = req.params.id;

    try {
        const addressToDelete = await userAddress.findOne({ _id: addressId, userId: userId });

        if (!addressToDelete) {
            return res.status(404).json({ message: 'Địa chỉ không tìm thấy hoặc không thuộc về người dùng này' });
        }

        // Kiểm tra xem địa chỉ này có phải là địa chỉ mặc định không
        const currentUser = await userModel.findById(userId);
        if (currentUser.address && currentUser.address.toString() === addressId) {
            // Nếu địa chỉ bị xóa là mặc định, cần xử lý địa chỉ mặc định mới
            const remainingAddresses = await userAddress.find({ userId: userId, _id: { $ne: addressId } });
            if (remainingAddresses.length > 0) {
                // Đặt địa chỉ đầu tiên còn lại làm mặc định mới
                await userModel.findByIdAndUpdate(userId, { address: remainingAddresses[0]._id });
            } else {
                // Nếu không còn địa chỉ nào, xóa địa chỉ mặc định khỏi user
                await userModel.findByIdAndUpdate(userId, { $unset: { address: 1 } }); // Xóa trường 'address'
            }
        }

        await userAddress.deleteOne({ _id: addressId, userId: userId });

        res.status(200).json({ message: 'Địa chỉ đã được xóa thành công' });
    } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi xóa địa chỉ." });
    }
};
//câp nhật trạng thái bình luận
const updateStatusComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Toggle trạng thái bình luận
    const newStatus = user.statuscomment === 'Cho phép bình luận' ? 'Cấm bình luận' : 'Cho phép bình luận';
    
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { statuscomment: newStatus },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//câp nhật trạng thái đặt câu hỏi
const updateStatusQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Toggle trạng thái đặt câu hỏi
    const newStatus = user.statusquestion === 'Cho phép đặt câu hỏi' ? 'Cấm đặt câu hỏi' : 'Cho phép đặt câu hỏi';
    
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { statusquestion: newStatus },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    register,
    login,
    verifyToken,
    googleLogin,
    getUser, 
    verifyAdmin,
    getAllUsers,
    editUser,
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
    toggleFavorite,
    updateUserStatus,
    changePassword,
    addUserAddress,
    getDefaultAddress,
    getAllUserAddresses,
    setDefaultUserAddress,
    updateAddress,
    deleteAddress,
    updateStatusComment,
    updateStatusQuestion
};