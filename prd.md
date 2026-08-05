# Product Requirements Document — TikTok Video Downloader

## 1. Informasi Produk

**Nama sementara:** TikTok Video Downloader
**Jenis aplikasi:** Web Application
**Platform:** Web Responsive / Mobile First
**Target deployment:** Vercel atau Netlify
**Target pengguna:** Pengguna umum dan portfolio pribadi developer
**Sumber media:** TikTok
**Prioritas utama:** Download video TikTok tanpa watermark

---

## 2. Latar Belakang

Pengguna TikTok sering membutuhkan cara sederhana untuk menyimpan video agar dapat digunakan kembali secara offline, disimpan sebagai arsip pribadi, atau digunakan pada perangkat lain.

Proses download secara langsung dari TikTok umumnya menyertakan watermark. Selain itu, pengguna sering membutuhkan format atau kualitas media yang berbeda.

Aplikasi ini dirancang sebagai website responsif yang memungkinkan pengguna menempelkan URL video TikTok, melihat informasi video, memilih format serta kualitas yang tersedia, kemudian mengunduh media melalui antarmuka yang sederhana.

Aplikasi juga dikembangkan sebagai project portfolio untuk menunjukkan implementasi frontend modern, integrasi API, serverless architecture, asynchronous state management, responsive design, dan file handling.

---

# 3. Tujuan Produk

Aplikasi memiliki tujuan utama:

1. Memungkinkan pengguna memasukkan URL video TikTok.
2. Memvalidasi URL TikTok secara otomatis.
3. Mengambil metadata video TikTok.
4. Menampilkan preview video sebelum download.
5. Menyediakan download video TikTok tanpa watermark apabila source tersedia.
6. Menampilkan pilihan kualitas/resolusi berdasarkan media source yang tersedia.
7. Menyediakan download dalam format MP4.
8. Menyediakan opsi audio sebagai fitur sekunder.
9. Memberikan pengalaman penggunaan yang optimal pada perangkat mobile.
10. Menjadi project portfolio dengan implementasi engineering yang relevan untuk aplikasi frontend modern.

---

# 4. Target Pengguna

## 4.1 Pengguna Umum

Pengguna yang ingin:

* menyimpan video TikTok;
* mengunduh video tanpa watermark;
* mendapatkan video dengan kualitas terbaik yang tersedia;
* menggunakan website tanpa login;
* menggunakan layanan melalui smartphone maupun desktop.

## 4.2 Portfolio Viewer

Recruiter, developer, atau pihak lain yang ingin melihat kemampuan developer dalam:

* React;
* TypeScript;
* responsive web development;
* API integration;
* serverless functions;
* error handling;
* asynchronous state management;
* frontend architecture;
* UI/UX implementation.

---

# 5. Product Principles

Aplikasi harus mengikuti prinsip:

### Simple

Pengguna harus dapat mengunduh video hanya dengan:

1. Paste URL.
2. Klik tombol proses.
3. Pilih kualitas.
4. Klik download.

### Fast

Pengambilan informasi video harus dilakukan tanpa perpindahan halaman.

### Mobile First

Interface harus nyaman digunakan melalui smartphone.

### Transparent

Aplikasi tidak boleh menampilkan kualitas video yang sebenarnya tidak tersedia.

### No Account Required

Pengguna tidak perlu login atau membuat akun.

### Minimal User Data

Aplikasi tidak menyimpan URL atau riwayat download secara permanen.

---

# 6. Scope Produk

## 6.1 In Scope — MVP

Fitur yang harus tersedia pada versi pertama:

### URL Input

Pengguna dapat menempelkan link TikTok.

Contoh:

```text
https://www.tiktok.com/@username/video/123456789
```

atau short link seperti:

```text
https://vm.tiktok.com/xxxxxx/
```

---

### URL Validation

Sistem melakukan validasi terhadap URL sebelum request dikirim.

Valid:

```text
tiktok.com
www.tiktok.com
vm.tiktok.com
vt.tiktok.com
```

Invalid:

```text
youtube.com
instagram.com
facebook.com
random-site.com
```

---

### URL Resolve

Untuk short URL TikTok, sistem dapat mengikuti redirect untuk mendapatkan canonical TikTok URL.

---

### Video Metadata

Setelah URL berhasil diproses, aplikasi dapat menampilkan:

* thumbnail;
* username creator;
* display name apabila tersedia;
* caption video;
* durasi;
* available media formats.

---

### Video Preview

Pengguna dapat melihat thumbnail atau preview dari video sebelum melakukan download.

---

### MP4 Download

Pengguna dapat mendownload video dalam format MP4.

Prioritas diberikan pada video tanpa watermark apabila source tersebut tersedia.

---

### Resolution / Quality Selector

Apabila tersedia lebih dari satu media variant, aplikasi menampilkan opsi seperti:

```text
Original
1080p
720p
540p
```

Sistem hanya menampilkan kualitas yang benar-benar tersedia.

Jika hanya satu kualitas tersedia, selector tidak perlu ditampilkan.

---

### Audio Download

Sebagai fitur sekunder, pengguna dapat memilih mode audio.

Format target:

```text
MP3
```

Apabila direct MP3 tidak tersedia, implementasi dapat dikembangkan menggunakan audio extraction.

---

### Loading State

Ketika video sedang diproses, aplikasi memberikan informasi loading.

Contoh:

```text
Fetching your video...
```

atau menggunakan skeleton loader.

---

### Error Handling

Aplikasi harus menangani:

* URL tidak valid;
* video tidak ditemukan;
* video private;
* video sudah dihapus;
* URL expired;
* TikTok resolver error;
* request timeout;
* koneksi internet gagal;
* media format tidak tersedia;
* rate limit.

---

### Reset

Pengguna dapat:

```text
Download another video
```

tanpa melakukan reload seluruh halaman.

---

# 7. Out of Scope — MVP

Fitur berikut tidak menjadi bagian versi pertama:

* user authentication;
* akun pengguna;
* database;
* download history;
* playlist download;
* bulk download;
* Instagram downloader;
* YouTube downloader;
* Facebook downloader;
* private TikTok video bypass;
* TikTok login;
* bypass authentication;
* mobile application native;
* browser extension;
* cloud file storage.

Fitur-fitur tersebut dapat dipertimbangkan setelah MVP stabil.

---

# 8. User Flow

## 8.1 Main User Flow

```text
User membuka website
        ↓
User melihat URL input
        ↓
User paste TikTok URL
        ↓
Client melakukan validation
        ↓
User klik Download
        ↓
Loading state
        ↓
Request ke API Resolver
        ↓
Serverless Function memproses URL
        ↓
Video ditemukan?
     ↙       ↘
   Tidak      Ya
     ↓         ↓
Error State   Metadata ditampilkan
              ↓
        Preview Video
              ↓
       Pilih Quality
              ↓
         Pilih Format
              ↓
        Download Media
              ↓
      Download Another
```

---

# 9. Functional Requirements

## FR-001 — Input TikTok URL

Sistem menyediakan input untuk menerima URL TikTok.

---

## FR-002 — Paste URL

Sistem mendukung paste URL melalui clipboard browser.

---

## FR-003 — Validate URL

Sistem melakukan validasi URL sebelum request dikirim.

---

## FR-004 — Process URL

Sistem dapat mengirim URL TikTok ke media resolver.

---

## FR-005 — Resolve Short URL

Sistem dapat menangani short-link TikTok jika resolver mendukungnya.

---

## FR-006 — Display Metadata

Sistem menampilkan informasi video setelah media berhasil ditemukan.

---

## FR-007 — Video Preview

Sistem menyediakan preview atau thumbnail video.

---

## FR-008 — Available Video Formats

Sistem mendapatkan daftar format video yang tersedia.

---

## FR-009 — Video Quality

Sistem menampilkan opsi kualitas sesuai media yang tersedia.

---

## FR-010 — MP4 Download

Sistem memungkinkan pengguna mengunduh media berformat MP4.

---

## FR-011 — No-Watermark Variant

Jika media source menyediakan video tanpa watermark, sistem memprioritaskan source tersebut.

---

## FR-012 — Audio Mode

Sistem menyediakan opsi download audio sebagai fitur sekunder.

---

## FR-013 — Error Feedback

Sistem memberikan feedback ketika proses gagal.

---

## FR-014 — Retry

Pengguna dapat mencoba memproses ulang request yang gagal.

---

## FR-015 — Reset

Pengguna dapat memasukkan URL baru setelah proses selesai.

---

# 10. Non-Functional Requirements

## NFR-001 — Responsive

Website harus berjalan baik pada:

```text
Mobile
Tablet
Laptop
Desktop
```

Minimum viewport target:

```text
320px
```

---

## NFR-002 — Performance

Homepage harus memiliki initial load yang ringan.

Target Lighthouse:

```text
Performance      ≥ 90
Accessibility    ≥ 90
Best Practices   ≥ 90
SEO              ≥ 90
```

---

## NFR-003 — Accessibility

Interface harus mendukung:

* semantic HTML;
* keyboard navigation;
* focus state;
* aria-label;
* sufficient contrast;
* reduced motion preference.

---

## NFR-004 — Security

API secret tidak boleh dikirim ke client.

Environment variable harus berada pada serverless environment.

---

## NFR-005 — Privacy

Aplikasi tidak menyimpan URL video pengguna secara permanen.

---

## NFR-006 — Reliability

Error dari third-party resolver tidak boleh menyebabkan website crash.

---

# 11. System Architecture

Meskipun interface utama menggunakan frontend React, aplikasi membutuhkan lightweight serverless function untuk proses media resolution.

```text
┌───────────────────┐
│      Browser      │
│                   │
│ React Application │
└─────────┬─────────┘
          │
          │ POST /api/resolve
          ▼
┌────────────────────────┐
│  Serverless Function   │
│                        │
│ - URL validation       │
│ - Resolve TikTok URL   │
│ - Fetch metadata       │
│ - Resolve media source │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ TikTok / Media Resolver│
└───────────┬────────────┘
            │
            ▼
      JSON Response
            │
            ▼
┌────────────────────────┐
│      React Client      │
│                        │
│ preview                │
│ quality                │
│ download               │
└────────────────────────┘
```

Media sebisa mungkin tidak diproxy melalui serverless function.

Serverless API hanya digunakan untuk mendapatkan metadata dan URL media.

---

# 12. API Contract

## Endpoint

```http
POST /api/resolve
```

## Request

```json
{
  "url": "https://www.tiktok.com/@username/video/123"
}
```

## Successful Response

```json
{
  "success": true,
  "data": {
    "id": "123",
    "title": "Video title",
    "author": {
      "username": "username",
      "displayName": "User Name"
    },
    "thumbnail": "https://...",
    "duration": 15,
    "formats": [
      {
        "id": "original",
        "type": "video",
        "format": "mp4",
        "quality": "Original",
        "watermark": false,
        "url": "https://..."
      },
      {
        "id": "720",
        "type": "video",
        "format": "mp4",
        "quality": "720p",
        "watermark": false,
        "url": "https://..."
      }
    ],
    "audio": {
      "available": true,
      "url": "https://..."
    }
  }
}
```

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "VIDEO_NOT_FOUND",
    "message": "Video could not be found."
  }
}
```

---

# 13. Error Codes

Contoh internal error:

```text
INVALID_URL
UNSUPPORTED_URL
VIDEO_NOT_FOUND
VIDEO_PRIVATE
VIDEO_REMOVED
MEDIA_NOT_AVAILABLE
RATE_LIMITED
RESOLVER_ERROR
NETWORK_ERROR
SERVER_ERROR
```

---

# 14. Technology Stack

## Frontend

```text
React
Vite
TypeScript
```

## Styling

```text
Tailwind CSS
```

## Component Architecture

Pilihan:

```text
Custom Components
+
shadcn/ui bila diperlukan
```

## Icons

```text
Lucide React
```

Tidak menggunakan emoji sebagai icon utama.

## Animation

```text
Framer Motion / Motion
```

Digunakan secara ringan untuk:

* entrance animation;
* loading transitions;
* result card;
* error feedback;
* button interaction.

## Validation

```text
Zod
```

## API Request

Native:

```text
fetch
```

atau menggunakan:

```text
TanStack Query
```

jika kebutuhan asynchronous state meningkat.

## Backend Layer

```text
Vercel Serverless Functions
```

atau:

```text
Netlify Functions
```

## Deployment

Prioritas:

```text
Vercel
```

Alternatif:

```text
Netlify
```

---

# 15. Suggested Frontend Architecture

```text
src/
│
├── components/
│   ├── common/
│   ├── downloader/
│   │   ├── UrlInput.tsx
│   │   ├── DownloadForm.tsx
│   │   ├── VideoPreview.tsx
│   │   ├── VideoMetadata.tsx
│   │   ├── QualitySelector.tsx
│   │   ├── FormatSelector.tsx
│   │   ├── DownloadButton.tsx
│   │   └── ErrorState.tsx
│   │
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── hooks/
│   └── useVideoResolver.ts
│
├── lib/
│   ├── validation.ts
│   └── utils.ts
│
├── services/
│   └── resolver.ts
│
├── types/
│   └── video.ts
│
├── App.tsx
└── main.tsx
```

Serverless:

```text
api/
└── resolve.ts
```

---

# 16. Application State

Minimal state:

```ts
type DownloadStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";
```

Core state:

```text
url
status
videoData
selectedQuality
selectedFormat
error
```

---

# 17. Main UI States

Aplikasi minimal memiliki lima state utama.

## Idle

Menampilkan URL input.

## URL Entered

Input telah memiliki URL yang valid.

## Loading

Video sedang diproses.

## Success

Video ditemukan dan opsi download ditampilkan.

## Error

Terjadi kegagalan dan pengguna diberikan solusi.

---

# 18. Download Logic

Urutan default format video:

```text
No Watermark + Original Quality
        ↓
No Watermark + Highest Resolution
        ↓
Watermarked Source
```

Namun UI tidak boleh mengklaim:

```text
1080p
```

jika media source hanya memiliki kualitas lebih rendah.

---

# 19. Mobile Requirements

Pada perangkat mobile:

* layout menggunakan satu kolom;
* input memiliki tinggi minimal ±48px;
* CTA memiliki width penuh;
* video preview menggunakan rasio vertikal;
* format selector mudah ditekan dengan ibu jari;
* tidak memiliki horizontal overflow;
* font input minimal 16px untuk menghindari automatic zoom pada iOS;
* download CTA berada pada posisi yang mudah dijangkau.

---

# 20. Analytics

Untuk versi portfolio dapat digunakan analytics yang bersifat privacy-friendly.

Data yang dapat dilihat:

```text
Page visit
Resolve attempt
Resolve success
Resolve error
Download MP4
Download audio
```

Tidak perlu menyimpan TikTok URL ke analytics.

---

# 21. SEO

Metadata minimum:

```html
<title>TikTok Video Downloader</title>

<meta
  name="description"
  content="Download TikTok videos quickly in available video qualities."
/>
```

Tambahkan:

* Open Graph;
* favicon;
* canonical URL;
* robots.txt;
* sitemap.xml.

---

# 22. Legal / Usage Notice

Interface sebaiknya memiliki notice:

```text
Only download content you own or have permission to use.
```

Aplikasi tidak digunakan untuk bypass:

* private content;
* authentication;
* authorization;
* access restriction.

---

# 23. MVP Acceptance Criteria

MVP dianggap selesai apabila:

1. Website responsive dari 320px hingga desktop.
2. URL TikTok dapat diinput.
3. URL non-TikTok ditolak.
4. Short TikTok URL dapat diproses jika resolver mendukung.
5. Metadata video berhasil ditampilkan.
6. Thumbnail atau preview tersedia.
7. Format MP4 dapat dipilih.
8. Video dapat didownload.
9. Quality selector hanya menampilkan kualitas tersedia.
10. Error state tersedia.
11. Retry tersedia.
12. Tidak membutuhkan login.
13. Tidak menggunakan database.
14. API secret tidak terdapat pada frontend.
15. Project dapat di-deploy ke Vercel.
16. UI tetap usable pada koneksi lambat.
17. Lighthouse memiliki hasil yang baik.

---

# 24. Future Development

## V1.1

* MP3 conversion;
* copy video metadata;
* improved loading progress;
* improved video preview.

## V1.2

* download history lokal menggunakan localStorage;
* PWA;
* installable web app.

## V2

Pertimbangkan platform lain hanya apabila dibutuhkan:

```text
Instagram
Facebook
X
```

Namun TikTok tetap menjadi fokus produk utama.

---

# 25. Success Definition

Produk dianggap berhasil apabila pengguna baru dapat memahami dan menyelesaikan proses:

```text
Paste → Process → Choose Quality → Download
```

tanpa membutuhkan tutorial.

Target utama produk bukan jumlah fitur, melainkan:

```text
Cepat
Sederhana
Responsif
Jelas
Reliable
```
