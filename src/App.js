import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import User from "./modules/User/User";
import Movie from "./modules/Movie/Movie";
import Signin from "./modules/Auth/pages/Signin/Signin";
import ProtectedRoute from "./routers/ProtectedRoute/ProtectedRoute";
import UserProvider from "./contexts/UserContext";
import NotFound from "./components/NotFound/NotFound";
import AddMovie from "./modules/Movie/AddMovie/AddMovie";
import EditMovie from "./modules/Movie/EditMovie/EditMovie";
import AddUser from "./modules/User/AddUser/AddUser";
import EditUser from "./modules/User/EditUser/EditUser";
import AddShowTimes from "./modules/Movie/AddShowTimes/AddShowTimes";
import { ReactNotifications } from "react-notifications-component";

function App() {
  return (
    <UserProvider>
      <ReactNotifications />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route element={<ProtectedRoute />}>
              {/* Movie Management */}
              <Route index element={<Movie />} />
              <Route path="movie/add" element={<AddMovie />} />
              <Route path="movie/edit/:movieId" element={<EditMovie />} />
              <Route
                path="movie/showtimes/:movieId"
                element={<AddShowTimes />}
              />
              {/* User Management */}
              <Route path="user" element={<User />} />
              <Route path="user/add" element={<AddUser />} />
              <Route path="user/edit/:userId" element={<EditUser />} />
            </Route>
          </Route>
          <Route path="sign-in" element={<Signin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
