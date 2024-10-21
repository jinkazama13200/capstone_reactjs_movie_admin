import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Stack,
  Switch,
  FormGroup,
  FormControlLabel,
  Toolbar,
  Typography,
  Paper,
} from "@mui/material";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { string, object, mixed } from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMovieById, updateMovie } from "../../../apis/movieAPI";
import dayjs from "dayjs";
import colorConfigs from "../../../configs/ColorConfigs";
import { useNavigate, useParams } from "react-router-dom";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";
import "animate.css";

const editMovieSchema = object({
  tenPhim: string().required("Trường hợp bắt buộc."),
  trailer: string().required("Trường hợp bắt buộc."),
  moTa: string().required("Trường hợp bắt buộc."),
  maNhom: string().required("Trường hợp bắt buộc."),
  ngayKhoiChieu: string().required("Trường hợp bắt buộc."),
  biDanh: string().required("Trường hợp bắt buộc."),
  danhGia: string()
    .required("Trường hợp bắt buộc.")
    .matches(/^(?:10|[0-9])$/, "Chỉ được đánh giá từ 0 đến 10."),
}).shape({
  hinhAnh: mixed().required("Trường hợp bắt buộc"),
});

export default function EditMovie() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [imgPreview, setImgPreview] = useState("");

  const { mutate: onSubmit, error } = useMutation({
    mutationFn: (movie) => {
      const formData = new FormData();
      formData.append("maPhim", movie.maPhim);
      formData.append("tenPhim", movie.tenPhim);
      formData.append("biDanh", movie.biDanh);
      formData.append("trailer", movie.trailer);
      formData.append("moTa", movie.moTa);
      formData.append("maNhom", movie.maNhom);
      formData.append("ngayKhoiChieu", movie.ngayKhoiChieu);
      formData.append("danhGia", movie.danhGia);
      formData.append("hinhAnh", movie.hinhAnh[0]);
      formData.append("dangChieu", movie.dangChieu);
      formData.append("sapChieu", movie.sapChieu);
      formData.append("hot", movie.hot);
      return updateMovie(formData);
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Success",
        message: "Updated Movie Successfully.",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      navigate("/");
    },
  });

  const { data: movieInfo = [] } = useQuery({
    queryKey: ["movieInfo", movieId],
    queryFn: () => getMovieById(movieId),
    enabled: !!movieId,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tenPhim: "",
      trailer: "",
      biDanh: "",
      moTa: "",
      maNhom: "",
      ngayKhoiChieu: "",
      danhGia: "",
      hinhAnh: "",
      sapChieu: false,
      dangChieu: false,
      hot: false,
    },
    resolver: yupResolver(editMovieSchema),
    mode: "onTouched",
  });
  const tenPhimValue = watch("tenPhim");
  const trailerValue = watch("trailer");
  const biDanhValue = watch("biDanh");
  const moTaValue = watch("moTa");
  const maNhomValue = watch("maNhom");
  const danhGiaValue = watch("danhGia");
  const sapChieuValue = watch("sapChieu");
  const dangChieuValue = watch("dangChieu");
  const hotValue = watch("hot");

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      file.preview = URL.createObjectURL(file);
      setImgPreview(file);
    }
  };

  useEffect(() => {
    return () => {
      imgPreview && URL.revokeObjectURL(imgPreview.preview);
    };
  }, [imgPreview]);

  useEffect(() => {
    if (movieInfo) {
      setValue("tenPhim", movieInfo.tenPhim);
      setValue("trailer", movieInfo.trailer);
      setValue("biDanh", movieInfo.biDanh);
      setValue("moTa", movieInfo.moTa);
      setValue("maNhom", movieInfo.maNhom);
      setValue("ngayKhoiChieu", movieInfo.ngayKhoiChieu);
      setValue("danhGia", movieInfo?.danhGia);
      setValue("dangChieu", movieInfo?.dangChieu);
      setValue("sapChieu", movieInfo?.sapChieu);
      setValue("hot", movieInfo?.hot);
      setValue("maPhim", movieInfo?.maPhim);
      setValue("hinhAnh", movieInfo?.hinhAnh);
      setImgPreview(movieInfo?.hinhAnh);
    }
  }, [movieInfo]);

  useEffect(() => {
    if (error) {
      Store.addNotification({
        title: "Error",
        message: error,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    }
  }, [error]);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box component={Paper} p={3}>
        <Typography
          variant="h6"
          style={{
            backgroundColor: colorConfigs.text.bgColor,
            color: colorConfigs.text.primary,
            display: "inline-block",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          EDIT MOVIE
        </Typography>
        {/* MovieForm here */}
        <Box
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          autoComplete="off"
        >
          <Stack direction="row" spacing={2} mt={2}>
            <div>
              <Typography>Tên Phim *</Typography>
              <TextField
                defaultValue={tenPhimValue || ""}
                error={!!errors.tenPhim}
                helperText={errors.tenPhim?.message}
                {...register("tenPhim")}
              />
            </div>
            <div>
              <Typography>Bí Danh *</Typography>
              <TextField
                defaultValue={biDanhValue || ""}
                error={!!errors.biDanh}
                helperText={errors.biDanh?.message}
                {...register("biDanh")}
              />
            </div>
          </Stack>
          <Stack direction="row" spacing={2} mt={2}>
            <div>
              <Typography>Mã Nhóm *</Typography>
              <TextField
                defaultValue={maNhomValue || ""}
                error={!!errors.maNhom}
                helperText={errors.maNhom?.message}
                {...register("maNhom")}
              />
            </div>
            <div>
              <Typography>Đánh Giá *</Typography>
              <TextField
                defaultValue={danhGiaValue || ""}
                error={!!errors.danhGia}
                helperText={errors.danhGia?.message}
                {...register("danhGia")}
              />
            </div>
          </Stack>
          <Stack direction="row" spacing={2} mt={2}>
            <div>
              <Typography>Trailer *</Typography>
              <TextField
                defaultValue={trailerValue || ""}
                error={!!errors.trailer}
                helperText={errors.trailer?.message}
                {...register("trailer")}
              />
            </div>
            <div>
              <Typography>Ngày Khởi Chiếu *</Typography>
              <TextField
                error={!!errors.ngayKhoiChieu}
                helperText={errors.ngayKhoiChieu?.message}
                {...register("ngayKhoiChieu", {
                  setValueAs: (value) => {
                    return dayjs(value).format("DD/MM/YYYY");
                  },
                })}
                type="datetime-local"
              />
            </div>
          </Stack>
          <Stack spacing={2} mt={2}>
            <Typography>Mô Tả *</Typography>
            <TextField
              defaultValue={moTaValue || ""}
              sx={{ width: 400 }}
              multiline
              rows={4}
              error={!!errors.moTa}
              helperText={errors.moTa?.message}
              {...register("moTa")}
            />
          </Stack>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={dangChieuValue || false}
                  {...register("dangChieu")}
                />
              }
              label="Đang Chiếu"
              labelPlacement="end"
            />
            <FormControlLabel
              label="Sắp Chiếu"
              labelPlacement="end"
              control={
                <Switch
                  checked={sapChieuValue || false}
                  {...register("sapChieu")}
                />
              }
            />
            <FormControlLabel
              label="Hot"
              labelPlacement="end"
              control={
                <Switch checked={hotValue || false} {...register("hot")} />
              }
            />
          </FormGroup>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              type="file"
              {...register("hinhAnh")}
              onChange={handleImgChange}
            />
            {imgPreview && (
              <img
                src={imgPreview.preview || imgPreview}
                width={50}
                height={55}
              />
            )}
          </div>
          <Button
            sx={{ mt: 2, width: 200 }}
            type="submit"
            variant="contained"
            color="primary"
          >
            UPDATE
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
