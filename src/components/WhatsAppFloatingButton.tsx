import { MessageCircle } from 'lucide-react';
import WhatsAppLink from './WhatsAppLink';

export default function WhatsAppFloatingButton() {
  return <WhatsAppLink className="floating-whatsapp" aria-label="Hubungi Hasanah Gold melalui WhatsApp">
    <MessageCircle size={22} aria-hidden="true" />
    <span>WhatsApp</span>
  </WhatsAppLink>;
}
