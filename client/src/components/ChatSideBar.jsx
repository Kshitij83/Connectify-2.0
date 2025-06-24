import React, { useState, useEffect } from "react";
import axios from "axios";

function ChatSideBar({ setActive }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
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

  const sendFriend = (user) => {
    setActive(user);
    setSidebarVisible(false);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex-col overflow-y-auto h-full border-r-2 border-gray-500 hidden md:flex w-[35vw]">
        <div className="p-4 px-10 text-[30.6px] font-bold flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-chat-left-dots-fill"
            viewBox="0 0 16 16"
          >
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
          </svg>
          <div className="ml-2">Messages</div>
        </div>
        <div className="grid grid-cols-1 px-[2vw] py-[1vw] gap-5">
          {friends.length > 0 ? (
            friends.map((user) => (
              <div
                key={user.userId}
                className="flex px-2 py-4 text-3xl items-center w-[100%] hover:bg-purple-900 rounded-lg hover:font-bold hover:cursor-pointer"
                onClick={() => sendFriend(user)}
              >
                <div>
                  <img
                    src={user.pfp}
                    alt="Profile"
                    className="rounded-full w-12 h-12"
                  />
                </div>
                <div className="ml-[1vw]">{user.username}</div>
              </div>
            ))
          ) : (
            <div>You have no friends</div>
          )}
        </div>
      </div>

      <button
        className="fixed top-6 right-4 p-2 bg-purple-600 text-white rounded-full md:hidden"
        onClick={() => setSidebarVisible(true)}
      >
        Messages
      </button>

      {sidebarVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center md:hidden">
          <div className="relative w-[90vw] h-[90vh] bg-black rounded-lg shadow-xl">
            <button
              className="absolute top-6 right-4 text-red-500 font-bold text-xl"
              onClick={() => setSidebarVisible(false)}
            >
              x
            </button>
            <div className="p-4 text-[30.6px] font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-chat-left-dots-fill"
                viewBox="0 0 16 16"
              >
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              </svg>
              <div className="ml-2">Messages</div>
            </div>
            <div className="grid grid-cols-1 px-[2vw] py-[1vw] gap-5">
              {friends.length > 0 ? (
                friends.map((user) => (
                  <div
                    key={user.userId}
                    className="flex px-[1vh] py-[1vw] text-3xl items-center w-[100%] hover:bg-purple-900 rounded-lg hover:font-bold hover:cursor-pointer"
                    onClick={() => sendFriend(user)}
                  >
                    <div>
                      <img
                        src={user.pfp}
                        alt="Profile"
                        className="rounded-full w-12 h-12"
                      />
                    </div>
                    <div className="ml-[1vw]">{user.username}</div>
                  </div>
                ))
              ) : (
                <div>You have no friends</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatSideBar;
