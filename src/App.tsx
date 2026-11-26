import CataloguePage from './components/CataloguePage';
import Navbar from './components/Navbar';
import EditorialHome from './components/EditorialHome';
import SiteFooter from './components/SiteFooter';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import { usePageMotion } from './motion/usePageMotion';
import CollectionPage from './components/CollectionPage';
import AboutPage from './components/AboutPage';

export default function App({ path = typeof window === 'undefined' ? '/' : window.location.pathname }: { path?: string }) {
  usePageMotion();
  const isCatalogue = path.replace(/\/$/, '') === '/katalog';
  const isCollection = path.replace(/\/$/, '') === '/koleksi';
  const isAbout = path.replace(/\/$/, '') === '/tentang';
  return <>
    <a className="skip-link" href="#main">Langkau ke kandungan</a>
    <Navbar />
    <main id="main">
      {isCollection ? <CollectionPage /> : isCatalogue ? <CataloguePage /> : isAbout ? <AboutPage /> : <EditorialHome />}
    </main>
    <SiteFooter />
    <WhatsAppFloatingButton />
  </>;
}
