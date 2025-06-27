> ⚠️ **DOKUMENTASI LAMA!** Untuk dokumentasi terbaru dan lengkap, silakan lihat di sini 👉 [📚 Dokumentasi Terbaru](https://github.com/Ikhsanheriyawan2404/kartu-bicara-ui/blob/main/README.md)


# kartu-bicara

## 📌 Tentang Proyek Ini

**Kartu Bicara** adalah aplikasi berbasis web yang bertujuan untuk meningkatkan komunikasi melalui permainan kartu interaktif. Proyek ini terdiri dari **frontend** dan **backend** yang masing-masing memiliki repositori tersendiri:

- **Frontend (Vue 3 + Vite)** → [kartu-bicara-web](https://github.com/ikhsanheriyawan2404/kartu-bicara-web)
- **Backend (Colyseus + Express)** → [kartu-bicara-server](https://github.com/Ikhsanheriyawan2404/kartu-bicara-server)

Proyek ini bersifat **open source**, dan kami mengundang siapa saja untuk berkontribusi, baik dalam pengembangan fitur baru, perbaikan bug, maupun penambahan konten permainan.

---

## 🚀 Cara Berkontribusi

Jika kamu tertarik untuk berkontribusi, silakan ikuti langkah-langkah berikut:

1. **Fork repo ini** dan buat branch baru untuk perubahanmu.
2. **Jalankan proyek secara lokal** dengan mengikuti petunjuk di atas.
3. **Tambahkan fitur atau perbaikan** yang ingin kamu kembangkan.
4. **Buat Pull Request (PR)** ke repository utama.

Kami juga menerima saran dan ide untuk pengembangan lebih lanjut! Silakan buat **issue** di repository jika memiliki masukan atau menemukan bug.

---

## 📋 Capaian yang Harus Dicapai

Berikut adalah daftar fitur dan pengembangan yang masih dalam progres atau belum tersedia:

### ✅ **Fitur yang sudah tersedia**
- Pemilihan kategori sebelum masuk ke permainan.
- Rotasi giliran pemain secara otomatis.
- ~~Timer permainan.~~
- ~~Penghitungan skor berdasarkan jawaban yang benar~~.
- ~~Penyimpanan riwayat permainan~~.

### 🚧 **Fitur yang masih perlu dikembangkan**
- [ ] **Halaman Dashboard** → Menampilkan daftar permainan yang tersedia atau telah dimainkan.
- [ ] **Profil Pemain** → Menyimpan informasi skor dan statistik permainan pemain.
- [ ] **Sistem Leaderboard** → Menampilkan peringkat pemain berdasarkan skor tertinggi.
- [ ] **UI untuk Administrasi Data Kartu** → Halaman CRUD untuk menambah, mengedit, dan menghapus kartu pertanyaan.
- [ ] **Sistem Multiplayer Real-Time yang Lebih Stabil** → Mengoptimalkan koneksi WebSocket dan handling sesi permainan.

### 🃏 **Data Kartu / Pertanyaan yang Masih Kurang**
- [ ] Penambahan lebih banyak **kategori** pertanyaan.
- [ ] Penambahan lebih banyak **pertanyaan** untuk setiap kategori yang ada.
- [ ] Diversifikasi tingkat kesulitan pertanyaan.

---

Kami sangat antusias untuk mengembangkan proyek ini bersama komunitas.  
Jika kamu tertarik untuk membantu, jangan ragu untuk **bergabung dan berkontribusi**! 🚀

---

## Installation
# Welcome to Colyseus!

This project has been created using [⚔️ `create-colyseus-app`](https://github.com/colyseus/create-colyseus-app/) - an npm init template for kick starting a Colyseus project in TypeScript.

[Documentation](http://docs.colyseus.io/)

## :crossed_swords: Usage

```
npm install
npm start
```

## Structure

- `index.ts`: main entry point, register an empty room handler and attach [`@colyseus/monitor`](https://github.com/colyseus/colyseus-monitor)
- `src/rooms/MyRoom.ts`: an empty room handler for you to implement your logic
- `src/rooms/schema/MyRoomState.ts`: an empty schema used on your room's state.
- `loadtest/example.ts`: scriptable client for the loadtest tool (see `npm run loadtest`)
- `package.json`:
    - `scripts`:
        - `npm start`: runs `ts-node-dev index.ts`
        - `npm test`: runs mocha test suite
        - `npm run loadtest`: runs the [`@colyseus/loadtest`](https://github.com/colyseus/colyseus-loadtest/) tool for testing the connection, using the `loadtest/example.ts` script.
- `tsconfig.json`: TypeScript configuration file


## License

MIT
