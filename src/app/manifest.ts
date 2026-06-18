import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RePro — Réputation Professionnelle',
    short_name: 'RePro',
    description:
      'Honest, verified reviews of Luxembourg service businesses. Réputation professionnelle.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4654f0',
    icons: [
      {src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
      {src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
