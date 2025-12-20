"use client";
import React from "react";

export default function OrganizationJsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WolvCapital",
    "url": "https://wolvcapital.com",
    "logo": "https://wolvcapital.com/wolv-logo.svg",
    "sameAs": [
      "https://www.facebook.com/yourpage",
      "https://twitter.com/yourhandle",
      "https://www.linkedin.com/company/yourcompany"
    ],
    "contactPoint": [{
      "@type": "ContactPoint",
      "email": "support@wolvcapital.com",
      "contactType": "customer support",
      "areaServed": "Worldwide",
      "availableLanguage": ["English"]
    }]
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
