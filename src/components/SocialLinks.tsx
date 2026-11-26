import { business } from '../data/business';

export default function SocialLinks() {
  return <div className="social-links">
    <a href={business.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
    <a href={business.socials.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
    {business.socials.facebook && <a href={business.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
  </div>;
}
