import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/index.css";

function Auth() {
  return (
    <div className="w-[100vw] h-[100vh] items-center justify-around flex flex-col bg-gradient-to-r from-black via-indigo-1000 to-indigo-700">
      <div className="flex flex-col gap-10 w-full p-8 items-center justify-between custom-950:w-[50%]">
        <div className="text-7xl font-bold bg-gradient-to-br from-purple-500 to-indigo-500 text-purple p-[2vw] bg-clip-text text-transparent flex justify-center">
          Connectify
        </div>
        <div className="flex items-center justify-center font-semibold text-xl tracking-wider text-center">
          Stay in touch with real-time messaging, explore trending topics, and
          express yourself with posts, photos, and videos. Join Connectify today
          and be part of a vibrant, interactive community!
        </div>
        <div className="flex justify-center items-center p-[3vw]">
          <Link
            to="/Signup"
            className="h-[7vh] w-[20vw] text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center justify-center"
          >
            Sign-up
          </Link>
          <Link
            to="/Signin"
            className="h-[7vh] w-[20vw] text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center justify-center"
          >
            Sign-in
          </Link>
        </div>
      </div>
      <div className="w-[50vw]"></div>
    </div>
  );
}

export default Auth;
