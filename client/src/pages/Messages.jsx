import React, { useState } from "react";
import ChatSideBar from "../components/ChatSideBar";
import ChatWindow from "../components/ChatWindow";

function Messages() {
  const [active, setActive] = useState(null);
  return (
    <div className="flex w-[100vw] h-[100vh] p-[3vw] bg-gradient-to-r from-black via-indigo-1000 to-indigo-900">
      <ChatSideBar setActive={setActive} />
      <ChatWindow active={active} />
    </div>
  );
}

export default Messages;
