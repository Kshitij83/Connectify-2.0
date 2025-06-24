import React from "react";
import axios from "axios";
import { useState } from "react";
function CreatePost({ setCreate }) {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const onFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const createPost = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        "http://localhost:5000/api/posts/createpost",
        {
          base64: image,
          caption: caption,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId,
          },
        }
      );

      console.log(response.data);
      window.alert("Posted Successfully");
      setCreate(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      console.log(false);
    }
  };
  return (
    <div className="fixed w-[100vw] h-[100vh] top-0 flex align-center justify-around items-center bg-black bg-opacity-50">
      <div className="relative flex flex-col p-8 bg-gray-500 shadow-xl rounded-lg">
        <button
          type="button"
          onClick={() => setCreate(false)}
          className="btn-close btn-close-white absolute top-2 right-4 w-2 h-2 "
          aria-label="Close"
        >
          X
        </button>

        <div className="flex align-center items-center w-[100%] justify-around p-4 text-2xl font-bold">
          Create a Post
        </div>
        <div className="px-4 pb-4">
          <div className="text-white">Image</div>
          <input
            accept="image/*"
            type="file"
            onChange={onFileChange}
            className="bg-gray-600 w-[100%] text-white"
          />
        </div>
        <div className="px-4 pb-6">
          <div className="text-white">Caption</div>
          <input
            className="w-[100%] text-black"
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="w-[100%] text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={createPost}
        >
          Create Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
