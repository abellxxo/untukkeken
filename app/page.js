"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react"; 
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  
  const videoRef = useRef(null); 
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // === JANGAN LUPA GANTI TANGGAL JADIAN KALIAN DI SINI ===
  const TARGET_DATE = "251025";
  const TARGET_NAME = "Kenisha";

  // Trik "Paksa" Autoplay Safari jalan pas halaman baru dibuka
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.log("Safari auto-play error:", err);
      });
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault(); 
    
    if (password === TARGET_DATE) {
      setErrorMsg("");
      // ✅ KUNCI PWA: Pakai replace() agar history form login ini terhapus
      router.replace("/surprise"); 
    } else {
      setErrorMsg("Sabaarrr, memang belum selesai");
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Video Background */}
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline 
        defaultMuted
        className="video-background"
      >
        <source src="/videokita.mp4" type="video/mp4" />
      </video>

      {/* Layer Hitam Transparan */}
      <div className="video-overlay"></div>

      <div className="content-container">
        <header className="header">
          <Image 
            src="/iconspotify.png" 
            alt="Logo" 
            width={150} 
            height={50} 
            priority
            className="logo-img logo-white"
          />
        </header>

        <main className="main-container">
          {/* Tombol Google yang ngarah ke WhatsApp */}
          <button 
            type="button"
            className="btn-google" 
            onClick={() => window.open("https://wa.me/6281231223796?text=I%20love%20you", "_blank")}
          >
            CONTINUE WITH WHATSAPP
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Your name</label>
              <input 
                type="text" 
                id="username" 
                placeholder="" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">On what date did we become a couple?</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                {/* Ikon Mata buat lihat/tutup sandi */}
                <div 
                  className="eye-icon" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </div>
              </div>
              {/* Pesan kalau sandinya salah */}
              {errorMsg && <p className="error-text">{errorMsg}</p>}
            </div>

            <div className="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>

            <div className="form-actions">
              <div className="remember-me">
                <input type="checkbox" id="remember" defaultChecked />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button type="submit" className="btn-login">LOG IN</button>
            </div>
          </form>

          <hr className="bottom-divider" />
        </main>
      </div>
    </div>
  );
}