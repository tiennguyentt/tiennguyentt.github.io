import type { UIKey } from './i18n/en';

export const SITE = {
  locale: 'en',
  title: 'Tien Nguyen',
  description:
    'AI product manager in Ho Chi Minh City. Live demos: Knowledge Engine, Recon, Sport Quant. Gelato in progress. Employer work (Green SM, Colonial) stays on the resume.',
  rssDescription: 'Notes and case studies from Tien Nguyen.',
  ogImage: '/og-image.png',
  author: 'Tien Nguyen',
  footerText: 'Tien Nguyen · AI Product Manager / Product Owner',
} as const;

export type SocialIcon = 'github' | 'x' | 'linkedin' | 'rss' | 'email';

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tiennguyenthithao/', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/tiennguyentt', icon: 'github' },
  { label: 'X', href: 'https://x.com/gelato_aop', icon: 'x' },
  { label: 'Email', href: 'mailto:tiennguyentthao@gmail.com', icon: 'email' },
];

export interface GiscusConfig {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  strict: boolean;
  reactionsEnabled: boolean;
  inputPosition: 'top' | 'bottom';
  lang: string;
  lightTheme: string;
  darkTheme: string;
}

export const GISCUS: GiscusConfig = {
  enabled: false,
  repo: '',
  repoId: '',
  category: 'Announcements',
  categoryId: '',
  mapping: 'pathname',
  strict: true,
  reactionsEnabled: true,
  inputPosition: 'bottom',
  lang: 'en',
  lightTheme: 'light',
  darkTheme: 'light',
};

export type NavItem =
  | { href: string; label: string; labelKey?: never }
  | { href: string; labelKey: UIKey; label?: never };

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/works/', label: 'Work' },
  { href: '/about/', label: 'About' },
];
