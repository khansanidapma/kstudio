# KSTUDIO — SEO Ready Version

Website musik curated: https://khansanidapma.github.io/kstudio/

## File SEO yang sudah ditambahkan

| File | Fungsi |
|------|--------|
| `robots.txt` | Memberi tahu search engine apa yang boleh di-crawl + lokasi sitemap |
| `sitemap.xml` | Daftar URL penting agar Google & Bing lebih cepat menemukan situs |
| `site.webmanifest` | Support "Add to Home Screen" + theme color |
| `index.html` (diperbarui) | Meta robots, keywords, JSON-LD structured data, aria labels, improved title & description |
| `og-kstudio-v2.jpg` | Open Graph image (1200×630) untuk preview saat di-share |
| `assets/favicon.svg` | Favicon modern (SVG) |

## Cara Deploy ulang ke GitHub Pages

1. Download ZIP ini (`kstudio-seo.zip`).
2. Extract, lalu **upload semua isinya** ke root repository `khansanidapma/kstudio` (ganti file lama yang sama namanya).
3. Pastikan GitHub Pages aktif:
   - Repo → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` / root
4. Tunggu 1–3 menit, lalu cek: https://khansanidapma.github.io/kstudio/

## Langkah SEO setelah deploy (WAJIB dilakukan)

### 1. Google Search Console (paling penting)
- Buka: https://search.google.com/search-console
- Tambah property → **URL prefix** → masukkan `https://khansanidapma.github.io/kstudio/`
- Verifikasi (pilih HTML tag atau DNS jika punya domain custom)
- Setelah verified → **Sitemaps** → submit `https://khansanidapma.github.io/kstudio/sitemap.xml`
- Minta indexing: URL Inspection → masukkan homepage → **Request indexing**

### 2. Bing Webmaster Tools
- https://www.bing.com/webmasters
- Tambah site + submit sitemap yang sama

### 3. Refresh cache Open Graph / Social Preview
Setelah deploy, paksa refresh preview di:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
  → masukkan URL situs → klik **Scrape Again**
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Twitter/X Card Validator: https://cards-dev.twitter.com/validator (atau cukup share di X)

### 4. Cek teknis
- Google PageSpeed Insights: https://pagespeed.web.dev/
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Rich Results Test (JSON-LD): https://search.google.com/test/rich-results
- Cek robots.txt: https://khansanidapma.github.io/kstudio/robots.txt
- Cek sitemap: https://khansanidapma.github.io/kstudio/sitemap.xml

### 5. Opsional tapi recommended
- Buat Google Business Profile / Google My Business jika ingin local SEO (tidak wajib untuk situs musik)
- Pasang Google Analytics 4 atau Microsoft Clarity (privacy-friendly)
- Nanti kalau punya domain custom (misalnya kstudio.id), set di GitHub Pages + update canonical + sitemap + Search Console

## Catatan
- Situs ini single-page (hash navigation). Google tetap bisa index homepage dengan baik.
- Playlist disimpan di localStorage browser user (tidak di server).
- Newsletter form masih front-end only (butuh Google Apps Script jika ingin simpan email).

© 2026 KStudio
