import React, { useEffect, useRef, useState } from "react";

const Player = ({ videoName }) => {
  const [src, setSrc] = useState();

  useEffect(() => {
    const fetchHlsStreamUrl = async () => {
      setSrc(`/api/stream?videoName=${encodeURIComponent(videoName)}`);
    };

    fetchHlsStreamUrl();
  }, [videoName]);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div className="video-content-box">
      <video
        key={src}
        width="100%"
        height="100%"
        controls
        onContextMenu={handleContextMenu}
		controlsList="nodownload"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export default Player;
