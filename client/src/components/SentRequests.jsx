import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function SentRequests() {
  const [username, setUsername] = useState(["No pending sent requests"]);
  const [error, setError] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          "http://localhost:5000/api/user/sentrequests",
          {
            headers: {
              Authorization: token,
              userId: userId,
            },
          }
        );
        setUsername(response.data);
      } catch (error) {
        setError(error.message);
      }
    })();
  }, []);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="flex flex-col p-8 custom-950:p-0">
      <div className="p-[2vw] text-3xl font-bold">Outgoing requests</div>
      <div className="grid grid-cols-1 p-[2vw] gap-5">
        {username.length > 0 ? (
          username.map((user) => (
            <div className=" flex justify-between w-[100%] font-bold text-xl items-center align-center">
              <div className="flex items-center">
                <div className="mr-4 justify-around flex items-center align-center rounded-full border-2 border-gray-500 w-16 h-16">
                  <img className="rounded-full" src={user.pfp} alt="" />
                </div>
                <div>{user.username}</div>
              </div>
              <div className="flex items-center align-center"></div>
            </div>
          ))
        ) : (
          <div>You have no pending outgoing requests</div>
        )}
      </div>
    </div>
  );
}

export default SentRequests;
