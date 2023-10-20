import React, { useState } from "react";
import {
  Box,
  Toolbar,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Button,
  TextField,
  Pagination,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { styled } from "@mui/system";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMovie, getMoviesByPage } from "../../apis/movieAPI";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@uidotdev/usehooks";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";
import "animate.css";
import LoadingPage from "../../components/LoadingPage/LoadingPage";

const Desc = styled("span")`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PaginationContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

export default function Movie() {
  const navigate = useNavigate();
  const theadData = [
    {
      id: 1,
      name: "#",
    },
    {
      id: 2,
      name: "Mã Phim",
    },
    {
      id: 3,
      name: "Tên Phim",
    },
    {
      id: 4,
      name: "Hình Ảnh",
    },
    {
      id: 5,
      name: "Mô Tả",
    },
    {
      id: 6,
      name: "Ngày Khởi Chiếu",
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debounceSearchTerm = useDebounce(searchTerm, 500);

  const queryClient = useQueryClient();

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies", currentPage, debounceSearchTerm],
    queryFn: () => getMoviesByPage(currentPage, searchTerm),
  });

  const movieList = movies?.items || [];

  const handleChangePage = (e, page) => {
    setCurrentPage(page);
  };

  const handleSearchChangePage = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const { mutate: handleDeleteMovie } = useMutation({
    mutationFn: (movieId) => deleteMovie(movieId),
    onSuccess: () => {
      Store.addNotification({
        title: "Success",
        message: "Deleted Movie Successfully.",
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

      queryClient.invalidateQueries(["movies"]);
    },
  });

  const renderTableHeaderData = (array) => {
    return array.map((item) => {
      return (
        <TableCell sx={{ fontWeight: 600 }} align="center" key={item.id}>
          {item.name}
        </TableCell>
      );
    });
  };
  const renderTableBodyData = (array) => {
    return array.map((item, index) => {
      const date = dayjs(item.ngayKhoiChieu).format("DD/MM/YYYY");
      return (
        <TableRow key={item.maPhim}>
          <TableCell align="center">{index + 1}</TableCell>
          <TableCell align="center">{item.maPhim}</TableCell>
          <TableCell align="center">{item.tenPhim}</TableCell>
          <TableCell align="center">
            <img
              style={{ objectFit: "contain" }}
              width={100}
              height={100}
              src={item.hinhAnh}
              alt={item.biDanh}
            />
          </TableCell>
          <TableCell width={500} align="center">
            <Desc>{item.moTa}</Desc>
          </TableCell>
          <TableCell align="center">{date}</TableCell>
          <TableCell align="center">
            <IconButton
              onClick={() => navigate(`movie/edit/${item.maPhim}`)}
              title="edit"
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteMovie(item.maPhim)}
              title="delete"
              color="error"
            >
              <DeleteForeverIcon />
            </IconButton>
            <IconButton
              onClick={() => navigate(`movie/showtimes/${item.maPhim}`)}
              title="show time"
              color="success"
            >
              <CalendarTodayIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Button
        onClick={() => navigate("movie/add")}
        sx={{ mb: 2 }}
        variant="outlined"
      >
        ADD MOVIE
      </Button>
      <div>
        <TextField
          value={searchTerm}
          onChange={handleSearchChangePage}
          sx={{ mb: 2 }}
          label="Search Movie"
          variant="outlined"
        />
      </div>
      <Box component="div" sx={{ flexGrow: 1 }}>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {renderTableHeaderData(theadData)}
                  <TableCell align="center">
                    <SettingsIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTableBodyData(movieList)}</TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {/*PAGINATION */}
      <PaginationContainer>
        <Pagination
          onChange={handleChangePage}
          color="primary"
          count={movies.totalPages}
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </PaginationContainer>
    </Box>
  );
}
