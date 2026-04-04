"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import "./surprise.css";

const PLAYLIST_ID = "3hBtJU9oHgkckXErVff3qM";

const MONTHS = [
  { id: "oct", name: "Octoberr", emoji: "🍂", desc: "Where it all began.", color: "#e8572a", bg: "#3d1a0a" },
  { id: "nov", name: "November", emoji: "🍁", desc: "Getting to know each other.", color: "#d4537e", bg: "#2d0f1c" },
  { id: "dec", name: "December", emoji: "❄️", desc: "Holiday feelings with you.", color: "#4facfe", bg: "#0a1f3d" },
  { id: "jan", name: "January", emoji: "🌸", desc: "New year, same us.", color: "#a78bfa", bg: "#1a0d3d" },
  { id: "feb", name: "February", emoji: "💕", desc: "Valentine's & every little thing.", color: "#f472b6", bg: "#2d0f20" },
  { id: "mar", name: "March", emoji: "🌿", desc: "5 months and counting.", color: "#34d399", bg: "#0a2d1f" },
];

function formatTime(s) {
  if (isNaN(s) || !s) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function SurprisePage() {
  const { data: session, status } = useSession();
  const [view, setView] = useState("home");
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [ourSongs, setOurSongs] = useState([]);
  const [ourPlaylistInfo, setOurPlaylistInfo] = useState(null);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [usingPreview, setUsingPreview] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const progressInterval = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const p = new window.Spotify.Player({
        name: "Ardit & Kenisha 💕",
        getOAuthToken: (cb) => cb(session.accessToken),
        volume: 0.8,
      });

      p.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        setSdkReady(true);
        setUsingPreview(false);
      });

      p.addListener("not_ready", () => {
        setSdkReady(false);
        setUsingPreview(true);
      });

      p.addListener("player_state_changed", (state) => {
        if (!state) return;
        const track = state.track_window.current_track;
        setCurrentSong({
          id: track.id,
          name: track.name,
          artists: track.artists.map((a) => a.name).join(", "),
          cover: track.album.images[0]?.url,
        });
        setIsPlaying(!state.paused);
        setDuration(state.duration / 1000);

        if (!isDraggingRef.current) {
          setProgress(state.position / 1000);
        }
      });

      p.connect().then((success) => {
        if (!success) {
          setUsingPreview(true);
        }
      });
      setPlayer(p);
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onerror = () => setUsingPreview(true);
    document.body.appendChild(script);

    return () => {
      const oldScript = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
      if (oldScript) document.body.removeChild(oldScript);
    };
  }, [session?.accessToken]);

  // Preview audio fallback
  useEffect(() => {
    if (!usingPreview) return;
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (!isDraggingRef.current) setProgress(audio.currentTime);
    });
    audio.addEventListener("durationchange", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [usingPreview]);

  useEffect(() => {
    if (isPlaying && !isDragging && !usingPreview) {
      progressInterval.current = setInterval(async () => {
        if (player) {
          const state = await player.getCurrentState();
          if (state && !isDraggingRef.current) {
            setProgress(state.position / 1000);
          }
        }
      }, 500);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying, player, isDragging, usingPreview]);

  useEffect(() => {
    if (!session?.accessToken) return;
    fetchOurPlaylist();
  }, [session?.accessToken]);

  const fetchOurPlaylist = async () => {
    setLoadingSongs(true);
    try {
      const res = await fetch(`/api/playlist?id=${PLAYLIST_ID}`);
      const data = await res.json();
      if (data.tracks) {
        setOurSongs(data.tracks);
        setOurPlaylistInfo(data.info);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingSongs(false);
  };

  const playSong = async (song) => {
    if (usingPreview || !deviceId) {
      // fallback: play preview
      if (!song.preview_url) return;
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = song.preview_url;
      audio.play();
      setIsPlaying(true);
      setCurrentSong({
        id: song.id,
        name: song.name,
        artists: song.artists,
        cover: song.cover,
      });
      return;
    }

    if (!session?.accessToken) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_uri: `spotify:playlist:${PLAYLIST_ID}`,
          offset: { uri: `spotify:track:${song.id}` },
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const togglePlay = () => {
    if (usingPreview) {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      if (player) player.togglePlay();
    }
  };

  const skipNext = () => {
    if (usingPreview) {
      const idx = ourSongs.findIndex((s) => s.id === currentSong?.id);
      const next = ourSongs[idx + 1];
      if (next) playSong(next);
    } else {
      if (player) player.nextTrack();
    }
  };

  const skipPrev = () => {
    if (usingPreview) {
      const idx = ourSongs.findIndex((s) => s.id === currentSong?.id);
      const prev = ourSongs[idx - 1];
      if (prev) playSong(prev);
    } else {
      if (player) player.previousTrack();
    }
  };

  const handleSeekEnd = async (e) => {
    const val = parseFloat(e.target.value);
    if (usingPreview) {
      if (audioRef.current) audioRef.current.currentTime = val;
    } else {
      if (player) await player.seek(Math.round(val * 1000));
    }
    setTimeout(() => {
      setIsDragging(false);
      isDraggingRef.current = false;
    }, 800);
  };

  const OUR_PLAYLIST = {
    id: "ours",
    name: ourPlaylistInfo?.name || "Our Playlist",
    emoji: "🎵",
    desc: ourPlaylistInfo?.description || "The songs that are us.",
    color: "#1DB954",
    bg: "#0a2d14",
    cover: "/photos/our-playlist.jpg",
  };

  const allPlaylists = [...MONTHS, OUR_PLAYLIST];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const openPlaylist = (p) => { setActivePlaylist(p); setView("playlist"); };

  const PlayIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/>
    </svg>
  );

  const PauseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"/>
    </svg>
  );

  const renderTrackNum = (song, i) => {
    const isCurrentSong = currentSong?.id === song.id;
    const isHovered = hoveredTrack === song.id;

    if (isCurrentSong) {
      if (isHovered) {
        return isPlaying ? <PauseIcon /> : <PlayIcon />;
      }
      return isPlaying
        ? <span className="sp-eq"><span/><span/><span/></span>
        : i + 1;
    }

    if (isHovered) return <PlayIcon />;
    return i + 1;
  };

  if (status === "loading") {
    return <div style={{ background: "#000", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>Loading...</div>;
  }

  if (!session) {
    return (
      <div style={{ background: "#000", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <img src="/iconspotify.png" alt="logo" width={300} style={{ objectFit: "contain" }} />
        <button onClick={() => signIn("spotify")} style={{ background: "#1DB954", color: "#000", border: "none", borderRadius: 500, padding: "14px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
          Login sek
        </button>
      </div>
    );
  }

  return (
    <div className="sp-app">
      <div className="sp-sidebar">
        <div className="sp-sidebar-top">
          <div className="sp-logo">
            <img src="/iconspotify.png" alt="logo" width={130} height={40} style={{ objectFit: "contain" }} />
          </div>
          <nav className="sp-nav">
            <button className={`sp-nav-item${view === "home" ? " active" : ""}`} onClick={() => setView("home")}>
              <img src="/home-icon.png" alt="Home" width="20" height="20" style={{ objectFit: "contain" }} />
              <span style={{ transform: "translateY(1px)" }}>Home</span>
            </button>
          </nav>
        </div>
        <div className="sp-library">
          <div className="sp-lib-title">Your Library</div>
          <div className="sp-lib-list">
            {allPlaylists.map(p => (
              <button key={p.id} className={`sp-lib-item${activePlaylist?.id === p.id && view === "playlist" ? " active" : ""}`} onClick={() => openPlaylist(p)}>
                <div className="sp-lib-thumb" style={{ background: p.cover ? "transparent" : p.color, overflow: "hidden" }}>
                  {p.cover ? <img src={p.cover} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} /> : p.emoji}
                </div>
                <div className="sp-lib-info">
                  <div className="sp-lib-name">{p.name}</div>
                  <div className="sp-lib-meta">{p.id === "ours" ? "Playlist" : "Memories"} • Us</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sp-main">
        {view === "home" && (
          <div className="sp-home" style={{ overflowY: "auto", height: "100%" }}>
            <div className="sp-home-header" style={{ background: "linear-gradient(180deg,#1a3a2a 0%,transparent 100%)" }}>
              <div className="sp-greeting">{greeting()}, Kenisha 💕</div>
              <div className="sp-quick-grid">
                {allPlaylists.slice(0, 6).map(p => (
                  <button key={p.id} className="sp-quick-card" onClick={() => openPlaylist(p)}>
                    <div className="sp-quick-thumb" style={{ background: p.cover ? "transparent" : p.color, overflow: "hidden" }}>
                      {p.cover ? <img src={p.cover} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.emoji}
                    </div>
                    <span className="sp-quick-name">{p.name}</span>
                    <div className="sp-quick-play">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="sp-section">
              <div className="sp-section-header">
                <span className="sp-section-title">Our months together 🗓</span>
              </div>
              <div className="sp-cards-grid">
                {MONTHS.map(p => (
                  <button key={p.id} className="sp-card" onClick={() => openPlaylist(p)}>
                    <div className="sp-card-img" style={{ background: p.bg, border: `1px solid ${p.color}22` }}>
                      <span style={{ fontSize: 44 }}>{p.emoji}</span>
                    </div>
                    <div className="sp-card-title">{p.name}</div>
                    <div className="sp-card-desc">{p.desc}</div>
                    <div className="sp-card-play">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "playlist" && activePlaylist && (
          <div className="sp-playlist-view" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
            <div className="sp-playlist-top" style={{ flexShrink: 0 }}>
              <div className="sp-playlist-hero" style={{ background: `linear-gradient(180deg, ${activePlaylist.bg || "#1a3a2a"} 0%, #121212 100%)`, padding: "60px 24px 24px" }}>
                <button className="sp-back-btn" onClick={() => setView("home")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.957 2.793a1 1 0 0 1 0 1.414L8.164 12l7.793 7.793a1 1 0 1 1-1.414 1.414L5.336 12l9.207-9.207a1 1 0 0 1 1.414 0z"/></svg>
                </button>
                <div className="sp-playlist-cover">
                  {activePlaylist.cover
                    ? <img src={activePlaylist.cover} alt={activePlaylist.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                    : <span style={{ fontSize: 72 }}>{activePlaylist.emoji}</span>}
                </div>
                <div className="sp-playlist-meta">
                  <div className="sp-playlist-type">Playlist</div>
                  <div className="sp-playlist-name">{activePlaylist.id === "ours" ? OUR_PLAYLIST.name : `${activePlaylist.name} Together`}</div>
                  <div className="sp-playlist-sub">Ardit & Kenisha • {activePlaylist.desc}</div>
                </div>
              </div>

              {activePlaylist.id === "ours" && (
                <div className="sp-playlist-actions" style={{ padding: "20px 24px", background: "#121212" }}>
                  <button className="sp-big-play" onClick={isPlaying ? togglePlay : () => ourSongs.length > 0 && playSong(ourSongs[0])}>
                    {isPlaying
                      ? <svg width="28" height="28" viewBox="0 0 24 24" fill="#000"><path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>
                      : <svg width="28" height="28" viewBox="0 0 24 24" fill="#000"><path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/></svg>}
                  </button>
                </div>
              )}
            </div>

            <div className="sp-playlist-scroll" style={{ flex: 1, overflowY: "auto" }}>
              <div className="sp-tracklist" style={{ padding: "0 24px 120px" }}>
                {activePlaylist.id === "ours" ? (
                  <>
                    <div className="sp-track-header" style={{ position: "sticky", top: 0, background: "#121212", zIndex: 10 }}>
                      <span>#</span>
                      <span>Title</span>
                      <span style={{ textAlign: "right" }}>Duration</span>
                    </div>
                    {loadingSongs ? (
                      <div className="sp-empty">Loading songs...</div>
                    ) : (
                      ourSongs.map((song, i) => (
                        <button
                          key={song.id}
                          className={`sp-track-row${currentSong?.id === song.id ? " playing" : ""}`}
                          onClick={() => {
                            if (currentSong?.id === song.id) {
                              togglePlay();
                            } else {
                              playSong(song);
                            }
                          }}
                          onMouseEnter={() => setHoveredTrack(song.id)}
                          onMouseLeave={() => setHoveredTrack(null)}
                        >
                          <span className="sp-track-num">
                            {renderTrackNum(song, i)}
                          </span>
                          <div className="sp-track-info">
                            <div className="sp-track-title" style={{ color: currentSong?.id === song.id ? "#1DB954" : "#fff" }}>{song.name}</div>
                            <div className="sp-track-artist">{song.artists}</div>
                          </div>
                          <span className="sp-track-dur">{song.duration}</span>
                        </button>
                      ))
                    )}
                  </>
                ) : (
                  <div className="sp-photo-grid">
                    <div className="sp-photo-empty">
                      <div className="sp-photo-empty-icon">{activePlaylist.emoji}</div>
                      <div className="sp-photo-empty-text">Add your photos here</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {currentSong && (
        <div className="sp-player">
          <div className="sp-player-left">
            <div className="sp-player-thumb">
              {currentSong.cover
                ? <img src={currentSong.cover} alt={currentSong.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
                : <span style={{ fontSize: 20 }}>🎵</span>}
            </div>
            <div className="sp-player-info">
              <div className="sp-player-title">{currentSong.name}</div>
              <div className="sp-player-artist">{currentSong.artists}</div>
            </div>
          </div>
          <div className="sp-player-center">
            <div className="sp-player-controls">
              <button className="sp-ctrl" onClick={skipPrev}>
                <img src="/back.png" alt="Previous" width="18" height="18" style={{ objectFit: "contain", pointerEvents: "none" }} />
              </button>
              <button className="sp-play-pause" onClick={togglePlay}>
                {isPlaying
                  ? <img src="/Pause.png" alt="Pause" width="18" height="18" style={{ objectFit: "contain", pointerEvents: "none" }} />
                  : <img src="/Play.png" alt="Play" width="18" height="18" style={{ objectFit: "contain", pointerEvents: "none" }} />}
              </button>
              <button className="sp-ctrl" onClick={skipNext}>
                <img src="/fwd.png" alt="Next" width="18" height="18" style={{ objectFit: "contain", pointerEvents: "none" }} />
              </button>
            </div>
            <div className="sp-progress-row">
              <span className="sp-time">{formatTime(progress)}</span>
              <input
                type="range"
                className="sp-slider-input"
                min="0"
                max={duration || 100}
                step="0.1"
                value={progress || 0}
                onChange={(e) => {
                  setIsDragging(true);
                  isDraggingRef.current = true;
                  setProgress(parseFloat(e.target.value));
                }}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                style={{ "--val": `${duration ? (progress / duration) * 100 : 0}%` }}
              />
              <span className="sp-time">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="sp-player-right">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#b3b3b3"><path d="M13 3a1 1 0 1 0-2 0v1.07A8.002 8.002 0 0 0 4.07 12H3a1 1 0 1 0 0 2h1.07A8.002 8.002 0 0 0 11 21.93V23a1 1 0 1 0 2 0v-1.07A8.002 8.002 0 0 0 19.93 14H21a1 1 0 1 0 0-2h-1.07A8.002 8.002 0 0 0 13 4.07V3z"/></svg>
            <input
              type="range"
              className="sp-slider-input"
              style={{ width: "90px", flex: "none", "--val": `${volume * 100}%` }}
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
              }}
              onMouseUp={async (e) => {
                if (usingPreview && audioRef.current) {
                  audioRef.current.volume = parseFloat(e.target.value);
                } else if (player) {
                  await player.setVolume(parseFloat(e.target.value));
                }
              }}
              onTouchEnd={async (e) => {
                if (usingPreview && audioRef.current) {
                  audioRef.current.volume = parseFloat(e.target.value);
                } else if (player) {
                  await player.setVolume(parseFloat(e.target.value));
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}