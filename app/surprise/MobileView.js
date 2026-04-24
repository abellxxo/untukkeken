"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import "./Mobile.css";
import WrappedScreen from "./WrappedScreen";

const PLAYLIST_ID = "1SIFyACKuXgde8rEcgWVby";
const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

// Pakai ini biar PWA gak white screen pas balik dari Spotify
const openSpotify = (url) => {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const MONTHS = [
  {
    id: "oct", name: "October", emoji: "🍂", desc: "Where it all began.",
    color: "#e8572a", bg: "#3d1a0a",
    cover: "/photos/oct-cover.png",
    photos: [
      { src: "/photos/oct/1.jpg", w: 4, h: 5 },
      { src: "/photos/oct/2.jpg", w: 3, h: 4 },
      { src: "/photos/oct/3.jpg", w: 1, h: 1 },
      { src: "/photos/oct/4.jpg", w: 4, h: 3 },
      { src: "/photos/oct/5.jpg", w: 3, h: 4 },
      { src: "/photos/oct/6.jpg", w: 1, h: 1 },
      { src: "/photos/oct/7.jpg", w: 4, h: 5 },
      { src: "/photos/oct/8.jpg", w: 3, h: 2 },
      { src: "/photos/oct/9.jpg", w: 1, h: 1 },
      { src: "/photos/oct/10.jpg", w: 4, h: 5 },
      { src: "/photos/oct/11.jpg", w: 3, h: 2 },
      { src: "/photos/oct/12.jpg", w: 3, h: 4 },
      { src: "/photos/oct/13.jpg", w: 4, h: 3 },
      { src: "/photos/oct/14.jpg", w: 1, h: 1 },
      { src: "/photos/oct/15.jpg", w: 3, h: 4 },
      { src: "/photos/oct/16.jpg", w: 4, h: 5 },
      { src: "/photos/oct/17.jpg", w: 4, h: 3 },
      { src: "/photos/oct/18.jpg", w: 3, h: 2 },
    ],
  },
  {
    id: "nov", name: "November", emoji: "🍁", desc: "Uhhh second month.",
    color: "#d4537e", bg: "#2d0f1c",
    cover: "/photos/nov-cover.png",
    photos: [
      { src: "/photos/nov/1.jpg", w: 3, h: 4 },
      { src: "/photos/nov/2.jpg", w: 1, h: 1 },
      { src: "/photos/nov/3.jpg", w: 4, h: 5 },
      { src: "/photos/nov/4.jpg", w: 3, h: 2 },
      { src: "/photos/nov/5.jpg", w: 1, h: 1 },
      { src: "/photos/nov/6.jpg", w: 4, h: 3 },
      { src: "/photos/nov/7.jpg", w: 3, h: 4 },
      { src: "/photos/nov/8.jpg", w: 4, h: 5 },
      { src: "/photos/nov/9.jpg", w: 4, h: 3 },
      { src: "/photos/nov/10.jpg", w: 3, h: 4 },
      { src: "/photos/nov/11.jpg", w: 1, h: 1 },
      { src: "/photos/nov/12.jpg", w: 4, h: 5 },
    ],
  },
  {
    id: "dec", name: "December", emoji: "❄️", desc: "It's all about you.",
    color: "#4facfe", bg: "#0a1f3d",
    cover: "/photos/dec-cover.png",
    photos: [
      { src: "/photos/dec/1.jpg", w: 1, h: 1 },
      { src: "/photos/dec/2.jpg", w: 4, h: 5 },
      { src: "/photos/dec/3.jpg", w: 3, h: 2 },
      { src: "/photos/dec/4.jpg", w: 3, h: 4 },
      { src: "/photos/dec/5.jpg", w: 4, h: 3 },
      { src: "/photos/dec/6.jpg", w: 1, h: 1 },
      { src: "/photos/dec/7.jpg", w: 3, h: 4 },
      { src: "/photos/dec/8.jpg", w: 4, h: 5 },
      { src: "/photos/dec/9.jpg", w: 4, h: 3 },
      { src: "/photos/dec/10.jpg", w: 1, h: 1 },
      { src: "/photos/dec/11.jpg", w: 3, h: 2 },
    ],
  },
  {
    id: "jan", name: "January", emoji: "🌸", desc: "New year, same us.",
    color: "#a78bfa", bg: "#1a0d3d",
    cover: "/photos/jan-cover.png",
    photos: [
      { src: "/photos/jan/1.jpg", w: 4, h: 3 },
      { src: "/photos/jan/2.jpg", w: 3, h: 4 },
      { src: "/photos/jan/3.jpg", w: 1, h: 1 },
      { src: "/photos/jan/4.jpg", w: 4, h: 5 },
      { src: "/photos/jan/5.jpg", w: 3, h: 2 },
      { src: "/photos/jan/6.jpg", w: 1, h: 1 },
      { src: "/photos/jan/7.jpg", w: 4, h: 3 },
      { src: "/photos/jan/8.jpg", w: 3, h: 4 },
      { src: "/photos/jan/9.jpg", w: 4, h: 5 },
      { src: "/photos/jan/10.jpg", w: 1, h: 1 },
      { src: "/photos/jan/11.jpg", w: 3, h: 2 },
      { src: "/photos/jan/12.jpg", w: 3, h: 4 },
      { src: "/photos/jan/13.jpg", w: 4, h: 3 },
    ],
  },
  {
    id: "feb", name: "February", emoji: "💕", desc: "Ramadan's fun.",
    color: "#f472b6", bg: "#2d0f20",
    cover: "/photos/feb-cover.png",
    photos: [
      { src: "/photos/feb/1.jpg", w: 3, h: 4 },
      { src: "/photos/feb/2.jpg", w: 4, h: 5 },
      { src: "/photos/feb/3.jpg", w: 1, h: 1 },
      { src: "/photos/feb/4.jpg", w: 3, h: 2 },
      { src: "/photos/feb/5.jpg", w: 4, h: 3 },
      { src: "/photos/feb/6.jpg", w: 3, h: 4 },
      { src: "/photos/feb/7.jpg", w: 1, h: 1 },
      { src: "/photos/feb/8.jpg", w: 4, h: 5 },
      { src: "/photos/feb/9.jpg", w: 4, h: 3 },
      { src: "/photos/feb/10.jpg", w: 3, h: 2 },
      { src: "/photos/feb/11.jpg", w: 1, h: 1 },
      { src: "/photos/feb/12.jpg", w: 3, h: 4 },
      { src: "/photos/feb/13.jpg", w: 4, h: 5 },
      { src: "/photos/feb/14.jpg", w: 4, h: 3 },
      { src: "/photos/feb/15.jpg", w: 3, h: 2 },
      { src: "/photos/feb/16.jpg", w: 1, h: 1 },
      { src: "/photos/feb/17.jpg", w: 3, h: 4 },
    ],
  },
  {
    id: "mar", name: "March", emoji: "🌿", desc: "5 months...",
    color: "#34d399", bg: "#0a2d1f",
    cover: "/photos/mar-cover.png",
    photos: [
      { src: "/photos/mar/1.jpg", w: 1, h: 1 },
      { src: "/photos/mar/2.jpg", w: 4, h: 3 },
      { src: "/photos/mar/3.jpg", w: 3, h: 4 },
      { src: "/photos/mar/4.jpg", w: 4, h: 5 },
      { src: "/photos/mar/5.jpg", w: 3, h: 2 },
      { src: "/photos/mar/6.jpg", w: 1, h: 1 },
      { src: "/photos/mar/7.jpg", w: 3, h: 4 },
      { src: "/photos/mar/8.jpg", w: 4, h: 3 },
      { src: "/photos/mar/9.jpg", w: 4, h: 5 },
      { src: "/photos/mar/10.jpg", w: 3, h: 2 },
      { src: "/photos/mar/11.jpg", w: 1, h: 1 },
      { src: "/photos/mar/12.jpg", w: 4, h: 3 },
      { src: "/photos/mar/13.jpg", w: 3, h: 4 },
      { src: "/photos/mar/14.jpg", w: 4, h: 5 },
      { src: "/photos/mar/15.jpg", w: 3, h: 2 },
      { src: "/photos/mar/16.jpg", w: 1, h: 1 },
    ],
  },
];

const OUR_PLAYLIST = {
  id: "ours",
  name: "The Kenisha Tape",
  emoji: "🎵",
  desc: "Inspired by you.",
  color: "#1DB954",
  bg: "#0a2d14",
  cover: "/photos/our-playlist.jpg",
};

// ── Masonry Gallery ──────────────────────────────────────────────────────────

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
                  <span style={{ fontSize: 20, opacity: 0.4 }} suppressHydrationWarning>{emoji}</span>
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

// ── Counter Hook ─────────────────────────────────────────────────────────────

function useCounter() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const start = new Date("2025-10-25T00:00:00");
    const tick = () => {
      const diff = Date.now() - start.getTime();
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
}

// ── Main Content Component ───────────────────────────────────────────────────

function MobileViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [view, setView] = useState("home");
  const [previousView, setPreviousView] = useState("home");
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [greeting, setGreeting] = useState("");
  const { days, hours, minutes, seconds } = useCounter();

  // Membaca URL parameter "?bulan=..." dan "?wrapped"
  const bulanParam = searchParams.get("bulan");
  const wrappedParam = searchParams.get("wrapped");

  // Efek untuk memantau perubahan URL dan Swipe-Back
  useEffect(() => {
    if (wrappedParam !== null) {
      setView("wrapped");
    } else if (bulanParam) {
      const foundMonth = MONTHS.find(m => m.id === bulanParam);
      if (foundMonth) {
        setActivePlaylist(foundMonth);
        setView("playlist");
      }
    } else {
      if (view === "playlist" || view === "wrapped") {
        setView(previousView);
        setActivePlaylist(null);
      }
    }
  }, [bulanParam, wrappedParam, view, previousView]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning, Kenisha");
    else if (h < 17) setGreeting("Good afternoon, Sayang");
    else setGreeting("Good evening, Bb");
  }, []);

  const openPlaylist = (p) => {
    if (p.id === "ours") {
      openSpotify(PLAYLIST_URL);
      return;
    }
    setPreviousView(view);
    router.push(`${pathname}?bulan=${p.id}`);
  };

  const allPlaylists = [...MONTHS, OUR_PLAYLIST];

  return (
    <div className={`m-app${view === "library" ? " no-scroll" : ""}`}>
      <div className={`m-scroll${view === "library" ? " m-scroll-fixed" : ""}`}>

        {/* ── HOME ── */}
        {view === "home" && (
          <div className="m-home">
            <div className="m-home-hero">

              {/* ✅ LOGO SPOTIFY */}
              <div style={{ marginBottom: "16px" }}>
                <img
                  src="/iconspotify.png"
                  alt="Spotify Logo"
                  style={{
                    height: "54px",
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)"
                  }}
                />
              </div>

              <div className="m-home-top">
                <h1 className="m-greeting">{greeting}</h1>
              </div>
              <div className="m-quick-grid">
                {allPlaylists.slice(0, 6).map(p => (
                  <button key={p.id} className="m-quick-card" onClick={() => openPlaylist(p)}>
                    <div
                      className="m-quick-thumb"
                      style={{ background: p.cover ? "transparent" : p.color, overflow: "hidden" }}
                    >
                      {p.cover ? (
                        <>
                          <img
                            src={p.cover}
                            alt={p.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              const fallback = e.target.parentNode.querySelector(".m-quick-emoji-fallback");
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          <div className="m-quick-emoji-fallback" style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: p.color, position: "absolute", inset: 0 }}>
                            <span style={{ fontSize: 20 }} suppressHydrationWarning>{p.emoji}</span>
                          </div>
                        </>
                      ) : (
                        <span style={{ fontSize: 20 }} suppressHydrationWarning>{p.emoji}</span>
                      )}
                    </div>
                    <span className="m-quick-name">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="m-counter-banner">
              <span className="m-counter-label">Together for</span>
              <span className="m-counter-val">{days}d {hours}h {minutes}m {seconds}s </span>
            </div>

            {/* ── WRAPPED CARD ── */}
            <div style={{ padding: "0 16px", marginBottom: "24px" }}>
              <div style={{
                position: "relative",
                width: "100%",
                background: "linear-gradient(135deg, #1ed760 0%, #ff00cc 100%)",
                borderRadius: "8px",
                padding: "24px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}>

                {/* Background Shapes */}
                <svg width="0" height="0" style={{ position: "absolute" }}>
                  <defs>
                    <clipPath id="spiky-shape" clipPathUnits="objectBoundingBox">
                      <polygon points="0.5 0, 0.6 0.3, 0.9 0.2, 0.7 0.5, 1 0.7, 0.6 0.7, 0.5 1, 0.4 0.7, 0 0.7, 0.3 0.5, 0.1 0.2, 0.4 0.3" />
                    </clipPath>
                    <clipPath id="squiggly-shape" clipPathUnits="objectBoundingBox">
                      <path d="M0.1,0.5 C0.1,0.2 0.4,0.1 0.6,0.3 C0.8,0.5 1 0.4 0.9,0.8 C0.8,1.1 0.4,1 0.2,0.8 C0,0.6 0.1,0.5 0.1,0.5 Z" />
                    </clipPath>
                  </defs>
                </svg>

                <div style={{
                  position: "absolute",
                  top: "-10%",
                  right: "-5%",
                  width: "120px",
                  height: "120px",
                  backgroundColor: "#5e17eb",
                  clipPath: "url(#spiky-shape)",
                  transform: "rotate(15deg)",
                  opacity: 0.8
                }} />

                <div style={{
                  position: "absolute",
                  bottom: "-15%",
                  left: "10%",
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#ffdb00",
                  clipPath: "url(#squiggly-shape)",
                  transform: "rotate(-20deg)",
                  opacity: 0.9
                }} />

                <div style={{
                  position: "absolute",
                  top: "20%",
                  right: "40%",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  opacity: 0.5
                }} />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 1, flex: 1, paddingRight: "16px" }}>
                  <p style={{
                    margin: 0,
                    fontSize: "12px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "#fff",
                    opacity: 0.9,
                    marginBottom: "4px"
                  }}>
                    6 Months Wrapped
                  </p>
                  <h3 style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "900",
                    lineHeight: "1.2",
                    color: "#fff",
                    textShadow: "2px 2px 0px rgba(0,0,0,0.2)"
                  }}>
                    Have a look at our 6 mo in review.
                  </h3>
                </div>

                {/* Action */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Start Pill Button */}
                  <button onClick={(e) => { e.stopPropagation(); router.push(`${pathname}?wrapped`); }} style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "24px",
                    padding: "8px 20px",
                    fontSize: "13px",
                    fontWeight: "800",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    flexShrink: 0,
                    marginBottom: "2px"
                  }}>
                    Start
                  </button>
                </div>
              </div>
            </div>

            <div className="m-section">
              <div className="m-section-header">
                <span className="m-section-title">Our months together 🗓</span>
              </div>
              <div className="m-cards-scroll">
                {MONTHS.map(p => (
                  <button key={p.id} className="m-card" onClick={() => openPlaylist(p)}>
                    <div className="m-card-img" style={{ background: p.cover ? "transparent" : p.bg, border: `1px solid ${p.color}33`, overflow: "hidden" }}>
                      {p.cover ? (
                        <img src={p.cover} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: 36 }} suppressHydrationWarning>{p.emoji}</span>
                      )}
                    </div>
                    <div className="m-card-title">{p.name}</div>
                    <div className="m-card-desc">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="m-section">
              <div className="m-section-header">
                <span className="m-section-title">Our Playlist 🎵</span>
              </div>

              <div
                className="m-feature-card"
                onClick={() => openPlaylist(OUR_PLAYLIST)}
                role="button"
                tabIndex={0}
              >
                <div className="m-feature-thumb">
                  <img
                    src={OUR_PLAYLIST.cover}
                    alt={OUR_PLAYLIST.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    style={{
                      display: "none", width: "100%", height: "100%",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 48, background: "#0a2d14",
                    }}
                  >
                    🎵
                  </div>
                </div>
                <div className="m-feature-info">
                  <div className="m-feature-label">Playlist • Us</div>
                  <div className="m-feature-name">{OUR_PLAYLIST.name}</div>
                  <div className="m-feature-desc">{OUR_PLAYLIST.desc}</div>
                  <div className="m-feature-actions" style={{ justifyContent: "flex-end" }}>
                    <button
                      className="m-play-circle"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSpotify(PLAYLIST_URL);
                      }}
                      aria-label="Open playlist on Spotify"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
                        <path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 2 }} />
          </div>
        )}

        {/* ── LIBRARY ── */}
        {view === "library" && (
          <div className="m-library">
            <h2 className="m-lib-title">Your Library</h2>
            <div className="m-lib-list">
              {MONTHS.map(p => (
                <button key={p.id} className="m-lib-item" onClick={() => openPlaylist(p)}>
                  <div className="m-lib-thumb" style={{ background: p.cover ? "transparent" : p.color, overflow: "hidden" }}>
                    {p.cover ? (
                      <img src={p.cover} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 22 }} suppressHydrationWarning>{p.emoji}</span>
                    )}
                  </div>
                  <div className="m-lib-info">
                    <div className="m-lib-name">{p.name}</div>
                    <div className="m-lib-meta">Memories • Us</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PLAYLIST ── */}
        {view === "playlist" && activePlaylist && (
          <div className="m-playlist-view">
            <div
              className="m-playlist-hero"
              style={{
                background: `linear-gradient(180deg, ${activePlaylist.bg || "#1a3a2a"} 0%, #121212 100%)`,
              }}
            >
              <button className="m-back-btn" onClick={() => router.push(pathname)} aria-label="Go back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.957 2.793a1 1 0 0 1 0 1.414L8.164 12l7.793 7.793a1 1 0 1 1-1.414 1.414L5.336 12l9.207-9.207a1 1 0 0 1 1.414 0z" />
                </svg>
              </button>
              <div className="m-playlist-cover" style={{ background: activePlaylist.cover ? "transparent" : "rgba(0,0,0,0.2)" }}>
                {activePlaylist.cover ? (
                  <img src={activePlaylist.cover} alt={activePlaylist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 64 }} suppressHydrationWarning>{activePlaylist.emoji}</span>
                )}
              </div>
              <div className="m-playlist-meta">
                <div className="m-playlist-type">Memories</div>
                <div className="m-playlist-name">{activePlaylist.name} Together</div>
                <div className="m-playlist-sub">Ardit & Kenisha • {activePlaylist.desc}</div>
              </div>
            </div>

            <MasonryGallery
              photos={activePlaylist.photos || []}
              accent={activePlaylist.color}
              emoji={activePlaylist.emoji}
              onOpen={(photo) => setLightbox(photo)}
            />
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      <nav className="m-bottom-nav">
        <button
          className={`m-nav-item${view === "home" ? " active" : ""}`}
          onClick={() => {
            setView("home");
            if (bulanParam) router.push(pathname);
          }}
          aria-label="Home"
        >
          <img
            src="/home-icon.png"
            alt="Home Icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span>Home</span>
        </button>
        <button
          className={`m-nav-item${view === "library" ? " active" : ""}`}
          onClick={() => {
            setView("library");
            if (bulanParam) router.push(pathname);
          }}
          aria-label="Your Library"
        >
          <img
            src="/lib-icon.png"
            alt="Library Icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span>Your Library</span>
        </button>
      </nav>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="m-lightbox" onClick={() => setLightbox(null)}>
          <button
            className="m-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.707 5.293a1 1 0 0 0-1.414 0L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0 0-1.414z" />
            </svg>
          </button>
          <div className="m-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption || ""} className="m-lightbox-img" />
            {lightbox.caption && <p className="m-lightbox-caption">{lightbox.caption}</p>}
          </div>
        </div>
      )}

      {/* ── WRAPPED FULLSCREEN COMPONENT ── */}
      {view === "wrapped" && <WrappedScreen onClose={() => router.push(pathname)} />}
    </div>
  );
}

// ── Wrapper Utama untuk Handle Suspense ──────────────────────────────────────
export default function MobileView() {
  return (
    <Suspense fallback={<div style={{ background: "#121212", minHeight: "100vh" }} />}>
      <MobileViewContent />
    </Suspense>
  );
}