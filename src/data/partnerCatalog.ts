export type PartnerCatalogItem = {
  id: string;
  name: string;
  formerName?: string;
  category: string;
  eyebrow: string;
  description: string;
  highlights: string[];
  url: string;
  ctaLabel: string;
  secondaryCta?: { label: string; url: string };
  learnMoreUrl?: string;
  website: string;
  image: string;
  favicon: string;
  imageFit?: 'contain' | 'cover';
  accent: string;
};

export const partnerCatalog: PartnerCatalogItem[] = [
  {
    id: 'numera',
    name: 'Numera',
    formerName: 'anteriormente Brdid',
    category: 'Telefonia e comunicação',
    eyebrow: 'Parceiro em destaque',
    description: 'Número virtual para WhatsApp Business, telefonia e PABX, com contratação online e gestão centralizada.',
    highlights: ['WhatsApp Business', 'Telefonia virtual', 'PABX para empresas'],
    url: 'https://brdid.com.br/?ref=orientohub',
    ctaLabel: 'Conhecer e contratar',
    learnMoreUrl: 'https://brdid.com.br/',
    website: 'brdid.com.br',
    image: '/partners/numera/brdid-logo.png',
    favicon: '/partners/numera/brdid-logo.png',
    imageFit: 'contain',
    accent: '#B6FF00',
  },
  {
    id: 'infinitepay',
    name: 'InfinitePay',
    category: 'Pagamentos e finanças',
    eyebrow: 'Solução parceira',
    description: 'Conta digital e soluções de pagamento para negócios, com maquininha, Pix e link de pagamento em uma mesma operação.',
    highlights: ['Maquininha Smart', 'Conta digital', 'Pix e link de pagamento'],
    url: 'https://buy.infinitepay.io/smart?rid=fernandoramalho',
    ctaLabel: 'Contratar maquininha Smart',
    learnMoreUrl: 'https://www.infinitepay.io/',
    website: 'infinitepay.io',
    image: '/partners/infinitepay/og-conta.avif',
    favicon: '/partners/infinitepay/favicon.ico',
    imageFit: 'cover',
    accent: '#37F28C',
  },
  {
    id: 'pagbank',
    name: 'PagBank',
    category: 'Pagamentos e finanças',
    eyebrow: 'Solução parceira',
    description: 'Soluções financeiras para pessoas e negócios, com conta digital, maquininhas de cartão e recursos para receber e movimentar dinheiro.',
    highlights: ['Maquininhas de cartão', 'Conta digital', 'Soluções para negócios'],
    url: 'http://pagbank.vc/indica-maquininhas-6563532d4',
    ctaLabel: 'Ver maquininhas',
    secondaryCta: {
      label: 'Criar conta',
      url: 'http://pagbank.vc/indica-conta-5f55740d6',
    },
    website: 'pagbank.com.br',
    image: '/partners/pagbank/og-pagbank.jpg',
    favicon: '/partners/pagbank/favicon.ico',
    imageFit: 'cover',
    accent: '#00B64F',
  },
];
