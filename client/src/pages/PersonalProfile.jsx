import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import DeleteUserButton from "../components/DeleteUserButton"; // Import the DeleteUserButton

function PersonalProfile() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [create, setCreate] = useState(false);

  const getCroppedImg = async (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          resolve(fileReader.result);
        };
        fileReader.readAsDataURL(blob);
      }, "image/jpeg");
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

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
        setUser({ username: response.data.user.username });
        setCroppedImage(response.data.user.pfp); // Load existing profile picture
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [create]);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setShowCropper(true); // Show cropper when image is selected
    };

    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImg = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImg);
      setShowCropper(false); // Hide cropper after cropping
    } catch (e) {
      console.error(e);
    }
  }, [image, croppedAreaPixels]);

  const saveProfilePicture = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await axios.post(
        "http://localhost:5000/api/user/pfp",
        {
          userId: userId,
          pfp: croppedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId,
          },
        }
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="px-1 pt-6 flex justify-around flex-col items-center md:px-[10vw] custom-950:pt-[3vw]">
        <div className="w-[100%] flex justify-between text-xl pb-8 border-1 border-b border-white p-1 mb-8 custom-950:w-[60%] custom-950:text-xl relative">
          <div className="rounded-full w-32 h-32 flex flex-col align-center items-center">
            <div className="border-2 border-solid rounded-full border-white w-32 h-32 flex items-center justify-center">
              {croppedImage ? (
                <img
                  src={croppedImage}
                  alt="Profile"
                  className="rounded-full"
                />
              ) : (
                <div className="text-white rounded-full w-32 h-32 flex align-center items-center justify-around">
                  PFP
                </div>
              )}
            </div>
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="mt-2 text-white text-sm"
            >
              Upload PFP
            </button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <button
              onClick={saveProfilePicture}
              className="mt-2 text-white text-sm"
            >
              Save
            </button>
          </div>
          <div className="flex flex-col justify-center w-[50%]">
            <div className="p-4">{user.username}</div>
            <div className="flex items-center space-x-4">
              <div className="p-4">{posts.length} Posts</div>
              <div className="p-4">{friends.length} Friends</div>
            </div>
            <button
              onClick={() => {
                setCreate(true);
              }}
              className="flex items-center align-center justify-around p-4 border-2 w-36 text-sm ml-4"
            >
              Create a Post
            </button>
          </div>
          <div style={{ position: "absolute", top: "0", right: "0" }}>
            <DeleteUserButton userId={localStorage.getItem("userId")} />
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
      {create && <CreatePost setCreate={setCreate} />}
      {showCropper && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-full mb-4" style={{ maxWidth: "400px" }}>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <button
              onClick={showCroppedImage}
              className="fixed top-60 left-40 mb-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Crop Image
            </button>
            <button
              onClick={() => setShowCropper(false)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PersonalProfile;
