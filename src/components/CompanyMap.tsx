export default function CompanyMap({
  lat,
  lng,
  name
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  const d = 0.008;
  const bbox = `${(lng - d).toFixed(5)},${(lat - d).toFixed(5)},${(lng + d).toFixed(5)},${(lat + d).toFixed(5)}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <iframe
      title={`Map: ${name}`}
      src={src}
      loading="lazy"
      className="h-64 w-full rounded-lg border border-border"
    />
  );
}
