import { GoogleTagManager as GTM } from '@next/third-parties/google';

export function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!gtmId) return null;

  return <GTM gtmId={gtmId} />;
}
