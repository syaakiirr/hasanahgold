import type { Category } from '../data/products';
import JewelleryImage from './JewelleryImage';
import WhatsAppLink from './WhatsAppLink';

export interface ProductCardItem {
  id: string;
  category: Category;
  name: string;
  subject: string;
  image: string;
  alt: string;
  isPlaceholder: boolean;
}

export default function ProductCard({ product }: { product: ProductCardItem }) {
  return <article className="product" data-reveal>
    <WhatsAppLink className="product-photo" subject={product.subject} aria-label={`Tanya tentang ${product.subject}`}>
      <div className="product-detail-image" aria-hidden="true"><JewelleryImage src={product.image} alt={`Perincian ${product.name}`} /></div>
      <JewelleryImage src={product.image} alt={product.alt} />
      <span className="product-quick-view">Tanya tentang koleksi</span>
    </WhatsAppLink>
  </article>;
}
