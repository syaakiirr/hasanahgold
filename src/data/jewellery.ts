export const jewellery = [
  { id: 'rings', name: 'Cincin Emas', english: 'Rings', model: 'ring', detail: 'Untuk jari, bukan untuk laci.', description: 'Rekaan ringkas untuk setiap hari dan cincin untuk saat istimewa. Semak saiz, berat dan harga bersama kami.', design: 'Jalinan berganda · kemasan berkilau' },
  { id: 'bracelets', name: 'Gelang Emas', english: 'Bracelets', model: 'bracelet', detail: 'Rancak di pergelangan.', description: 'Rantaian dengan perincian yang bergerak bersama anda. Padankan sendiri atau lapiskan dengan gelang kegemaran.', design: 'Rantaian bertaut · pautan bujur' },
  { id: 'necklaces', name: 'Rantai Leher', english: 'Necklaces', model: 'necklace', detail: 'Pilih panjang yang selesa.', description: 'Boleh dipakai sendiri atau bersama loket. Tanya kami tentang corak, panjang dan pilihan rantai yang ada.', design: 'Rantaian pintal · siluet memanjang' },
  { id: 'pendants', name: 'Loket Emas', english: 'Pendants', model: 'pendant', detail: 'Kecil, tapi nampak.', description: 'Satu loket boleh menukar rupa rantai lama anda. Pilih bentuk yang membawa makna tersendiri.', design: 'Bentuk titisan · kerawang bunga' },
  { id: 'earrings', name: 'Subang Emas', english: 'Earrings', model: 'earrings', detail: 'Sepasang untuk menyerikan wajah.', description: 'Daripada subang kecil hingga rekaan berjuntai. Pilih pasangan yang selesa dipakai sepanjang hari.', design: 'Sepasang juntaian · lengkung berpilin' },
  { id: 'bangles', name: 'Bangle Emas', english: 'Bangles', model: 'bangle', detail: 'Bentuk tegas, kilauan lembut.', description: 'Gelang keras dengan lengkung yang kemas. Tanya kami tentang saiz dan rekaan bangle yang sesuai di pergelangan.', design: 'Gelang keras · jalur bertekstur' },
  { id: 'anklets', name: 'Gelang Kaki Emas', english: 'Anklets', model: 'anklet', detail: 'Kilauan pada setiap langkah.', description: 'Rantaian halus dengan hiasan kecil. Semak ukuran dan pilihan bersama kami.', design: 'Rantaian halus · hiasan berjurai' },
  { id: 'accessories', name: 'Aksesori Emas', english: 'Accessories', model: 'tiara', detail: 'Untuk majlis dan persalinan istimewa.', description: 'Lengkapkan persalinan istimewa dengan aksesori dari kedai. Tanya kami apa yang tersedia buat masa ini.', design: 'Bros orkid · perincian kelopak' },
] as const;

export type Jewellery = typeof jewellery[number];

