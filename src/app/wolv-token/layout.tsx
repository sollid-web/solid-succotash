import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WOLV Token — WolvCapital Profit Token on BNB Smart Chain',
  description: 'WOLV is the native profit token of WolvCapital. Investors earn WOLV as verifiable on-chain proof of investment returns. Deployed and verified on BNB Smart Chain.',
  keywords: 'WOLV token, WolvCapital token, BNB chain token, investment profit token, blockchain rewards, WOLV BEP20',
  openGraph: {
    title: 'WOLV Token — WolvCapital Profit Token',
    description: 'Earn WOLV tokens as verifiable proof of your investment returns on WolvCapital.',
    url: 'https://wolvcapital.com/wolv-token',
    siteName: 'WolvCapital',
    type: 'website',
  },
};

export default function WolvTokenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
