import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
function PendingRequests() {
  const [requests, setRequests] = useState("");
  const [button, setButton] = useState("Accept");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          "http://localhost:5000/api/user/receivedrequests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
          }
        );
        setRequests(response.data);
        console.log(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const acceptreq = async (userid) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        "http://localhost:5000/api/user/acceptrequest",
        { from: userid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userid: userId,
          },
        }
      );
      if (response.data.message === "Request accepted") {
        setButton("Accepted");
      }

      console.log(response.data.message);
    } catch (error) {
      setError(error.message);
    }
  };
  if (loading) {
    return <div>{loading}</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="flex flex-col">
      <div className="p-8 text-3xl font-bold">Pending Requests</div>
      <div className="grid grid-cols-1 p-4 gap-5">
        {requests.length > 0 ? (
          requests.map((user) => (
            <div className="p-4 flex justify-between w-[100%] items-center">
              <div className="flex items-center">
                <div>
                  <img
                    src={user.pfp}
                    className="rounded-full h-16 w-16"
                    alt=""
                  />
                </div>
                <div className="ml-4">{user.username}</div>
              </div>

              <div>
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => acceptreq(user.userId)}
                >
                  {button}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="font-bold text-2xl">You have no requests..</div>
        )}
      </div>
    </div>
  );
}

export default PendingRequests;
