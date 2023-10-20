import fetcher from "./fetcher";

export async function getMovie(searchParams) {
  try {
    const res = await fetcher.get("/api/QuanLyPhim/LayDanhSachPhim", {
      params: {
        maNhom: "GP09",
        tenPhim: searchParams || undefined,
      },
    });
    return res.data.content;
  } catch (error) {
    throw error.response.data.content;
  }
}

export async function addMovie(movie) {
  try {
    const res = await fetcher.post("/api/QuanLyPhim/ThemPhimUploadHinh", movie);
    return res.data.content;
  } catch (error) {
    throw error.response.data.content;
  }
}

export async function deleteMovie(movieId) {
  try {
    const res = await fetcher.delete("/api/QuanLyPhim/XoaPhim", {
      params: {
        MaPhim: movieId,
      },
    });
    return res.data.content;
  } catch (error) {
    throw error.response.data.content;
  }
}

export async function getMovieById(movieId) {
  try {
    const res = await fetcher.get("/api/QuanLyPhim/LayThongTinPhim", {
      params: {
        MaPhim: movieId,
      },
    });
    return res.data.content;
  } catch (error) {
    throw error.response.data.content;
  }
}

export async function updateMovie(movie) {
  try {
    const res = await fetcher.post("/api/QuanLyPhim/CapNhatPhimUpload", movie);
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}

export async function getCinemaSystem() {
  try {
    const res = await fetcher.get("/api/QuanLyRap/LayThongTinHeThongRap");
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}

export async function getTheaterById(id) {
  try {
    const res = await fetcher.get(
      "/api/QuanLyRap/LayThongTinCumRapTheoHeThong",
      {
        params: {
          maHeThongRap: id,
        },
      }
    );
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}

export async function addShowTime(payload) {
  try {
    const res = fetcher.post("/api/QuanLyDatVe/TaoLichChieu", payload);
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}

export async function getMoviesByPage(page, searchTerm) {
  try {
    const res = await fetcher.get("/api/QuanLyPhim/LayDanhSachPhimPhanTrang", {
      params: {
        maNhom: "GP09",
        soTrang: page,
        tenPhim: searchTerm || undefined,
        soPhanTuTrenTrang: 3,
      },
    });
    return res.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
}
