import React, { useRef, useState, useEffect } from "react";
import { Mic } from "lucide-react";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Simple waveform generator (for demo, not real waveform)
function Waveform({ playing }) {
  return (
    <div className="flex-1 flex items-center mx-2">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="bg-purple-400 rounded"
          style={{
            width: 3,
            height: Math.random() * 18 + 8,
            marginLeft: 1,
            marginRight: 1,
            opacity: playing ? 1 : 0.5,
            transition: "height 0.2s",
          }}
        />
      ))}
    </div>
  );
}

const AudioMessageBubble = ({ url }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
      };
    }
  }, [url]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex items-center bg-purple-100 rounded-xl px-3 py-2 max-w-xs">
      <Mic size={22} className="text-purple-700" />
      <Waveform playing={playing} />
      <span className="mx-2 text-gray-700 text-xs">{formatDuration(duration)}</span>
      <button
        className="ml-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
        onClick={handlePlayPause}
      >
        {playing ? (
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <rect width="5" height="14" x="2" y="1" rx="1" />
            <rect width="5" height="14" x="9" y="1" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <polygon points="2,2 14,8 2,14" />
          </svg>
        )}
      </button>
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AudioMessageBubble;
