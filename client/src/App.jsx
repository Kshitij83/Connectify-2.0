import React from "react";
import Signup from "./pages/Signup.jsx";
import SentRequests from "./components/SentRequests.jsx";
import Signin from "./pages/Signin.jsx";
import PendingRequests from "./components/PendingRequests.jsx";
import PersonalProfile from "./pages/PersonalProfile.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import AddFriend from "./components/AddFriend.jsx";
import MyFriends from "./components/MyFriends.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Messages from "./pages/Messages.jsx";
import Auth from "./pages/Auth.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
    errorElement: <div>404</div>,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <div>404</div>,
  },
  {
    path: "/signin",
    element: <Signin />,
    errorElement: <div>404</div>,
  },
  {
    path: "/addfriend",
    element: <AddFriend />,
    errorElement: <div>404</div>,
  },
  {
    path: "/home",
    element: <Home />,
    errorElement: <div>404</div>,
  },
  {
    path: "/myfriends",
    element: <MyFriends />,
    errorElement: <div>404</div>,
  },
  {
    path: "/pendingrequests",
    element: <PendingRequests />,
    errorElement: <div>404</div>,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <div>404</div>,
  },
  {
    path: "/personalprofile",
    element: <PersonalProfile />,
    errorElement: <div>404</div>,
  },
  {
    path: "/sentrequests",
    element: <SentRequests />,
    errorElement: <div>404</div>,
  },
  {
    path: "/messages",
    element: <Messages />,
    errorElement: <div>404</div>,
  },
]);

const App = () => (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

export default App;
