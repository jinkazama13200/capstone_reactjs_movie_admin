import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../../apis/userAPI";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";
import "animate.css";
import LoadingPage from "../../../components/LoadingPage/LoadingPage";

const editUserSchema = object({
  taiKhoan: string().required("Trường hợp bắt buộc."),
  matKhau: string().required("Trường hợp bắt buộc."),
  email: string().required("Trường hợp bắt buộc.").email("Email không hợp lệ."),
  // soDT: string().required("Trường hợp bắt buộc."),
  maNhom: string().required("Trường hợp bắt buộc."),
  maLoaiNguoiDung: string().required("Trường hợp bắt buộc."),
  hoTen: string().required("Trường hợp bắt buộc."),
});

export default function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { data: selectedUser = {}, isLoading } = useQuery({
    queryKey: ["userById", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  const { mutate: onSubmit } = useMutation({
    mutationFn: (payload) => updateUser(payload),
    onSuccess: () => {
      Store.addNotification({
        title: "Success",
        message: "Updated User Successfully.",
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
      email: "",
      soDT: "",
      maNhom: "GP09",
      maLoaiNguoiDung: "",
      hoTen: "",
    },
    resolver: yupResolver(editUserSchema),
    mode: "onTouched",
  });
  const userTypeWatch = watch("maLoaiNguoiDung");

  useEffect(() => {
    if (selectedUser.length > 0) {
      const userInfo = selectedUser[0];
      setValue("taiKhoan", userInfo?.taiKhoan);
      setValue("matKhau", userInfo.matKhau);
      setValue("email", userInfo?.email);
      setValue("soDT", userInfo?.soDT);
      setValue("hoTen", userInfo?.hoTen);
      setValue("maLoaiNguoiDung", userInfo?.maLoaiNguoiDung);
    }
    return;
  }, [selectedUser]);

  if (isLoading) {
    return <LoadingPage />;
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
          EDIT USER
        </Typography>
        {/* Edit User Form */}
        <Box
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          autoComplete="off"
        >
          <Stack direction="row" spacing={4} mt={2}>
            <div>
              <Typography>Tài Khoản *</Typography>
              <TextField
                disabled
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
                disabled
                error={!!errors.maNhom}
                helperText={errors.maNhom?.message}
                variant="outlined"
                {...register("maNhom")}
              />
            </div>
            <div>
              <Typography>Số ĐT *</Typography>
              <TextField
                error={!!errors.soDT}
                helperText={errors.soDT?.message}
                variant="outlined"
                {...register("soDT")}
              />
            </div>
            {/* Select */}
            <FormControl>
              <Typography>Mã Loại Người Dùng *</Typography>
              <Select
                error={!!errors.maLoaiNguoiDung}
                {...register("maLoaiNguoiDung")}
                value={userTypeWatch || ""}
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
            UPDATE
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
