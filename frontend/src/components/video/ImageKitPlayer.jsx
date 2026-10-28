import React, { useRef } from 'react';
import { IKVideoPlayer } from '@imagekit/video-player/react';
import '@imagekit/video-player/styles.css';

/**
 * ImageKit Advanced Video Player
 * Supports Adaptive Bitrate Streaming (HLS 360p-1080p), Seek Thumbnails,
 * and responsive Video.js controls.
 */
export default function ImageKitPlayer({
  src,
  poster,
  title,
  autoplay = false,
  className = '',
}) {
  const playerRef = useRef(null);

  // Configured with the user's ImageKit ID: 'imagesource'
  const ikOptions = {
    imagekitId: 'imagesource',
    seekThumbnails: true,
    abs: {
      protocol: 'hls',
      sr: [360, 480, 720, 1080],
    },
  };

  const videoJsOptions = {
    controls: true,
    autoplay: autoplay ? 'muted' : false,
    fluid: true,
    responsive: true,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
  };

  // If a raw ImageKit URL is passed, use it; otherwise fallback to ImageKit demo sample video
  const resolvedSrc = src && src.startsWith('http')
    ? src
    : src
    ? `https://ik.imagekit.io/imagesource/${src}`
    : 'https://ik.imagekit.io/demo/sample-video.mp4';

  const source = {
    src: resolvedSrc,
    ...(poster ? { poster: { src: poster } } : {}),
    ...(title ? { info: { title, description: title } } : {}),
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl bg-black shadow-2xl ${className}`}>
      <IKVideoPlayer
        ref={playerRef}
        ikOptions={ikOptions}
        videoJsOptions={videoJsOptions}
        source={source}
      />
    </div>
  );
}
