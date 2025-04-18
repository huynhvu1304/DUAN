export interface ProductInterface {
    _id?: string;
    thong_tin_mon_an: {
      ten_mon: string;
      mien_quoc_gia: string;
      mo_ta_ngan: string;
      img: string;
    };
    nguyen_lieu: {
      khau_phan: string;
      danh_sach_nguyen_lieu: {
        ten: string;
        so_luong: string;
      }[];
      de_tim_kiem: {
        goi_y_thay_the: string[];
      };
      don_vi_do_luong: string;
    };
    dung_cu_can_thiet: {
      danh_sach_dung_cu: string[];
      chi_dan_de_hieu: string[];
    };
    cach_lam: {
      cac_buoc_thuc_hien: {
        buoc: number;
        ten_buoc: string;
        thoi_gian: string;
        chi_tiet: string[];
      }[];
      thoi_gian_lam: string;
      luu_y: string[];
    };
    so_luong_khi_lam_xong: {
      khau_phan: string;
      tinh_toan_cho_khau_phan_khac: string[];
    };
    kha_nang_tuy_bien: {
      lua_chon_thay_the_nguyen_lieu: string[];
      dieu_chinh_khau_vi: string[];
    };
    categoryId: string;
    hot: number;
}

export interface CategoryInterface {
    _id?: string;
    name: string;
}
