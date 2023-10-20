import fetcher from "./fetcher";

export async function getUserByPage(page, searchTerm) {
  try {
    const res = await fetcher.get(
      "/api/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang",
      {
        params: {
          MaNhom: "GP09",
          soTrang: page,
          tuKhoa: searchTerm || undefined,
          soPhanTuTrenTrang: 5,
        },
      }
    );
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}

export async function userSignin(payload) {
  try {
    const res = await fetcher.post("/api/QuanLyNguoiDung/DangNhap", payload);
    return res.data.content;
  } catch (error) {
    throw error.response.data.content;
  }
}

export async function addUser(payload) {
  try {
    const res = await fetcher.post(
      "/api/QuanLyNguoiDung/ThemNguoiDung",
      payload
    );
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}

export async function updateUser(payload) {
  try {
    const res = await fetcher.post(
      "/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
      payload
    );
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}

export async function deleteUser(userId) {
  try {
    const res = await fetcher.delete("/api/QuanLyNguoiDung/XoaNguoiDung", {
      params: {
        TaiKhoan: userId,
      },
    });
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}

export async function getUserById(userId) {
  try {
    const res = await fetcher.get("/api/QuanLyNguoiDung/TimKiemNguoiDung", {
      params: {
        MaNhom: "GP09",
        tuKhoa: userId,
      },
    });
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}
