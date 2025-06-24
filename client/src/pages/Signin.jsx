import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center w-full h-screen text-black bg-white overflow-hidden bg-gradient-to-r from-black via-indigo-1000 to-indigo-700">
      <div className="border-2 text-white px-6 py-12 border-2 rounded-lg shadow-2xl w-10/12 custom-950:w-[40vw] custom-670:w-4/5">
        <h1 className="p-2 flex justify-around font-bold text-3xl">Sign In</h1>
        <div className="p-2 flex justify-around">
          Enter your details to get started!
        </div>
        <div className="flex flex-col w-full py-2">
          <p className="py-1">User Name</p>
          <input
            className="text-white bg-transparent border border-slate-500 rounded-md h-12"
            onChange={(e) => {
              setUsername(e.target.value);
              console.log(e.target.value);
            }}
          />
        </div>

        <div className="flex flex-col w-full py-2">
          <p className="py-1">Password</p>
          <input
            className="border text-white bg-transparent border-slate-500 rounded-md h-12"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
              console.log(e.target.value);
            }}
          />
        </div>
        {errorMessage ? (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        ) : null}
        <div className="pt-6 flex justify-around">
          <button
            type="button"
            className="px-8 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={async () => {
              try {
                const response = await axios.post(
                  "http://localhost:5000/api/user/signin",
                  {
                    username: username,
                    password: password,
                  }
                );
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                navigate("/Home");
              } catch (error) {
                setErrorMessage(
                  error.response.data.message ||
                    "Something went wrong. Please try again."
                );
              }
            }}
          >
            Sign In
          </button>
        </div>
        <div className="py-4 flex justify-around">
          <div>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
