import React from "react";
import { styled } from "@mui/system";
import { Box, Toolbar } from "@mui/material";
import LoadingIcon from "../../assets/img/animation_lnu7fmv8_small.gif";

const LoadingPageContainer = styled("div")`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
`;

export default function LoadingPage() {
  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Toolbar />
      <LoadingPageContainer>
        <img
          style={{
            objectFit: "none",
            position: "absolute",
            top: "50%",
            left: "58%",
            transform: "translate(-50%,-50%)",
          }}
          src={LoadingIcon}
          alt=""
        />
      </LoadingPageContainer>
    </Box>
  );
}
