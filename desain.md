# UI/UX Design Specification — TikTok Video Downloader

## 1. Design Direction

Website menggunakan pendekatan:

**Modern Minimal Utility Interface**

Karakter visual:

* clean;
* modern;
* lightweight;
* mobile-first;
* sedikit playful;
* fokus pada satu aktivitas utama;
* tidak terlihat seperti website downloader penuh iklan;
* tidak terlalu banyak card;
* tidak menggunakan efek 3D berlebihan;
* memiliki hierarchy yang kuat.

Website harus terasa seperti modern SaaS utility.

---

# 2. Design Goals

UI harus membuat pengguna langsung memahami:

> Paste TikTok link → Download video.

Tanpa onboarding dan tanpa tutorial panjang.

Prioritas hierarchy:

```text
1. URL Input
2. Download CTA
3. Video Result
4. Quality Selection
5. Download Action
```

Informasi lain bersifat pendukung.

---

# 3. Visual Style

Gunakan visual minimal dengan background bersih.

Referensi karakter desain:

```text
Vercel
Linear
Raycast
modern utility tools
```

Bukan menyalin desain, hanya mengikuti prinsip:

* whitespace luas;
* typography jelas;
* border tipis;
* radius modern;
* shadow halus;
* visual hierarchy yang kuat.

---

# 4. Color System

Gunakan neutral palette sebagai foundation.

## Background

```text
Background Primary:
#FAFAFA

Surface:
#FFFFFF

Surface Secondary:
#F5F5F5
```

## Text

```text
Primary:
#171717

Secondary:
#737373

Muted:
#A3A3A3
```

## Border

```text
#E5E5E5
```

## Primary Accent

Gunakan satu accent color yang kuat.

Contoh:

```text
#111111
```

dengan white text.

Optional secondary accent dapat mengambil inspirasi dari warna TikTok tetapi **jangan membuat website terlihat seperti clone TikTok**.

Accent tambahan dapat digunakan sangat terbatas.

---

# 5. Typography

Gunakan modern sans-serif.

Primary recommendation:

```text
Inter
```

Alternatif:

```text
Geist
Manrope
Plus Jakarta Sans
```

Typography scale:

```text
Hero:
48–64px Desktop
34–40px Mobile

Section Heading:
28–36px

Card Heading:
18–20px

Body:
16px

Secondary:
14px

Caption:
12–13px
```

Heading menggunakan:

```text
font-weight: 600–700
```

Body:

```text
400–500
```

---

# 6. Page Structure

Single-page interface.

```text
Navbar

Hero / Downloader

Video Result

How It Works

Features

FAQ

Footer
```

Downloader menjadi elemen utama yang terlihat tanpa scrolling pada desktop.

---

# 7. Navbar

Desktop:

```text
┌─────────────────────────────────────────────────────────┐
│ Logo                     How it works    FAQ    GitHub   │
└─────────────────────────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────────────────┐
│ Logo                      GitHub │
└──────────────────────────────────┘
```

Tidak perlu hamburger apabila jumlah navigation sangat sedikit.

Navbar:

```text
height: 64–72px
```

Gunakan max-width container.

Contoh:

```text
max-width: 1200px
```

---

# 8. Logo

Gunakan logo berbasis:

```text
Download arrow + play/video element
```

Style:

* simple;
* geometric;
* monoline atau filled minimalist;
* dapat digunakan sebagai favicon.

Jangan menggunakan logo TikTok sebagai logo utama website.

---

# 9. Hero Section

Hero menjadi pusat perhatian halaman.

Desktop layout:

```text
                 Small Badge

         Download TikTok videos
           quickly and easily.

    Save your favorite TikTok videos
       in the quality you prefer.


┌────────────────────────────────────────────┐
│ Paste TikTok video URL...          Paste │
└────────────────────────────────────────────┘

              [ Download ]

       No login • Fast • Easy to use
```

Hero berada di tengah halaman.

Max text width:

```text
650–750px
```

---

# 10. Hero Heading

Contoh:

```text
Download TikTok videos
quickly and easily.
```

Subheading:

```text
Paste a TikTok link, choose the available quality,
and download your video in seconds.
```

Hindari copy terlalu panjang.

---

# 11. URL Input

Input merupakan komponen terpenting.

Desktop:

```text
┌──────────────────────────────────────────────────────────┐
│ 🔗  https://www.tiktok.com/@user/video/...      Paste   │
└──────────────────────────────────────────────────────────┘
```

Gunakan Lucide icon:

```text
Link
Clipboard
Check
X
```

Jangan menggunakan emoji.

Height:

```text
56–60px desktop
52–56px mobile
```

Border radius:

```text
12–16px
```

---

# 12. Paste Button

Di sisi kanan input terdapat:

```text
Paste
```

Setelah clipboard berhasil dibaca:

```text
Pasted
```

dengan icon check selama ±1 detik.

Mobile dapat tetap inline jika space cukup.

Untuk viewport sangat kecil:

```text
Input
Paste

Download Button
```

---

# 13. Primary CTA

CTA utama:

```text
Download
```

atau:

```text
Fetch Video
```

Rekomendasi:

```text
Download
```

Button memiliki:

```text
height: 52–56px
```

Mobile:

```text
width: 100%
```

Desktop:

```text
width: auto / ±180px
```

Button disabled ketika URL kosong atau invalid.

---

# 14. URL Feedback

Invalid URL:

```text
Please enter a valid TikTok video URL.
```

Tampilkan tepat di bawah input.

Jangan menggunakan browser alert.

Valid URL dapat memiliki check icon kecil.

---

# 15. Loading Experience

Setelah tombol Download ditekan, input area berubah menjadi loading state.

Contoh:

```text
Fetching your video...
```

Gunakan:

* spinner sederhana; atau
* animated progress indicator.

Jangan menggunakan fake percentage.

Loading state sebaiknya menampilkan tahapan kecil:

```text
Finding video...
```

Jika cukup lama:

```text
This may take a few seconds.
```

---

# 16. Skeleton Loading

Result card menggunakan skeleton untuk:

```text
thumbnail
username
caption
quality buttons
download button
```

Skeleton membuat layout tidak mengalami perubahan besar setelah data selesai dimuat.

---

# 17. Result Section

Desktop:

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│ ┌───────────────┐    @username                          │
│ │               │                                      │
│ │ Video Preview │    Video caption...                   │
│ │               │                                      │
│ │               │    Quality                           │
│ └───────────────┘                                      │
│                      [ Original ] [ 1080p ] [ 720p ]    │
│                                                         │
│                      Format                             │
│                      [ Video MP4 ] [ Audio MP3 ]         │
│                                                         │
│                      [ ↓ Download Video ]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

# 18. Mobile Result Layout

Pada mobile gunakan satu kolom.

```text
┌────────────────────────────┐
│                            │
│       Video Preview        │
│                            │
└────────────────────────────┘

@username

Video caption text...

Quality

[ Original ]
[ 1080p    ]
[ 720p     ]

Format

[ Video MP4 ] [ Audio MP3 ]

[ ↓ Download Video ]

Download another
```

Tidak boleh ada horizontal scroll.

---

# 19. Video Preview

TikTok merupakan vertical content.

Gunakan:

```css
aspect-ratio: 9 / 16;
```

Max-width desktop:

```text
240–280px
```

Mobile:

```text
min(70vw, 280px)
```

Card video memiliki rounded corners.

---

# 20. Thumbnail State

Sebelum video dimainkan, tampilkan thumbnail.

Optional overlay:

```text
Play button
```

Video tidak perlu autoplay.

Hal tersebut menjaga:

* bandwidth;
* performance;
* user experience.

---

# 21. Video Metadata

Metadata ditampilkan dengan hierarchy:

```text
@username
Caption
Duration
```

Caption maksimal:

```text
2–3 lines
```

Jika lebih panjang:

```text
Show more
```

---

# 22. Quality Selector

Gunakan segmented button / pill selector.

Contoh:

```text
Quality

┌────────────┐ ┌────────┐ ┌────────┐
│ Original ✓ │ │ 1080p  │ │ 720p   │
└────────────┘ └────────┘ └────────┘
```

Selected state harus jelas.

Gunakan label:

```text
Best
```

untuk kualitas tertinggi apabila berguna.

Contoh:

```text
Original
Best
```

Jangan mengarang nilai resolution.

---

# 23. Format Selector

Primary:

```text
Video
MP4
```

Secondary:

```text
Audio
MP3
```

Layout:

```text
┌────────────────┐  ┌────────────────┐
│ Video          │  │ Audio          │
│ MP4            │  │ MP3            │
└────────────────┘  └────────────────┘
```

Video dipilih secara default.

---

# 24. Download Button

Primary CTA pada result:

```text
Download Video
```

Icon:

```text
Download
```

dari Lucide.

Jika audio dipilih:

```text
Download Audio
```

Button harus mengikuti selected format.

---

# 25. Download Feedback

Setelah download dimulai:

```text
Download started
```

dengan check icon.

Jangan mempertahankan spinner jika browser sudah mulai download.

---

# 26. Download Another

Setelah proses selesai terdapat secondary action:

```text
Download another video
```

Action akan:

```text
reset URL
reset media
reset selector
focus URL input
```

---

# 27. Error State

Error harus sederhana dan informatif.

Contoh:

```text
We couldn't fetch this video.

The video may be private, deleted,
or the link may no longer be available.

[ Try Again ]
```

Optional:

```text
Use another link
```

Error tidak menampilkan technical stack trace.

---

# 28. Specific Error Messages

## Invalid URL

```text
That doesn't look like a TikTok video link.
```

## Video Private

```text
This video appears to be private.
```

## Deleted Video

```text
This video is no longer available.
```

## Rate Limit

```text
Too many requests. Please try again shortly.
```

## Resolver Error

```text
We couldn't process this video right now.
```

---

# 29. How It Works Section

Setelah downloader.

Gunakan tiga step:

```text
01
Paste the link

02
Choose quality

03
Download
```

Desktop:

```text
01  ─────────  02  ─────────  03
```

Mobile:

```text
01
│
02
│
03
```

Gunakan icon sederhana:

```text
Link
SlidersHorizontal
Download
```

---

# 30. Features Section

Maksimal 4 feature blocks.

Contoh:

```text
No Watermark
Download available clean video variants.

Multiple Qualities
Choose from available resolutions.

Mobile Friendly
Built for mobile and desktop.

No Account
Paste a link and download.
```

Tidak perlu banyak marketing card.

---

# 31. FAQ

Gunakan accordion.

Pertanyaan:

```text
How do I download a TikTok video?

Can I download without a watermark?

Can I download TikTok videos as MP3?

Why isn't a certain resolution available?

Do I need to create an account?

Are my download links stored?
```

---

# 32. Footer

Minimal footer:

```text
Logo

TikTok Video Downloader

Built with React + TypeScript

GitHub
Portfolio

Only download content you own
or have permission to use.

© 2026
```

---

# 33. Responsive Breakpoints

Suggested Tailwind breakpoints:

```text
Mobile:
< 640px

sm:
640px+

md:
768px+

lg:
1024px+

xl:
1280px+
```

Design harus dimulai dari:

```text
320px
```

bukan desktop dahulu.

---

# 34. Container

Default:

```text
max-width: 1200px
margin: auto
```

Horizontal padding:

```text
16px mobile
24px tablet
32px desktop
```

---

# 35. Spacing System

Gunakan consistent spacing scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Jangan menggunakan random margin.

---

# 36. Border Radius

Suggested:

```text
Button:
10–12px

Input:
12–14px

Cards:
16–20px

Video:
16px
```

---

# 37. Shadows

Gunakan minimal.

Contoh:

```text
small:
0 1px 2px rgba(...)

card:
0 8px 30px rgba(... very low opacity)
```

Jangan menggunakan heavy glow.

---

# 38. Animation

Gunakan Motion/Framer Motion.

Animation hanya untuk mendukung interaction.

## Page Load

Hero:

```text
opacity: 0 → 1
y: 16 → 0
duration: ±0.4s
```

## Result

```text
opacity: 0 → 1
y: 12 → 0
```

## Error

Subtle fade.

## Button

Hover:

```text
scale: ±1.01
```

Tap:

```text
scale: ±0.98
```

Hindari:

```text
large parallax
3D scene
cursor follower
excessive floating objects
```

karena tidak mendukung fungsi utama aplikasi.

---

# 39. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Animation harus dapat dikurangi atau dinonaktifkan.

---

# 40. Accessibility

Interactive element minimal target:

```text
44 × 44px
```

Semua input memiliki label.

Icon-only button memiliki:

```html
aria-label
```

Keyboard:

```text
Tab
Enter
Space
```

harus berfungsi.

---

# 41. Toast

Gunakan toast hanya untuk feedback singkat:

```text
Link pasted
Download started
Copied
```

Error utama sebaiknya ditampilkan inline, bukan hanya toast.

---

# 42. Dark Mode

Dark mode **tidak menjadi kebutuhan MVP**.

Jika dikembangkan kemudian:

```text
system
light
dark
```

Untuk versi awal lebih baik fokus membuat satu visual theme yang matang.

---

# 43. Homepage Wireframe — Desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo                               How it works  FAQ  GitHub │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    TikTok Video Downloader                   │
│                                                              │
│                Download videos quickly                       │
│                  and without hassle.                         │
│                                                              │
│       Paste a TikTok link and select your quality.           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Paste TikTok URL...                            Paste  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│                     [ Download ]                             │
│                                                              │
│               No login • Fast • Simple                      │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                        RESULT                               │
│                                                              │
│  ┌─────────────┐      @username                             │
│  │             │                                             │
│  │   Preview   │      Caption...                            │
│  │             │                                             │
│  └─────────────┘      Quality                               │
│                       [Original] [1080p] [720p]              │
│                                                              │
│                       Format                                │
│                       [Video MP4] [Audio MP3]                │
│                                                              │
│                       [ Download Video ]                     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                      HOW IT WORKS                           │
│                                                              │
│       01                   02                  03             │
│    Paste link        Choose quality         Download         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                         FEATURES                             │
├──────────────────────────────────────────────────────────────┤
│                           FAQ                                │
├──────────────────────────────────────────────────────────────┤
│                          FOOTER                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 44. Homepage Wireframe — Mobile

```text
┌──────────────────────────────┐
│ Logo                  GitHub │
├──────────────────────────────┤
│                              │
│     TikTok Downloader        │
│                              │
│ Download TikTok videos       │
│ quickly and easily.          │
│                              │
│ ┌──────────────────────────┐ │
│ │ Paste TikTok URL...      │ │
│ │                    Paste │ │
│ └──────────────────────────┘ │
│                              │
│ [        Download         ]  │
│                              │
│ No login • Fast • Simple     │
│                              │
├──────────────────────────────┤
│                              │
│     ┌──────────────────┐     │
│     │                  │     │
│     │  Video Preview   │     │
│     │                  │     │
│     └──────────────────┘     │
│                              │
│ @username                    │
│                              │
│ Caption...                   │
│                              │
│ Quality                      │
│                              │
│ [ Original ] [ 1080p ]       │
│ [ 720p ]                     │
│                              │
│ Format                       │
│                              │
│ [ Video MP4 ] [ Audio MP3 ]  │
│                              │
│ [    Download Video       ]  │
│                              │
│ Download another video       │
│                              │
├──────────────────────────────┤
│ How it works                 │
│                              │
│ 01 Paste Link                │
│ │                            │
│ 02 Choose Quality            │
│ │                            │
│ 03 Download                  │
│                              │
├──────────────────────────────┤
│ Features                     │
├──────────────────────────────┤
│ FAQ                          │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

---

# 45. Component Mapping

```text
App
│
├── Navbar
│
├── Hero
│   └── DownloaderForm
│       ├── URLInput
│       ├── PasteButton
│       └── SubmitButton
│
├── ResultSection
│   ├── VideoPreview
│   ├── VideoMetadata
│   ├── QualitySelector
│   ├── FormatSelector
│   └── DownloadButton
│
├── HowItWorks
│
├── Features
│
├── FAQ
│
└── Footer
```

---

# 46. UX Priority

Jika terdapat konflik antara visual dan usability, gunakan urutan berikut:

```text
Usability
   ↓
Clarity
   ↓
Performance
   ↓
Responsive behavior
   ↓
Animation
   ↓
Decoration
```

Fungsi downloader harus selalu menjadi pusat perhatian website.

---

# 47. Final Design Principle

Website harus memberikan impresi:

> "Saya tahu harus melakukan apa dalam 2 detik setelah halaman terbuka."

Bukan:

> "Website ini mempunyai banyak animasi dan elemen visual."

Produk ini merupakan **utility application**, sehingga desain terbaik adalah desain yang membuat fungsi utamanya terasa cepat, sederhana, dan terpercaya.
