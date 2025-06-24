import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import PostCard from "../components/PostCard";
import axios from "axios";
function Profile() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = searchParams.get("userId");

        const response = await axios.get(
          "http://localhost:5000/api/posts/userposts",
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPosts(response.data.posts);
        setFriends(response.data.friends);
        setUser(response.data.user); // Set user object containing username and pfp
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="px-1 pt-6 flex justify-around flex-col items-center md:px-[10vw] custom-950:pt-[3vw]">
        <div className="w-[100%] flex justify-around text-xl pb-8 border-1 border-b border-white p-1 mb-8 custom-950:w-[60%] custom-950:text-xl ">
          <div className="rounded-full w-32 h-32 flex flex-col align-center items-center">
            <div className="border-2 border-solid rounded-full border-white w-32 h-32 flex items-center justify-center">
              {user.pfp ? (
                <img src={user.pfp} alt="Profile" className="rounded-full" />
              ) : (
                <div className="text-white rounded-full w-32 h-32 flex align-center items-center justify-around">
                  PFP
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center w-[50%]">
            <div className="p-4">{user.username}</div>
            <div className="flex items-center space-x-4">
              <div className="p-4">{posts.length} Posts</div>
              <div className="p-4">{friends.length} Friends</div>
            </div>
          </div>
        </div>
        <div className="w-[70%] flex justify-around p-[1vw] font-bold text-2xl">
          Posts
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center justify-items-center">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="font-bold text-2xl col-span-3 row-span-10">
              This user has not posted...
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
