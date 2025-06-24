import React, { useEffect } from "react";
import BottomBar from "../components/BottomBar";
import "../assets/styles/black.css";
import Sidebar from "../components/Sidebar";
import AddFriend from "../components/AddFriend";
import Post from "../components/Post";
import SentRequests from "../components/SentRequests";
import PendingRequests from "../components/PendingRequests";
import MyFriends from "../components/MyFriends";
import { useState } from "react";
import axios from "axios";
function Home() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          throw new Error("Missing token or userId");
        }

        const response = await axios.get(
          "http://localhost:5000/api/user/getprofile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
          }
        );

        setUser(response.data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching user profile:", error);
      }
    })();
  }, []);

  let ActiveComponent;
  switch (active) {
    case "Home":
      ActiveComponent = Post;
      break;
    case "Add Friends":
      ActiveComponent = AddFriend;
      break;
    case "Sent Requests":
      ActiveComponent = SentRequests;
      break;
    case "Pending Requests":
      ActiveComponent = PendingRequests;
      break;
    case "My Friends":
      ActiveComponent = MyFriends;
      break;
    default:
      ActiveComponent = Post;
  }

  return (
    <>
      <div className="flex w-[100vw]">
        <Sidebar setActive={setActive} />
        <BottomBar setActive={setActive} />
        <div className="ml-0 w-[100vw] custom-950:ml-[25vw] custom-950:p-[1vw] custom-950:w-[50vw]">
          <ActiveComponent />
        </div>
        <div className="w-[0vw] hidden custom-950:flex custom-950:w-[30%]">
          <div className="p-[2vw]">
            <div className="w-[100%] text-3xl font-bold py-[1vw]">
              Logged In as:
            </div>
            {user ? (
              <div className="flex align-center items-center">
                <img
                  src={user.pfp}
                  alt="unable to load post"
                  className="rounded-full w-16 h-16 mr-2"
                />
                <div className="text-xl">{user.username}</div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
