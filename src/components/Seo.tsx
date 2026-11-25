import { Helmet } from 'react-helmet-async';

const SITE_ORIGIN = 'https://orientohub.com.br';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/orientohub-social.jpg`;

export type JsonLdObject = Record<string, unknown>;

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  author?: string;
  jsonLd?: JsonLdObject | JsonLdObject[];
}

const normalizeUrl = (rawImage?: string) => {
  if (!rawImage) return DEFAULT_IMAGE;
  if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) return rawImage;
  const normalizedPath = rawImage.startsWith('/') ? rawImage : `/${rawImage}`;
  return `${SITE_ORIGIN}${encodeURI(normalizedPath)}`;
};

export const organizationSchema: JsonLdObject = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OrientoHub',
  alternateName: 'Orientohub',
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/favicon_512x512.png`,
  description:
    'Ecossistema brasileiro de estratégia, inovação, tecnologia e execução para empreendedores e empresas.',
  founder: {
    '@type': 'Person',
    name: 'Fernando Ramalho',
  },
  sameAs: [
    'https://www.instagram.com/orientohub/',
    'https://www.linkedin.com/company/orientohub/',
  ],
};

export const buildBreadcrumbSchema = (
  items: Array<{ name: string; path: string }>
): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_ORIGIN}${item.path === '/' ? '/' : item.path}`,
  })),
});

export function Seo({
  title,
  description,
  path = '/',
  image,
  imageAlt = 'OrientoHub',
  type = 'website',
  noindex = false,
  publishedTime,
  author,
  jsonLd,
}: SeoProps) {
  const cleanPath = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_ORIGIN}${cleanPath}`;
  const ogImage = normalizeUrl(image);
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      {!noindex && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:type" content={type} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="OrientoHub" />
      {!noindex && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={imageAlt} />

      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && <meta property="article:author" content={author} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export default Seo;
