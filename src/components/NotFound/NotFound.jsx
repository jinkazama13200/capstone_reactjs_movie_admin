import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import NotFoundIcon from "../../assets/img/404.png";

const LoadingpPageContainer = styled("div")`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: white;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;
const LoadingIcon = styled("img")`
  width: 300px;
  height: 300px;
`;

export default function NotFound() {
  return (
    <LoadingpPageContainer>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%,-50%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingIcon src={NotFoundIcon} alt=""></LoadingIcon>

        <Button
          onClick={() => window.location.replace("/")}
          variant="contained"
        >
          BACK TO HOME
        </Button>
      </div>
    </LoadingpPageContainer>
  );
}
