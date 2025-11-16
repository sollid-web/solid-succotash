import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';
import PlansPage from '@/app/plans/page';
import ContactPage from '@/app/contact/page';
import LegalDisclaimerPage from '@/app/legal-disclaimer/page';
import PrivacyPolicyPage from '@/app/privacy/page';
import TermsOfServicePage from '@/app/terms-of-service/page';
import RiskDisclosurePage from '@/app/risk-disclosure/page';

const heroImages = [
  { name: 'About', component: AboutPage, src: '/images/home-hero.jpg' },
  { name: 'Plans', component: PlansPage, src: '/images/plans-hero.jpg' },
  { name: 'Contact', component: ContactPage, src: '/images/contact-hero.jpg' },
  { name: 'Legal Disclaimer', component: LegalDisclaimerPage, src: '/images/legal/wolvcapital-legal-disclaimer.jpg' },
  { name: 'Privacy', component: PrivacyPolicyPage, src: '/images/legal/wolvcapital-privacy-policy.jpg' },
  { name: 'Terms of Service', component: TermsOfServicePage, src: '/images/legal/legal-terms-hero.jpg' },
  { name: 'Risk Disclosure', component: RiskDisclosurePage, src: '/images/legal/wolvcapital-risk-disclosure.jpg' },
];

describe('Hero image presence on all main pages', () => {
  heroImages.forEach(({ name, component, src }) => {
    it(`${name} page displays correct hero image`, () => {
      render(component());
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', expect.stringContaining(src));
    });
  });
});
