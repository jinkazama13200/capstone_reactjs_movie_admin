import React from "react";
import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <Grid container>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      <Grid item xs={10}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
