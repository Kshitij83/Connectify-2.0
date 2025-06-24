import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Comments from './Comments';

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false); // Add state to track if the post is liked
  const [showComments, setShowComments] = useState(false);
  const [Pfp, setPfp] = useState("");

  useEffect(() => {
    const getPfp = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/getpfp', {
          params: {
            userId: post.userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        setPfp(response.data);
      } catch (error) {
        console.error("Error getting pfp:", error);
      }
    };

    getPfp();

    const checkLiked = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:5000/api/posts/liked/${post._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            userId: userId,
          }
        });
        setLiked(response.data.liked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLiked();
  }, [post.userId, post._id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`http://localhost:5000/api/posts/like/${post._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          userId: userId,
        }
      });
      setLikes(response.data.post.likes);
      setLiked(response.data.liked); // Update liked state
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col border-t border-gray-500 pt-2">
        <div className="px-[1vw] font-bold text-xl flex items-center">
          {Pfp ? <img src={Pfp} alt="Profile" className="rounded-full w-12 h-12" /> : <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
          </svg>}
          <div className='ml-4'>{post.username}</div>
        </div>
        <div className="p-[1vw]">
          <img src={post.image} alt="Post" />
        </div>
        <div className="px-[1vw] flex align-center items-center">
          <div className='font-bold text-lg'>{post.username}</div>
          <div className='ml-2'>{post.caption}</div>
        </div>
        <div className="flex flex-row p-[1vw] items-center align-center">
          <div onClick={handleLike}>
            {liked ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            )}
            <div className='ml-2'>{likes}</div>
          </div>
          <div onClick={() => { setShowComments(true) }} className='ml-4 mb-7'>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-chat-dots-fill" viewBox="0 0 16 16">
              <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
            </svg>
          </div>
        </div>
      </div>
      {showComments && (<Comments showComments={showComments} setShowComments={setShowComments} post={post} />)}
    </>
  );
}

export default PostCard;
