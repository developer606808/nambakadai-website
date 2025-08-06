import Head from "next/head"

interface MetaTagsProps {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: "website" | "article" | "product"
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export default function MetaTags({
  title,
  description,
  keywords,
  image = "/placeholder.svg?height=630&width=1200",
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
}: MetaTagsProps) {
  const siteName = "Nanbakadai"
  const fullTitle = `${title} | ${siteName}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author || siteName} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article specific meta tags */}
      {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === "article" && author && <meta property="article:author" content={author} />}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === "product" ? "Product" : "WebPage",
            name: title,
            description: description,
            image: image,
            url: url,
            ...(type === "product" && {
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStock",
              },
            }),
          }),
        }}
      />
    </Head>
  )
}
