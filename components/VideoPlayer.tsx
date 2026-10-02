"use client";

import { useState, type ReactNode } from "react";

/** Shows our cover first; the YouTube player (privacy-enhanced mode) loads only when someone presses play. */
export default function VideoPlayer({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="video-player">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-poster" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
          {children}
          <span className="video-play">Play video</span>
        </button>
      )}
    </div>
  );
}
