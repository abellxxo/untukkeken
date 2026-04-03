# Happy 5 Months — Setup Guide

## Struktur folder
```
anniversary/
├── app/
│   ├── layout.js
│   ├── page.js           ← Landing page
│   └── timeline/
│       └── page.js       ← Timeline 6 bulan
├── package.json
└── next.config.js
```

---

## Cara run di laptop

1. Buka terminal / command prompt
2. Masuk ke folder ini:
   ```
   cd anniversary
   ```
3. Install dependencies (sekali aja):
   ```
   npm install
   ```
4. Jalankan:
   ```
   npm run dev
   ```
5. Buka browser → http://localhost:3000

---

## Cara isi foto (Imgur)

1. Buka https://imgur.com
2. Klik Upload (pojok kiri atas)
3. Upload foto
4. Setelah upload, klik foto → klik kanan → **Copy image address**
5. Buka file `app/timeline/page.js`
6. Cari bagian `photos:` di tiap bulan
7. Paste URL foto menggantikan link placeholder `placehold.co`

---

## Cara isi musik (Spotify)

1. Buka Spotify (web atau app)
2. Cari lagu yang mau dipakai
3. Klik titik tiga (...) di lagu → Share → **Copy Embed Code**
4. Dari kode embed itu, ambil bagian `src="..."` — itu URL-nya
5. Paste ke bagian `spotifyUrl:` di tiap bulan di file `app/timeline/page.js`

Contoh URL embed Spotify:
```
https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh?utm_source=generator
```

---

## Cara ganti nama

Di file `app/page.js`, cari:
```
Abel & Kenisha
```
Ganti dengan nama kalian.

---

## Cara ganti caption

Di file `app/timeline/page.js`, tiap bulan ada `caption:` — ganti teksnya sesuka hati.

---

## Deploy ke Vercel

1. Buat akun di https://vercel.com (gratis)
2. Install Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Di dalam folder `anniversary`, jalankan:
   ```
   vercel
   ```
4. Ikuti langkah-langkahnya (login, confirm settings)
5. Done — dapat link URL yang bisa dishare!

Atau bisa juga lewat Vercel website:
1. Push folder ini ke GitHub
2. Di Vercel → New Project → Import dari GitHub
3. Deploy

---

## Yang perlu diisi (checklist)

- [ ] Nama di `app/page.js`
- [ ] Foto Oktober (3 foto) di `app/timeline/page.js`
- [ ] Foto November (3 foto)
- [ ] Foto Desember (3 foto)
- [ ] Foto Januari (3 foto)
- [ ] Foto Februari (3 foto)
- [ ] Foto Maret (3 foto)
- [ ] Spotify URL Oktober
- [ ] Spotify URL November
- [ ] Spotify URL Desember
- [ ] Spotify URL Januari
- [ ] Spotify URL Februari
- [ ] Spotify URL Maret
- [ ] Caption tiap bulan (optional, udah ada default)
