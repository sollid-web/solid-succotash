"use client";
import React from "react";

export default function OrganizationJsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.wolvcapital.com/#organization",
        "name": "WolvCapital",
        "url": "https://www.wolvcapital.com",
        "logo": "https://www.wolvcapital.com/wolv-logo.svg",
        "description": "Digital-asset information and platform services on BNB Smart Chain with public contract references and WOLV token data.",
        "sameAs": [
          "https://x.com/wolvcapitals",
          "https://t.me/wolvcapital"
        ],
        "contactPoint": [{
          "@type": "ContactPoint",
          "email": "support@mail.wolvcapital.com",
          "contactType": "customer support",
          "availableLanguage": ["English", "German", "Spanish", "French", "Italian", "Portuguese", "Russian", "Norwegian"]
        }]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.wolvcapital.com/#website",
        "name": "WolvCapital",
        "url": "https://www.wolvcapital.com",
        "publisher": { "@id": "https://www.wolvcapital.com/#organization" }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      key="organization-jsonld"
    />
  );
}
