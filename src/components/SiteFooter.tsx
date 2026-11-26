import DoodleCrewFooter, { type CrewMember } from './ui/doodle-crew-footer';
import { business, mapsUrl, navigation, navigationHref, whatsappUrl } from '../data/business';
import { jewellery as collections } from '../data/jewellery';

const crew: CrewMember[] = [
  { kind: 'yeti', letter: 0, seat: 'front', offset: -0.32, name: 'Bruno', says: 'Hungry. Got snacks?' },
  { kind: 'bird', letter: 1, seat: 'top', offset: 0.02, name: 'Pip', says: 'Tweet us! Seriously.' },
  { kind: 'mushroom', letter: 2, seat: 'front', offset: 0.12, scale: 0.95, name: 'Morel', says: "I'm a fun guy." },
  { kind: 'kid', letter: 4, seat: 'top', offset: -0.05, name: 'Juno', says: 'Up here! Best seat in the house.' },
  { kind: 'ghost', letter: 5, seat: 'behind', offset: 0, name: 'Boo', says: 'Boo! …sorry. Hi.' },
  { kind: 'cat', letter: 6, seat: 'front', offset: 0.42, flip: true, name: 'Patch', says: 'Arr. Nice cursor.' },
];

export default function SiteFooter() {
  return (
    <DoodleCrewFooter
      wordmark="HASANAH"
      brand="syaakiirr"
      preset="paper"
      blurb="Hasanah Gold, Kuala Terengganu. Barang kemas emas untuk dipakai, diberi dan dikenang."
      tagline="Hasanah Gold — kedai emas di Kuala Terengganu."
      columns={[
        { title: 'Pautan', links: navigation.map(([id, label]) => ({ label, href: navigationHref(id) })) },
        { title: 'Koleksi', links: collections.map((c) => ({ label: c.name, href: `/koleksi/#${c.id}` })) },
        {
          title: 'Hubungi',
          links: [
            { label: business.phone, href: `tel:${business.telephone}` },
            { label: business.email, href: `mailto:${business.email}` },
            { label: 'Lokasi kedai', href: '/#visit' },
          ],
        },
      ]}
      actions={[
        { label: 'Tanya di WhatsApp', href: whatsappUrl(), icon: 'heart', variant: 'solid' },
        { label: 'Buka Google Maps', href: mapsUrl, icon: 'plane', variant: 'outline' },
      ]}
      copyright={`© ${new Date().getFullYear()} ${business.name}.`}
      legal={[]}
      socials={[
        { label: 'Instagram', href: business.socials.instagram ?? undefined },
        { label: 'TikTok', href: business.socials.tiktok ?? undefined },
      ]}
      crew={crew}
    />
  );
}
