import { WalletProviderClient } from '@/_client/WalletProviderClient';

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
    <WalletProviderClient>
      {children}
    </WalletProviderClient>
  );
}
