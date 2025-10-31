export default async function Head({ params }: { params: { slug: string } }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base}/story-book/${encodeURIComponent(params.slug)}`;
  try {
    const res = await fetch(`${base}/api/storybooks/${encodeURIComponent(params.slug)}`, { cache: "no-store" });
    if (!res.ok) throw new Error("not ok");
    const data = await res.json();
    const title = data?.title || data?.data?.title || "Story";
    const description = data?.description || data?.data?.summary || "Read AI-generated storybook.";
    const image = data?.data?.coverImage || data?.coverImage || data?.images?.[0];
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: title,
      description,
      url,
      image,
    };
    return (
      <>
        <link rel="canonical" href={url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </>
    );
  } catch {
    return <link rel="canonical" href={url} />;
  }
}


