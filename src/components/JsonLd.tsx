export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ScrollCart",
    url: "https://scrollcart.com",
    logo: "https://scrollcart.com/logo.png",
    sameAs: [
      "https://twitter.com/scrollcart",
      "https://facebook.com/scrollcart",
      "https://instagram.com/scrollcart",
    ],
    description:
      "AI-curated Amazon shopping feed with one-tap checkout. Discover trending products recommended by top influencers and shop with ease.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
