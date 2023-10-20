import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Toolbar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TextField,
  Paper,
  IconButton,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SettingsIcon from "@mui/icons-material/Settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUserByPage } from "../../apis/userAPI";
import { useNavigate } from "react-router-dom";
import colorConfigs from "../../configs/ColorConfigs";
import { styled } from "@mui/system";
import { useDebounce } from "@uidotdev/usehooks";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";
import LoadingPage from "../../components/LoadingPage/LoadingPage";

const theadData = [
  {
    id: 1,
    name: "#",
  },
  {
    id: 2,
    name: "Tài Khoản",
  },
  {
    id: 3,
    name: "Mật Khẩu",
  },
  {
    id: 4,
    name: "Email",
  },
  {
    id: 5,
    name: "Họ Tên",
  },
  {
    id: 6,
    name: "Mã Loại Người Dùng",
  },
  {
    id: 7,
    name: "Số ĐT",
  },
];

const PaginationContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

export default function User() {
  // NAVIGATE
  const navigate = useNavigate();

  // STATE
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // useDebounce Hook for Searching
  const debounceSearchTerm = useDebounce(searchTerm, 500);

  // MUTATION FOR DELETE USER
  const {
    mutate: handleDeleteUser,
    error: isDeleteFail,
    isError,
  } = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      Store.addNotification({
        title: "Success",
        message: "Deleted User Successfully.",
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
      queryClient.invalidateQueries(["users"]);
    },
  });

  // GET USER API USING USEQUERY
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", currentPage, debounceSearchTerm],
    queryFn: () => getUserByPage(currentPage, searchTerm),
  });
  const handleChangePage = (e, page) => {
    setCurrentPage(page);
  };
  const handleSearchChangePage = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const userList = users?.items || [];

  // RENDER TABLE HEAD DATA
  const renderTableHeadData = (array) => {
    return array.map((item) => {
      return (
        <TableCell key={item.id} style={{ fontWeight: 600 }} align="center">
          {item.name}
        </TableCell>
      );
    });
  };

  // RENDER TABLE BODY DATA
  const renderTableBodyData = (array) => {
    return array.map((item, index) => {
      return (
        <TableRow key={item.taiKhoan}>
          <TableCell align="center">{index + 1}</TableCell>
          <TableCell align="center">{item.taiKhoan}</TableCell>
          <TableCell align="center">{item.matKhau}</TableCell>
          <TableCell align="center">{item.email}</TableCell>
          <TableCell align="center">{item.hoTen}</TableCell>
          <TableCell align="center">
            <Typography
              sx={{
                border: "none",
                borderRadius: "5px",
                display: "inline-block",
                padding: "5px 20px",
                color: colorConfigs.text.primary,
                backgroundColor: `${
                  item.maLoaiNguoiDung === "QuanTri"
                    ? colorConfigs.usertype.bgcolor.admin
                    : colorConfigs.usertype.bgcolor.customer
                }`,
              }}
              variant="span"
            >
              {item.maLoaiNguoiDung}
            </Typography>
          </TableCell>
          <TableCell align="center">{item.soDt}</TableCell>
          <TableCell align="center">
            <IconButton
              onClick={() => navigate(`/user/edit/${item.taiKhoan}`)}
              title="edit"
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteUser(item.taiKhoan)}
              title="delete"
              color="error"
            >
              <DeleteForeverIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  useEffect(() => {
    if (isError) {
      Store.addNotification({
        title: "Error",
        message: isDeleteFail,
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
  }, [isDeleteFail]);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Button
        onClick={() => navigate("/user/add")}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        ADD USER
      </Button>
      <div>
        <TextField
          sx={{ mb: 2 }}
          label="Search User"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChangePage}
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
                  {renderTableHeadData(theadData)}
                  <TableCell align="center">
                    <SettingsIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTableBodyData(userList)}</TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Pagination */}
        <PaginationContainer>
          <Pagination
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            count={users.totalPages}
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </PaginationContainer>
      </Box>
    </Box>
  );
}
