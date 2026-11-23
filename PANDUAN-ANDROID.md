# Panduan Aplikasi Android – Absensi Pekerja PT. Cenderawasih Teknik Papua

Paket ini mengubah `index.html` Anda menjadi aplikasi yang bisa dipasang di Android (PWA).
Isi paket:

| File | Fungsi |
|---|---|
| `index.html` | Aplikasi Anda (isi tidak diubah, hanya ditambah tautan manifest + pendaftaran service worker) |
| `manifest.webmanifest` | Nama, warna, dan ikon aplikasi |
| `sw.js` | Service worker (syarat agar bisa di-install) |
| `icons/` | Ikon 192, 512, dan maskable (diambil dari logo di aplikasi Anda) |
| `firebase.json` | Opsional, untuk hosting di Firebase Hosting |

> Aplikasi tetap butuh **internet** (Firebase, peta, dan jam server). GPS dan kamera selfie butuh halaman **HTTPS**, jadi file harus di-host dulu, tidak bisa dibuka dari penyimpanan HP.

---

## Langkah 1 – Taruh di hosting HTTPS (wajib)

**Opsi A: GitHub Pages** (sesuai catatan di dalam file Anda)
1. Buat repo GitHub, unggah **semua isi folder ini** (bukan zip-nya) ke branch `main`, termasuk folder `icons`.
2. Settings → Pages → Deploy from branch → `main` / root → Save.
3. Alamat jadi `https://NAMAANDA.github.io/NAMAREPO/`.

**Opsi B: Firebase Hosting** (Anda sudah punya project Firebase)
1. Install Node.js, lalu di terminal: `npm i -g firebase-tools` → `firebase login`.
2. Masuk ke folder ini → `firebase init hosting` (pilih project `cenderawasih-teknik-papua`, folder public: `.`, single-page app: No, jangan timpa `index.html`).
3. `firebase deploy`. Alamat jadi `https://cenderawasih-teknik-papua.web.app`.

---

## Langkah 2 – Pasang di HP

### Cara 1 (paling mudah): Install dari Chrome, tanpa APK
1. Di HP Android, buka alamat dari Langkah 1 memakai **Chrome**.
2. Ketuk menu ⋮ → **Instal aplikasi** (atau **Tambahkan ke layar utama**).
3. Buka ikon "Absensi" di layar utama. Saat diminta, izinkan **Lokasi** dan **Kamera**.
4. Bagikan alamat yang sama ke semua pekerja. Mereka cukup mengulangi langkah 1–3.

### Cara 2: Jadi file APK (bisa dibagikan lewat WhatsApp / USB)
Memakai PWABuilder, tanpa coding dan tanpa Android Studio.
1. Buka **pwabuilder.com**, tempel alamat dari Langkah 1, klik **Start**.
2. Pastikan skor Manifest dan Service Worker hijau, lalu klik **Package for stores → Android**.
3. Isi: Package ID (mis. `id.cenderawasih.absensi`), nama aplikasi, versi `1`. Pilih **Generate signing key** (otomatis).
4. Unduh zip hasilnya. **Simpan file signing key dan passwordnya baik-baik**, karena dibutuhkan untuk setiap pembaruan APK.
5. Di dalam zip ada `*.apk`. Kirim ke HP, buka, izinkan "Instal dari sumber tidak dikenal", lalu Install.

Catatan: agar APK tampil penuh tanpa bar alamat, file `assetlinks.json` dari PWABuilder harus berada di `https://DOMAIN/.well-known/assetlinks.json` di **akar domain**. Ini mudah di Firebase Hosting atau domain sendiri, tetapi tidak bisa di GitHub Pages bentuk `username.github.io/NAMAREPO` (kecuali repo bernama `username.github.io`). Tanpa file itu aplikasi tetap jalan normal, hanya ada bar alamat kecil di atas.

### Cara 3 (lanjutan): Capacitor + Android Studio
Hanya bila perlu fitur native. Perhatikan: di WebView, tombol **unduh Excel/JSON** (admin) kemungkinan tidak berfungsi karena memakai unduhan blob. Cara 1 dan 2 tidak punya masalah ini.
```
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init Absensi id.cenderawasih.absensi --web-dir=www
mkdir www && cp -r index.html manifest.webmanifest sw.js icons www/
npx cap add android
npx cap sync
```
Tambahkan di `android/app/src/main/AndroidManifest.xml` (di atas `<application>`):
```
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.CAMERA"/>
```
Lalu `npx cap open android` → Build → Build APK(s).

---

## Memperbarui aplikasi
1. Ubah `index.html`, lalu di `sw.js` naikkan `VERSION` (`absensi-v1` → `absensi-v2`).
2. Unggah ulang ke hosting. HP akan memakai versi baru saat aplikasi dibuka ulang (kadang perlu ditutup dan dibuka dua kali). APK Cara 2 tidak perlu dibuat ulang selama alamatnya sama.

## Masalah umum
- **Tombol Instal tidak muncul:** pastikan alamat `https://`, semua file (termasuk `icons/`) terunggah, dan pakai Chrome.
- **GPS/kamera ditolak:** Pengaturan HP → Aplikasi → Chrome (atau Absensi) → Izin → aktifkan Lokasi dan Kamera, GPS HP menyala.
- **Perubahan tidak muncul:** `VERSION` di `sw.js` belum dinaikkan, atau tutup aplikasi sepenuhnya lalu buka lagi.
- **Keamanan Firebase:** kalau Firestore dibuat dengan "test mode", aturannya kedaluwarsa setelah 30 hari dan terbuka untuk umum. Periksa tab Rules di Firebase Console.
