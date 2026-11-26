> Current design (16 November 2026): see [Cartelle reconstruction](docs/CARTELLE_RECONSTRUCTION.md) and [motion documentation](ANIMATION_DOCUMENTATION_Hasanah_Gold.md). ShinyText, TiltedCard, FadeContent and StarBorder below are retained source components but are no longer used by the landing page. The current page uses CSS crossfades, viewport reveals, Embla desktop rails, static mobile lists, and native dialog search.

# Hasanah Gold: pilihan komponen visual

Dokumen ini memilih **komponen visual library sebenar**, bukan sekadar Header, Footer atau Hero. Matlamat: pengalaman jenama barang kemas yang elegan, dengan foto dan pertanyaan WhatsApp sebagai fokus.

> Kemas kini: atas permintaan pengguna, hero kini statik sepenuhnya. ShinyText dan StarBorder mengekalkan gaya visual sahaja; shimmer, border sweep, entrance hero, float dan parallax dimatikan. Butang jeda dan label “Foto inspirasi” pada hero dibuang. Butiran gerakan hero di bawah ialah rekod konfigurasi terdahulu.

## Diterapkan pada website

| Komponen sebenar | Library / preview | Lokasi dan tujuan | Customisation | Priority |
| --- | --- | --- | --- | --- |
| Shiny Text | [React Bits preview](https://reactbits.dev/text-animations/shiny-text) | Headline hero; pantulan metalik menghubungkan tipografi dengan material emas | Magenta ke emas gelap yang masih boleh dibaca; sweep perlahan dengan jeda; dikawal butang Jeda animasi; statik pada telefon/reduced motion | Essential |
| Fade Content | [React Bits preview](https://reactbits.dev/animations/fade-content) | Foto dalam galeri; memperkenalkan barang kemas dengan reveal yang tenang | Adaptasi dengan mask cetek dan opacity, 750ms, sekali apabila terlihat; blur dibuang; kandungan asal sentiasa tersedia | Essential |
| Tilted Card | [React Bits preview](https://reactbits.dev/components/tilted-card) | Foto produk sahaja; sedikit perspektif seperti melihat barang kemas dari sudut berbeza | Maksimum 3Â°, skala 1.025, spring lembut; tiada tooltip, flip atau hologram; dimatikan pada touch/reduced motion | Recommended |
| Star Border | [React Bits preview](https://reactbits.dev/animations/star-border) | Satu CTA WhatsApp dalam hero; membantu pengunjung mengenal tindakan utama | Bingkai emas 1px, sweep 9s, tiada glow neon; kawalan pause yang sama dengan hero | Recommended |
| Embla Carousel | [React preview dan panduan v8](https://www.embla-carousel.com/docs/v8/get-started/react) | Galeri inspirasi; melihat pilihan tanpa halaman terlalu panjang | Tiga kad desktop, dua tablet, satu telefon; swipe, butang sebelum/selepas, papan kekunci; tiada autoplay atau loop | Essential |

Preview versi yang telah ditala untuk Hasanah Gold: [Hero dan logo](docs/previews/hero.png), [Galeri editorial](docs/previews/collections.png), [Telefon](docs/previews/mobile.png).

## Source tepat yang digunakan

React Bits dipin pada commit `448c03d79c240ead64360631e3465f4672878ac8`. Demo semasa mungkin menunjukkan lebih banyak pilihan daripada versi ringan yang digunakan di sini.

- [ShinyText.tsx](https://github.com/DavidHDev/react-bits/blob/448c03d79c240ead64360631e3465f4672878ac8/src/ts-default/TextAnimations/ShinyText/ShinyText.tsx) dan [CSS](https://github.com/DavidHDev/react-bits/blob/448c03d79c240ead64360631e3465f4672878ac8/src/ts-default/TextAnimations/ShinyText/ShinyText.css).
- [FadeContent.tsx](https://github.com/DavidHDev/react-bits/blob/448c03d79c240ead64360631e3465f4672878ac8/src/ts-default/Animations/FadeContent/FadeContent.tsx).
- [TiltedCard.tsx](https://github.com/DavidHDev/react-bits/blob/448c03d79c240ead64360631e3465f4672878ac8/src/ts-default/Components/TiltedCard/TiltedCard.tsx) dan [CSS](https://github.com/DavidHDev/react-bits/blob/448c03d79c240ead64360631e3465f4672878ac8/src/ts-default/Components/TiltedCard/TiltedCard.css).
- [StarBorder.tsx](https://github.com/DavidHDev/react-bits/blob/448c03d79c240ead64360631e3465f4672878ac8/src/ts-default/Animations/StarBorder/StarBorder.tsx) dan [CSS](https://github.com/DavidHDev/react-bits/blob/448c03d79c240ead64360631e3465f4672878ac8/src/ts-default/Animations/StarBorder/StarBorder.css).
- [Embla Carousel source](https://github.com/davidjerleke/embla-carousel/tree/v8.6.0/packages/embla-carousel-react), dependency `embla-carousel-react@8.6.0`.

Adaptasi projek berada dalam `src/components/visual/`; gaya dalam `src/styles/visual-components.css`; warna dan timing dalam `src/styles/tokens.css`. Native hero entrance/parallax daripada kerja animasi sebelumnya dikekalkan dan tidak dilabel sebagai komponen library.

## Pilihan yang disengajakan untuk tidak dipasang

| Komponen sebenar | Preview / source | Lokasi berpotensi | Sebab dan tetapan jika digunakan | Priority |
| --- | --- | --- | --- | --- |
| Particles | [React Bits preview](https://reactbits.dev/backgrounds/particles), [source](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Backgrounds/Particles/Particles.tsx) | Di belakang foto hero sahaja | Sedikit titik champagne, tiada garisan constellation; pause off-screen, tiada canvas pada telefon. Belum dipasang kerana cahaya dan shimmer sudah memberi suasana tanpa WebGL tambahan | Optional |
| Scroll Velocity | [React Bits preview](https://reactbits.dev/text-animations/scroll-velocity), [source](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/ScrollVelocity/ScrollVelocity.tsx) | Satu separator selepas koleksi | Teks jenama sahaja, sangat perlahan, tanpa distortion, disertakan pause; reduced motion menjadi teks statik. Belum dipasang supaya gerakan tulisan tidak bersaing dengan headline | Optional |
| Glowing Effect | [Aceternity preview dan source tab](https://ui.aceternity.com/components/glowing-effect) | Satu bingkai featured image | Warna emas sahaja, border 1px, blur minimum; bukan rainbow/neon. Tidak dipasang kerana Star Border sudah melaksanakan fungsi penekanan CTA. Lesen setiap sumber perlu disemak sebelum mengambil kod | Optional alternative |

21st.dev sesuai untuk mencari komponen individu, tetapi bukan satu lesen seragam atau alasan untuk memasukkan keseluruhan template. Pilih source author dan lesen khusus dahulu. Tiada kod 21st.dev dimasukkan atau dilabel seolah-olah digunakan.

## Disiplin visual dan akses

- Jangan tambah globe, terminal, grid futuristik, glitch, electric border atau dashboard visual.
- Produk, mesej WhatsApp dan CTA kekal boleh dibaca tanpa hover.
- Shimmer dan border berkongsi butang Jeda animasi; ambient berhenti apabila hero di luar viewport atau tab tidak aktif.
- Tilt tidak meminta gyroscope permission dan tidak berjalan pada sentuhan.
- Carousel manual menjaga masa membaca; slide yang tidak kelihatan tidak menerima fokus.
- Reduced motion menukar galeri serta-merta dan mengekalkan imej/teks statik.
- Semua stok fotografi ialah inspirasi, bukan pengesahan inventori, harga, ketulenan atau stok Hasanah Gold.
- Tiada foto rujukan Dribbble/Behance atau imej daripada mesej pengguna disalin sebagai aset jenama tanpa lesen.

## Lesen dan dependency

React Bits menggunakan **MIT + Commons Clause**, bukan MIT tanpa sekatan. Penggunaan dalam website komersial ini dibenarkan; komponen tidak boleh dijual semula sebagai produk komponen. Lesen asal disimpan dalam `public/licenses/react-bits.txt`. Embla dan Motion menggunakan MIT. Lihat `THIRD_PARTY_NOTICES.md`.

Hanya Motion (spring TiltedCard) dan Embla (galeri) ditambah. Tiada GSAP, Three.js, Spline atau particle engine. Build mengeluarkan HTML statik sebelum hydration supaya kandungan masih tersedia tanpa JavaScript.
