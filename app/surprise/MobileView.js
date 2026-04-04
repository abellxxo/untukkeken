"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import "./Mobile.css";

const PLAYLIST_ID = "3hBtJU9oHgkckXErVff3qM";

const MONTHS = [
  { id: "oct", name: "Octoberr", emoji: "🍂", desc: "Where it all began.", color: "#e8572a", bg: "#3d1a0a",
    photos: [
      { src: "/photos/oct/1.jpg", w: 4, h: 5 },{ src: "/photos/oct/2.jpg", w: 3, h: 4 },
      { src: "/photos/oct/3.jpg", w: 1, h: 1 },{ src: "/photos/oct/4.jpg", w: 4, h: 3 },
      { src: "/photos/oct/5.jpg", w: 3, h: 4 },{ src: "/photos/oct/6.jpg", w: 1, h: 1 },
      { src: "/photos/oct/7.jpg", w: 4, h: 5 },{ src: "/photos/oct/8.jpg", w: 3, h: 2 },
    ]
  },
  { id: "nov", name: "November", emoji: "🍁", desc: "Getting to know each other.", color: "#d4537e", bg: "#2d0f1c",
    photos: [
      { src: "/photos/nov/1.jpg", w: 3, h: 4 },{ src: "/photos/nov/2.jpg", w: 1, h: 1 },
      { src: "/photos/nov/3.jpg", w: 4, h: 5 },{ src: "/photos/nov/4.jpg", w: 3, h: 2 },
      { src: "/photos/nov/5.jpg", w: 1, h: 1 },{ src: "/photos/nov/6.jpg", w: 4, h: 3 },
      { src: "/photos/nov/7.jpg", w: 3, h: 4 },{ src: "/photos/nov/8.jpg", w: 4, h: 5 },
    ]
  },
  { id: "dec", name: "December", emoji: "❄️", desc: "Holiday feelings with you.", color: "#4facfe", bg: "#0a1f3d",
    photos: [
      { src: "/photos/dec/1.jpg", w: 1, h: 1 },{ src: "/photos/dec/2.jpg", w: 4, h: 5 },
      { src: "/photos/dec/3.jpg", w: 3, h: 2 },{ src: "/photos/dec/4.jpg", w: 3, h: 4 },
      { src: "/photos/dec/5.jpg", w: 4, h: 3 },{ src: "/photos/dec/6.jpg", w: 1, h: 1 },
      { src: "/photos/dec/7.jpg", w: 3, h: 4 },{ src: "/photos/dec/8.jpg", w: 4, h: 5 },
    ]
  },
  { id: "jan", name: "January", emoji: "🌸", desc: "New year, same us.", color: "#a78bfa", bg: "#1a0d3d",
    photos: [
      { src: "/photos/jan/1.jpg", w: 4, h: 3 },{ src: "/photos/jan/2.jpg", w: 3, h: 4 },
      { src: "/photos/jan/3.jpg", w: 1, h: 1 },{ src: "/photos/jan/4.jpg", w: 4, h: 5 },
      { src: "/photos/jan/5.jpg", w: 3, h: 2 },{ src: "/photos/jan/6.jpg", w: 1, h: 1 },
      { src: "/photos/jan/7.jpg", w: 4, h: 3 },{ src: "/photos/jan/8.jpg", w: 3, h: 4 },
    ]
  },
  { id: "feb", name: "February", emoji: "💕", desc: "Valentine's & every little thing.", color: "#f472b6", bg: "#2d0f20",
    photos: [
      { src: "/photos/feb/1.jpg", w: 3, h: 4 },{ src: "/photos/feb/2.jpg", w: 4, h: 5 },
      { src: "/photos/feb/3.jpg", w: 1, h: 1 },{ src: "/photos/feb/4.jpg", w: 3, h: 2 },
      { src: "/photos/feb/5.jpg", w: 4, h: 3 },{ src: "/photos/feb/6.jpg", w: 3, h: 4 },
      { src: "/photos/feb/7.jpg", w: 1, h: 1 },{ src: "/photos/feb/8.jpg", w: 4, h: 5 },
    ]
  },
  { id: "mar", name: "March", emoji: "🌿", desc: "5 months and counting.", color: "#34d399", bg: "#0a2d1f",
    photos: [
      { src: "/photos/mar/1.jpg", w: 1, h: 1 },{ src: "/photos/mar/2.jpg", w: 4, h: 3 },
      { src: "/photos/mar/3.jpg", w: 3, h: 4 },{ src: "/photos/mar/4.jpg", w: 4, h: 5 },
      { src: "/photos/mar/5.jpg", w: 3, h: 2 },{ src: "/photos/mar/6.jpg", w: 1, h: 1 },
      { src: "/photos/mar/7.jpg", w: 3, h: 4 },{ src: "/photos/mar/8.jpg", w: 4, h: 3 },
    ]
  },
];

function formatTime(s) {
  if (isNaN(s) || !s) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function MasonryGallery({ photos, accent, emoji, onOpen }) {
  const [loaded, setLoaded] = useState({});
  const [errored, setErrored] = useState({});

  const getPlaceholder = (idx, w, h) => {
    const seed = idx * 7 + 1;
    const pw = Math.round(400 * (w / Math.max(w, h)));
    const ph = Math.round(400 * (h / Math.max(w, h)));
    return `https://picsum.photos/seed/${seed}/${pw}/${ph}`;
  };

  const items = photos.map((p, i) => ({
    ...p,
    placeholder: getPlaceholder(i + 1, p.w, p.h),
    aspectPad: `${(p.h / p.w) * 100}%`,
  }));

  if (!items.length) {
    return (
      <div className="m-photo-empty">
        <div style={{ fontSize: 64, marginBottom: 16 }}>{emoji}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>No photos yet</div>
        <div style={{ fontSize: 13, color: "#b3b3b3" }}>Photos will appear here</div>
      </div>
    );
  }

  return (
    <div className="m-masonry-wrap">
      <div className="m-masonry">
        {items.map((photo, i) => (
          <div
            key={i}
            className="m-masonry-item"
            onClick={() => onOpen({ src: errored[i] ? photo.placeholder : photo.src, caption: photo.caption })}
          >
            <div className="m-masonry-img-wrap" style={{ paddingBottom: photo.aspectPad }}>
              {!loaded[i] && (
                <div className="m-masonry-skeleton" style={{ background: accent + "22" }}>
                  <span style={{ fontSize: 20, opacity: 0.4 }}>{emoji}</span>
                </div>
              )}
              <img
                src={photo.src}
                alt={photo.caption || `memory ${i + 1}`}
                className={`m-masonry-img${loaded[i] ? " loaded" : ""}`}
                onLoad={() => setLoaded(l => ({ ...l, [i]: true }))}
                onError={(e) => {
                  setErrored(er => ({ ...er, [i]: true }));
                  e.target.src = photo.placeholder;
                  setLoaded(l => ({ ...l, [i]: true }));
                }}
              />
              {photo.caption && <div className="m-masonry-caption">{photo.caption}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MobileView() {
  const { data: session, status } = useSession();
  const [view, setView] = useState("home"); // home | playlist | library
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
  const [lightbox, setLightbox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const progressInterval = useRef(null);
  const audioRef = useRef(null);

  // ESC to close lightbox
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Spotify SDK
  useEffect(() => {
    if (!session?.accessToken) return;
    window.onSpotifyWebPlaybackSDKReady = () => {
      const p = new window.Spotify.Player({
        name: "Ardit & Kenisha 💕",
        getOAuthToken: (cb) => cb(session.accessToken),
        volume: 0.8,
      });
      p.addListener("ready", ({ device_id }) => { setDeviceId(device_id); setSdkReady(true); setUsingPreview(false); });
      p.addListener("not_ready", () => { setSdkReady(false); setUsingPreview(true); });
      p.addListener("player_state_changed", (state) => {
        if (!state) return;
        const track = state.track_window.current_track;
        setCurrentSong({ id: track.id, name: track.name, artists: track.artists.map((a) => a.name).join(", "), cover: track.album.images[0]?.url });
        setIsPlaying(!state.paused);
        setDuration(state.duration / 1000);
        if (!isDraggingRef.current) setProgress(state.position / 1000);
      });
      p.connect().then((success) => { if (!success) setUsingPreview(true); });
      setPlayer(p);
    };
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onerror = () => setUsingPreview(true);
    document.body.appendChild(script);
    return () => {
      const old = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
      if (old) document.body.removeChild(old);
    };
  }, [session?.accessToken]);

  useEffect(() => {
    if (!usingPreview) return;
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;
    audio.addEventListener("timeupdate", () => { if (!isDraggingRef.current) setProgress(audio.currentTime); });
    audio.addEventListener("durationchange", () => { setDuration(audio.duration); });
    audio.addEventListener("ended", () => { setIsPlaying(false); setProgress(0); });
    return () => { audio.pause(); audioRef.current = null; };
  }, [usingPreview]);

  useEffect(() => {
    if (isPlaying && !isDragging && !usingPreview) {
      progressInterval.current = setInterval(async () => {
        if (player) {
          const state = await player.getCurrentState();
          if (state && !isDraggingRef.current) setProgress(state.position / 1000);
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
      if (data.tracks) { setOurSongs(data.tracks); setOurPlaylistInfo(data.info); }
    } catch (e) { console.error(e); }
    setLoadingSongs(false);
  };

  const playSong = async (song) => {
    if (usingPreview || !deviceId) {
      if (!song.preview_url) return;
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = song.preview_url;
      audio.play();
      setIsPlaying(true);
      setCurrentSong({ id: song.id, name: song.name, artists: song.artists, cover: song.cover });
      return;
    }
    if (!session?.accessToken) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ context_uri: `spotify:playlist:${PLAYLIST_ID}`, offset: { uri: `spotify:track:${song.id}` } }),
      });
    } catch (e) { console.error(e); }
  };

const togglePlay = async () => {
    if (usingPreview) {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play(); setIsPlaying(true); }
    } else {
      if (!session?.accessToken) return;
      try {
        // Tembak REST API Spotify langsung (jauh lebih stabil dari bawaan SDK)
        const endpoint = isPlaying ? "pause" : "play";
        await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        
        // Bikin tombol kerasa instan responsif
        setIsPlaying(!isPlaying); 
      } catch (e) {
        console.error("Gagal toggle play via API", e);
        // Fallback panggil SDK kalau koneksi API sedang bermasalah
        if (player) player.togglePlay(); 
      }
    }
  };

  const skipNext = () => {
    if (usingPreview) { const idx = ourSongs.findIndex((s) => s.id === currentSong?.id); const next = ourSongs[idx + 1]; if (next) playSong(next); }
    else { if (player) player.nextTrack(); }
  };

  const skipPrev = () => {
    if (usingPreview) { const idx = ourSongs.findIndex((s) => s.id === currentSong?.id); const prev = ourSongs[idx - 1]; if (prev) playSong(prev); }
    else { if (player) player.previousTrack(); }
  };

  const handleSeekEnd = async (e) => {
    const val = parseFloat(e.target.value);
    if (usingPreview) { if (audioRef.current) audioRef.current.currentTime = val; }
    else { if (player) await player.seek(Math.round(val * 1000)); }
    setTimeout(() => { setIsDragging(false); isDraggingRef.current = false; }, 800);
  };

  const OUR_PLAYLIST = {
    id: "ours", name: ourPlaylistInfo?.name || "Our Playlist", emoji: "🎵",
    desc: ourPlaylistInfo?.description || "The songs that are us.",
    color: "#1DB954", bg: "#0a2d14", cover: "/photos/our-playlist.jpg",
  };

  const allPlaylists = [...MONTHS, OUR_PLAYLIST];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning, Kenisha";
    if (h < 17) return "Good afternoon, Sayang";
    return "Good evening, Bb";
  };

  const useCounter = () => {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
      const start = new Date("2025-10-25T00:00:00");
      const tick = () => {
        const now = new Date();
        const diff = now - start;
        setTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }, []);
    return time;
  };

  const openPlaylist = (p) => { setActivePlaylist(p); setView("playlist"); };
  const { days, hours, minutes, seconds } = useCounter();

  const renderTrackNum = (song, i) => {
    const isCurrentSong = currentSong?.id === song.id;
    const isHovered = hoveredTrack === song.id;
    if (isCurrentSong) {
      if (isHovered) return isPlaying
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/></svg>;
      return isPlaying ? <span className="m-eq"><span/><span/><span/></span> : i + 1;
    }
    if (isHovered) return <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/></svg>;
    return i + 1;
  };

  if (status === "loading") {
    return <div style={{ background: "#000", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>Loading...</div>;
  }

  if (!session) {
    return (
      <div style={{ background: "#000", height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <img src="/iconspotify.png" alt="logo" width={220} style={{ objectFit: "contain" }} />
        <button onClick={() => signIn("spotify")} style={{ background: "#1DB954", color: "#000", border: "none", borderRadius: 500, padding: "14px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
          Login sek
        </button>
      </div>
    );
  }

  return (
    <div className="m-app">
      {/* ── SCROLLABLE CONTENT ── */}
      <div className="m-scroll">

        {/* ══ HOME VIEW ══ */}
        {view === "home" && (
          <div className="m-home">
            {/* Header gradient section */}
            <div className="m-home-hero">
              <div className="m-home-top">
                <h1 className="m-greeting">{greeting()}</h1>
                <div className="m-home-icons">
                </div>
              </div>

              {/* Quick access 2-col grid */}
              <div className="m-quick-grid">
                {allPlaylists.slice(0, 6).map(p => (
                  <button key={p.id} className="m-quick-card" onClick={() => openPlaylist(p)}>
                    <div className="m-quick-thumb" style={{ background: p.cover ? "transparent" : p.color, overflow: "hidden" }}>
                      {p.cover
                        ? <img src={p.cover} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 20 }}>{p.emoji}</span>}
                    </div>
                    <span className="m-quick-name">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Counter banner */}
            <div className="m-counter-banner">
              <span className="m-counter-label">Together for</span>
              <span className="m-counter-val">{days}d {hours}h {minutes}m {seconds}s 💕</span>
            </div>

            {/* Our months section */}
            <div className="m-section">
              <div className="m-section-header">
                <span className="m-section-title">Our months together 🗓</span>
              </div>
              <div className="m-cards-scroll">
                {MONTHS.map(p => (
                  <button key={p.id} className="m-card" onClick={() => openPlaylist(p)}>
                    <div className="m-card-img" style={{ background: p.bg, border: `1px solid ${p.color}33` }}>
                      <span style={{ fontSize: 36 }}>{p.emoji}</span>
                    </div>
                    <div className="m-card-title">{p.name}</div>
                    <div className="m-card-desc">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Our playlist feature card */}
            <div className="m-section">
              <div className="m-section-header">
                <span className="m-section-title">Our Playlist 🎵</span>
              </div>
              <button className="m-feature-card" onClick={() => openPlaylist(OUR_PLAYLIST)}>
                <div className="m-feature-thumb">
                  <img src="/photos/our-playlist.jpg" alt="Our Playlist"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                  />
                  <div style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🎵</div>
                </div>
                <div className="m-feature-info">
                  <div className="m-feature-label">Playlist • Us</div>
                  <div className="m-feature-name">{OUR_PLAYLIST.name}</div>
                  <div className="m-feature-desc">{OUR_PLAYLIST.desc}</div>
                  <div className="m-feature-actions">
                    <button className="m-heart-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                    <button className="m-play-circle" onClick={(e) => { e.stopPropagation(); ourSongs.length > 0 && playSong(ourSongs[0]); }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#000"><path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/></svg>
                    </button>
                  </div>
                </div>
              </button>
            </div>

            <div style={{ height: 32 }} />
          </div>
        )}

        {/* ══ LIBRARY VIEW ══ */}
        {view === "library" && (
          <div className="m-library">
            <h2 className="m-lib-title">Your Library</h2>
            <div className="m-lib-list">
              {allPlaylists.map(p => (
                <button key={p.id} className="m-lib-item" onClick={() => openPlaylist(p)}>
                  <div className="m-lib-thumb" style={{ background: p.cover ? "transparent" : p.color, overflow: "hidden" }}>
                    {p.cover
                      ? <img src={p.cover} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
                      : <span style={{ fontSize: 22 }}>{p.emoji}</span>}
                  </div>
                  <div className="m-lib-info">
                    <div className="m-lib-name">{p.name}</div>
                    <div className="m-lib-meta">{p.id === "ours" ? "Playlist" : "Memories"} • Us</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ PLAYLIST VIEW ══ */}
        {view === "playlist" && activePlaylist && (
          <div className="m-playlist-view">
            {/* Hero */}
            <div className="m-playlist-hero" style={{ background: `linear-gradient(180deg, ${activePlaylist.bg || "#1a3a2a"} 0%, #121212 100%)` }}>
              <button className="m-back-btn" onClick={() => setView("home")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.957 2.793a1 1 0 0 1 0 1.414L8.164 12l7.793 7.793a1 1 0 1 1-1.414 1.414L5.336 12l9.207-9.207a1 1 0 0 1 1.414 0z"/></svg>
              </button>
              <div className="m-playlist-cover">
                {activePlaylist.cover
                  ? <img src={activePlaylist.cover} alt={activePlaylist.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                  : <span style={{ fontSize: 64 }}>{activePlaylist.emoji}</span>}
              </div>
              <div className="m-playlist-meta">
                <div className="m-playlist-type">
                  {activePlaylist.id === "ours" ? "Playlist" : "Memories"}
                </div>
                <div className="m-playlist-name">
                  {activePlaylist.id === "ours" ? OUR_PLAYLIST.name : `${activePlaylist.name} Together`}
                </div>
                <div className="m-playlist-sub">Ardit & Kenisha • {activePlaylist.desc}</div>
              </div>
            </div>

            {/* Actions */}
            {activePlaylist.id === "ours" && (
              <div className="m-playlist-actions">
                <button className="m-heart-btn">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                <button className="m-big-play" onClick={isPlaying ? togglePlay : () => ourSongs.length > 0 && playSong(ourSongs[0])}>
                  {isPlaying
                    ? <svg width="28" height="28" viewBox="0 0 24 24" fill="#000"><path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="#000"><path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/></svg>}
                </button>
              </div>
            )}

            {/* Content */}
            {activePlaylist.id === "ours" ? (
              <div className="m-tracklist">
                {loadingSongs ? (
                  <div className="m-empty">Loading songs...</div>
                ) : (
                  ourSongs.map((song, i) => (
                    <button
                      key={song.id}
                      className={`m-track-row${currentSong?.id === song.id ? " playing" : ""}`}
                      onClick={() => { if (currentSong?.id === song.id) togglePlay(); else playSong(song); }}
                      onMouseEnter={() => setHoveredTrack(song.id)}
                      onMouseLeave={() => setHoveredTrack(null)}
                    >
                      <div className="m-track-left">
                        {song.cover && <img src={song.cover} alt={song.name} className="m-track-thumb" />}
                        <div className="m-track-info">
                          <div className="m-track-title" style={{ color: currentSong?.id === song.id ? "#1DB954" : "#fff" }}>{song.name}</div>
                          <div className="m-track-artist">{song.artists}</div>
                        </div>
                      </div>
                      <div className="m-track-right">
                        <span className="m-track-dur">{song.duration}</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#b3b3b3"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <MasonryGallery
                photos={activePlaylist.photos || []}
                accent={activePlaylist.color}
                emoji={activePlaylist.emoji}
                onOpen={(photo) => setLightbox(photo)}
              />
            )}
          </div>
        )}

      </div>
      {/* ── END SCROLL ── */}

      {/* ── MINI PLAYER ── */}
      {currentSong && (
        <div className="m-mini-player">
          <div className="m-mini-progress" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
          <div className="m-mini-inner">
            <div className="m-mini-thumb">
              {currentSong.cover
                ? <img src={currentSong.cover} alt={currentSong.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
                : <span style={{ fontSize: 18 }}>🎵</span>}
            </div>
            <div className="m-mini-info">
              <div className="m-mini-title">{currentSong.name}</div>
              <div className="m-mini-artist">{currentSong.artists}</div>
            </div>
            <div className="m-mini-controls">
              {/* Play/Pause */}
              <button className="m-mini-btn" onClick={togglePlay}>
                {isPlaying
                  ? <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>
                  : <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/></svg>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      <nav className="m-bottom-nav">
        <button className={`m-nav-item${view === "home" ? " active" : ""}`} onClick={() => setView("home")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Home</span>
        </button>
        <button className={`m-nav-item${view === "library" ? " active" : ""}`} onClick={() => setView("library")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4zm6 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4zm7-1a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-2z"/></svg>
          <span>Your Library</span>
        </button>
      </nav>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="m-lightbox" onClick={() => setLightbox(null)}>
          <button className="m-lightbox-close" onClick={() => setLightbox(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.707 5.293a1 1 0 0 0-1.414 0L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0 0-1.414z"/></svg>
          </button>
          <div className="m-lightbox-inner" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption || ""} className="m-lightbox-img" />
            {lightbox.caption && <p className="m-lightbox-caption">{lightbox.caption}</p>}
          </div>
        </div>
      )}

    </div>
  );
}