"use client";

interface PublicLayoutProps {
  children: React.ReactNode;
  backgroundImageUrl?: string; // legacy support
  backgroundClassName?: string; // preferred utility-based backgrounds
}

export default function PublicLayout({ children, backgroundImageUrl, backgroundClassName }: PublicLayoutProps) {
  return (
    <div
      className={`min-h-screen pt-20 ${backgroundClassName ? `${backgroundClassName} bg-cover bg-center bg-no-repeat relative` : ''}`}
      style={backgroundImageUrl && !backgroundClassName ? {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      } : undefined}
    >
      {backgroundClassName && (
        <div className="pointer-events-none absolute inset-0 bg-black/10"></div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}