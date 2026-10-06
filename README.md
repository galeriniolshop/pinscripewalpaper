# RONA — Wallpaper Discovery

Website pencarian wallpaper berbahasa Indonesia (Next.js 16). Pengunjung bisa membuka tautan keyword seperti:

```text
https://domainmu.vercel.app/bunga-matahari
```

Slug tersebut otomatis diubah menjadi pencarian **“bunga matahari”**. Hasil dicari dari Pinterest melalui endpoint server-side yang mengadaptasi alur pencarian di proyek [pinscrape](https://github.com/galeriniolshop/pinscrape). Untuk deployment Vercel, alur pencarian ditulis ulang ringan di route Next.js (bukan memuat paket Python `pinscrape` dan seluruh dependensi OpenCV/NumPy-nya). Untuk contoh `bunga-matahari`, tersedia juga tiga gambar pratinjau lokal sehingga halaman tetap menampilkan visual bila Pinterest sedang membatasi akses.

## Fitur

- Halaman landing modern dan responsif.
- URL dinamis `/{keyword}` — bisa dibagikan langsung.
- Pencarian Pinterest dari server (tidak membuka endpoint scraper di browser).
- Galeri masonry, lightbox, simpan favorit di browser, serta tombol unduh.
- Validasi host gambar dan batas ukuran file pada endpoint unduh.
- Tidak memerlukan API key atau environment variable.

## Jalankan lokal

Persyaratan: Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`, lalu cari keyword atau kunjungi `http://localhost:3000/bunga-matahari`.

Untuk membuat build produksi:

```bash
npm run build
npm run start
```

## Deploy ke Vercel

1. Push seluruh folder proyek ini ke repository GitHub milikmu.
2. Di [Vercel](https://vercel.com/new), pilih **Add New → Project**, lalu import repository tersebut.
3. Biarkan Framework Preset terdeteksi sebagai **Next.js**. Build command dan output default tidak perlu diubah.
4. Tekan **Deploy**. Tidak ada environment variable yang wajib diisi.
5. Setelah deploy, tes tautan langsung seperti `https://domainmu.vercel.app/bunga-matahari`.

Vercel akan menangani routing dinamis Next.js secara otomatis; tidak perlu membuat satu halaman untuk tiap keyword. Jika ingin mengatur lokasi function, pilih **Singapore (`sin1`)** di pengaturan Function Region bila opsi itu tersedia pada paket/proyekmu.

## Catatan Pinterest

Integrasi ini memakai endpoint pencarian web Pinterest tanpa API key resmi, sesuai pola yang dipakai `pinscrape`. Endpoint tidak resmi dapat berubah, dibatasi, atau menampilkan challenge sewaktu-waktu. Dalam kondisi itu halaman `bunga-matahari` tetap memakai gambar pratinjau lokal, sementara keyword lain menampilkan pesan untuk mencoba kembali. Gambar Pinterest tetap milik pemegang hak masing-masing—gunakan dan unduh hanya sesuai izin dan ketentuan yang berlaku.
