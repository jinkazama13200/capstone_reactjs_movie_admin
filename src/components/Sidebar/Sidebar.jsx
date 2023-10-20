import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MovieIcon from "@mui/icons-material/Movie";
import LogoutIcon from "@mui/icons-material/Logout";
import colorConfigs from "../../configs/ColorConfigs";
import { ListItemIcon, ListItemText, Avatar, IconButton } from "@mui/material";
import Logo from "../../assets/img/—Pngtree—cinema vector illustration_3704537.png";
import UserAvatar from "../../assets/img/78f6cd6a3d3f0a0f6fc11e85746a2e9a.jpg";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";

const drawerWidth = 320;

export default function Sidebar() {
  const { currentUser, handleSignout } = useUserContext();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: colorConfigs.sidebar.bgcolor,
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            CINEMA MANAGEMENT
          </Typography>
          <Typography
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            component="div"
          >
            <Avatar src={UserAvatar} />
            <span style={{ display: "block" }}>{currentUser?.taiKhoan}</span>
            <IconButton onClick={handleSignout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ bgcolor: colorConfigs.sidebar.bgcolor }}>
          <div style={{ textAlign: "center", width: "100%" }}>
            <img style={{ width: "50px", height: "100%" }} src={Logo} alt="" />
          </div>
        </Toolbar>
        <Divider />
        <List>
          {/* //Movie Management */}
          <ListItem  disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <MovieIcon />
              </ListItemIcon>
              <ListItemText primary="Movie" />
            </ListItemButton>
          </ListItem>

          {/* //User Management */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("user")}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="User" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
}
