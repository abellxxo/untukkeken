"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { X, Heart, Moon, MessageCircle, Play } from "lucide-react";
import "./Wrapped.css";

// ── Helpers ──
const Starburst = ({ className, fill }) => (
  <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="none">
    <polygon points="50,0 62,28 92,15 72,40 100,55 70,68 85,95 55,75 25,98 38,68 0,60 30,42 8,15 40,28" fill={fill} />
  </svg>
);

const SmoothCounter = ({ target, duration, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <span>{count.toLocaleString("id-ID")}{suffix}</span>;
};

// ── Slides ──
const SLIDE_DURATION = 6500;

const BG = [
  "wr-bg-purple", "wr-bg-green", "wr-bg-blue", "wr-bg-pink",
  "wr-bg-green", "wr-bg-navy", "wr-bg-rose", "wr-bg-yellow",
  "wr-bg-dark", "wr-bg-rose", "wr-bg-yellow"
];

function Slide1() {
  const lines = [...Array(15)].map((_, i) => {
    const c = i % 3 === 0 ? "c1" : i % 3 === 1 ? "c2" : "c3";
    return <div key={i} className={`wr-s1-line ${c}`}>756 HOURS 756 HOURS</div>;
  });
  return (
    <div className="wr-s1">
      <div className="wr-s1-bg"><div className="wr-s1-scroll">{lines}</div></div>
      <div className="wr-s1-card wr-anim-scale">
        <p>This year we spent</p>
        <h1><SmoothCounter target={756} duration={2500} /></h1>
        <p className="sub">Hours together.</p>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="wr-s2">
      <div className="wr-s2-bg-stripes" />

      <div className="wr-s2-stars">
        <Starburst className="wr-s2-shape s-yellow" fill="#ffdb00" />
        <Starburst className="wr-s2-shape s-pink" fill="#ff00cc" />
        <div className="wr-s2-polaroid wr-anim-scale-d">
          <div className="wr-s2-photo">
            <img src="/photos/oct/18.jpg" alt="Us" />
          </div>
          <div className="wr-s2-polaroid-tape" />
        </div>
        <div className="wr-s2-badge b-1">FAV!</div>
        <div className="wr-s2-badge b-2">📸</div>
      </div>

      <div className="wr-s2-info wr-anim-slideup">
        <div className="wr-s2-pill">TOP MOMENT</div>
        <div className="wr-s2-text-box">
          <h1 className="wr-s2-title">First trip<br />to Atsiri</h1>
          <p className="wr-s2-date">October 25, 2025</p>
          <div className="wr-s2-stats-box">
            <p className="stat-label">Total Photos Saved</p>
            <p className="stat-val"><SmoothCounter target={129} duration={2000} /></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="wr-s3">
      {/* Heavy brutalist aura background shapes */}
      <div className="wr-s3-aura-bg">
        <Starburst className="wr-s3-shape s-purple" fill="#5e17eb" />
        <Starburst className="wr-s3-shape s-pink" fill="#ff00cc" />
        <Starburst className="wr-s3-shape s-yellow" fill="#ffdb00" />
      </div>

      <div className="wr-s3-content wr-anim-fadeup">
        <div className="wr-s3-pill">RELATIONSHIP AURA</div>
        <h1 className="wr-s3-title">Absolute scenes this year...</h1>

        <div className="wr-s3-card wr-anim-scale-d">
          <div className="wr-s3-card-inner">
            <h2 className="wr-s3-card-title">CHAOS &<br />CUDDLES</h2>
            <p className="wr-s3-card-desc">We keep bickering over silly little things, but we always end up making it up with a hug.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide4() {
  const bars = [
    { name: "Eating", w: "95%", bg: "#ffdb00", color: "#000" },
    { name: "Random Chit Chat", w: "80%", bg: "#1ed760", color: "#000" },
    { name: "Watching Movies", w: "65%", bg: "#5e17eb", color: "#fff" },
    { name: "Monopoly", w: "40%", bg: "#ff265cff", color: "#fff" },
  ];
  return (
    <div className="wr-s4">
      <p className="label wr-anim-slideleft">Top Activities</p>
      <h1 className="wr-anim-slideright">Things we did the most:</h1>
      <div className="wr-s4-bars">
        {bars.map((b, i) => (
          <div key={i}>
            <div className="wr-s4-bar-label wr-anim-fadein" style={{ animationDelay: `${0.5 + i * 0.2}s` }}>{b.name}</div>
            <div className="wr-s4-bar-track">
              <div className="wr-s4-bar-fill" style={{ "--tw": b.w, background: b.bg, color: b.color, animationDelay: `${0.7 + i * 0.2}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide5({ isPaused }) {
  const pausedStyle = isPaused ? { animationPlayState: "paused" } : {};

  return (
    <div className="wr-s5">
      {/* Background: Moving Stripes */}
      <div className="wr-s5-stripes" style={pausedStyle} />

      <p className="wr-s5-label wr-anim-slidedown">
        My ANTHEM
      </p>

      <div className="wr-s5-vinyl wr-anim-scale">
        <div className="wr-s5-disc" style={pausedStyle}>
          <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
          <img src="/photos/album-cover.jpg" alt="Album Art" style={pausedStyle} />
          <div className="dot" />
        </div>
      </div>

      <div className="wr-s5-info wr-anim-slideup">
        <h2 className="wr-s5-title">By Your Side</h2>
        <p className="wr-s5-artist">Sade</p>
        <div className="wr-s5-pill">
          <p>
            Played <span className="wr-s5-pill-num"><SmoothCounter target={143} duration={2000} /></span> times when i missed you so much.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slide6() {
  const heights = [1, 2, 4, 10, 3, 1];
  return (
    <div className="wr-s6">
      <div className="wr-s6-moon"><Moon size={120} fill="#ffdb00" color="#ffdb00" /></div>
      <div className="wr-s6-content wr-anim-fadeup">
        <p className="label">Night Owls</p>
        <h1>We are like bats.</h1>
        <p className="desc">Most of our conversations usually happen around:</p>
        <div className="wr-s6-chart">
          <div className="wr-s6-chart-bg" />
          {[3, 8, 10, 5, 2, 1].map((h, i) => (
            <div key={i} className="wr-s6-bar" style={{ "--th": `${h * 10}%`, animationDelay: `${1 + i * 0.1}s` }} />
          ))}
        </div>
        <div className="wr-s6-labels">
          <span>8 PM</span><span className="peak">10 PM</span><span>12 AM</span><span>2 AM</span>
        </div>
      </div>
    </div>
  );
}

function Slide7() {
  return (
    <div className="wr-s7">
      <div className="wr-s7-rays"></div>
      
      <p className="label wr-anim-fadein" style={{ zIndex: 10, color: "#fff", background: "#000", padding: "8px 16px", border: "3px solid #fff", transform: "rotate(-2deg)", boxShadow: "4px 4px 0px #ffdb00", letterSpacing: "2px" }}>
        Relationship Personality
      </p>

      <div className="wr-s7-trading-card wr-anim-scale-d">
        <div className="wr-s7-tc-header">
          <div className="wr-s7-heart">
            <Heart size={50} fill="#ff00cc" color="#000" strokeWidth={3} />
          </div>
          <div className="wr-s7-tc-stars">★★★</div>
        </div>
        
        <div className="wr-s7-tc-title">
          <h2>The &quot;Easy To Love&quot;</h2>
        </div>
        
        <div className="wr-s7-tc-image-area">
           <div className="wr-s7-tc-badge wr-anim-pop">Ride or Die</div>
        </div>

        <div className="wr-s7-tc-desc">
          <p>You&apos;re the type who makes loving you the most effortless and natural thing in the world.</p>
        </div>
      </div>
    </div>
  );
}

function Slide8() {
  const chats = [
    { align: "right", text: "Silit 😒", cls: "white", delay: "0.6s" },
    { align: "left", text: "Modeng", cls: "magenta", delay: "1s" },
    { align: "right", text: "Kopet.", cls: "dark", delay: "1.4s" },
    { align: "left", text: "TIMUUTTTT", cls: "lime", delay: "1.8s" },
  ];
  return (
    <div className="wr-s8">
      <div className="wr-s8-icon wr-anim-slideleft"><MessageCircle size={40} fill="#000" /></div>
      <p className="label wr-anim-fadein">Top Vocabulary</p>
      <h1 className="wr-anim-slideup">The secret language only we understand:</h1>
      <div className="wr-s8-chats">
        {chats.map((c, i) => (
          <div key={i} className={`wr-s8-row ${c.align}`} style={{ animationDelay: c.delay, animationFillMode: "forwards" }}>
            <div className={`wr-s8-bubble ${c.cls}`}>{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide9() {
  return (
    <div className="wr-s9">
      <div className="wr-s9-hero">
        <Starburst className="s1" fill="#5e17eb" />
        <Starburst className="s2" fill="#ffdb00" />
        <div className="wr-s9-hero-photo">
          <img src="/photos/us.jpg" alt="Us" />
        </div>
      </div>
      <div className="wr-s9-grid">
        <div className="wr-anim-fadeup" style={{ animationDelay: "0.2s" }}>
          <h3>Top Places</h3>
          <ol><li><span className="num">1</span>Kurasu</li><li><span className="num">2</span>Medit by Kamil</li><li><span className="num">3</span>GI</li></ol>
        </div>
        <div className="wr-anim-fadeup" style={{ animationDelay: "0.4s" }}>
          <h3>Top Words</h3>
          <ol><li><span className="num">1</span>Sayang</li><li><span className="num">2</span>Kangen</li><li><span className="num">3</span>Silit</li></ol>
        </div>
        <div className="wr-anim-fadeup" style={{ animationDelay: "0.6s" }}>
          <h3>Messages Sent</h3>
          <p className="big"><SmoothCounter target={190116} duration={2500} /></p>
        </div>
        <div className="wr-anim-fadeup" style={{ animationDelay: "0.8s" }}>
          <h3>Vibe</h3>
          <p className="vibe">Still LDR huft..</p>
        </div>
      </div>
      <div className="wr-s9-footer wr-anim-fadein" style={{ animationDelay: "1.5s" }}>
        <img src="/iconspotify.png" alt="Silit" style={{ height: 48, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
      </div>
    </div>
  );
}

function Slide10() {
  return (
    <div className="wr-s10">
      <div className="wr-s10-bg-layer" />

      <div className="wr-s10-content">
        <div className="wr-s10-marquee wr-anim-fadein">
          <div className="wr-s10-marquee-track">
            {/* Set 1 */}
            <img src="/photos/gerak1.png" className="wr-s10-p1" alt="Gerak 1" />
            <img src="/photos/gerak2.png" className="wr-s10-p2" alt="Gerak 2" />
            <img src="/photos/gerak1.png" className="wr-s10-p1" alt="Gerak 1" />
            <img src="/photos/gerak2.png" className="wr-s10-p2" alt="Gerak 2" />
            {/* Set 2 (for seamless loop) */}
            <img src="/photos/gerak1.png" className="wr-s10-p1" alt="Gerak 1" />
            <img src="/photos/gerak2.png" className="wr-s10-p2" alt="Gerak 2" />
            <img src="/photos/gerak1.png" className="wr-s10-p1" alt="Gerak 1" />
            <img src="/photos/gerak2.png" className="wr-s10-p2" alt="Gerak 2" />
          </div>
        </div>
        <h1 className="wr-anim-slidedown wr-s10-title">
          FOR MY<br />KENISHA
        </h1>

        <div className="wr-anim-scale wr-s10-box">
          <div className="wr-s10-badge b1">MY LOVEY</div>
          <p style={{ fontSize: "16px" }}>
            Six months with you have quite honestly been the happiest time of my life.<br /><br />
            I&apos;m ever so looking forward to all the things we&apos;ll keep building and experiencing together.<br /><br />
            You mean the absolute world to me, truly. I love you.
          </p>
          <div className="wr-s10-badge b2">FOREVER</div>
        </div>
      </div>
    </div>
  );
}

function Slide11({ onFinish }) {
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", position: "relative", overflow: "hidden" }}>
      {/* Giant Starburst BG */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "150%", height: "150%", zIndex: 0 }}>
        <Starburst className="wr-s11-starburst" fill="#ff90e8" />
      </div>

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", textAlign: "center" }}>
        <p className="wr-anim-slidedown" style={{
          backgroundColor: "#000", color: "#fff", padding: "6px 16px",
          borderRadius: "999px", border: "2px solid #fff",
          fontSize: "12px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0
        }}>NOT THE END OF CHAPTER</p>

        <h1 className="wr-anim-scale" style={{
          fontSize: "80px", fontWeight: 900, color: "#000",
          textShadow: "6px 6px 0px #1ed760", lineHeight: 0.9,
          margin: "16px 0"
        }}>6 MONTHS</h1>

        <div className="wr-anim-fadeup" style={{
          animationDelay: "0.6s", backgroundColor: "#000", padding: "32px",
          border: "4px solid #fff", boxShadow: "8px 8px 0px 0px #5e17eb",
          marginTop: "16px", width: "100%", transform: "rotate(-3deg)"
        }}>
          <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: 0 }}>
            WAS JUST<br />THE INTRO.
          </h2>
          <p style={{ color: "#ff90e8", fontSize: "18px", fontWeight: 700, marginTop: "16px", marginBottom: 0 }}>
            Ready for a new chapter?
          </p>
        </div>

        <button
          onClick={onFinish}
          className="wr-anim-fadeup"
          style={{
            animationDelay: "1.2s", marginTop: "48px",
            backgroundColor: "#1ed760", color: "#000",
            padding: "16px 40px", borderRadius: "999px",
            fontWeight: 900, fontSize: "20px",
            border: "4px solid #000", boxShadow: "6px 6px 0px 0px #000",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s ease", fontFamily: "inherit"
          }}
          onPointerOver={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000"; }}
          onPointerOut={(e) => { e.currentTarget.style.transform = "translate(0px, 0px)"; e.currentTarget.style.boxShadow = "6px 6px 0px 0px #000"; }}
        >
          <Play size={24} fill="#000" strokeWidth={3} /> PLAY 2026
        </button>

        <div className="wr-anim-fadeup" style={{ animationDelay: "1.5s", marginTop: "48px" }}>
          <img src="/iconspotify.png" alt="Spotify" style={{ height: "72px", objectFit: "contain", filter: "brightness(0)" }} />
        </div>
      </div>
    </div>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10, Slide11];
const INTRO_DURATION = 3000;
const MUSIC_START_SLIDE = 4; // index 4 = Slide5 (My Anthem)
const getSlideDuration = (index) => {
  if (index === 4) return 10000;
  if (index === 9) return 15000;
  return SLIDE_DURATION;
};

// ── Main Component ──
const WrappedScreen = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef(null);
  const kenAudioRef = useRef(null);
  const prevSlideRef = useRef(0);
  const timerRef = useRef(null);
  const remainingRef = useRef(SLIDE_DURATION);
  const startTimeRef = useRef(Date.now());

  const handleFinish = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (kenAudioRef.current) {
      kenAudioRef.current.pause();
      kenAudioRef.current.currentTime = 0;
    }
    if (onClose) onClose();
    else setActiveSlide(0);
  }, [onClose]);

  // ── Intro timer ──
  useEffect(() => {
    if (!showIntro) return;
    const t = setTimeout(() => setShowIntro(false), INTRO_DURATION);
    return () => clearTimeout(t);
  }, [showIntro]);

  // ── Audio management ──
  useEffect(() => {
    if (showIntro) return;

    // Anthem logic
    if (activeSlide === MUSIC_START_SLIDE) {
      if (!audioRef.current) {
        audioRef.current = new Audio("/audio/our-anthem.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.9;
      }
      if (!isPaused) {
        audioRef.current.play().catch(() => { });
      }
    } else if (activeSlide > MUSIC_START_SLIDE) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    // Kenisha audio logic (Slide 10 onwards)
    if (activeSlide >= 9) {
      if (!kenAudioRef.current) {
        kenAudioRef.current = new Audio("/audio/ken.mp3");
        kenAudioRef.current.loop = true;
        kenAudioRef.current.volume = 0.9;
      }

      if (activeSlide === 9 && prevSlideRef.current !== 9) {
        kenAudioRef.current.currentTime = 0;
      }

      if (!isPaused) {
        kenAudioRef.current.play().catch(() => { });
      }
    } else {
      if (kenAudioRef.current) {
        kenAudioRef.current.pause();
        kenAudioRef.current.currentTime = 0;
      }
    }

    prevSlideRef.current = activeSlide;
  }, [activeSlide, showIntro, isPaused]);

  // ── Cleanup audio on unmount ──
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (kenAudioRef.current) {
        kenAudioRef.current.pause();
        kenAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  // ── Pause/resume audio on hold ──
  useEffect(() => {
    if (isPaused) {
      if (audioRef.current) audioRef.current.pause();
      if (kenAudioRef.current) kenAudioRef.current.pause();
    } else {
      if (activeSlide === MUSIC_START_SLIDE && audioRef.current) {
        audioRef.current.play().catch(() => { });
      }
      if (activeSlide >= 9 && kenAudioRef.current) {
        kenAudioRef.current.play().catch(() => { });
      }
    }
  }, [isPaused, activeSlide]);

  // ── Slide auto-advance timer (pause-aware) ──
  useEffect(() => {
    if (showIntro || isPaused) return;

    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      if (activeSlide < SLIDES.length - 1) {
        setActiveSlide(s => s + 1);
        remainingRef.current = getSlideDuration(activeSlide + 1);
      } else {
        setTimeout(handleFinish, 3000);
      }
    }, remainingRef.current);

    return () => {
      clearTimeout(timerRef.current);
      // Save remaining time when pausing
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
    };
  }, [activeSlide, isPaused, showIntro, handleFinish]);

  // Reset remaining time when slide changes
  useEffect(() => {
    remainingRef.current = getSlideDuration(activeSlide);
  }, [activeSlide]);

  // ── Hold to pause handlers ──
  const handleHoldStart = useCallback(() => setIsPaused(true), []);
  const handleHoldEnd = useCallback(() => setIsPaused(false), []);

  // ── Unified Pointer Events (prevents double-fire from touch+mouse) ──
  const pointerStartTime = useRef(0);
  const pointerStartX = useRef(0);

  const handlePointerDown = useCallback((e) => {
    pointerStartTime.current = Date.now();
    pointerStartX.current = e.clientX;
    handleHoldStart();
  }, [handleHoldStart]);

  const handlePointerUp = useCallback((e) => {
    handleHoldEnd();
    const held = Date.now() - pointerStartTime.current;
    if (held > 300) return; // Was a hold, not a tap

    if (e.target.closest("button")) return;
    const clickX = e.clientX;
    if (clickX < window.innerWidth * 0.3) {
      if (activeSlide > 0) setActiveSlide(s => s - 1);
    } else {
      if (activeSlide < SLIDES.length - 1) setActiveSlide(s => s + 1);
      else handleFinish();
    }
  }, [activeSlide, handleHoldEnd, handleFinish]);

  // ── Intro screen ──
  if (showIntro) {
    return (
      <div className="wr-root">
        <div className="wr-container" style={{ background: "#ffdb00" }}>
          <div className="wr-intro">
            {/* Crazy background elements */}
            <div className="wr-intro-bg-layer">
              <div className="wr-intro-marquee top">
                <span>2025 WRAPPED • 2025 WRAPPED • 2025 WRAPPED • 2025 WRAPPED • 2025 WRAPPED • 2025 WRAPPED • 2025 WRAPPED • 2025 WRAPPED • </span>
              </div>
              <div className="wr-intro-marquee bottom">
                <span>GET READY • GET READY • GET READY • GET READY • GET READY • GET READY • GET READY • GET READY • GET READY • GET READY • </span>
              </div>

              <Starburst className="wr-intro-star s1" fill="#ff00cc" />
              <Starburst className="wr-intro-star s2" fill="#5e17eb" />
              <Starburst className="wr-intro-star s3" fill="#1ed760" />
            </div>

            <div className="wr-intro-content">
              <div className="wr-intro-box">
                <div className="wr-intro-logo-wrap">
                  <div className="wr-intro-logo-box">
                    <img src="/iconspotify.png" alt="Logo" />
                  </div>
                  {/* Decorative badges around logo */}
                  <div className="wr-intro-badge b-left">TOP<br />SECRET</div>
                  <div className="wr-intro-badge b-right">PLAY<br />LOUD</div>
                </div>

                <h1 className="wr-intro-title">
                  <span className="line1">OUR</span><br />
                  <span className="line2">6 MONTHS</span><br />
                  <span className="line3">WRAPPED</span>
                </h1>

                <div className="wr-intro-pill-wrapper">
                  <div className="wr-intro-pill">
                    <p>Ready for a flashback?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flash overlay for 'jedar' effect */}
            <div className="wr-intro-flash" />
          </div>
        </div>
      </div>
    );
  }

  const SlideComponent = SLIDES[activeSlide];

  return (
    <div className="wr-root">
      <div
        className={`wr-container ${BG[activeSlide]}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        <div className="wr-progress-bar">
          {SLIDES.map((_, i) => (
            <div key={i} className="wr-progress-seg">
              <div
                className={`wr-progress-fill ${i === activeSlide ? `active${isPaused ? " paused" : ""}` : i < activeSlide ? "done" : "pending"}`}
                style={i === activeSlide ? { animationDuration: `${getSlideDuration(i)}ms` } : {}}
              />
            </div>
          ))}
        </div>

        <div key={activeSlide} className="wr-slide">
          <SlideComponent onFinish={handleFinish} isPaused={isPaused} />
        </div>
      </div>
    </div>
  );
};

export default WrappedScreen;

