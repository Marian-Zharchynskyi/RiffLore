/**
 * Resolves static or binary asset URLs (3D .glb models, .gp/.xml tabs, audio samples).
 * Uses local /public path in MVP and seamlessly switches to Cloudflare R2 / Blob CDN
 * when NEXT_PUBLIC_ASSET_CDN_URL is configured.
 */
export function getAssetUrl(relativePath: string): string {
  const normalized = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  const cdnBase = process.env.NEXT_PUBLIC_ASSET_CDN_URL?.replace(/\/$/, '');
  return cdnBase ? `${cdnBase}${normalized}` : normalized;
}
