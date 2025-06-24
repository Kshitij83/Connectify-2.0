import React, { useState, useEffect } from "react";
import axios from "axios";

function Comments({ showComments, setShowComments, post }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const fetchComments = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:5000/api/comments/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            userId: userId,
          },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [post._id]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, fetchComments]);

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `http://localhost:5000/api/comments/${post._id}`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            userId: userId,
          },
        }
      );
      setComments([...comments, response.data.comments]);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-black rounded-lg shadow-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Comments</h2>
          <button
            onClick={() => setShowComments(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <div className="comments-section border-t border-gray-300 mt-4 p-2 overflow-y-auto max-h-64">
          {comments.map((comment, index) => (
            <div key={index} className="comment mb-4">
              <div className="font-bold">{comment.username}</div>
              <div>{comment.text}</div>
            </div>
          ))}
        </div>
        <div className="p-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment"
            className="border border-gray-300 rounded p-2 w-full"
            style={{ color: "black" }}
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Comments;
