import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function MyFriends() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          "http://localhost:5000/api/user/getfriends",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
          }
        );
        setFriends(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const seeprofile = async (userId) => {
    navigate(`/Profile?userId=${userId}`);
  };

  if (loading) {
    return (
      <div className="w-[50vw] h-[90vh] flex items-center justify-center">
        Loading..........
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-[50vw] h-[90vh] flex items-center justify-center">
        {error}
      </div>
    );
  }
  return (
    <div className="flex flex-col p-8 custom-950:p-0">
      <div className="p-[2vw] text-3xl font-bold">My Friends</div>
      <div className="grid grid-cols-1 p-[2vw] gap-5">
        {friends.length > 0 ? (
          friends.map((user) => (
            <div className=" flex justify-between w-[100%] font-bold text-xl items-center align-center">
              <div className="flex items-center">
                <div className="mr-4 justify-around flex items-center align-center rounded-full border-2 border-gray-500 w-16 h-16">
                  <img className="rounded-full" src={user.pfp} alt="" />
                </div>
                <div>{user.username}</div>
              </div>
              <div className="flex items-center align-center">
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => seeprofile(user.userId)}
                >
                  See Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>You have no friends</div>
        )}
      </div>
    </div>
  );
}

export default MyFriends;
