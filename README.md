# AM Premium Store

Web sederhana untuk jualan Alight Motion Premium: dashboard, order otomatis,
top up saldo manual (dikonfirmasi admin), riwayat, dan panel admin.

## Fitur

- **Dashboard** — saldo, sisa stok, harga per unit, pop up ajakan gabung saluran WhatsApp.
- **Beli AM Premium** — masukkan jumlah, langsung otomatis terkirim ke Riwayat Pesanan kalau saldo & stok cukup.
- **Top Up** — instruksi kirim ke QR/DANA, isi nominal + nama pengirim, status pending sampai admin konfirmasi (minimal top up Rp1.000).
- **Riwayat Pesanan** & **Riwayat Deposit** — histori lengkap milik user.
- **Panel Admin** — pantau user & saldo, total pesanan & omzet, konfirmasi/tolak deposit, tambah/hapus stok Alight Motion Premium.

## Cara Menjalankan

1. Pastikan sudah install [Node.js](https://nodejs.org) (versi 18 ke atas).
2. Buka folder ini di terminal, lalu jalankan:
   ```
   npm install
   npm start
   ```
3. Buka `http://localhost:3000` di browser.

## Akun Admin Default

Saat pertama kali dijalankan, sistem otomatis membuat akun admin:

- Username: `admin`
- Password: `admin123`

**Segera login dan ganti password ini** (untuk saat ini ganti langsung lewat
file `data/db.json`, hash password baru bisa dibuat dengan bcrypt — atau
minta bantuan untuk ditambahkan fitur ganti password dari UI).

## Mengatur Harga, WhatsApp, QR, dan Nomor DANA

Semua ada di satu file: `src/config.js`. Tinggal ubah nilainya, tidak perlu
menyentuh kode lain:

- `PRICE_PER_UNIT` — harga per 1 unit AM Premium (default Rp500).
- `MIN_TOPUP` — minimal nominal top up (default Rp1.000).
- `WHATSAPP_CHANNEL` — link saluran WhatsApp yang muncul di pop up.
- `QR_IMAGE_URL` — gambar QR pembayaran.
- `DANA_NUMBER` / `DANA_NAME` — nomor & nama pemilik DANA.
- `JWT_SECRET` — ganti dengan string acak yang panjang sebelum dipakai online (sebaiknya lewat environment variable, jangan ditulis langsung di kode kalau sudah live).

## Menambah Stok Alight Motion Premium

Login sebagai admin → menu **Panel Admin** → bagian **Kelola Stok** → tempel
satu akun/kode per baris → klik **Tambah ke Stok**. Item paling atas akan
terkirim duluan ke pembeli berikutnya (FIFO).

## Struktur Data

Semua data (user, saldo, pesanan, deposit, stok) disimpan di satu file JSON:
`data/db.json`. Cocok untuk skala kecil-menengah. Kalau nanti trafiknya besar,
bagian `src/db.js` bisa diganti ke database sungguhan (misalnya SQLite/PostgreSQL)
tanpa mengubah route lainnya.

## Catatan Keamanan

- Ganti `JWT_SECRET` dan password admin default sebelum dipakai untuk transaksi nyata.
- Jalankan di belakang HTTPS (misalnya lewat Nginx/Cloudflare) supaya token login tidak bisa disadap.
- Backup rutin file `data/db.json`.
