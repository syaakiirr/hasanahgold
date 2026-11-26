import { inspirationProducts, products } from '../data/products';
import ProductCard from './ProductCard';
import CollectionCarousel from './visual/CollectionCarousel';

export default function FeaturedProducts({ curated = false }: { curated?: boolean }) {
  const items = curated ? inspirationProducts : products;
  return <section id={curated ? 'inspiration' : 'products'} className="section products-section"><div className="container">
    {curated && <p className="eyebrow section-eyebrow">Idea untuk anda</p>}
    <div className="section-heading" data-reveal><h2>{curated ? 'Mana satu pilihan anda?' : 'Cari yang sesuai dengan anda.'}</h2><a className="button button-outline" href={curated ? '#contact' : '#collections'}>{curated ? 'Tanya kami' : 'Lihat kategori'}</a></div>
    <CollectionCarousel>{items.map((product) => <ProductCard key={product.id} product={product} />)}</CollectionCarousel>
    <a className="button button-outline mobile-view-more" href={curated ? '#contact' : '#collections'}>{curated ? 'Tanya kami' : 'Lihat kategori'}</a>
  </div></section>;
}
