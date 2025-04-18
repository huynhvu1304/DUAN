const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  thong_tin_mon_an: {
    ten_mon: String,
    mien_quoc_gia: String,
    mo_ta_ngan: String,
    img: String
  },
  nguyen_lieu: {
    khau_phan: String,
    danh_sach_nguyen_lieu: [
      {
        ten: String,
        so_luong: String
      }
    ],
    de_tim_kiem: {
      goi_y_thay_the: [String]
    },
    don_vi_do_luong: String
  },
  dung_cu_can_thiet: {
    danh_sach_dung_cu: [String],
    chi_dan_de_hieu: [String]
  },
  cach_lam: {
    cac_buoc_thuc_hien: [
      {
        buoc: Number,
        ten_buoc: String,
        thoi_gian: String,
        chi_tiet: [String]
      }
    ],
    thoi_gian_lam: String,
    luu_y: [String]
  },
  so_luong_khi_lam_xong: {
    khau_phan: String,
    tinh_toan_cho_khau_phan_khac: [String]
  },
  kha_nang_tuy_bien: {
    lua_chon_thay_the_nguyen_lieu: [String],
    dieu_chinh_khau_vi: [String]
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories'
  }
});

module.exports = mongoose.model('products', ProductSchema);
