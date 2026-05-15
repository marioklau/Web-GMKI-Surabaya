# Website GMKI Surabaya

Website resmi GMKI (Gerakan Mahasiswa Kristen Indonesia) Surabaya yang informatif, modern, dan mudah diakses.

## Fitur Utama

### 1. **Beranda**
- Gambaran umum GMKI Surabaya
- Sejarah singkat organisasi
- Visi dan misi
- Highlight berita terbaru
- Call-to-action untuk bergabung

### 2. **Profil Pengurus**
- Struktur kepengurusan lengkap
- Ketua, Sekretaris, Bendahara
- Kepala Bidang (Kabid)
- Sekretaris Fungsional
- Foto dan deskripsi setiap pengurus

### 3. **Administrasi**
- Surat keputusan
- Formulir kaderisasi
- Template surat
- Pedoman dan aturan organisasi
- Download dokumen penting

### 4. **Komisariat**
- Daftar komisariat di Surabaya
- Profil lengkap setiap komisariat
- Informasi kontak dan media sosial
- Lokasi kampus

### 5. **Agenda Kegiatan**
- Kegiatan yang telah dan akan berlangsung
- Detail acara (tanggal, lokasi, deskripsi)
- Dokumentasi foto kegiatan
- Laporan kegiatan yang sudah selesai
- Filter berdasarkan status kegiatan

### 6. **Karya Kader**
- Artikel dan tulisan kader
- Kategori: Renungan, Sosial-Politik, Esai, Laporan
- Halaman detail artikel
- Informasi penulis dan tanggal publikasi

## Teknologi yang Digunakan

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Backend**: Supabase (Real-time database & Auth ready)

## Setup & Instalasi

### 1. Clone repository dan install dependencies
```bash
npm install
```

### 2. Konfigurasi Supabase
Buat file `.env` di root project dan isi dengan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database
- Buka Supabase SQL Editor
- Migration untuk membuat tabel sudah otomatis dijalankan
- Jalankan file `SAMPLE_DATA.sql` untuk mengisi data contoh

### 4. Jalankan Development Server
```bash
npm run dev
```

Website akan berjalan di `http://localhost:5173`

### 5. Build untuk Production
```bash
npm run build
```

## Struktur Database

### Tables:
1. **organization_info** - Informasi umum organisasi (sejarah, visi, misi)
2. **board_members** - Data pengurus organisasi
3. **documents** - Dokumen dan file administrasi
4. **commissariats** - Data komisariat GMKI
5. **events** - Agenda dan dokumentasi kegiatan
6. **articles** - Artikel dan karya tulis kader
7. **news_highlights** - Berita dan highlight untuk homepage

## Cara Mengelola Konten

### Menambah/Edit Data melalui Supabase Dashboard:

1. **Buka Supabase Dashboard** → Table Editor
2. Pilih tabel yang ingin dikelola
3. Tambah/edit/hapus data sesuai kebutuhan

### Struktur Data Penting:

#### Board Members
- `order_position`: Urutan tampilan (angka lebih kecil tampil duluan)
- `is_active`: Set `true` untuk ditampilkan di website

#### Documents
- `category`: surat_keputusan | formulir | template | pedoman
- `file_url`: Link ke file (bisa dari Google Drive, Dropbox, dll)

#### Events
- `status`: upcoming | ongoing | completed
- `images`: Array JSON berisi URL gambar
  ```json
  ["url1.jpg", "url2.jpg", "url3.jpg"]
  ```

#### Articles
- `is_published`: Set `true` untuk publish artikel
- `category`: renungan | sosial-politik | esai | laporan

#### Commissariats
- `social_media`: JSON object untuk link media sosial
  ```json
  {
    "instagram": "https://instagram.com/username",
    "facebook": "https://facebook.com/pagename"
  }
  ```

## Fitur Keamanan

- Row Level Security (RLS) aktif di semua tabel
- Public read access untuk konten website
- Dapat dikonfigurasi untuk akses write yang restricted

## Customization

### Mengubah Warna Tema
Edit file `tailwind.config.js` atau langsung di component dengan Tailwind classes.

### Menambah Menu Navigasi
Edit file `src/components/Navbar.tsx` pada array `navItems`.

### Mengubah Footer
Edit file `src/components/Footer.tsx`.

## Support & Maintenance

Website ini dibangun dengan arsitektur modern yang mudah di-maintain:
- Modular component structure
- Type-safe dengan TypeScript
- Responsive design untuk semua device
- SEO-friendly routing

## Kontak

Untuk pertanyaan atau dukungan, hubungi:
- Email: gmkisurabaya@gmail.com
- Instagram: @gmkisurabaya

---

**GMKI Surabaya** - Gerakan Mahasiswa Kristen Indonesia
