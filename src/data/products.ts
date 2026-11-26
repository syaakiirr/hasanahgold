export const collections = [
  { id: 'rings', name: 'Cincin', english: 'Rings', description: 'Cincin untuk dipakai harian atau hari istimewa. Semak saiz dengan kami dahulu.', image: '/images/rings.jpg', alt: 'Cincin emas 916 berukir di atas kain linen krim dan batu travertine' },
  { id: 'bracelets', name: 'Gelang', english: 'Bracelets', description: 'Gelang lembut dan bangle keras. Ukur pergelangan dulu supaya selesa dipakai.', image: '/images/collection/bracelets.webp', alt: 'Gelang rantai emas 916 di atas batu travertine' },
  { id: 'necklaces', name: 'Rantai', english: 'Necklaces', description: 'Panjang dan corak rantai boleh ditanya terus dengan kami.', image: '/images/necklaces.jpg', alt: 'Rantai leher pintal emas 916 di atas kain sutera krim dan batu travertine' },
  { id: 'pendants', name: 'Loket', english: 'Pendants', description: 'Padankan loket dengan rantai yang ada di kedai.', image: '/images/pendants.webp', alt: 'Loket emas bermangga halus pada rantai emas' },
  { id: 'earrings', name: 'Subang', english: 'Earrings', description: 'Subang kecil untuk harian, atau berjuntai untuk majlis. Pilih sendiri di kedai.', image: '/images/earrings.jpg', alt: 'Sepasang subang juntaian emas 916 di atas batu travertine bermandi cahaya pagi' },
] as const;

export type Category = typeof collections[number]['id'];

export const products = collections.map((category) => ({
  id: `sample-${category.id}`,
  category: category.id,
  name: `Inspirasi ${category.name.toLowerCase()}`,
  subject: category.name,
  image: category.image,
  alt: category.alt,
  isPlaceholder: true,
}));

export const inspirationProducts = [
  {
    id: 'inspiration-daily-rings',
    category: 'rings' as const,
    name: 'Gaya harian cincin emas',
    subject: 'Cincin harian',
    image: '/images/inspiration/daily-rings.jpg',
    alt: 'Tangan memakai cincin emas 916 di bawah cahaya matahari pagi',
    isPlaceholder: false,
  },
  {
    id: 'inspiration-gift-set',
    category: 'pendants' as const,
    name: 'Set hadiah & hantaran',
    subject: 'Set hadiah emas',
    image: '/images/inspiration/gift-set.jpg',
    alt: 'Set cincin, subang dan rantai emas 916 dalam kotak baldu krim untuk hadiah atau hantaran',
    isPlaceholder: false,
  },
  {
    id: 'inspiration-bangle',
    category: 'bracelets' as const,
    name: 'Bangle ukiran klasik',
    subject: 'Bangle emas',
    image: '/images/collection/bangles.webp',
    alt: 'Bangle emas 916 berukir halus di atas batu travertine',
    isPlaceholder: false,
  },
  {
    id: 'inspiration-pendant',
    category: 'pendants' as const,
    name: 'Loket kerawang bunga',
    subject: 'Loket emas',
    image: '/images/collection/pendants.webp',
    alt: 'Loket emas 916 bentuk titisan kerawang bunga di atas batu travertine',
    isPlaceholder: false,
  },
  {
    id: 'inspiration-accessories',
    category: 'earrings' as const,
    name: 'Aksesori majlis istimewa',
    subject: 'Aksesori emas',
    image: '/images/collection/accessories.webp',
    alt: 'Bros orkid emas 916 dengan perincian kelopak halus',
    isPlaceholder: false,
  },
];
