import { WalletProvider } from '@/_client/WalletProvider';

export const metadata = {
  title: 'WOLV Admin - Token Manager',
  description: 'Manage WOLV profit tokens',
};

export default function WolvAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  );
}
