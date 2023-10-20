import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { string, object } from "yup";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Stack,
} from "@mui/material";
import { FaSignInAlt } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { userSignin } from "../../../../apis/userAPI";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../../../contexts/UserContext";

const signinSchema = object({
  taiKhoan: string().required("Tài khoản không được để trống"),
  matKhau: string().required("Mật khẩu không được để trống."),
});

export default function Signin() {
  const [showPassword, setShowpassword] = useState(false);

  const { currentUser, handleSignin: onSuccessSignin } = useUserContext();
  console.log(currentUser);

  const {
    mutate: handleSignin,
    isLoading,
    error,
  } = useMutation({
    mutationFn: (payload) => userSignin(payload),
    onSuccess: (data) => {
      onSuccessSignin(data);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
    },
    resolver: yupResolver(signinSchema),
    mode: "onTouched",
  });

  const onSubmit = (values) => {
    handleSignin(values);
  };

  if (currentUser) {
    return <Navigate to={"/"} />;
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "calc(100% - 170ch)",
        border: "1px solid lightgrey",
        borderRadius: "5px",
        p: 5,
        boxShadow: 3,
      }}
    >
      <div>
        <FaSignInAlt size={40} />
      </div>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          "& > :not(style)": { m: 1, width: "40ch" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        component={"form"}
        autoComplete="off"
      >
        <TextField
          {...register("taiKhoan")}
          error={!!errors.taiKhoan}
          helperText={errors.taiKhoan?.message}
          variant="outlined"
          label="Tài Khoản"
        />
        <TextField
          {...register("matKhau")}
          error={!!errors.matKhau}
          helperText={errors.matKhau?.message}
          type={showPassword ? "text" : "password"}
          variant="outlined"
          label="Mật Khẩu"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowpassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          disabled={isLoading}
          sx={{ width: "20ch !important" }}
          type="submit"
          variant="contained"
        >
          Đăng Nhập
        </Button>
        {error && (
          <Stack>
            <Alert variant="outlined" severity="error">
              {error}
            </Alert>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
