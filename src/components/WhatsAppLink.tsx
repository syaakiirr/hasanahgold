import type { AnchorHTMLAttributes } from 'react';
import { whatsappUrl } from '../data/business';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> & { subject?: string };

export default function WhatsAppLink({ subject, className = 'button', children = 'Tanya di WhatsApp', ...props }: Props) {
  return <a {...props} className={className} href={whatsappUrl(subject)} target="_blank" rel="noopener noreferrer">{children}</a>;
}
