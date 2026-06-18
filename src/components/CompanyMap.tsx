export default function CompanyMap({
  lat,
  lng,
  name
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Use Google Maps when an API key is configured; otherwise fall back to the
  // keyless OpenStreetMap embed so the map always renders.
  let src: string;
  if (key) {
    src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${lat},${lng}&zoom=15`;
  } else {
    const d = 0.008;
    const bbox = `${(lng - d).toFixed(5)},${(lat - d).toFixed(5)},${(lng + d).toFixed(5)},${(lat + d).toFixed(5)}`;
    src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`;
  }

  return (
    <iframe
      title={`Map: ${name}`}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className="h-64 w-full rounded-lg border border-border"
    />
  );
}
