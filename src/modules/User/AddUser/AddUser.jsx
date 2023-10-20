import React, { useState, forwardRef } from "react";
import {
  Toolbar,
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import colorConfigs from "../../../configs/ColorConfigs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { isError, useMutation } from "@tanstack/react-query";
import { addUser } from "../../../apis/userAPI";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";
import "animate.css";
import { useNavigate } from "react-router-dom";

const addUserSchema = object({
  taiKhoan: string().required("Trường hợp bắt buộc."),
  matKhau: string().required("Trường hợp bắt buộc."),
  email: string().required("Trường hợp bắt buộc.").email("Email không hợp lệ."),
  soDt: string().required("Trường hợp bắt buộc."),
  maNhom: string().required("Trường hợp bắt buộc."),
  maLoaiNguoiDung: string().required("Trường hợp bắt buộc."),
  hoTen: string().required("Trường hợp bắt buộc."),
});

export default function AddUser() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
      email: "",
      soDt: "",
      maNhom: "",
      maLoaiNguoiDung: "",
      hoTen: "",
    },
    resolver: yupResolver(addUserSchema),
    mode: "onTouched",
  });
  const userTypeWatch = watch("maLoaiNguoiDung");

  const { mutate: onSubmit, error } = useMutation({
    mutationFn: (payload) => {
      return addUser(payload);
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Success",
        message: "Created User Successfully.",
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
      navigate("/user");
    },
  });

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
          ADD USER
        </Typography>
        {/* Add User Form */}
        <Box
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          autoComplete="off"
        >
          <Stack direction="row" spacing={4} mt={2}>
            <div>
              <Typography>Tài Khoản *</Typography>
              <TextField
                error={!!errors.taiKhoan}
                helperText={errors.taiKhoan?.message}
                variant="outlined"
                {...register("taiKhoan")}
              />
            </div>
            <div>
              <Typography>Mật Khẩu *</Typography>
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                type={showPassword ? "text" : "password"}
                error={!!errors.matKhau}
                helperText={errors.matKhau?.message}
                {...register("matKhau")}
              />
            </div>
          </Stack>
          <Stack direction="row" spacing={4} mt={2}>
            <div>
              <Typography>Email *</Typography>
              <TextField
                error={!!errors.email}
                helperText={errors.email?.message}
                variant="outlined"
                {...register("email")}
              />
            </div>
            <div>
              <Typography>Họ Tên *</Typography>
              <TextField
                error={!!errors.hoTen}
                helperText={errors.hoTen?.message}
                variant="outlined"
                {...register("hoTen")}
              />
            </div>
          </Stack>
          <Stack direction="row" spacing={4} mt={2}>
            <div>
              <Typography>Mã Nhóm *</Typography>
              <TextField
                error={!!errors.maNhom}
                helperText={errors.maNhom?.message}
                variant="outlined"
                {...register("maNhom")}
              />
            </div>
            <div>
              <Typography>Số ĐT *</Typography>
              <TextField
                error={!!errors.soDt}
                helperText={errors.soDt?.message}
                variant="outlined"
                {...register("soDt")}
              />
            </div>
            {/* Select */}
            <FormControl>
              <Typography>Mã Loại Người Dùng *</Typography>
              <Select
                error={!!errors.maLoaiNguoiDung}
                defaultValue={userTypeWatch}
                {...register("maLoaiNguoiDung")}
                value={userTypeWatch}
              >
                <MenuItem value={"QuanTri"}>Quản Trị</MenuItem>
                <MenuItem value={"KhachHang"}>Khách Hàng</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Button
            sx={{ mt: 2, width: 200 }}
            type="submit"
            variant="contained"
            color="primary"
          >
            ADD USER
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
