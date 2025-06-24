import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import AudioMessageBubble from "./AudioMessageBubble";
import axios from "axios";
import { io } from "socket.io-client";
import { Phone, Video, Mic, Paperclip } from "lucide-react";
import Peer from "simple-peer";

function ChatWindow({ active }) {
  const [messages, setMessages] = useState([]);
  const [sendmsg, setSendmsg] = useState("");
  const socketRef = useRef();
  const [callModal, setCallModal] = useState(false);
  const [callType, setCallType] = useState(null); // 'video' or 'audio'
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const peerRef = useRef();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for incoming call
    socket.on("callUser", ({ from, signal, callType }) => {
      setIncomingCall({ from, signal, callType });
      setCallModal(true);
      setCallType(callType);
    });

    // Listen for call accepted
    socket.on("callAccepted", (signal) => {
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (active) {
      fetchMessages(active.userId);
      const userId = localStorage.getItem("userId");
      socketRef.current.emit("joinRoom", { userId, friendId: active.userId });
    }
  }, [active]);

  useEffect(() => {
    const messageContainer = document.getElementById("messages-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  const sendmessage = () => {
    const trimmedMessage = sendmsg.trim();
    if (!trimmedMessage) {
      console.log("Cannot send an empty message");
      return;
    }

    const userId = localStorage.getItem("userId");
    const friendId = active.userId;

    socketRef.current.emit("sendMessage", {
      sender: userId,
      receiver: friendId,
      message: sendmsg,
    });

    setSendmsg("");
  };

  const fetchMessages = async (friendId) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/messages/getmessages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId,
          },
          params: {
            friendId: friendId,
          },
        }
      );

      if (response.status === 200) {
        const messages = response.data;
        setMessages(messages);
      } else {
        console.error("Failed to fetch messages:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  // --- Call Logic ---
  const handleVoiceCall = async () => {
    setCallType("audio");
    setCallModal(true);
    const userId = localStorage.getItem("userId");
    const friendId = active.userId;
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setStream(userStream);
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: userStream,
      });
      peerRef.current = peer;
      peer.on("signal", (signalData) => {
        socketRef.current.emit("callUser", {
          to: friendId,
          from: userId,
          signalData,
          callType: "audio",
        });
      });
      peer.on("stream", (remote) => {
        setRemoteStream(remote);
      });
      // Clean up on close
      peer.on("close", () => {
        setCallModal(false);
        setStream(null);
        setRemoteStream(null);
        peerRef.current = null;
      });
    } catch (err) {
      alert("Microphone permission denied or not available.");
      setCallModal(false);
    }
  };

  const handleVideoCall = async () => {
    setCallType("video");
    setCallModal(true);
    const userId = localStorage.getItem("userId");
    const friendId = active.userId;
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setStream(userStream);
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: userStream,
      });
      peerRef.current = peer;
      peer.on("signal", (signalData) => {
        socketRef.current.emit("callUser", {
          to: friendId,
          from: userId,
          signalData,
          callType: "video",
        });
      });
      peer.on("stream", (remote) => {
        setRemoteStream(remote);
      });
      peer.on("close", () => {
        setCallModal(false);
        setStream(null);
        setRemoteStream(null);
        peerRef.current = null;
      });
    } catch (err) {
      alert("Camera or microphone permission denied or not available.");
      setCallModal(false);
    }
  };

  // Accept incoming call
  const acceptCall = async () => {
    setCallType(incomingCall.callType);
    setCallModal(true);
    const userId = localStorage.getItem("userId");
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: incomingCall.callType === "video",
      });
      setStream(userStream);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: userStream,
      });
      peerRef.current = peer;
      peer.on("signal", (signalData) => {
        socketRef.current.emit("answerCall", {
          to: incomingCall.from,
          signal: signalData,
        });
      });
      peer.on("stream", (remote) => {
        setRemoteStream(remote);
      });
      peer.signal(incomingCall.signal);
      peer.on("close", () => {
        setCallModal(false);
        setStream(null);
        setRemoteStream(null);
        peerRef.current = null;
      });
      setIncomingCall(null);
    } catch (err) {
      alert("Permission denied or not available.");
      setCallModal(false);
      setIncomingCall(null);
    }
  };

  // End call
  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setCallModal(false);
    setStream(null);
    setRemoteStream(null);
    setIncomingCall(null);
    peerRef.current = null;
  };

  // --- Audio Recording Logic (WhatsApp style: hold to record, release to send) ---
  const handleMicMouseDown = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      let chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result;
          const userId = localStorage.getItem("userId");
          const friendId = active.userId;
          socketRef.current.emit("sendMessage", {
            sender: userId,
            receiver: friendId,
            message: base64Audio,
            messageType: "audio",
          });
        };
        reader.readAsDataURL(blob);
        setMediaRecorder(null);
        setRecording(false);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      alert("Microphone permission denied or not available.");
    }
  };

  const handleMicMouseUp = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
    }
  };

  // --- Image Attachment Logic ---
  const handleAttachmentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const sendImage = () => {
    if (!imagePreview || !imageFile) return;
    const userId = localStorage.getItem("userId");
    const friendId = active.userId;
    socketRef.current.emit("sendMessage", {
      sender: userId,
      receiver: friendId,
      message: imagePreview,
      messageType: "image",
      fileName: imageFile.name,
    });
    setImagePreview(null);
    setImageFile(null);
  };

  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 w-[100%] text-3xl font-bold">
        <div className="text-6xl font-bold bg-gradient-to-br from-purple-500 to-indigo-500 text-purple p-[1vw] bg-clip-text text-transparent">
          Connectify
        </div>
        <div className="flex flex-col items-center">
          <div>Your Messages</div>
          <div>Send a message to start a chat</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex p-[2vw] text-4xl font-bold border-b-2 border-gray-800 items-center">
        <div className="flex items-center">
          <img
            src={active.pfp}
            alt="Profile"
            className="rounded-full w-12 h-12"
          />
          <div className="ml-[2vw]">{active.username}</div>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <button onClick={handleVideoCall}>
            <Video size={24} />
          </button>
          <button onClick={handleVoiceCall}>
            <Phone size={24} />
          </button>
        </div>
      </div>
      <div
        id="messages-container"
        className="flex flex-col gap-5 h-[90%] px-[2vw] overflow-y-auto"
      >
        {messages.length === 0 ? (
          <div>No messages found</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-[100%] ${
                msg.sender === localStorage.getItem("userId")
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.messageType === "audio" ? (
                <AudioMessageBubble url={msg.message} />
              ) : msg.messageType === "image" ? (
                <img
                  src={msg.message}
                  alt={msg.fileName || "Image"}
                  className="max-w-[200px] max-h-[200px] rounded-lg border"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <MessageBubble
                  username={
                    msg.sender === localStorage.getItem("userId")
                      ? "You"
                      : "Friend"
                  }
                  message={msg.message}
                  time={msg.timestamp}
                />
              )}
            </div>
          ))
        )}
      </div>
      {/* Image preview before sending */}
      {imagePreview && (
        <div className="flex items-center px-[2vw] py-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-[120px] max-h-[120px] rounded-lg border mr-4"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={sendImage}
          >
            Send Image
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setImagePreview(null);
              setImageFile(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <div className="px-[2vw] pt-2 flex items-center">
        <input
          className="w-[60%] h-[8vh] rounded-xl bg-transparent border-2 border-gray-500 p-[1vw]"
          placeholder="Message...."
          value={sendmsg}
          onChange={(e) => setSendmsg(e.target.value)}
        />
        {/* Audio message button (hold to record) */}
        <button
          className="ml-2"
          onMouseDown={handleMicMouseDown}
          onMouseUp={handleMicMouseUp}
          onMouseLeave={handleMicMouseUp}
          title={
            recording ? "Recording... Release to send" : "Hold to record audio"
          }
          style={{ background: recording ? "#fee2e2" : "transparent" }}
        >
          <Mic size={25} color={recording ? "red" : "currentColor"} />
        </button>
        {/* Attachment button */}
        <label className="ml-2 cursor-pointer" title="Send Image">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAttachmentUpload}
          />
          <Paperclip size={25} />
        </label>
        <button className="ml-6" onClick={sendmessage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg>
        </button>
      </div>
      {/* Call Modal */}
      {callModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            {incomingCall && (
              <>
                <div className="mb-4 text-xl font-bold">
                  Incoming{" "}
                  {incomingCall.callType === "video" ? "Video" : "Voice"} Call
                </div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={acceptCall}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={endCall}
                >
                  Decline
                </button>
              </>
            )}
            {!incomingCall && (
              <>
                <div className="mb-2 text-lg font-semibold">
                  {callType === "video" ? "Video" : "Voice"} Call
                </div>
                <div className="flex gap-4">
                  {/* Local stream */}
                  {stream && (
                    <video
                      ref={(video) => {
                        if (video && stream) video.srcObject = stream;
                      }}
                      autoPlay
                      muted
                      playsInline
                      className="w-40 h-32 bg-black rounded"
                      style={{
                        display: callType === "video" ? "block" : "none",
                      }}
                    />
                  )}
                  {/* Remote stream */}
                  {remoteStream && (
                    <video
                      ref={(video) => {
                        if (video && remoteStream)
                          video.srcObject = remoteStream;
                      }}
                      autoPlay
                      playsInline
                      className="w-40 h-32 bg-black rounded"
                      style={{
                        display: callType === "video" ? "block" : "none",
                      }}
                    />
                  )}
                  {/* For voice call, show status */}
                  {callType === "audio" && (
                    <div className="text-center text-lg font-bold">
                      Voice Call Ongoing...
                    </div>
                  )}
                </div>
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                  onClick={endCall}
                >
                  End Call
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
