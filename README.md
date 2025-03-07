# FL-Psikologi-Polda

Backend API untuk aplikasi psikologi Polda.

## 📋 Daftar Isi

-   [Tentang](#tentang)
-   [Teknologi](#teknologi)
-   [Instalasi](#instalasi)
-   [Konfigurasi Database](#konfigurasi-database)
-   [Menjalankan Aplikasi](#menjalankan-aplikasi)
-   [Endpoints API](#endpoints-api)
-   [Membuat Data Default](#membuat-data-default)
-   [Troubleshooting](#troubleshooting)

## 🔍 Tentang

Aplikasi ini menyediakan backend API untuk Aplikasi Tes online

## 💻 Teknologi

-   Node.js v20+ / v22+
-   Express.js
-   Prisma ORM
-   JWT (JSON Web Token)
-   bcrypt
-   MySQL

## 🚀 Instalasi

1. Clone repository ini:

```bash
git clone https://github.com/your-username/FL-psikologi-polda.git
cd FL-psikologi-polda
```

2. Install dependencies:

```bash
npm install
```

## 🗃️ Konfigurasi Database

1. Buat file `.env` di root direktori dan isi dengan konfigurasi berikut (sesuaikan dengan lingkungan Anda):

```
# Environment
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="mysql://username:password@localhost:3306/psikologi_polda"

# JWT
JWT_SECRET="thisisasecretcodepsikologipolda"
JWT_EXPIRES_IN="1d"
```

2. Buat database MySQL dengan nama `psikologi_polda`:

```sql
CREATE DATABASE psikologi_polda;
```

3. Jalankan Prisma untuk membuat struktur database:

```bash
npx prisma db push
```

4. Untuk melihat data di database secara visual:

```bash
npx prisma studio
```

## 🏃 Menjalankan Aplikasi

1. Mode Development (dengan auto-reload):

```bash
npm run dev
```

2. Mode Production:

```bash
npm start
```

## 🔌 Endpoints API

### Autentikasi

-   `POST /api/auth/login` - Login user/admin

### User Management

-   `GET /api/users` - Mendapatkan semua user
-   `GET /api/users/:id` - Mendapatkan user berdasarkan ID
-   `POST /api/users` - Membuat user baru
-   `POST /api/users/batch` - Membuat batch user (format: kesatuan+nomor)
-   `PUT /api/users/:id` - Update user
-   `DELETE /api/users/:id` - Hapus user

### Admin Management

-   `GET /api/admins` - Mendapatkan semua admin
-   `GET /api/admins/:id` - Mendapatkan admin berdasarkan ID
-   `POST /api/admins` - Membuat admin baru
-   `PUT /api/admins/:id` - Update admin
-   `DELETE /api/admins/:id` - Hapus admin

## 📝 Membuat Data Default

Jalankan script seeder untuk membuat 3 pengguna default:

```bash
npm run seed
```

Ini akan membuat:

1. Superadmin (username: `superadmin`, password: `superadmin123`)
2. Admin (username: `admin`, password: `admin123`)
3. User biasa (username: `user`, password: `user123`)

## ⚠️ Troubleshooting

### Port sudah digunakan

Jika Anda mendapatkan error `EADDRINUSE: address already in use :::3000`:

1. Ubah port di file `.env` ke port lain, misalnya:
    ```
    PORT=3001
    ```
2. Atau matikan aplikasi yang menggunakan port 3000:

    ```bash
    # Untuk melihat proses yang menggunakan port (macOS/Linux)
    lsof -i :3000

    # Untuk menghentikan proses
    kill <PID>
    ```

### Koneksi Database

Jika menemui error terkait koneksi database:

1. Pastikan server MySQL berjalan
2. Verifikasi kredensial di `DATABASE_URL` benar
3. Pastikan database `psikologi_polda` sudah dibuat
4. Pastikan user MySQL memiliki hak akses ke database tersebut

### Modul tidak ditemukan

Jika Anda mendapatkan error `Cannot find module`:

```bash
npm install
```

### Reset Database

Jika perlu reset database:

```bash
npx prisma migrate reset --force
npx prisma db push
```

### Error Seeder

Jika script seeder tidak berjalan:

1. Pastikan struktur direktori sesuai (`src/seeds/createDummyUsers.js`)
2. Pastikan script seeder tercantum di `package.json`:
    ```json
    "scripts": {
      "seed": "node src/seeds/createDummyUsers.js"
    }
    ```

## 📞 Kontak

Jika ada pertanyaan, hubungi [muhakbarra1@google.com]

---

Dibuat dengan ❤️ oleh Muhamad Akbar
