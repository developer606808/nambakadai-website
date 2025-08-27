import { Metadata } from 'next';

export type SeoMetadata = {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
};

export function generateSeoMetadata(seo: SeoMetadata): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.image ? [{ url: seo.image }] : undefined,
      url: seo.url,
      type: seo.type || 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : undefined
    }
  };
}

export function generateProductSeoMetadata(
  productName: string,
  description: string,
  price: number,
  images: string[]
): Metadata {
  return {
    title: productName,
    description: description,
    openGraph: {
      title: productName,
      description: description,
      images: images.map(url => ({ url })),
      type: 'product',
      price: {
        amount: price.toString(),
        currency: 'INR'
      }
    },
    twitter: {
      card: 'summary_large_image',
      title: productName,
      description: description,
      images: images.slice(0, 1)
    }
  };
}

export function generateStoreSeoMetadata(
  storeName: string,
  description: string,
  logo?: string
): Metadata {
  return {
    title: storeName,
    description: description,
    openGraph: {
      title: storeName,
      description: description,
      images: logo ? [{ url: logo }] : undefined,
      type: 'business'
    },
    twitter: {
      card: 'summary',
      title: storeName,
      description: description,
      images: logo ? [logo] : undefined
    }
  };
}