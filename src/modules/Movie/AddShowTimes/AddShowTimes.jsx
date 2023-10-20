import React, { useState } from "react";
import {
  Toolbar,
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import colorConfigs from "../../../configs/ColorConfigs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  addShowTime,
  getCinemaSystem,
  getMovieById,
  getTheaterById,
} from "../../../apis/movieAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";
import "animate.css";
import dayjs from "dayjs";

const showTimeSchema = object({
  tenHeThongRap: string().required("Hệ Thống Rạp Không Được Để Trống"),
  tenCumRap: string().required("Tên Cụm Rạp Không Được Để Trống"),
  giaVe: string()
    .required("Giá Vé Không Được Để Trống")
    .matches(/^[0-9]+$/, "Số tiền không hợp lệ."),
  ngayChieuGioChieu: string().required("Không Được Để Trống"),
});

export default function AddShowTimes() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      tenHeThongRap: "",
      tenCumRap: "",
      giaVe: "",
      ngayChieuGioChieu: "",
    },
    resolver: yupResolver(showTimeSchema),
    mode: "onSubmit",
  });
  const tenHeThongRapValue = watch("tenHeThongRap");
  const tenCumRapValue = watch("tenCumRap");

  const { data: movie = [], isLoading } = useQuery({
    queryKey: ["movieInfo", movieId],
    queryFn: () => getMovieById(movieId),
    enabled: !!movieId,
  });

  const { data: theater = [] } = useQuery({
    queryKey: ["theater", tenHeThongRapValue],
    queryFn: () => getTheaterById(tenHeThongRapValue),
    enabled: !!tenHeThongRapValue,
  });

  const { data: cinemaSys = [] } = useQuery({
    queryKey: ["cinema"],
    queryFn: getCinemaSystem,
  });

  const { mutate: onSubmit, error } = useMutation({
    mutationFn: (data) => {
      const showTimeobj = {
        maPhim: movieId,
        maRap: data?.tenCumRap,
        giaVe: data?.giaVe,
        ngayChieuGioChieu: data?.ngayChieuGioChieu,
      };
      return addShowTime(showTimeobj);
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Success",
        message: "Add Showtime Successfully.",
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

  const renderCinemaSysSelect = (array) => {
    return array.map((item) => {
      return (
        <MenuItem value={item.maHeThongRap} key={item.maHeThongRap}>
          {item.tenHeThongRap}
        </MenuItem>
      );
    });
  };

  const renderTheaterSelect = (array) => {
    return array.map((item) => {
      return (
        <MenuItem value={item.maCumRap} key={item.maCumRap}>
          {item.tenCumRap}
        </MenuItem>
      );
    });
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box component={Paper} p={3}>
        {/* TITLE */}
        <div style={{ marginBottom: "16px" }}>
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
            ADD SHOW TIMES
          </Typography>
          <Typography sx={{ display: "inline-block" }} variant="h6">
            {movie.tenPhim}
          </Typography>
        </div>
        {/* CONTENT */}
        <div style={{ display: "flex", gap: "40px" }}>
          {/* IMG */}
          <div>
            <img width={300} src={movie?.hinhAnh} alt={movie?.biDanh} />
          </div>
          {/* FORM */}
          <Box
            width={"300px"}
            onSubmit={handleSubmit(onSubmit)}
            component="form"
          >
            {/* CinemaSys Select */}
            <Stack spacing={2}>
              <FormControl>
                <Typography>Hệ Thống Rạp *</Typography>
                <Select
                  error={!!errors.tenHeThongRap}
                  value={tenHeThongRapValue || ""}
                  {...register("tenHeThongRap")}
                >
                  {renderCinemaSysSelect(cinemaSys)}
                </Select>
              </FormControl>
            </Stack>
            {/*Theater Select */}
            <Stack spacing={2} mt={2}>
              <FormControl>
                <Typography>Cụm Rạp *</Typography>
                <Select
                  error={!!errors.tenCumRap}
                  {...register("tenCumRap")}
                  value={tenCumRapValue || ""}
                >
                  {theater ? renderTheaterSelect(theater) : null}
                </Select>
              </FormControl>
            </Stack>
            {/* Date & Time */}
            <Stack spacing={2} mt={2}>
              <div>
                <Typography>Ngày Chiếu Giờ Chiếu *</Typography>
                <TextField
                  {...register("ngayChieuGioChieu", {
                    setValueAs: (value) => {
                      return dayjs(value).format("DD/MM/YYYY hh:mm:ss");
                    },
                  })}
                  error={!!errors.ngayChieuGioChieu}
                  type="datetime-local"
                />
              </div>
            </Stack>
            {/* Ticket Price */}
            <Stack spacing={2} mt={2}>
              <div>
                <Typography>Giá Vé *</Typography>
                <TextField
                  helperText={errors.giaVe?.message}
                  error={!!errors.giaVe}
                  {...register("giaVe")}
                />
              </div>
              <Button type="submit" sx={{ mt: "16px" }} variant="contained">
                CREATE SHOW TIME
              </Button>
            </Stack>
          </Box>
        </div>
      </Box>
    </Box>
  );
}
