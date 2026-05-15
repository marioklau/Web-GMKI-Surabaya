# Admin Panel Setup Guide - GMKI Surabaya Website

## Akses Admin Panel

### URL Login Admin
```
http://localhost:5173/admin/login
```

## Cara Setup Admin User di Supabase

### 1. Buat User Admin di Supabase Dashboard

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Pergi ke **Authentication** → **Users**
4. Klik **+ Add user**
5. Isi email dan password untuk admin
6. Klik **Create user**

### 2. Set User sebagai Admin

Setelah user dibuat, Anda perlu mengatur `is_admin` di app_metadata:

1. Buka **SQL Editor** di Supabase Dashboard
2. Jalankan query berikut (ganti EMAIL_USER dengan email admin):

```sql
-- Update user untuk menjadi admin
UPDATE auth.users
SET app_metadata = jsonb_set(
  COALESCE(app_metadata, '{}'),
  '{is_admin}',
  'true'
)
WHERE email = 'gmkisurabaya@gmail.com';
```

### 3. Test Login

1. Buka http://localhost:5173/admin/login
2. Masukkan email dan password admin
3. Anda akan diarahkan ke Admin Dashboard

## Admin Dashboard Features

### Menu Utama Admin:

1. **Informasi Organisasi** (`/admin/organization-info`)
   - Kelola sejarah GMKI
   - Edit visi dan misi
   - Tambah/edit/hapus informasi

2. **Kelola Pengurus** (`/admin/board-members`)
   - CRUD untuk struktur kepengurusan
   - Manage foto, jabatan, dan deskripsi
   - Set urutan tampilan
   - Toggle status aktif/tidak aktif

3. **Kelola Dokumen** (`/admin/documents`)
   - CRUD dokumen administrasi
   - Kategori: Surat Keputusan, Formulir, Template, Pedoman
   - Upload link file dari cloud storage

4. **Kelola Komisariat** (`/admin/commissariats`)
   - CRUD data komisariat
   - Manage informasi kontak
   - Update link media sosial (Instagram, Facebook)
   - Toggle status aktif

5. **Kelola Kegiatan** (`/admin/events`)
   - CRUD agenda kegiatan
   - Upload multiple foto kegiatan
   - Set status: upcoming, ongoing, completed
   - Tambah laporan kegiatan

6. **Kelola Artikel** (`/admin/articles`)
   - CRUD artikel dan karya kader
   - Kategori: Renungan, Sosial-Politik, Esai, Laporan
   - Upload cover image
   - Publish/unpublish artikel

7. **Kelola Berita Highlight** (`/admin/news-highlights`)
   - CRUD berita untuk homepage
   - Mark sebagai featured news
   - Upload gambar berita

## Tips Penggunaan

### Upload File Dokumen
- Gunakan Google Drive, Dropbox, atau cloud storage lainnya
- Dapatkan link public untuk file
- Paste link di form document upload

### Upload Foto
- Rekomendasi ukuran: 1200x600px untuk optimal
- Format: JPG, PNG
- Bisa hosting di cloud storage dan ambil link publicnya

### Menambah Multiple Foto Kegiatan
1. Siapkan link foto dari cloud storage
2. Paste link di field "Foto Kegiatan"
3. Klik tombol "Tambah"
4. Ulangi untuk foto berikutnya
5. Foto pertama akan menjadi cover image

### Membuat Artikel
- Gunakan Enter untuk membuat paragraf baru
- Konten disimpan dalam format text plain
- Anda bisa copy-paste dari text editor

## Security Notes

- Hanya user dengan email di auth.users Supabase yang bisa login
- is_admin field disimpan di app_metadata (aman dari self-modification)
- Semua akses data diproteksi dengan RLS policies
- Admin yang logout akan perlu login lagi

## Troubleshooting

### Lupa Password Admin
1. Buka Supabase Dashboard
2. Pergi ke Authentication → Users
3. Cari user admin
4. Klik menu (•••) → Reset password
5. User akan menerima email untuk reset password

### User Tidak Bisa Login
- Pastikan user sudah dibuat di Supabase Authentication
- Pastikan is_admin sudah di-set di app_metadata
- Cek apakah user sudah confirm email (jika email confirmation diaktifkan)

### Data Tidak Tersimpan
- Cek apakah user sudah login dengan benar
- Cek internet connection
- Lihat browser console untuk error message
- Refresh halaman dan coba lagi

## Database Structure untuk Reference

### Tables yang bisa dikelola admin:
- `organization_info` - Info organisasi
- `board_members` - Data pengurus
- `documents` - Dokumen administrasi
- `commissariats` - Data komisariat
- `events` - Kegiatan dan event
- `articles` - Artikel kader
- `news_highlights` - Berita homepage

Semua table sudah memiliki RLS policies yang mengizinkan admin untuk read/write/delete.

---

**Catatan Penting:**
- Sebelum production, ubah password admin yang default
- Backup database secara berkala
- Edukasi admin user tentang pentingnya data accuracy
