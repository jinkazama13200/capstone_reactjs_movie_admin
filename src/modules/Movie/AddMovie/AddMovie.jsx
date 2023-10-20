import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Stack,
  Switch,
  FormGroup,
  FormControlLabel,
  Alert,
  Toolbar,
  Typography,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { string, object } from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMovie } from "../../../apis/movieAPI";
import dayjs from "dayjs";
import colorConfigs from "../../../configs/ColorConfigs";
import { useNavigate } from "react-router-dom";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";
import "animate.css";

const addMovieSchema = object({
  tenPhim: string().required("Trường hợp bắt buộc."),
  trailer: string().required("Trường hợp bắt buộc."),
  moTa: string().required("Trường hợp bắt buộc."),
  maNhom: string().required("Trường hợp bắt buộc."),
  ngayKhoiChieu: string().required("Trường hợp bắt buộc."),
  biDanh: string().required("Trường hợp bắt buộc."),
  danhGia: string()
    .required("Trường hợp bắt buộc.")
    .matches(/^(?:10|[0-9])$/, "Chỉ được đánh giá từ 0 đến 10."),
});

export default function AddMovie() {
  const navigate = useNavigate();
  const [imgPreview, setImgPreview] = useState("");

  const { mutate: onSubmit, error } = useMutation({
    mutationFn: (movie) => {
      const formData = new FormData();
      formData.append("tenPhim", movie.tenPhim);
      formData.append("biDanh", movie.biDanh);
      formData.append("trailer", movie.trailer);
      formData.append("moTa", movie.moTa);
      formData.append("maNhom", movie.maNhom);
      formData.append("ngayKhoiChieu", movie.ngayKhoiChieu);
      formData.append("danhGia", movie.danhGia);
      formData.append("dangChieu", movie.dangChieu);
      formData.append("hinhAnh", movie.hinhAnh[0]);
      formData.append("sapChieu", movie.sapChieu);
      formData.append("hot", movie.hot);
      return addMovie(formData);
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Success",
        message: "Add Movie Successfully.",
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

  const {
    register,
    handleSubmit,
    watch,
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
      dangChieu: false,
      sapChieu: false,
      hot: false,
    },
    resolver: yupResolver(addMovieSchema),
    mode: "onTouched",
  });

  const sapChieuValue = watch("sapChieu");
  const dangChieuValue = watch("dangChieu");
  const hotValue = watch("hot");
  const imgWatch = watch("hinhAnh");

  useEffect(() => {
    // using useEffect call back when imgWatch changes the value
    const file = imgWatch?.[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      setImgPreview(e.target.result);
    };
  }, [imgWatch]);

  if (error) {
    Store.addNotification({
      title: "error",
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
          ADD MOVIE
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
                error={!!errors.tenPhim}
                helperText={errors.tenPhim?.message}
                {...register("tenPhim")}
                label="Tên Phim *"
              />
            </div>
            <div>
              <Typography>Bí Danh *</Typography>
              <TextField
                error={!!errors.biDanh}
                helperText={errors.biDanh?.message}
                {...register("biDanh")}
                label="Bí Danh *"
              />
            </div>
          </Stack>
          <Stack direction="row" spacing={2} mt={2}>
            <div>
              <Typography>Mã Nhóm *</Typography>
              <TextField
                error={!!errors.maNhom}
                helperText={errors.maNhom?.message}
                {...register("maNhom")}
                label="Mã Nhóm *"
              />
            </div>
            <div>
              <Typography>Đánh Giá *</Typography>
              <TextField
                error={!!errors.danhGia}
                helperText={errors.danhGia?.message}
                {...register("danhGia")}
                label="Đánh Giá *"
              />
            </div>
          </Stack>
          <Stack direction="row" spacing={2} mt={2}>
            <div>
              <Typography>Trailer *</Typography>
              <TextField
                error={!!errors.trailer}
                helperText={errors.trailer?.message}
                {...register("trailer")}
                label="Trailer *"
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
              sx={{ width: 400 }}
              multiline
              rows={4}
              error={!!errors.moTa}
              helperText={errors.moTa?.message}
              {...register("moTa")}
              label="Mô Tả *"
            />
          </Stack>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch checked={dangChieuValue} {...register("dangChieu")} />
              }
              label="Đang Chiếu"
              labelPlacement="end"
            />
            <FormControlLabel
              labelPlacement="end"
              control={
                <Switch checked={sapChieuValue} {...register("sapChieu")} />
              }
              label="Sắp Chiếu"
            />
            <FormControlLabel
              labelPlacement="end"
              control={<Switch checked={hotValue} {...register("hot")} />}
              label="Hot"
            />
          </FormGroup>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField type="file" {...register("hinhAnh")} />
            {imgPreview && <img src={imgPreview} width={50} height={55} />}
          </div>
          <Button
            sx={{ mt: 2, width: 200 }}
            type="submit"
            variant="contained"
            color="primary"
          >
            ADD
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
