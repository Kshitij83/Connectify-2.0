import React from "react";

function MessageBubble({ username, message, time }) {
  return (
    <div className="flex flex-end items-center p-0 gap-2.5">
      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-purple-100 rounded-e-xl rounded-es-xl dark:bg-green-800">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {username}
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {time}
          </span>
        </div>
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
          {message}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;
