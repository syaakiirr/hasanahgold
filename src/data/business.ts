export const business = {
  name: 'Hasanah Gold',
  tagline: 'Keindahan Emas, Keanggunan Anda.',
  address: 'Lot 11-A & 12-A, Dataran Panji, Jalan Panji Alam, 21100 Kuala Terengganu, Terengganu, Malaysia',
  phone: '019-9089888',
  telephone: '+60199089888',
  whatsapp: '60199089888',
  email: 'hasanahgold78@gmail.com',
  generalMessage: 'Hai Hasanah Gold, boleh saya tahu koleksi emas yang ada di kedai?',
  socials: {
    instagram: 'https://www.instagram.com/hasanahgold78/',
    tiktok: 'https://www.tiktok.com/@hasanahgold78',
    facebook: null as string | null,
  },
};

export function whatsappUrl(subject?: string) {
  const message = subject
    ? `Hai Hasanah Gold, saya berminat dengan ${subject} selepas melihat gambar inspirasi di laman web. Boleh kongsikan gambar dan maklumat koleksi yang ada di kedai?`
    : business.generalMessage;
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${business.address}`)}`;

export const navigation = [
  ['home', 'Utama'], ['collections', 'Koleksi'], ['catalogue', 'Katalog'], ['about', 'Tentang kami'],
  ['contact', 'Hubungi'],
] as const;

export const navigationHref = (id: string) => id === 'collections' ? '/koleksi/' : id === 'catalogue' ? '/katalog/' : id === 'about' ? '/tentang/' : `/#${id}`;
