import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/signup",
        {
          email,
          username,
          password,
        }
      );
      console.log("Signup Response:", response); // Log the response for debugging
      if (response && response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        navigate("/Home");
      } else {
        setErrorMessage("Unexpected response format. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error); // Log the error for debugging
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full h-screen bg-gradient-to-r from-black via-indigo-1000 to-indigo-700">
      <div className="text-5xl font-bold bg-gradient-to-br from-purple-500 to-indigo-500 text-purple py-12 bg-clip-text text-transparent flex justify-center md:text-7xl">
        Connectify
      </div>
      <div className="justify-between px-6 py-8 flex flex-col items-center border-2 rounded-lg shadow-2xl w-[80%] lg:w-1/3 md:w-[50%]">
        <h1 className="font-bold text-3xl p-2">Sign Up</h1>
        <div className="p-2">Enter your details to get started!</div>
        <div className="flex flex-col w-full py-2">
          <input
            className="border border-slate-500 rounded-md h-12 text-white bg-transparent"
            placeholder="E-mail"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full py-2">
          <input
            className="border border-slate-500 rounded-md h-12 text-white bg-transparent"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full py-2">
          <input
            className="border border-slate-500 rounded-md h-12 text-white bg-transparent"
            placeholder="Name"
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full py-2 mb-4">
          <input
            className="border border-slate-500 rounded-md h-12 text-white bg-transparent"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        {errorMessage ? (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        ) : null}
        <button
          type="button"
          className="px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg text-center dark:bg-purple-600 dark:hover:bg-blue-700 dark:focus:ring-purple-800"
          onClick={handleSignup}
        >
          Sign Up
        </button>
        <div className="py-2">
          Already have an account? <Link to="/signin">Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
