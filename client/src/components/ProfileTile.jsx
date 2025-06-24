import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
function ProfileTile({ user }) {
  const [added, setAdded] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          "http://localhost:5000/api/user/isfriend",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
            params: {
              to: user._id,
            },
          }
        );
        const response1 = await axios.get(
          "http://localhost:5000/api/user/issent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
            params: {
              to: user._id,
            },
          }
        );
        if (response.data === "Added") {
          setAdded("Added");
        } else if (
          response.data === "Add Friend" &&
          response1.data === "Sent"
        ) {
          setAdded("Sent");
        } else if (
          response.data === "Added" &&
          response1.data === "Add Friend"
        ) {
          setAdded("Added");
        } else {
          setAdded("Add Friend");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  });
  const sendreq = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        "http://localhost:5000/api/user/sendrequest",
        { to: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userid: userId,
          },
        }
      );
      if (response.data.message === "Alreadysent") {
        window.alert(
          "You have a pending request from this user. Please accept in the 'Pending requests' tab"
        );
      } else {
        setAdded("Sent");
      }

      console.log(response.data.message);
    } catch (error) {
      setError(error.message);
    }
  };
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-around">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 200 200"
        >
          <circle
            fill="#FF156D"
            stroke="#FF156D"
            strokeWidth="15"
            r="15"
            cx="40"
            cy="65"
          >
            <animate
              attributeName="cy"
              calcMode="spline"
              dur="2"
              values="65;135;65;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.4"
            ></animate>
          </circle>
          <circle
            fill="#FF156D"
            stroke="#FF156D"
            strokeWidth="15"
            r="15"
            cx="100"
            cy="65"
          >
            <animate
              attributeName="cy"
              calcMode="spline"
              dur="2"
              values="65;135;65;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.2"
            ></animate>
          </circle>
          <circle
            fill="#FF156D"
            stroke="#FF156D"
            strokeWidth="15"
            r="15"
            cx="160"
            cy="65"
          >
            <animate
              attributeName="cy"
              calcMode="spline"
              dur="2"
              values="65;135;65;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="0"
            ></animate>
          </circle>
        </svg>
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="p-2 flex justify-between w-[100%]">
      <div className="flex items-center gap-5">
        <div>
          <img
            src={user.pfp}
            alt="Profile"
            className="rounded-full w-12 h-12"
          />
        </div>
        <div>{user.username}</div>
      </div>
      <div>
        {added === "Add Friend" ? (
          <button
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={sendreq}
          >
            {added}
          </button>
        ) : (
          <button
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            {added}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileTile;
