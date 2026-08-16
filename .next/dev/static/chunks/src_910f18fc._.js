(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/LocaleProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocaleProvider",
    ()=>LocaleProvider,
    "useLocale",
    ()=>useLocale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// 1. Initialize Context with a default value
const LocaleContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    locale: 'en',
    setLocale: async ()=>{}
});
function LocaleProvider({ locale: initialLocale, children }) {
    _s();
    // 2. All hooks MUST be inside the function component
    const [locale, setLocaleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialLocale);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocaleProvider.useEffect": ()=>{
            // Sync state if a cookie already exists on the HP workstation/client browser
            const savedLocale = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('django_language');
            if (savedLocale && savedLocale !== locale) {
                setLocaleState(savedLocale);
            }
        }
    }["LocaleProvider.useEffect"], [
        locale
    ]);
    const setLocale = async (newLocale)=>{
        setLocaleState(newLocale);
        // Save to cookie (Django-compatible name)
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set('django_language', newLocale, {
            expires: 365,
            path: '/'
        });
        try {
            // Sync with your Django DRF endpoint
            const response = await fetch('/api/update-language/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    language: newLocale
                })
            });
            if (!response.ok) throw new Error('Backend sync failed');
        } catch (error) {
            console.error("Failed to sync language preference:", error);
        }
        // Refresh to trigger Django's WolvLanguageMiddleware
        window.location.reload();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LocaleContext.Provider, {
        value: {
            locale,
            setLocale
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/LocaleProvider.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(LocaleProvider, "VqMfx25E6JzbdDwYlgpF3maQtIg=");
_c = LocaleProvider;
function useLocale() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}
_s1(useLocale, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "LocaleProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/i18n/en.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"nav.home\":\"Home\",\"nav.plans\":\"Plans\",\"nav.about\":\"About\",\"nav.blog\":\"Blog\",\"nav.contact\":\"Contact\",\"nav.login\":\"Login\",\"nav.signup\":\"Sign Up\",\"nav.virtualCard\":\"Virtual Card\",\"nav.wolvToken\":\"WOLV Token\",\"nav.compliance\":\"Compliance\",\"hero.eyebrow\":\"Smart Chain Staking with Institutional Protection\",\"hero.title\":\"Stake BNB or BUSD. Earn WOLV Rewards. Audited on-chain.\",\"hero.subtitle\":\"WolvCapital combines KYC verification, institutional custody, and audited smart contracts. Your principal and rewards are held on BNB Chain — fully transparent and verifiable by anyone.\",\"hero.button.viewPlans\":\"View Plans\",\"hero.button.openAccount\":\"Open Account\",\"hero.badge.encryption\":\"256-bit Encryption\",\"hero.badge.custody\":\"Institutional Custody\",\"hero.badge.fincen\":\"FinCEN Registered MSB\",\"hero.welcome\":\"Welcome to WolvCapital\",\"security.title\":\"Security & Compliance\",\"security.eyebrow\":\"Security\",\"security.description\":\"Enterprise-grade controls, active threat monitoring, and compliance-first custody.\",\"security.standards.heading\":\"Security Standards\",\"security.feature.kyc.title\":\"KYC Verification\",\"security.feature.kyc.description\":\"All stakers must pass identity verification before account activation.\",\"security.feature.aml.title\":\"AML Screening\",\"security.feature.aml.description\":\"Continuous transaction screening against global watchlists.\",\"security.feature.ssl.title\":\"SSL Encryption\",\"security.feature.ssl.description\":\"Bank-grade encryption for every user session.\",\"security.feature.2fa.title\":\"Two-Factor Authentication\",\"security.feature.2fa.description\":\"Optional 2FA to protect account access and withdrawals.\",\"security.feature.monitoring.title\":\"Real-Time Monitoring\",\"security.feature.monitoring.description\":\"24/7 risk monitoring with automated alerts.\",\"security.feature.pci.title\":\"PCI-DSS Compliance\",\"security.feature.pci.description\":\"Our payments workflows are designed for PCI-DSS standards.\",\"security.standard.2fa\":\"Optional 2FA\",\"security.standard.ssl\":\"256-bit SSL\",\"security.standard.monitoring\":\"Real-time fraud monitoring\",\"security.standard.pci\":\"PCI-DSS compliant\",\"security.cta\":\"Review our security practices\",\"contact.title\":\"Get In Touch\",\"contact.locationHeading\":\"Our Registered Office\",\"contact.location\":\"United States\",\"contact.contactInformationHeading\":\"Contact Information\",\"contact.emailSupportHeading\":\"Email Support\",\"contact.email\":\"support@wolvcapital.com\",\"contact.emailSupportResponse\":\"We typically respond within 24 hours.\",\"contact.businessHoursHeading\":\"Business Hours\",\"contact.businessHoursValue\":\"24/7 Support Available\",\"contact.businessHoursNote\":\"Round-the-clock assistance for all your needs.\",\"contact.liveChatHeading\":\"Live Chat\",\"contact.liveChatValue\":\"Available for account holders\",\"contact.liveChatNote\":\"Login to access live chat support.\",\"contact.faqHeading\":\"Frequently Asked Questions\",\"contact.faqIntro\":\"Before contacting us, you might find answers in our FAQ section.\",\"contact.faqLink\":\"View FAQ\",\"contact.formHeading\":\"Send Us a Message\",\"contact.form.name\":\"Full Name\",\"contact.form.email\":\"Email Address\",\"contact.form.subject\":\"Subject\",\"contact.form.message\":\"Message\",\"contact.form.submit\":\"Send Message\",\"contact.form.requiredNote\":\"* All fields are required. We'll respond within 24 hours.\",\"contact.mapAlt\":\"WolvCapital Registered Office — 516 High St, Palo Alto, CA 94301, United States (overlay)\",\"compliance.eyebrow\":\"Compliance Overview\",\"compliance.title\":\"What this means for you\",\"compliance.description\":\"WolvCapital combines institutional compliance, blockchain transparency, and licensed custody to give stakers a clear, professional foundation for smart chain staking and rewards.\",\"compliance.card.subtitle\":\"Secure, audited, and blockchain-verified\",\"compliance.card.title\":\"A compliance-first framework built for staker confidence\",\"compliance.card.body\":\"Every step of our onboarding and staking process is designed to meet institutional standards while keeping you informed and protected.\",\"compliance.card.readMore\":\"Read More\",\"compliance.benefit.1\":\"Identity verified before any stakes accepted\",\"compliance.benefit.2\":\"Staked assets held by a licensed institutional custodian — not WolvCapital directly\",\"compliance.benefit.3\":\"All fees disclosed in writing before you stake\",\"compliance.benefit.4\":\"No guaranteed or promised staking rewards\",\"compliance.benefit.5\":\"Audited monthly staking performance reports provided\",\"compliance.benefit.6\":\"Unstaking terms disclosed upfront — no hidden locks\",\"compliance.benefit.7\":\"All blockchain transactions reviewed by our compliance team\",\"cta.title\":\"Start Your Application\",\"cta.subtitle\":\"Account opening is subject to KYC verification, eligibility review, and applicable regulatory requirements.\",\"cta.field.fullName\":\"Full Legal Name\",\"cta.field.fullName.placeholder\":\"Jane Doe\",\"cta.field.fullName.hint\":\"Used for identity verification and account records.\",\"cta.field.email\":\"Email Address\",\"cta.field.email.placeholder\":\"jane.doe@example.com\",\"cta.field.email.hint\":\"We will send your account confirmation to this address.\",\"cta.field.country\":\"Country of Residence\",\"cta.field.country.placeholder\":\"Select your country\",\"cta.field.country.hint\":\"Used for regulatory eligibility screening.\",\"cta.field.amount\":\"Staking Amount (USD)\",\"cta.field.amount.placeholder\":\"$5,000\",\"cta.field.amount.hint\":\"Your principal amount for the staking pool.\",\"cta.button\":\"Open Account\",\"cta.disclaimer\":\"Staking rewards are not guaranteed. You may lose some or all of your principal.\",\"faq.eyebrow\":\"Support\",\"faq.title\":\"Frequently Asked Questions\",\"faq.subtitle\":\"Get answers to common questions about staking with WolvCapital.\",\"faq.viewAll\":\"View All FAQs →\",\"faq.q1\":\"How does WolvCapital calculate staking rewards?\",\"faq.a1\":\"WolvCapital locks your principal in audited smart contracts deployed on BNB Smart Chain. Rewards are calculated daily based on your staking period and APY, then distributed in WOLV tokens. Reward calculations are transparent and verifiable on BSCScan at any time. Staking rewards are not guaranteed and depend on market conditions.\",\"faq.q2\":\"Is WolvCapital regulated?\",\"faq.a2\":\"WolvCapital operates under KYC, AML, and PCI-DSS compliance standards and holds FinCEN Money Services Business registration. Please visit sec.gov or contact legal@wolvcapital.com for detailed regulatory documentation.\",\"faq.q3\":\"Are my staking rewards guaranteed?\",\"faq.a3\":\"No. WolvCapital does not guarantee any staking reward. The blockchain and cryptocurrency markets are highly volatile. Your principal value can fall significantly and you may lose some or all of your staked capital. Past performance does not guarantee future results. APY projections are estimates only.\",\"faq.q4\":\"How and when can I claim or unstake my rewards?\",\"faq.a4\":\"Staking rewards are credited to your wallet after admin approval. Unstaking (withdrawal) terms vary by plan: Pioneer (90-day lock), Vanguard (150-day lock), Horizon (180-day lock), and Summit (365-day lock). After your lock-up period ends, you may request unstaking and your principal returns within 5 business days via blockchain transaction. Early unstaking incurs a penalty fee.\",\"faq.q5\":\"What are term lengths and exit fees?\",\"faq.a5\":\"Each plan has a minimum holding period (term length). Pioneer is 90 days, Vanguard 150 days, Horizon 180 days, and Summit 365 days. Your funds are locked during this period and you cannot withdraw without penalty. Early withdrawals incur an exit fee (Pioneer 2%, Vanguard 2.5%, Horizon 3%, Summit 3.5%), which is deducted from your capital. At the end of your term, your account automatically continues on a rolling basis (monthly for Pioneer, Vanguard, and Horizon, quarterly for Summit) unless you withdraw or switch plans. You will receive notification 7-14 days before your term expires so you can decide whether to continue, withdraw, or restart.\",\"faq.q6\":\"Who holds my assets?\",\"faq.a6\":\"Client assets are held by Coinbase Custody, a licensed institutional digital asset custodian. Your funds are segregated from WolvCapital company assets and protected in the event of any operational issue on our side. Custody terms and insurance coverage are disclosed in your investment agreement. Custodian details and proof of custody are available on your dashboard.\",\"faq.q7\":\"What are the fees?\",\"faq.a7\":\"Management fees range from 1-2% of AUM annually (Pioneer 1%, Vanguard 1.25%, Horizon 1.5%, Summit 2%), charged monthly. Performance fees of 20% apply only on gains exceeding the Bloomberg Crypto Index on applicable plans. There are no hidden fees. The full fee schedule and performance fee benchmark are provided in writing before account activation.\",\"faq.q8\":\"Which countries does WolvCapital serve?\",\"faq.a8\":\"WolvCapital supports investors from 120+ countries, subject to local legal requirements. Residents of OFAC-sanctioned jurisdictions are not eligible. Virtual card services are available in the U.S., UK, EU, and select Asian markets. Physical cards are available in the U.S. only. Check our eligibility page for your specific country before signing up.\",\"faq.q9\":\"How are taxes handled?\",\"faq.a9\":\"WolvCapital generates quarterly tax reports (Forms K-1 for U.S. investors) detailing realized gains, losses, and staking income. Reports are downloadable from your dashboard. You are responsible for filing and paying taxes on your gains under the requirements of your local tax laws. Consult a tax professional regarding your specific tax obligations. Digital asset tax treatment varies by country.\",\"faq.q10\":\"What happens to my funds if WolvCapital shuts down?\",\"faq.a10\":\"Your assets are held by Coinbase Custody and are separate from WolvCapital company assets. In the event of any WolvCapital operational issue, your funds remain protected with the custodian. Withdrawal rights are preserved and enforced through your custody agreement. Our insurance coverage through Coinbase Custody covers custodial holdings. Full details are in your investment agreement.\",\"faq.q11\":\"How is the performance benchmark calculated?\",\"faq.a11\":\"Performance fees are calculated against the Bloomberg Crypto Index, a market-cap-weighted basket of major cryptocurrencies. For custom plans (Summit), the benchmark is negotiated individually. Calculations are audited quarterly by Deloitte LLP. Performance reports showing benchmark comparison, fees charged, and net returns are provided monthly and available in your dashboard.\",\"footer.brand.description\":\"Regulated smart chain staking. Institutional custody. Transparent on-chain rewards. Principal at risk.\",\"footer.platform\":\"Platform\",\"footer.platform.createAccount\":\"Create Account\",\"footer.platform.login\":\"Login\",\"footer.platform.plans\":\"Staking Plans\",\"footer.platform.virtualCard\":\"Virtual Card\",\"footer.platform.faq\":\"FAQ\",\"footer.legal\":\"Legal & Compliance\",\"footer.legal.terms\":\"Terms of Service\",\"footer.legal.privacy\":\"Privacy Policy\",\"footer.legal.risk\":\"Risk Disclosure\",\"footer.legal.disclaimer\":\"Legal Disclaimer\",\"footer.legal.compliance\":\"Compliance\",\"footer.support\":\"Support\",\"footer.support.about\":\"About\",\"footer.support.contact\":\"Contact\",\"footer.support.blog\":\"Blog\",\"footer.support.security\":\"Security\",\"footer.support.status\":\"Status\",\"footer.copyright\":\"© {year} WolvCapital, Inc. All rights reserved.\",\"footer.badge.fincen\":\"🔒 FinCEN MSB Registered\",\"footer.badge.ssl\":\"🔐 256-bit SSL Encryption\",\"footer.badge.pci\":\"✓ PCI-DSS Compliant\",\"howitworks.eyebrow\":\"Process\",\"howitworks.title\":\"How WolvCapital Works\",\"howitworks.description\":\"Our streamlined process ensures security, transparency, and compliance at every step.\",\"howitworks.step1.title\":\"Create Account\",\"howitworks.step1.description\":\"Sign up and complete full KYC identity verification in line with U.S. regulatory requirements.\",\"howitworks.step2.title\":\"Choose Portfolio\",\"howitworks.step2.description\":\"Select a managed portfolio tier matching your risk tolerance and investment horizon. Review fees first.\",\"howitworks.step3.title\":\"Deposit Funds\",\"howitworks.step3.description\":\"Funds are held with a licensed institutional custodian. All deposits are subject to AML compliance review.\",\"howitworks.step4.title\":\"Track Performance\",\"howitworks.step4.description\":\"Monitor your portfolio via a real-time dashboard. Audited monthly statements are provided to all investors.\",\"howitworks.cta\":\"Learn More About Our Process\",\"plans.eyebrow\":\"Investment Tiers\",\"plans.title\":\"Choose your portfolio plan\",\"plans.subtitle\":\"Each tier reflects a distinct risk strategy and fee structure — not a return promise. All fees are disclosed in full before account activation.\",\"plans.minimum\":\"Minimum:\",\"plans.button.review\":\"Review\",\"plans.button.getStarted\":\"Get Started\",\"plans.disclaimer\":\"Digital assets are speculative. You may lose some or all of your invested capital.\",\"plans.feeDisclosure\":\"Management fees are charged as a percentage of AUM, deducted monthly. Performance fees apply only on gains exceeding the agreed benchmark. No guaranteed returns are offered. All fees are disclosed in writing before account activation. Digital assets are speculative — you may lose some or all of your capital.\",\"plans.feeDisclosure.label\":\"Fee disclosure:\",\"regulated.title\":\"Regulated & Compliant\",\"regulated.subtitle\":\"WolvCapital operates under stringent compliance standards to protect investor capital and ensure transparency.\",\"regulated.kyc.title\":\"KYC Verified\",\"regulated.kyc.description\":\"All investors undergo comprehensive identity verification before account activation, ensuring regulatory compliance and investor protection.\",\"regulated.aml.title\":\"AML Compliant\",\"regulated.aml.description\":\"Advanced Anti-Money Laundering systems monitor all transactions in real-time, identifying and preventing suspicious activity while maintaining customer privacy.\",\"regulated.encryption.title\":\"Data Encryption\",\"regulated.encryption.description\":\"Military-grade SSL/TLS encryption protects all communications and financial data, secured with multi-factor authentication throughout.\",\"regulated.standards.title\":\"Security Standards\",\"regulated.standard.2fa\":\"Two-Factor Authentication\",\"regulated.standard.ssl\":\"SSL Encryption\",\"regulated.standard.monitoring\":\"Fraud Monitoring\",\"regulated.standard.pci\":\"Level 1 Certified\",\"riskbar.title\":\"Important Disclosure\",\"riskbar.body\":\"All staking positions carry risk, including potential loss of principal. Digital assets are highly volatile. Past performance does not guarantee future staking rewards. WolvCapital is not a bank and does not offer FDIC or SIPC insurance. Only stake capital you can afford to lose entirely. Please review our\",\"riskbar.riskDisclosure\":\"Risk Disclosure\",\"riskbar.and\":\"and\",\"riskbar.terms\":\"Terms of Service\",\"riskbar.before\":\"before investing.\",\"riskbar.cta\":\"Read Full Disclosure\",\"stats.eyebrow\":\"Platform Metrics — Pending Third-Party Audit\",\"stats.body\":\"Audited platform metrics will be published upon completion of our independent third-party audit. Expected Q3 2026.\",\"stats.supporting\":\"Our commitment to transparency includes independent verification of all platform metrics. Check back for detailed statistics and audit reports.\",\"stats.link\":\"View our compliance framework\",\"virtualcard.eyebrow\":\"Virtual Card\",\"virtualcard.title\":\"Pay bills directly from your dashboard\",\"virtualcard.subtitle\":\"Once your account is KYC-verified and activated, you can request a WolvCapital virtual Visa card linked directly to your portfolio balance. Use it to pay subscriptions, shop online, or connect to Apple Pay and Google Pay — all managed from your dashboard.\",\"virtualcard.disclaimer\":\"The WolvCapital virtual card is currently available to verified residents of supported countries only. A full list of supported countries is available at activation. Residents of unsupported regions may register their interest via the waitlist.\",\"virtualcard.cta\":\"Activate Your Card →\",\"virtualcard.feature.1\":\"Instant virtual card issued on KYC approval\",\"virtualcard.feature.2\":\"Pay Netflix, Spotify, Apple, Amazon and 100+ merchants\",\"virtualcard.feature.3\":\"Connect to Apple Pay and Google Pay wallets\",\"virtualcard.feature.4\":\"Set custom spending limits per merchant category\",\"virtualcard.feature.5\":\"Real-time transaction notifications and dashboard tracking\",\"virtualcard.feature.6\":\"Freeze or unfreeze instantly from the app\",\"virtualcard.feature.7\":\"Physical card available for eligible verified accounts\"}"));}),
"[project]/src/i18n/de.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"nav.home\":\"Startseite\",\"nav.plans\":\"Pläne\",\"nav.about\":\"Über uns\",\"nav.blog\":\"Blog\",\"nav.contact\":\"Kontakt\",\"nav.login\":\"Anmelden\",\"nav.signup\":\"Registrieren\",\"nav.virtualCard\":\"Virtuelle Karte\",\"nav.wolvToken\":\"WOLV-Token\",\"nav.compliance\":\"Compliance\",\"hero.eyebrow\":\"Institutionelles Digital-Asset-Management\",\"hero.title\":\"Verwaltete Kryptowährungsportfolios mit transparenten Gebühren und professioneller Verwahrung.\",\"hero.subtitle\":\"WolvCapital kombiniert KYC-verifiziertes Onboarding, institutionelle Verwahrung und geprüfte Digital-Asset-Strategien. Kapital ist gefährdet und Renditen sind nicht garantiert.\",\"hero.button.viewPlans\":\"Pläne ansehen\",\"hero.button.openAccount\":\"Konto eröffnen\",\"hero.badge.encryption\":\"256-Bit-Verschlüsselung\",\"hero.badge.custody\":\"Institutionelle Verwahrung\",\"hero.badge.fincen\":\"FinCEN registriertes MSB\",\"hero.welcome\":\"Willkommen bei WolvCapital\",\"security.title\":\"Sicherheit & Compliance\",\"security.eyebrow\":\"Sicherheit\",\"security.description\":\"Unternehmensweite Kontrollen, aktive Bedrohungsüberwachung und Compliance-orientierte Verwahrung.\",\"security.standards.heading\":\"Sicherheitsstandards\",\"security.feature.kyc.title\":\"KYC-Verifizierung\",\"security.feature.kyc.description\":\"Alle Investoren müssen vor der Einzahlung Identitätsprüfungen bestehen.\",\"security.feature.aml.title\":\"AML-Screening\",\"security.feature.aml.description\":\"Kontinuierliche Transaktionsprüfung gegen globale Beobachtungslisten.\",\"security.feature.ssl.title\":\"SSL-Verschlüsselung\",\"security.feature.ssl.description\":\"Bankverschlüsselung für jede Benutzersitzung.\",\"security.feature.2fa.title\":\"Zwei-Faktor-Authentifizierung\",\"security.feature.2fa.description\":\"Optionale 2FA zum Schutz des Kontozugangs und von Auszahlungen.\",\"security.feature.monitoring.title\":\"Echtzeit-Überwachung\",\"security.feature.monitoring.description\":\"24/7-Risikoüberwachung mit automatischen Benachrichtigungen.\",\"security.feature.pci.title\":\"PCI-DSS-Konformität\",\"security.feature.pci.description\":\"Unsere Zahlungsworkflows sind nach PCI-DSS-Standards ausgelegt.\",\"security.standard.2fa\":\"Optionale 2FA\",\"security.standard.ssl\":\"256-Bit-SSL\",\"security.standard.monitoring\":\"Echtzeit-Betrugsüberwachung\",\"security.standard.pci\":\"PCI-DSS-konform\",\"security.cta\":\"Unsere Sicherheitspraktiken prüfen\",\"contact.title\":\"Kontakt aufnehmen\",\"contact.locationHeading\":\"Unser eingetragenes Büro\",\"contact.location\":\"Vereinigte Staaten\",\"contact.contactInformationHeading\":\"Kontaktinformationen\",\"contact.emailSupportHeading\":\"E-Mail-Support\",\"contact.email\":\"support@wolvcapital.com\",\"contact.emailSupportResponse\":\"Wir antworten in der Regel innerhalb von 24 Stunden.\",\"contact.businessHoursHeading\":\"Geschäftszeiten\",\"contact.businessHoursValue\":\"24/7-Support verfügbar\",\"contact.businessHoursNote\":\"Rund-um-die-Uhr-Unterstützung für all Ihre Bedürfnisse.\",\"contact.liveChatHeading\":\"Live-Chat\",\"contact.liveChatValue\":\"Verfügbar für Kontoinhaber\",\"contact.liveChatNote\":\"Melden Sie sich an, um den Live-Chat-Support zu nutzen.\",\"contact.faqHeading\":\"Häufig gestellte Fragen\",\"contact.faqIntro\":\"Bevor Sie uns kontaktieren, finden Sie möglicherweise Antworten in unserem FAQ-Bereich.\",\"contact.faqLink\":\"FAQ ansehen\",\"contact.formHeading\":\"Senden Sie uns eine Nachricht\",\"contact.form.name\":\"Vollständiger Name\",\"contact.form.email\":\"E-Mail-Adresse\",\"contact.form.subject\":\"Betreff\",\"contact.form.message\":\"Nachricht\",\"contact.form.submit\":\"Nachricht senden\",\"contact.form.requiredNote\":\"* Alle Felder sind erforderlich. Wir antworten innerhalb von 24 Stunden.\",\"contact.mapAlt\":\"WolvCapital Eingetragenes Büro — 516 High St, Palo Alto, CA 94301, USA (Overlay)\",\"compliance.eyebrow\":\"Compliance-Übersicht\",\"compliance.title\":\"Was das für Sie bedeutet\",\"compliance.description\":\"WolvCapital kombiniert institutionelle Compliance, transparente Offenlegungen und lizenzierte Verwahrung, um Investoren eine klare, professionelle Grundlage für Digital-Asset-Investitionen zu bieten.\",\"compliance.card.subtitle\":\"Sicher, geprüft und transparent\",\"compliance.card.title\":\"Ein Compliance-orientierter Rahmen für das Vertrauen der Investoren\",\"compliance.card.body\":\"Jeder Schritt unseres Onboarding- und Investmentprozesses ist darauf ausgelegt, institutionelle Standards zu erfüllen und Sie dabei informiert und geschützt zu halten.\",\"compliance.card.readMore\":\"Mehr lesen\",\"compliance.benefit.1\":\"Identität vor der Annahme von Geldern verifiziert\",\"compliance.benefit.2\":\"Gelder werden von einem lizenzierten institutionellen Verwahrer gehalten — nicht direkt von WolvCapital\",\"compliance.benefit.3\":\"Alle Gebühren vor Ihrer Investition schriftlich offengelegt\",\"compliance.benefit.4\":\"Keine garantierten oder versprochenen Anlagerenditen\",\"compliance.benefit.5\":\"Monatliche geprüfte Performance-Berichte bereitgestellt\",\"compliance.benefit.6\":\"Auszahlungsbedingungen vorab offengelegt — keine versteckten Sperren\",\"compliance.benefit.7\":\"Alle Transaktionen von unserem Compliance-Team geprüft\",\"cta.title\":\"Ihre Bewerbung starten\",\"cta.subtitle\":\"Die Kontoeröffnung unterliegt der KYC-Verifizierung, der Eignungsprüfung und den geltenden gesetzlichen Anforderungen.\",\"cta.field.fullName\":\"Vollständiger rechtlicher Name\",\"cta.field.fullName.placeholder\":\"Max Mustermann\",\"cta.field.fullName.hint\":\"Wird zur Identitätsverifizierung und für Kontoaufzeichnungen verwendet.\",\"cta.field.email\":\"E-Mail-Adresse\",\"cta.field.email.placeholder\":\"max.mustermann@beispiel.com\",\"cta.field.email.hint\":\"Wir senden Ihre Kontobestätigung an diese Adresse.\",\"cta.field.country\":\"Wohnsitzland\",\"cta.field.country.placeholder\":\"Wählen Sie Ihr Land\",\"cta.field.country.hint\":\"Wird zur regulatorischen Eignungsprüfung verwendet.\",\"cta.field.amount\":\"Anlagebetrag (USD)\",\"cta.field.amount.placeholder\":\"$5.000\",\"cta.field.amount.hint\":\"Dies ist ein vorläufiger Betrag für Ihre Bewerbung.\",\"cta.button\":\"Konto eröffnen\",\"cta.disclaimer\":\"Digitale Assets sind spekulativ. Sie können einen Teil oder das gesamte investierte Kapital verlieren.\",\"faq.eyebrow\":\"Support\",\"faq.title\":\"Häufig gestellte Fragen\",\"faq.subtitle\":\"Erhalten Sie Antworten auf häufige Fragen zum Investieren mit WolvCapital.\",\"faq.viewAll\":\"Alle FAQs ansehen →\",\"faq.q1\":\"Wie generiert WolvCapital Renditen für Investoren?\",\"faq.a1\":\"WolvCapital verwaltet diversifizierte Digital-Asset-Portfolios durch Preissteigerungen, Staking-Erträge und DeFi-Liquiditätsstrategien. Renditen sind vollständig marktabhängig und nicht garantiert. Wir erheben unabhängig von der Performance eine Verwaltungsgebühr und eine Performancegebühr nur auf Gewinne über der vereinbarten Benchmark (für öffentliche Pläne am Bloomberg Crypto Index gemessen). Renditen variieren je nach Marktbedingungen und Strategie.\",\"faq.q2\":\"Ist WolvCapital reguliert?\",\"faq.a2\":\"WolvCapital operiert unter KYC-, AML- und PCI-DSS-Compliance-Standards und besitzt eine FinCEN Money Services Business-Registrierung. Besuchen Sie sec.gov oder kontaktieren Sie legal@wolvcapital.com für detaillierte regulatorische Dokumentation.\",\"faq.q3\":\"Sind meine Renditen garantiert?\",\"faq.a3\":\"Nein. WolvCapital garantiert keine Anlagerenditen. Digitale Assets sind hochvolatil und spekulativ. Der Wert Ihres Portfolios kann erheblich sinken und Sie können einen Teil oder das gesamte Kapital verlieren. Vergangene Wertentwicklungen sind kein Indikator für zukünftige Ergebnisse. Alle Projektionen auf dieser Website dienen nur zu Bildungszwecken und stellen keine Zusagen dar.\",\"faq.q4\":\"Wie und wann kann ich auszahlen?\",\"faq.a4\":\"Auszahlungsbedingungen variieren je nach Plan: Pioneer (90 Tage), Vanguard (150 Tage), Horizon (180 Tage) und Summit (365 Tage). Gelder sind während Ihrer Vertragslaufzeit gesperrt. Nach Ablauf der Laufzeit können Sie eine Auszahlung beantragen, die innerhalb von 5 Werktagen erfolgt. Rücknahmen werden zum Nettoportfoliowert zum Zeitpunkt der Rücknahme verarbeitet. Vorzeitige Auszahlungsanträge sind außer unter außergewöhnlichen Umständen nicht zulässig.\",\"faq.q5\":\"Was sind Laufzeiten und Ausstiegsgebühren?\",\"faq.a5\":\"Jeder Plan hat eine Mindesthaltedauer. Pioneer 90 Tage, Vanguard 150 Tage, Horizon 180 Tage, Summit 365 Tage. Ihre Gelder sind während dieses Zeitraums gesperrt. Vorzeitige Auszahlungen werden mit einer Ausstiegsgebühr belastet (Pioneer 2 %, Vanguard 2,5 %, Horizon 3 %, Summit 3,5 %), die von Ihrem Kapital abgezogen wird. Nach Ablauf der Laufzeit wird Ihr Konto automatisch auf rollierender Basis fortgesetzt, sofern Sie nicht auszahlen oder den Plan wechseln. Sie erhalten 7–14 Tage vor Ablauf Ihrer Laufzeit eine Benachrichtigung.\",\"faq.q6\":\"Wer hält meine Assets?\",\"faq.a6\":\"Kundenvermögen wird von Coinbase Custody gehalten, einem lizenzierten institutionellen Digital-Asset-Verwahrer. Ihre Gelder sind von WolvCapital-Unternehmensassets getrennt und bei etwaigen betrieblichen Problemen auf unserer Seite geschützt. Verwahrungsbedingungen und Versicherungsschutz werden in Ihrer Investitionsvereinbarung offengelegt.\",\"faq.q7\":\"Wie hoch sind die Gebühren?\",\"faq.a7\":\"Verwaltungsgebühren reichen von 1–2 % des AUM jährlich (Pioneer 1 %, Vanguard 1,25 %, Horizon 1,5 %, Summit 2 %), monatlich abgerechnet. Performancegebühren von 20 % gelten nur für Gewinne über dem Bloomberg Crypto Index bei anwendbaren Plänen. Es gibt keine versteckten Gebühren. Der vollständige Gebührenplan wird vor der Kontoaktivierung schriftlich bereitgestellt.\",\"faq.q8\":\"Welche Länder bedient WolvCapital?\",\"faq.a8\":\"WolvCapital unterstützt Investoren aus über 120 Ländern, vorbehaltlich lokaler gesetzlicher Anforderungen. Einwohner von OFAC-sanktionierten Gebieten sind nicht berechtigt. Virtuelle Kartendienste sind in den USA, Großbritannien, der EU und ausgewählten asiatischen Märkten verfügbar. Physische Karten sind nur in den USA erhältlich.\",\"faq.q9\":\"Wie werden Steuern gehandhabt?\",\"faq.a9\":\"WolvCapital erstellt vierteljährliche Steuerberichte (Formulare K-1 für US-Investoren) mit Details zu realisierten Gewinnen, Verlusten und Staking-Einkommen. Berichte sind von Ihrem Dashboard herunterladbar. Sie sind für die Einreichung und Zahlung von Steuern auf Ihre Gewinne gemäß den Anforderungen Ihrer lokalen Steuergesetze verantwortlich.\",\"faq.q10\":\"Was passiert mit meinen Geldern, wenn WolvCapital schließt?\",\"faq.a10\":\"Ihre Assets werden von Coinbase Custody gehalten und sind von WolvCapital-Unternehmensassets getrennt. Bei einem WolvCapital-Betriebsproblem bleiben Ihre Gelder beim Verwahrer geschützt. Auszahlungsrechte bleiben erhalten und werden durch Ihre Verwahrungsvereinbarung durchgesetzt.\",\"faq.q11\":\"Wie wird die Performance-Benchmark berechnet?\",\"faq.a11\":\"Performancegebühren werden gegen den Bloomberg Crypto Index berechnet, einen nach Marktkapitalisierung gewichteten Korb wichtiger Kryptowährungen. Für individuelle Pläne (Summit) wird die Benchmark individuell verhandelt. Berechnungen werden vierteljährlich von Deloitte LLP geprüft.\",\"footer.brand.description\":\"Reguliertes Digital-Asset-Portfoliomanagement. Transparente Gebühren. Institutionelle Verwahrung. Kapital ist gefährdet.\",\"footer.platform\":\"Plattform\",\"footer.platform.createAccount\":\"Konto erstellen\",\"footer.platform.login\":\"Anmelden\",\"footer.platform.plans\":\"Investitionspläne\",\"footer.platform.virtualCard\":\"Virtuelle Karte\",\"footer.platform.faq\":\"FAQ\",\"footer.legal\":\"Recht & Compliance\",\"footer.legal.terms\":\"Nutzungsbedingungen\",\"footer.legal.privacy\":\"Datenschutzrichtlinie\",\"footer.legal.risk\":\"Risikooffenlegung\",\"footer.legal.disclaimer\":\"Rechtlicher Hinweis\",\"footer.legal.compliance\":\"Compliance\",\"footer.support\":\"Support\",\"footer.support.about\":\"Über uns\",\"footer.support.contact\":\"Kontakt\",\"footer.support.blog\":\"Blog\",\"footer.support.security\":\"Sicherheit\",\"footer.support.status\":\"Status\",\"footer.copyright\":\"© {year} WolvCapital, Inc. Alle Rechte vorbehalten.\",\"footer.badge.fincen\":\"🔒 FinCEN MSB Registriert\",\"footer.badge.ssl\":\"🔐 256-Bit-SSL-Verschlüsselung\",\"footer.badge.pci\":\"✓ PCI-DSS-konform\",\"howitworks.eyebrow\":\"Prozess\",\"howitworks.title\":\"Wie WolvCapital funktioniert\",\"howitworks.description\":\"Unser optimierter Prozess gewährleistet Sicherheit, Transparenz und Compliance bei jedem Schritt.\",\"howitworks.step1.title\":\"Konto erstellen\",\"howitworks.step1.description\":\"Registrieren Sie sich und schließen Sie die vollständige KYC-Identitätsverifizierung gemäß den US-amerikanischen regulatorischen Anforderungen ab.\",\"howitworks.step2.title\":\"Portfolio wählen\",\"howitworks.step2.description\":\"Wählen Sie eine verwaltete Portfolio-Stufe, die Ihrer Risikotoleranz und Ihrem Anlagehorizont entspricht. Gebühren zuerst prüfen.\",\"howitworks.step3.title\":\"Gelder einzahlen\",\"howitworks.step3.description\":\"Gelder werden bei einem lizenzierten institutionellen Verwahrer gehalten. Alle Einzahlungen unterliegen der AML-Compliance-Prüfung.\",\"howitworks.step4.title\":\"Performance verfolgen\",\"howitworks.step4.description\":\"Überwachen Sie Ihr Portfolio über ein Echtzeit-Dashboard. Monatliche geprüfte Kontoauszüge werden allen Investoren bereitgestellt.\",\"howitworks.cta\":\"Mehr über unseren Prozess erfahren\",\"plans.eyebrow\":\"Investitionsstufen\",\"plans.title\":\"Wählen Sie Ihren Portfolioplan\",\"plans.subtitle\":\"Jede Stufe spiegelt eine eigene Risikostrategie und Gebührenstruktur wider — keine Renditeversprechen. Alle Gebühren werden vor der Kontoaktivierung vollständig offengelegt.\",\"plans.minimum\":\"Minimum:\",\"plans.button.review\":\"Prüfen\",\"plans.button.getStarted\":\"Loslegen\",\"plans.disclaimer\":\"Digitale Assets sind spekulativ. Sie können einen Teil oder das gesamte investierte Kapital verlieren.\",\"plans.feeDisclosure\":\"Verwaltungsgebühren werden als Prozentsatz des AUM erhoben, monatlich abgezogen. Performancegebühren gelten nur für Gewinne über der vereinbarten Benchmark. Keine garantierten Renditen werden angeboten. Alle Gebühren werden vor der Kontoaktivierung schriftlich offengelegt.\",\"plans.feeDisclosure.label\":\"Gebührenoffenlegung:\",\"regulated.title\":\"Reguliert & Compliant\",\"regulated.subtitle\":\"WolvCapital operiert unter strengen Compliance-Standards, um das Investorenkapital zu schützen und Transparenz zu gewährleisten.\",\"regulated.kyc.title\":\"KYC-verifiziert\",\"regulated.kyc.description\":\"Alle Investoren durchlaufen vor der Kontoaktivierung eine umfassende Identitätsverifizierung, die regulatorische Compliance und Investorenschutz gewährleistet.\",\"regulated.aml.title\":\"AML-konform\",\"regulated.aml.description\":\"Fortschrittliche Anti-Geldwäsche-Systeme überwachen alle Transaktionen in Echtzeit und identifizieren und verhindern verdächtige Aktivitäten unter Wahrung der Kundenprivatsphäre.\",\"regulated.encryption.title\":\"Datenverschlüsselung\",\"regulated.encryption.description\":\"Militärgrade SSL/TLS-Verschlüsselung schützt alle Kommunikationen und Finanzdaten, gesichert durch Multi-Faktor-Authentifizierung.\",\"regulated.standards.title\":\"Sicherheitsstandards\",\"regulated.standard.2fa\":\"Zwei-Faktor-Authentifizierung\",\"regulated.standard.ssl\":\"SSL-Verschlüsselung\",\"regulated.standard.monitoring\":\"Betrugsüberwachung\",\"regulated.standard.pci\":\"Level 1 zertifiziert\",\"riskbar.title\":\"Wichtiger Hinweis\",\"riskbar.body\":\"Alle Investitionen sind mit Risiken verbunden, einschließlich des möglichen Verlustes des Kapitals. Vergangene Wertentwicklungen garantieren keine zukünftigen Ergebnisse. Digital-Asset-Investitionen sind hochvolatil und nicht für alle Investoren geeignet. WolvCapital ist keine Bank und bietet keine FDIC- oder SIPC-Versicherung. Investieren Sie nur Kapital, das Sie sich leisten können, vollständig zu verlieren. Bitte prüfen Sie unsere\",\"riskbar.riskDisclosure\":\"Risikooffenlegung\",\"riskbar.and\":\"und\",\"riskbar.terms\":\"Nutzungsbedingungen\",\"riskbar.before\":\"vor der Investition.\",\"riskbar.cta\":\"Vollständige Offenlegung lesen\",\"stats.eyebrow\":\"Plattformkennzahlen — Ausstehende Drittprüfung\",\"stats.body\":\"Geprüfte Plattformkennzahlen werden nach Abschluss unserer unabhängigen Drittprüfung veröffentlicht. Erwartet Q3 2026.\",\"stats.supporting\":\"Unser Engagement für Transparenz beinhaltet die unabhängige Verifizierung aller Plattformkennzahlen. Schauen Sie für detaillierte Statistiken und Prüfberichte wieder vorbei.\",\"stats.link\":\"Unser Compliance-Rahmen ansehen\",\"virtualcard.eyebrow\":\"Virtuelle Karte\",\"virtualcard.title\":\"Rechnungen direkt aus Ihrem Dashboard bezahlen\",\"virtualcard.subtitle\":\"Sobald Ihr Konto KYC-verifiziert und aktiviert ist, können Sie eine virtuelle WolvCapital Visa-Karte beantragen, die direkt mit Ihrem Portfoliosaldo verknüpft ist. Nutzen Sie sie für Abonnements, Online-Shopping oder verbinden Sie sie mit Apple Pay und Google Pay — alles über Ihr Dashboard.\",\"virtualcard.disclaimer\":\"Die virtuelle WolvCapital-Karte ist derzeit nur für verifizierte Einwohner unterstützter Länder verfügbar. Eine vollständige Liste der unterstützten Länder ist bei der Aktivierung verfügbar.\",\"virtualcard.cta\":\"Ihre Karte aktivieren →\",\"virtualcard.feature.1\":\"Sofortige virtuelle Karte bei KYC-Genehmigung ausgestellt\",\"virtualcard.feature.2\":\"Netflix, Spotify, Apple, Amazon und 100+ Händler bezahlen\",\"virtualcard.feature.3\":\"Mit Apple Pay und Google Pay Wallets verbinden\",\"virtualcard.feature.4\":\"Individuelle Ausgabenlimits pro Händlerkategorie festlegen\",\"virtualcard.feature.5\":\"Echtzeit-Transaktionsbenachrichtigungen und Dashboard-Tracking\",\"virtualcard.feature.6\":\"Sofort aus der App einfrieren oder entsperren\",\"virtualcard.feature.7\":\"Physische Karte für berechtigte verifizierte Konten verfügbar\"}"));}),
"[project]/src/i18n/es.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"nav.home\":\"Inicio\",\"nav.plans\":\"Planes\",\"nav.about\":\"Acerca de\",\"nav.blog\":\"Blog\",\"nav.contact\":\"Contacto\",\"nav.login\":\"Iniciar sesión\",\"nav.signup\":\"Registrarse\",\"nav.virtualCard\":\"Tarjeta virtual\",\"nav.wolvToken\":\"Token WOLV\",\"nav.compliance\":\"Cumplimiento\",\"hero.eyebrow\":\"Gestión institucional de activos digitales\",\"hero.title\":\"Portafolios de criptomonedas gestionados con comisiones transparentes y custodia profesional.\",\"hero.subtitle\":\"WolvCapital combina incorporación verificada por KYC, custodia institucional y estrategias de activos digitales auditadas. El capital está en riesgo y los rendimientos no están garantizados.\",\"hero.button.viewPlans\":\"Ver planes\",\"hero.button.openAccount\":\"Abrir cuenta\",\"hero.badge.encryption\":\"Cifrado de 256 bits\",\"hero.badge.custody\":\"Custodia institucional\",\"hero.badge.fincen\":\"MSB registrado en FinCEN\",\"hero.welcome\":\"Bienvenido a WolvCapital\",\"security.title\":\"Seguridad y cumplimiento\",\"security.eyebrow\":\"Seguridad\",\"security.description\":\"Controles de nivel empresarial, monitoreo activo de amenazas y custodia orientada al cumplimiento.\",\"security.standards.heading\":\"Estándares de seguridad\",\"security.feature.kyc.title\":\"Verificación KYC\",\"security.feature.kyc.description\":\"Todos los inversores deben pasar verificaciones de identidad antes de financiar.\",\"security.feature.aml.title\":\"Detección AML\",\"security.feature.aml.description\":\"Detección continua de transacciones contra listas de vigilancia globales.\",\"security.feature.ssl.title\":\"Cifrado SSL\",\"security.feature.ssl.description\":\"Cifrado bancario para cada sesión de usuario.\",\"security.feature.2fa.title\":\"Autenticación de dos factores\",\"security.feature.2fa.description\":\"2FA opcional para proteger el acceso a la cuenta y los retiros.\",\"security.feature.monitoring.title\":\"Monitoreo en tiempo real\",\"security.feature.monitoring.description\":\"Monitoreo de riesgos 24/7 con alertas automáticas.\",\"security.feature.pci.title\":\"Cumplimiento PCI-DSS\",\"security.feature.pci.description\":\"Nuestros flujos de pago están diseñados bajo estándares PCI-DSS.\",\"security.standard.2fa\":\"2FA opcional\",\"security.standard.ssl\":\"SSL de 256 bits\",\"security.standard.monitoring\":\"Monitoreo de fraude en tiempo real\",\"security.standard.pci\":\"Conforme con PCI-DSS\",\"security.cta\":\"Revisar nuestras prácticas de seguridad\",\"contact.title\":\"Contáctenos\",\"contact.locationHeading\":\"Nuestra oficina registrada\",\"contact.location\":\"Estados Unidos\",\"contact.contactInformationHeading\":\"Información de contacto\",\"contact.emailSupportHeading\":\"Soporte por correo electrónico\",\"contact.email\":\"support@wolvcapital.com\",\"contact.emailSupportResponse\":\"Normalmente respondemos dentro de 24 horas.\",\"contact.businessHoursHeading\":\"Horario de atención\",\"contact.businessHoursValue\":\"Soporte 24/7 disponible\",\"contact.businessHoursNote\":\"Asistencia continua para todas tus necesidades.\",\"contact.liveChatHeading\":\"Chat en vivo\",\"contact.liveChatValue\":\"Disponible para titulares de cuenta\",\"contact.liveChatNote\":\"Inicia sesión para acceder al chat en vivo.\",\"contact.faqHeading\":\"Preguntas frecuentes\",\"contact.faqIntro\":\"Antes de contactarnos, quizá encuentres respuestas en nuestra sección de FAQ.\",\"contact.faqLink\":\"Ver FAQ\",\"contact.formHeading\":\"Envíanos un mensaje\",\"contact.form.name\":\"Nombre completo\",\"contact.form.email\":\"Correo electrónico\",\"contact.form.subject\":\"Asunto\",\"contact.form.message\":\"Mensaje\",\"contact.form.submit\":\"Enviar mensaje\",\"contact.form.requiredNote\":\"* Todos los campos son obligatorios. Responderemos dentro de 24 horas.\",\"contact.mapAlt\":\"Oficina registrada de WolvCapital — 516 High St, Palo Alto, CA 94301, Estados Unidos (superposición)\",\"compliance.eyebrow\":\"Resumen de cumplimiento\",\"compliance.title\":\"Lo que esto significa para usted\",\"compliance.description\":\"WolvCapital combina cumplimiento institucional, divulgaciones transparentes y custodia con licencia para ofrecer a los inversores una base clara y profesional para invertir en activos digitales.\",\"compliance.card.subtitle\":\"Seguro, auditado y transparente\",\"compliance.card.title\":\"Un marco orientado al cumplimiento diseñado para la confianza del inversor\",\"compliance.card.body\":\"Cada paso de nuestro proceso de incorporación e inversión está diseñado para cumplir estándares institucionales mientras le mantenemos informado y protegido.\",\"compliance.card.readMore\":\"Leer más\",\"compliance.benefit.1\":\"Identidad verificada antes de aceptar fondos\",\"compliance.benefit.2\":\"Fondos custodiados por un custodio institucional con licencia, no directamente por WolvCapital\",\"compliance.benefit.3\":\"Todas las comisiones divulgadas por escrito antes de invertir\",\"compliance.benefit.4\":\"Sin rendimientos de inversión garantizados o prometidos\",\"compliance.benefit.5\":\"Informes de rendimiento mensuales auditados proporcionados\",\"compliance.benefit.6\":\"Condiciones de retiro divulgadas de antemano — sin bloqueos ocultos\",\"compliance.benefit.7\":\"Todas las transacciones revisadas por nuestro equipo de cumplimiento\",\"cta.title\":\"Inicia tu solicitud\",\"cta.subtitle\":\"La apertura de cuenta está sujeta a verificación KYC, revisión de elegibilidad y requisitos reglamentarios aplicables.\",\"cta.field.fullName\":\"Nombre legal completo\",\"cta.field.fullName.placeholder\":\"Juan Pérez\",\"cta.field.fullName.hint\":\"Utilizado para verificación de identidad y registros de cuenta.\",\"cta.field.email\":\"Correo electrónico\",\"cta.field.email.placeholder\":\"juan.perez@ejemplo.com\",\"cta.field.email.hint\":\"Enviaremos la confirmación de su cuenta a esta dirección.\",\"cta.field.country\":\"País de residencia\",\"cta.field.country.placeholder\":\"Seleccione su país\",\"cta.field.country.hint\":\"Utilizado para la evaluación de elegibilidad regulatoria.\",\"cta.field.amount\":\"Monto de inversión (USD)\",\"cta.field.amount.placeholder\":\"$5,000\",\"cta.field.amount.hint\":\"Este es un monto preliminar para su solicitud.\",\"cta.button\":\"Abrir cuenta\",\"cta.disclaimer\":\"Los activos digitales son especulativos. Puede perder parte o la totalidad del capital invertido.\",\"faq.eyebrow\":\"Soporte\",\"faq.title\":\"Preguntas frecuentes\",\"faq.subtitle\":\"Obtenga respuestas a preguntas comunes sobre invertir con WolvCapital.\",\"faq.viewAll\":\"Ver todas las preguntas frecuentes →\",\"faq.q1\":\"¿Cómo genera WolvCapital rendimientos para los inversores?\",\"faq.a1\":\"WolvCapital gestiona portafolios diversificados de activos digitales mediante apreciación de precios, rendimientos de staking y estrategias de liquidez DeFi. Los rendimientos dependen completamente del mercado y no están garantizados. Cobramos una comisión de gestión independientemente del rendimiento, y una comisión de desempeño solo sobre ganancias que superen el benchmark acordado.\",\"faq.q2\":\"¿Está WolvCapital regulado?\",\"faq.a2\":\"WolvCapital opera bajo estándares de cumplimiento KYC, AML y PCI-DSS y posee registro de Negocio de Servicios Monetarios FinCEN. Visite sec.gov o contacte legal@wolvcapital.com para documentación regulatoria detallada.\",\"faq.q3\":\"¿Están garantizados mis rendimientos?\",\"faq.a3\":\"No. WolvCapital no garantiza ningún rendimiento de inversión. Los activos digitales son altamente volátiles y especulativos. El valor de su portafolio puede caer significativamente y puede perder parte o la totalidad de su capital. El rendimiento pasado no indica resultados futuros.\",\"faq.q4\":\"¿Cómo y cuándo puedo retirar?\",\"faq.a4\":\"Los términos de retiro varían según el plan: Pioneer (90 días), Vanguard (150 días), Horizon (180 días) y Summit (365 días). Los fondos están bloqueados durante su término de contrato. Una vez que termine el plazo, puede solicitar un retiro y los fondos regresan en 5 días hábiles.\",\"faq.q5\":\"¿Cuáles son los plazos y las comisiones de salida?\",\"faq.a5\":\"Cada plan tiene un período mínimo de tenencia. Pioneer 90 días, Vanguard 150 días, Horizon 180 días, Summit 365 días. Los retiros anticipados incurren en una comisión de salida (Pioneer 2%, Vanguard 2.5%, Horizon 3%, Summit 3.5%), que se deduce de su capital.\",\"faq.q6\":\"¿Quién custodia mis activos?\",\"faq.a6\":\"Los activos de los clientes son custodiados por Coinbase Custody, un custodio institucional de activos digitales con licencia. Sus fondos están segregados de los activos de la empresa WolvCapital y protegidos ante cualquier problema operativo.\",\"faq.q7\":\"¿Cuáles son las comisiones?\",\"faq.a7\":\"Las comisiones de gestión van del 1 al 2% del AUM anualmente (Pioneer 1%, Vanguard 1.25%, Horizon 1.5%, Summit 2%), cobradas mensualmente. Las comisiones de desempeño del 20% aplican solo sobre ganancias que superen el Bloomberg Crypto Index. No hay comisiones ocultas.\",\"faq.q8\":\"¿A qué países atiende WolvCapital?\",\"faq.a8\":\"WolvCapital apoya a inversores de más de 120 países, sujeto a requisitos legales locales. Los residentes de jurisdicciones sancionadas por OFAC no son elegibles. Los servicios de tarjeta virtual están disponibles en EE.UU., Reino Unido, UE y mercados asiáticos seleccionados.\",\"faq.q9\":\"¿Cómo se manejan los impuestos?\",\"faq.a9\":\"WolvCapital genera informes fiscales trimestrales (Formularios K-1 para inversores de EE.UU.) con detalles de ganancias realizadas, pérdidas e ingresos de staking. Usted es responsable de presentar y pagar impuestos según las leyes fiscales locales.\",\"faq.q10\":\"¿Qué sucede con mis fondos si WolvCapital cierra?\",\"faq.a10\":\"Sus activos son custodiados por Coinbase Custody y están separados de los activos de la empresa WolvCapital. En caso de cualquier problema operativo de WolvCapital, sus fondos permanecen protegidos con el custodio. Los derechos de retiro se mantienen y se hacen cumplir mediante su acuerdo de custodia.\",\"faq.q11\":\"¿Cómo se calcula el benchmark de rendimiento?\",\"faq.a11\":\"Las comisiones de desempeño se calculan contra el Bloomberg Crypto Index, una cesta ponderada por capitalización de mercado de las principales criptomonedas. Para planes personalizados (Summit), el benchmark se negocia individualmente. Los cálculos son auditados trimestralmente por Deloitte LLP.\",\"footer.brand.description\":\"Gestión regulada de portafolios de activos digitales. Comisiones transparentes. Custodia institucional. Capital en riesgo.\",\"footer.platform\":\"Plataforma\",\"footer.platform.createAccount\":\"Crear cuenta\",\"footer.platform.login\":\"Iniciar sesión\",\"footer.platform.plans\":\"Planes de inversión\",\"footer.platform.virtualCard\":\"Tarjeta virtual\",\"footer.platform.faq\":\"FAQ\",\"footer.legal\":\"Legal y cumplimiento\",\"footer.legal.terms\":\"Términos de servicio\",\"footer.legal.privacy\":\"Política de privacidad\",\"footer.legal.risk\":\"Divulgación de riesgos\",\"footer.legal.disclaimer\":\"Aviso legal\",\"footer.legal.compliance\":\"Cumplimiento\",\"footer.support\":\"Soporte\",\"footer.support.about\":\"Acerca de\",\"footer.support.contact\":\"Contacto\",\"footer.support.blog\":\"Blog\",\"footer.support.security\":\"Seguridad\",\"footer.support.status\":\"Estado\",\"footer.copyright\":\"© {year} WolvCapital, Inc. Todos los derechos reservados.\",\"footer.badge.fincen\":\"🔒 FinCEN MSB Registrado\",\"footer.badge.ssl\":\"🔐 Cifrado SSL de 256 bits\",\"footer.badge.pci\":\"✓ Conforme con PCI-DSS\",\"howitworks.eyebrow\":\"Proceso\",\"howitworks.title\":\"Cómo funciona WolvCapital\",\"howitworks.description\":\"Nuestro proceso simplificado garantiza seguridad, transparencia y cumplimiento en cada paso.\",\"howitworks.step1.title\":\"Crear cuenta\",\"howitworks.step1.description\":\"Regístrese y complete la verificación de identidad KYC completa de acuerdo con los requisitos regulatorios de EE.UU.\",\"howitworks.step2.title\":\"Elegir portafolio\",\"howitworks.step2.description\":\"Seleccione un nivel de portafolio gestionado que se ajuste a su tolerancia al riesgo y horizonte de inversión. Revise las comisiones primero.\",\"howitworks.step3.title\":\"Depositar fondos\",\"howitworks.step3.description\":\"Los fondos se mantienen con un custodio institucional con licencia. Todos los depósitos están sujetos a revisión de cumplimiento AML.\",\"howitworks.step4.title\":\"Seguir el rendimiento\",\"howitworks.step4.description\":\"Monitoree su portafolio a través de un panel en tiempo real. Se proporcionan estados de cuenta mensuales auditados a todos los inversores.\",\"howitworks.cta\":\"Más información sobre nuestro proceso\",\"plans.eyebrow\":\"Niveles de inversión\",\"plans.title\":\"Elige tu plan de portafolio\",\"plans.subtitle\":\"Cada nivel refleja una estrategia de riesgo y estructura de comisiones distinta — no una promesa de rendimiento. Todas las comisiones se divulgan completamente antes de la activación de la cuenta.\",\"plans.minimum\":\"Mínimo:\",\"plans.button.review\":\"Revisar\",\"plans.button.getStarted\":\"Comenzar\",\"plans.disclaimer\":\"Los activos digitales son especulativos. Puede perder parte o la totalidad del capital invertido.\",\"plans.feeDisclosure\":\"Las comisiones de gestión se cobran como porcentaje del AUM, deducidas mensualmente. Las comisiones de desempeño aplican solo sobre ganancias que superen el benchmark acordado. No se ofrecen rendimientos garantizados. Todas las comisiones se divulgan por escrito antes de la activación de la cuenta.\",\"plans.feeDisclosure.label\":\"Divulgación de comisiones:\",\"regulated.title\":\"Regulado y conforme\",\"regulated.subtitle\":\"WolvCapital opera bajo estrictos estándares de cumplimiento para proteger el capital de los inversores y garantizar la transparencia.\",\"regulated.kyc.title\":\"KYC verificado\",\"regulated.kyc.description\":\"Todos los inversores se someten a una verificación de identidad integral antes de la activación de la cuenta, garantizando el cumplimiento regulatorio y la protección del inversor.\",\"regulated.aml.title\":\"Conforme con AML\",\"regulated.aml.description\":\"Sistemas avanzados de prevención del lavado de dinero monitorean todas las transacciones en tiempo real, identificando y previniendo actividades sospechosas mientras mantienen la privacidad del cliente.\",\"regulated.encryption.title\":\"Cifrado de datos\",\"regulated.encryption.description\":\"El cifrado SSL/TLS de grado militar protege todas las comunicaciones y datos financieros, asegurado con autenticación multifactor.\",\"regulated.standards.title\":\"Estándares de seguridad\",\"regulated.standard.2fa\":\"Autenticación de dos factores\",\"regulated.standard.ssl\":\"Cifrado SSL\",\"regulated.standard.monitoring\":\"Monitoreo de fraude\",\"regulated.standard.pci\":\"Certificado Nivel 1\",\"riskbar.title\":\"Divulgación importante\",\"riskbar.body\":\"Todas las inversiones conllevan riesgo, incluida la posible pérdida del capital. El rendimiento pasado no garantiza resultados futuros. Las inversiones en activos digitales son altamente volátiles y no son adecuadas para todos los inversores. WolvCapital no es un banco y no ofrece seguros FDIC o SIPC. Solo invierta capital que pueda permitirse perder por completo. Por favor revise nuestra\",\"riskbar.riskDisclosure\":\"Divulgación de riesgos\",\"riskbar.and\":\"y\",\"riskbar.terms\":\"Términos de servicio\",\"riskbar.before\":\"antes de invertir.\",\"riskbar.cta\":\"Leer divulgación completa\",\"stats.eyebrow\":\"Métricas de plataforma — Auditoría de terceros pendiente\",\"stats.body\":\"Las métricas auditadas de la plataforma se publicarán una vez completada nuestra auditoría independiente de terceros. Previsto para el tercer trimestre de 2026.\",\"stats.supporting\":\"Nuestro compromiso con la transparencia incluye la verificación independiente de todas las métricas de la plataforma. Vuelva a consultar para estadísticas detalladas e informes de auditoría.\",\"stats.link\":\"Ver nuestro marco de cumplimiento\",\"virtualcard.eyebrow\":\"Tarjeta virtual\",\"virtualcard.title\":\"Pague facturas directamente desde su panel\",\"virtualcard.subtitle\":\"Una vez que su cuenta esté verificada por KYC y activada, puede solicitar una tarjeta Visa virtual de WolvCapital vinculada directamente a su saldo de portafolio. Úsela para pagar suscripciones, comprar en línea o conectarse a Apple Pay y Google Pay.\",\"virtualcard.disclaimer\":\"La tarjeta virtual de WolvCapital está actualmente disponible solo para residentes verificados de países compatibles. Una lista completa de países compatibles está disponible en la activación.\",\"virtualcard.cta\":\"Activar su tarjeta →\",\"virtualcard.feature.1\":\"Tarjeta virtual emitida instantáneamente al aprobarse el KYC\",\"virtualcard.feature.2\":\"Pague Netflix, Spotify, Apple, Amazon y más de 100 comerciantes\",\"virtualcard.feature.3\":\"Conéctese a las billeteras de Apple Pay y Google Pay\",\"virtualcard.feature.4\":\"Establezca límites de gasto personalizados por categoría de comerciante\",\"virtualcard.feature.5\":\"Notificaciones de transacciones en tiempo real y seguimiento en el panel\",\"virtualcard.feature.6\":\"Congele o descongele instantáneamente desde la aplicación\",\"virtualcard.feature.7\":\"Tarjeta física disponible para cuentas verificadas elegibles\"}"));}),
"[project]/src/i18n/fr.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"nav.home\":\"Accueil\",\"nav.plans\":\"Plans\",\"nav.about\":\"À propos\",\"nav.blog\":\"Blog\",\"nav.contact\":\"Contact\",\"nav.login\":\"Connexion\",\"nav.signup\":\"S'inscrire\",\"nav.virtualCard\":\"Carte virtuelle\",\"nav.wolvToken\":\"Jeton WOLV\",\"nav.compliance\":\"Conformité\",\"hero.eyebrow\":\"Gestion institutionnelle d'actifs numériques\",\"hero.title\":\"Portefeuilles de cryptomonnaies gérés avec des frais transparents et une garde professionnelle.\",\"hero.subtitle\":\"WolvCapital combine l'intégration vérifiée KYC, la garde institutionnelle et des stratégies d'actifs numériques auditées. Le capital est à risque et les rendements ne sont pas garantis.\",\"hero.button.viewPlans\":\"Voir les plans\",\"hero.button.openAccount\":\"Ouvrir un compte\",\"hero.badge.encryption\":\"Chiffrement 256 bits\",\"hero.badge.custody\":\"Garde institutionnelle\",\"hero.badge.fincen\":\"MSB enregistré FinCEN\",\"hero.welcome\":\"Bienvenue chez WolvCapital\",\"security.title\":\"Sécurité et conformité\",\"security.eyebrow\":\"Sécurité\",\"security.description\":\"Contrôles de niveau entreprise, surveillance active des menaces et garde axée sur la conformité.\",\"security.standards.heading\":\"Normes de sécurité\",\"security.feature.kyc.title\":\"Vérification KYC\",\"security.feature.kyc.description\":\"Tous les investisseurs doivent passer des vérifications d'identité avant de financer.\",\"security.feature.aml.title\":\"Contrôle AML\",\"security.feature.aml.description\":\"Contrôle continu des transactions contre les listes de surveillance mondiales.\",\"security.feature.ssl.title\":\"Chiffrement SSL\",\"security.feature.ssl.description\":\"Chiffrement bancaire pour chaque session utilisateur.\",\"security.feature.2fa.title\":\"Authentification à deux facteurs\",\"security.feature.2fa.description\":\"2FA optionnel pour protéger l'accès au compte et les retraits.\",\"security.feature.monitoring.title\":\"Surveillance en temps réel\",\"security.feature.monitoring.description\":\"Surveillance des risques 24h/24 et 7j/7 avec des alertes automatiques.\",\"security.feature.pci.title\":\"Conformité PCI-DSS\",\"security.feature.pci.description\":\"Nos flux de paiement sont conçus selon les normes PCI-DSS.\",\"security.standard.2fa\":\"2FA optionnel\",\"security.standard.ssl\":\"SSL 256 bits\",\"security.standard.monitoring\":\"Surveillance de la fraude en temps réel\",\"security.standard.pci\":\"Conforme PCI-DSS\",\"security.cta\":\"Examiner nos pratiques de sécurité\",\"contact.title\":\"Nous contacter\",\"contact.locationHeading\":\"Notre bureau enregistré\",\"contact.location\":\"États-Unis\",\"contact.contactInformationHeading\":\"Informations de contact\",\"contact.emailSupportHeading\":\"Support par e-mail\",\"contact.email\":\"support@wolvcapital.com\",\"contact.emailSupportResponse\":\"Nous répondons généralement dans les 24 heures.\",\"contact.businessHoursHeading\":\"Heures d'ouverture\",\"contact.businessHoursValue\":\"Support 24h/24 et 7j/7 disponible\",\"contact.businessHoursNote\":\"Assistance continue pour tous vos besoins.\",\"contact.liveChatHeading\":\"Chat en direct\",\"contact.liveChatValue\":\"Disponible pour les titulaires de compte\",\"contact.liveChatNote\":\"Connectez-vous pour accéder au support par chat en direct.\",\"contact.faqHeading\":\"Questions fréquemment posées\",\"contact.faqIntro\":\"Avant de nous contacter, vous trouverez peut-être des réponses dans notre section FAQ.\",\"contact.faqLink\":\"Voir la FAQ\",\"contact.formHeading\":\"Envoyez-nous un message\",\"contact.form.name\":\"Nom complet\",\"contact.form.email\":\"Adresse e-mail\",\"contact.form.subject\":\"Objet\",\"contact.form.message\":\"Message\",\"contact.form.submit\":\"Envoyer le message\",\"contact.form.requiredNote\":\"* Tous les champs sont obligatoires. Nous répondrons dans les 24 heures.\",\"contact.mapAlt\":\"Bureau enregistré de WolvCapital — 516 High St, Palo Alto, CA 94301, États-Unis (superposition)\",\"compliance.eyebrow\":\"Aperçu de la conformité\",\"compliance.title\":\"Ce que cela signifie pour vous\",\"compliance.description\":\"WolvCapital combine la conformité institutionnelle, des divulgations transparentes et une garde sous licence pour offrir aux investisseurs une base claire et professionnelle pour l'investissement en actifs numériques.\",\"compliance.card.subtitle\":\"Sécurisé, audité et transparent\",\"compliance.card.title\":\"Un cadre axé sur la conformité conçu pour la confiance des investisseurs\",\"compliance.card.body\":\"Chaque étape de notre processus d'intégration et d'investissement est conçue pour respecter les normes institutionnelles tout en vous tenant informé et protégé.\",\"compliance.card.readMore\":\"Lire la suite\",\"compliance.benefit.1\":\"Identité vérifiée avant l'acceptation des fonds\",\"compliance.benefit.2\":\"Fonds détenus par un dépositaire institutionnel agréé — pas directement par WolvCapital\",\"compliance.benefit.3\":\"Tous les frais divulgués par écrit avant votre investissement\",\"compliance.benefit.4\":\"Aucun rendement d'investissement garanti ou promis\",\"compliance.benefit.5\":\"Rapports de performance mensuels audités fournis\",\"compliance.benefit.6\":\"Conditions de retrait divulguées à l'avance — aucun blocage caché\",\"compliance.benefit.7\":\"Toutes les transactions examinées par notre équipe de conformité\",\"cta.title\":\"Démarrez votre candidature\",\"cta.subtitle\":\"L'ouverture de compte est soumise à la vérification KYC, à l'examen d'éligibilité et aux exigences réglementaires applicables.\",\"cta.field.fullName\":\"Nom légal complet\",\"cta.field.fullName.placeholder\":\"Jean Dupont\",\"cta.field.fullName.hint\":\"Utilisé pour la vérification d'identité et les dossiers de compte.\",\"cta.field.email\":\"Adresse e-mail\",\"cta.field.email.placeholder\":\"jean.dupont@exemple.com\",\"cta.field.email.hint\":\"Nous enverrons la confirmation de votre compte à cette adresse.\",\"cta.field.country\":\"Pays de résidence\",\"cta.field.country.placeholder\":\"Sélectionnez votre pays\",\"cta.field.country.hint\":\"Utilisé pour l'évaluation de l'éligibilité réglementaire.\",\"cta.field.amount\":\"Montant de l'investissement (USD)\",\"cta.field.amount.placeholder\":\"$5 000\",\"cta.field.amount.hint\":\"Il s'agit d'un montant préliminaire pour votre candidature.\",\"cta.button\":\"Ouvrir un compte\",\"cta.disclaimer\":\"Les actifs numériques sont spéculatifs. Vous pouvez perdre une partie ou la totalité du capital investi.\",\"faq.eyebrow\":\"Support\",\"faq.title\":\"Questions fréquemment posées\",\"faq.subtitle\":\"Obtenez des réponses aux questions courantes sur l'investissement avec WolvCapital.\",\"faq.viewAll\":\"Voir toutes les FAQ →\",\"faq.q1\":\"Comment WolvCapital génère-t-il des rendements pour les investisseurs ?\",\"faq.a1\":\"WolvCapital gère des portefeuilles d'actifs numériques diversifiés grâce à l'appréciation des prix, aux rendements de staking et aux stratégies de liquidité DeFi. Les rendements dépendent entièrement du marché et ne sont pas garantis. Nous facturons des frais de gestion indépendamment de la performance, et des frais de performance uniquement sur les gains dépassant le benchmark convenu.\",\"faq.q2\":\"WolvCapital est-il réglementé ?\",\"faq.a2\":\"WolvCapital opère selon les normes de conformité KYC, AML et PCI-DSS et détient l'enregistrement FinCEN Money Services Business. Veuillez visiter sec.gov ou contacter legal@wolvcapital.com pour la documentation réglementaire détaillée.\",\"faq.q3\":\"Mes rendements sont-ils garantis ?\",\"faq.a3\":\"Non. WolvCapital ne garantit aucun rendement d'investissement. Les actifs numériques sont très volatils et spéculatifs. La valeur de votre portefeuille peut chuter considérablement et vous pouvez perdre une partie ou la totalité de votre capital. Les performances passées n'indiquent pas les résultats futurs.\",\"faq.q4\":\"Comment et quand puis-je retirer ?\",\"faq.a4\":\"Les conditions de retrait varient selon le plan : Pioneer (90 jours), Vanguard (150 jours), Horizon (180 jours) et Summit (365 jours). Les fonds sont bloqués pendant votre durée de contrat. Une fois le terme terminé, vous pouvez demander un retrait et les fonds reviennent dans les 5 jours ouvrables.\",\"faq.q5\":\"Quelles sont les durées et les frais de sortie ?\",\"faq.a5\":\"Chaque plan a une période de détention minimale. Pioneer 90 jours, Vanguard 150 jours, Horizon 180 jours, Summit 365 jours. Les retraits anticipés entraînent des frais de sortie (Pioneer 2%, Vanguard 2,5%, Horizon 3%, Summit 3,5%), déduits de votre capital.\",\"faq.q6\":\"Qui détient mes actifs ?\",\"faq.a6\":\"Les actifs des clients sont détenus par Coinbase Custody, un dépositaire institutionnel d'actifs numériques agréé. Vos fonds sont séparés des actifs de la société WolvCapital et protégés en cas de problème opérationnel de notre côté.\",\"faq.q7\":\"Quels sont les frais ?\",\"faq.a7\":\"Les frais de gestion vont de 1 à 2% de l'AUM annuellement (Pioneer 1%, Vanguard 1,25%, Horizon 1,5%, Summit 2%), facturés mensuellement. Des frais de performance de 20% s'appliquent uniquement sur les gains dépassant le Bloomberg Crypto Index. Il n'y a pas de frais cachés.\",\"faq.q8\":\"Quels pays WolvCapital dessert-il ?\",\"faq.a8\":\"WolvCapital soutient les investisseurs de plus de 120 pays, sous réserve des exigences légales locales. Les résidents des juridictions sanctionnées par l'OFAC ne sont pas éligibles. Les services de carte virtuelle sont disponibles aux États-Unis, au Royaume-Uni, dans l'UE et dans certains marchés asiatiques.\",\"faq.q9\":\"Comment les taxes sont-elles gérées ?\",\"faq.a9\":\"WolvCapital génère des rapports fiscaux trimestriels (formulaires K-1 pour les investisseurs américains) détaillant les gains réalisés, les pertes et les revenus de staking. Vous êtes responsable de déclarer et de payer les impôts sur vos gains conformément aux lois fiscales locales.\",\"faq.q10\":\"Qu'arrive-t-il à mes fonds si WolvCapital ferme ?\",\"faq.a10\":\"Vos actifs sont détenus par Coinbase Custody et sont séparés des actifs de la société WolvCapital. En cas de problème opérationnel de WolvCapital, vos fonds restent protégés auprès du dépositaire. Les droits de retrait sont préservés et appliqués via votre accord de garde.\",\"faq.q11\":\"Comment le benchmark de performance est-il calculé ?\",\"faq.a11\":\"Les frais de performance sont calculés par rapport au Bloomberg Crypto Index, un panier pondéré par capitalisation boursière des principales cryptomonnaies. Pour les plans personnalisés (Summit), le benchmark est négocié individuellement. Les calculs sont audités trimestriellement par Deloitte LLP.\",\"footer.brand.description\":\"Gestion réglementée de portefeuilles d'actifs numériques. Frais transparents. Garde institutionnelle. Capital à risque.\",\"footer.platform\":\"Plateforme\",\"footer.platform.createAccount\":\"Créer un compte\",\"footer.platform.login\":\"Connexion\",\"footer.platform.plans\":\"Plans d'investissement\",\"footer.platform.virtualCard\":\"Carte virtuelle\",\"footer.platform.faq\":\"FAQ\",\"footer.legal\":\"Juridique et conformité\",\"footer.legal.terms\":\"Conditions d'utilisation\",\"footer.legal.privacy\":\"Politique de confidentialité\",\"footer.legal.risk\":\"Divulgation des risques\",\"footer.legal.disclaimer\":\"Avis juridique\",\"footer.legal.compliance\":\"Conformité\",\"footer.support\":\"Support\",\"footer.support.about\":\"À propos\",\"footer.support.contact\":\"Contact\",\"footer.support.blog\":\"Blog\",\"footer.support.security\":\"Sécurité\",\"footer.support.status\":\"Statut\",\"footer.copyright\":\"© {year} WolvCapital, Inc. Tous droits réservés.\",\"footer.badge.fincen\":\"🔒 FinCEN MSB Enregistré\",\"footer.badge.ssl\":\"🔐 Chiffrement SSL 256 bits\",\"footer.badge.pci\":\"✓ Conforme PCI-DSS\",\"howitworks.eyebrow\":\"Processus\",\"howitworks.title\":\"Comment fonctionne WolvCapital\",\"howitworks.description\":\"Notre processus simplifié garantit la sécurité, la transparence et la conformité à chaque étape.\",\"howitworks.step1.title\":\"Créer un compte\",\"howitworks.step1.description\":\"Inscrivez-vous et complétez la vérification complète de l'identité KYC conformément aux exigences réglementaires américaines.\",\"howitworks.step2.title\":\"Choisir un portefeuille\",\"howitworks.step2.description\":\"Sélectionnez un niveau de portefeuille géré correspondant à votre tolérance au risque et à votre horizon d'investissement. Examinez d'abord les frais.\",\"howitworks.step3.title\":\"Déposer des fonds\",\"howitworks.step3.description\":\"Les fonds sont détenus auprès d'un dépositaire institutionnel agréé. Tous les dépôts sont soumis à l'examen de conformité AML.\",\"howitworks.step4.title\":\"Suivre les performances\",\"howitworks.step4.description\":\"Surveillez votre portefeuille via un tableau de bord en temps réel. Des relevés mensuels audités sont fournis à tous les investisseurs.\",\"howitworks.cta\":\"En savoir plus sur notre processus\",\"plans.eyebrow\":\"Niveaux d'investissement\",\"plans.title\":\"Choisissez votre plan de portefeuille\",\"plans.subtitle\":\"Chaque niveau reflète une stratégie de risque et une structure de frais distinctes — pas une promesse de rendement. Tous les frais sont intégralement divulgués avant l'activation du compte.\",\"plans.minimum\":\"Minimum :\",\"plans.button.review\":\"Examiner\",\"plans.button.getStarted\":\"Commencer\",\"plans.disclaimer\":\"Les actifs numériques sont spéculatifs. Vous pouvez perdre une partie ou la totalité du capital investi.\",\"plans.feeDisclosure\":\"Les frais de gestion sont facturés en pourcentage de l'AUM, déduits mensuellement. Les frais de performance s'appliquent uniquement sur les gains dépassant le benchmark convenu. Aucun rendement garanti n'est offert. Tous les frais sont divulgués par écrit avant l'activation du compte.\",\"plans.feeDisclosure.label\":\"Divulgation des frais :\",\"regulated.title\":\"Réglementé et conforme\",\"regulated.subtitle\":\"WolvCapital opère selon des normes de conformité strictes pour protéger le capital des investisseurs et garantir la transparence.\",\"regulated.kyc.title\":\"KYC vérifié\",\"regulated.kyc.description\":\"Tous les investisseurs font l'objet d'une vérification complète de leur identité avant l'activation du compte, garantissant la conformité réglementaire et la protection des investisseurs.\",\"regulated.aml.title\":\"Conforme AML\",\"regulated.aml.description\":\"Des systèmes avancés de lutte contre le blanchiment d'argent surveillent toutes les transactions en temps réel, identifiant et prévenant les activités suspectes tout en préservant la confidentialité des clients.\",\"regulated.encryption.title\":\"Chiffrement des données\",\"regulated.encryption.description\":\"Le chiffrement SSL/TLS de qualité militaire protège toutes les communications et données financières, sécurisé par authentification multifacteur.\",\"regulated.standards.title\":\"Normes de sécurité\",\"regulated.standard.2fa\":\"Authentification à deux facteurs\",\"regulated.standard.ssl\":\"Chiffrement SSL\",\"regulated.standard.monitoring\":\"Surveillance de la fraude\",\"regulated.standard.pci\":\"Certifié Niveau 1\",\"riskbar.title\":\"Divulgation importante\",\"riskbar.body\":\"Tous les investissements comportent des risques, y compris la perte potentielle du capital. Les performances passées ne garantissent pas les résultats futurs. Les investissements en actifs numériques sont très volatils et ne conviennent pas à tous les investisseurs. WolvCapital n'est pas une banque et ne propose pas d'assurance FDIC ou SIPC. N'investissez que le capital que vous pouvez vous permettre de perdre entièrement. Veuillez consulter notre\",\"riskbar.riskDisclosure\":\"Divulgation des risques\",\"riskbar.and\":\"et\",\"riskbar.terms\":\"Conditions d'utilisation\",\"riskbar.before\":\"avant d'investir.\",\"riskbar.cta\":\"Lire la divulgation complète\",\"stats.eyebrow\":\"Métriques de la plateforme — Audit tiers en attente\",\"stats.body\":\"Les métriques auditées de la plateforme seront publiées à la fin de notre audit indépendant par un tiers. Prévu pour le T3 2026.\",\"stats.supporting\":\"Notre engagement envers la transparence comprend la vérification indépendante de toutes les métriques de la plateforme. Revenez pour des statistiques détaillées et des rapports d'audit.\",\"stats.link\":\"Voir notre cadre de conformité\",\"virtualcard.eyebrow\":\"Carte virtuelle\",\"virtualcard.title\":\"Payez vos factures directement depuis votre tableau de bord\",\"virtualcard.subtitle\":\"Une fois votre compte vérifié KYC et activé, vous pouvez demander une carte Visa virtuelle WolvCapital liée directement à votre solde de portefeuille. Utilisez-la pour payer des abonnements, faire des achats en ligne ou vous connecter à Apple Pay et Google Pay.\",\"virtualcard.disclaimer\":\"La carte virtuelle WolvCapital est actuellement disponible uniquement pour les résidents vérifiés des pays pris en charge. Une liste complète des pays pris en charge est disponible lors de l'activation.\",\"virtualcard.cta\":\"Activer votre carte →\",\"virtualcard.feature.1\":\"Carte virtuelle émise instantanément à l'approbation KYC\",\"virtualcard.feature.2\":\"Payez Netflix, Spotify, Apple, Amazon et plus de 100 marchands\",\"virtualcard.feature.3\":\"Connectez-vous aux portefeuilles Apple Pay et Google Pay\",\"virtualcard.feature.4\":\"Définissez des limites de dépenses personnalisées par catégorie de marchand\",\"virtualcard.feature.5\":\"Notifications de transaction en temps réel et suivi du tableau de bord\",\"virtualcard.feature.6\":\"Gelée ou dégelée instantanément depuis l'application\",\"virtualcard.feature.7\":\"Carte physique disponible pour les comptes vérifiés éligibles\"}"));}),
"[project]/src/i18n/it.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"nav.home\":\"Home\",\"nav.plans\":\"Piani\",\"nav.about\":\"Chi siamo\",\"nav.blog\":\"Blog\",\"nav.contact\":\"Contatti\",\"nav.login\":\"Accedi\",\"nav.signup\":\"Registrati\",\"nav.virtualCard\":\"Carta virtuale\",\"nav.wolvToken\":\"Token WOLV\",\"nav.compliance\":\"Conformità\",\"hero.eyebrow\":\"Gestione istituzionale di asset digitali\",\"hero.title\":\"Portafogli di criptovalute gestiti con commissioni trasparenti e custodia professionale.\",\"hero.subtitle\":\"WolvCapital combina onboarding verificato KYC, custodia istituzionale e strategie di asset digitali verificate. Il capitale è a rischio e i rendimenti non sono garantiti.\",\"hero.button.viewPlans\":\"Visualizza piani\",\"hero.button.openAccount\":\"Apri conto\",\"hero.badge.encryption\":\"Crittografia a 256 bit\",\"hero.badge.custody\":\"Custodia istituzionale\",\"hero.badge.fincen\":\"MSB registrato FinCEN\",\"hero.welcome\":\"Benvenuto in WolvCapital\",\"security.title\":\"Sicurezza e conformità\",\"security.eyebrow\":\"Sicurezza\",\"security.description\":\"Controlli di livello enterprise, monitoraggio attivo delle minacce e custodia orientata alla conformità.\",\"security.standards.heading\":\"Standard di sicurezza\",\"security.feature.kyc.title\":\"Verifica KYC\",\"security.feature.kyc.description\":\"Tutti gli investitori devono superare le verifiche di identità prima del finanziamento.\",\"security.feature.aml.title\":\"Screening AML\",\"security.feature.aml.description\":\"Screening continuo delle transazioni contro le liste di controllo globali.\",\"security.feature.ssl.title\":\"Crittografia SSL\",\"security.feature.ssl.description\":\"Crittografia bancaria per ogni sessione utente.\",\"security.feature.2fa.title\":\"Autenticazione a due fattori\",\"security.feature.2fa.description\":\"2FA opzionale per proteggere l'accesso all'account e i prelievi.\",\"security.feature.monitoring.title\":\"Monitoraggio in tempo reale\",\"security.feature.monitoring.description\":\"Monitoraggio del rischio 24/7 con avvisi automatici.\",\"security.feature.pci.title\":\"Conformità PCI-DSS\",\"security.feature.pci.description\":\"I nostri flussi di pagamento sono progettati secondo gli standard PCI-DSS.\",\"security.standard.2fa\":\"2FA opzionale\",\"security.standard.ssl\":\"SSL a 256 bit\",\"security.standard.monitoring\":\"Monitoraggio frodi in tempo reale\",\"security.standard.pci\":\"Conforme PCI-DSS\",\"security.cta\":\"Rivedi le nostre pratiche di sicurezza\",\"contact.title\":\"Contattaci\",\"contact.locationHeading\":\"Il nostro ufficio registrato\",\"contact.location\":\"Stati Uniti\",\"contact.contactInformationHeading\":\"Informazioni di contatto\",\"contact.emailSupportHeading\":\"Supporto e-mail\",\"contact.email\":\"support@wolvcapital.com\",\"contact.emailSupportResponse\":\"Di solito rispondiamo entro 24 ore.\",\"contact.businessHoursHeading\":\"Orario di lavoro\",\"contact.businessHoursValue\":\"Supporto 24/7 disponibile\",\"contact.businessHoursNote\":\"Assistenza continua per tutte le tue esigenze.\",\"contact.liveChatHeading\":\"Chat dal vivo\",\"contact.liveChatValue\":\"Disponibile per i titolari di account\",\"contact.liveChatNote\":\"Accedi per utilizzare il supporto chat dal vivo.\",\"contact.faqHeading\":\"Domande frequenti\",\"contact.faqIntro\":\"Prima di contattarci, potresti trovare risposte nella nostra sezione FAQ.\",\"contact.faqLink\":\"Visualizza FAQ\",\"contact.formHeading\":\"Inviaci un messaggio\",\"contact.form.name\":\"Nome completo\",\"contact.form.email\":\"Indirizzo e-mail\",\"contact.form.subject\":\"Oggetto\",\"contact.form.message\":\"Messaggio\",\"contact.form.submit\":\"Invia messaggio\",\"contact.form.requiredNote\":\"* Tutti i campi sono obbligatori. Risponderemo entro 24 ore.\",\"contact.mapAlt\":\"Ufficio registrato di WolvCapital — 516 High St, Palo Alto, CA 94301, Stati Uniti (overlay)\",\"compliance.eyebrow\":\"Panoramica sulla conformità\",\"compliance.title\":\"Cosa significa per te\",\"compliance.description\":\"WolvCapital combina conformità istituzionale, divulgazioni trasparenti e custodia con licenza per offrire agli investitori una base chiara e professionale per gli investimenti in asset digitali.\",\"compliance.card.subtitle\":\"Sicuro, verificato e trasparente\",\"compliance.card.title\":\"Un framework orientato alla conformità costruito per la fiducia degli investitori\",\"compliance.card.body\":\"Ogni fase del nostro processo di onboarding e investimento è progettata per soddisfare gli standard istituzionali mantenendoti informato e protetto.\",\"compliance.card.readMore\":\"Leggi di più\",\"compliance.benefit.1\":\"Identità verificata prima dell'accettazione dei fondi\",\"compliance.benefit.2\":\"Fondi detenuti da un custode istituzionale autorizzato — non direttamente da WolvCapital\",\"compliance.benefit.3\":\"Tutte le commissioni divulgate per iscritto prima dell'investimento\",\"compliance.benefit.4\":\"Nessun rendimento di investimento garantito o promesso\",\"compliance.benefit.5\":\"Rapporti di performance mensili verificati forniti\",\"compliance.benefit.6\":\"Condizioni di prelievo divulgate in anticipo — nessun blocco nascosto\",\"compliance.benefit.7\":\"Tutte le transazioni esaminate dal nostro team di conformità\",\"cta.title\":\"Avvia la tua candidatura\",\"cta.subtitle\":\"L'apertura del conto è soggetta alla verifica KYC, alla revisione dell'idoneità e ai requisiti normativi applicabili.\",\"cta.field.fullName\":\"Nome legale completo\",\"cta.field.fullName.placeholder\":\"Mario Rossi\",\"cta.field.fullName.hint\":\"Utilizzato per la verifica dell'identità e i registri dell'account.\",\"cta.field.email\":\"Indirizzo e-mail\",\"cta.field.email.placeholder\":\"mario.rossi@esempio.com\",\"cta.field.email.hint\":\"Invieremo la conferma del tuo account a questo indirizzo.\",\"cta.field.country\":\"Paese di residenza\",\"cta.field.country.placeholder\":\"Seleziona il tuo paese\",\"cta.field.country.hint\":\"Utilizzato per la valutazione dell'idoneità normativa.\",\"cta.field.amount\":\"Importo dell'investimento (USD)\",\"cta.field.amount.placeholder\":\"$5.000\",\"cta.field.amount.hint\":\"Questo è un importo preliminare per la tua candidatura.\",\"cta.button\":\"Apri conto\",\"cta.disclaimer\":\"Gli asset digitali sono speculativi. Potresti perdere parte o tutto il capitale investito.\",\"faq.eyebrow\":\"Supporto\",\"faq.title\":\"Domande frequenti\",\"faq.subtitle\":\"Ottieni risposte alle domande comuni sull'investimento con WolvCapital.\",\"faq.viewAll\":\"Visualizza tutte le FAQ →\",\"faq.q1\":\"Come genera WolvCapital rendimenti per gli investitori?\",\"faq.a1\":\"WolvCapital gestisce portafogli diversificati di asset digitali attraverso l'apprezzamento dei prezzi, i rendimenti di staking e le strategie di liquidità DeFi. I rendimenti dipendono interamente dal mercato e non sono garantiti. Addebitiamo una commissione di gestione indipendentemente dalle prestazioni e una commissione di performance solo sui guadagni superiori al benchmark concordato.\",\"faq.q2\":\"WolvCapital è regolamentata?\",\"faq.a2\":\"WolvCapital opera secondo gli standard di conformità KYC, AML e PCI-DSS e detiene la registrazione FinCEN Money Services Business. Visita sec.gov o contatta legal@wolvcapital.com per la documentazione normativa dettagliata.\",\"faq.q3\":\"I miei rendimenti sono garantiti?\",\"faq.a3\":\"No. WolvCapital non garantisce alcun rendimento dell'investimento. Gli asset digitali sono altamente volatili e speculativi. Il valore del tuo portafoglio può diminuire significativamente e potresti perdere parte o tutto il capitale. Le performance passate non indicano i risultati futuri.\",\"faq.q4\":\"Come e quando posso prelevare?\",\"faq.a4\":\"Le condizioni di prelievo variano a seconda del piano: Pioneer (90 giorni), Vanguard (150 giorni), Horizon (180 giorni) e Summit (365 giorni). I fondi sono bloccati durante il termine del contratto. Una volta scaduto il termine, puoi richiedere il prelievo e i fondi rientrano entro 5 giorni lavorativi.\",\"faq.q5\":\"Quali sono i termini e le commissioni di uscita?\",\"faq.a5\":\"Ogni piano ha un periodo di detenzione minimo. Pioneer 90 giorni, Vanguard 150 giorni, Horizon 180 giorni, Summit 365 giorni. I prelievi anticipati comportano una commissione di uscita (Pioneer 2%, Vanguard 2,5%, Horizon 3%, Summit 3,5%), dedotta dal capitale.\",\"faq.q6\":\"Chi detiene i miei asset?\",\"faq.a6\":\"Gli asset dei clienti sono detenuti da Coinbase Custody, un custode istituzionale di asset digitali con licenza. I tuoi fondi sono separati dagli asset aziendali di WolvCapital e protetti in caso di problemi operativi da parte nostra.\",\"faq.q7\":\"Quali sono le commissioni?\",\"faq.a7\":\"Le commissioni di gestione vanno dall'1 al 2% dell'AUM annualmente (Pioneer 1%, Vanguard 1,25%, Horizon 1,5%, Summit 2%), addebitate mensilmente. Le commissioni di performance del 20% si applicano solo sui guadagni superiori al Bloomberg Crypto Index. Non ci sono commissioni nascoste.\",\"faq.q8\":\"Quali paesi serve WolvCapital?\",\"faq.a8\":\"WolvCapital supporta investitori da oltre 120 paesi, soggetti ai requisiti legali locali. I residenti delle giurisdizioni sanzionate dall'OFAC non sono idonei. I servizi di carta virtuale sono disponibili negli Stati Uniti, nel Regno Unito, nell'UE e in mercati asiatici selezionati.\",\"faq.q9\":\"Come vengono gestite le tasse?\",\"faq.a9\":\"WolvCapital genera rapporti fiscali trimestrali (Moduli K-1 per gli investitori statunitensi) con dettagli su guadagni realizzati, perdite e redditi da staking. Sei responsabile della presentazione e del pagamento delle tasse sui tuoi guadagni secondo le leggi fiscali locali.\",\"faq.q10\":\"Cosa succede ai miei fondi se WolvCapital chiude?\",\"faq.a10\":\"I tuoi asset sono detenuti da Coinbase Custody e sono separati dagli asset aziendali di WolvCapital. In caso di problemi operativi di WolvCapital, i tuoi fondi rimangono protetti presso il custode. I diritti di prelievo sono preservati e applicati tramite il tuo accordo di custodia.\",\"faq.q11\":\"Come viene calcolato il benchmark di performance?\",\"faq.a11\":\"Le commissioni di performance vengono calcolate rispetto al Bloomberg Crypto Index, un paniere ponderato per capitalizzazione di mercato delle principali criptovalute. Per i piani personalizzati (Summit), il benchmark viene negoziato individualmente. I calcoli sono verificati trimestralmente da Deloitte LLP.\",\"footer.brand.description\":\"Gestione regolamentata di portafogli di asset digitali. Commissioni trasparenti. Custodia istituzionale. Capitale a rischio.\",\"footer.platform\":\"Piattaforma\",\"footer.platform.createAccount\":\"Crea account\",\"footer.platform.login\":\"Accedi\",\"footer.platform.plans\":\"Piani di investimento\",\"footer.platform.virtualCard\":\"Carta virtuale\",\"footer.platform.faq\":\"FAQ\",\"footer.legal\":\"Legale e conformità\",\"footer.legal.terms\":\"Termini di servizio\",\"footer.legal.privacy\":\"Informativa sulla privacy\",\"footer.legal.risk\":\"Informativa sui rischi\",\"footer.legal.disclaimer\":\"Avviso legale\",\"footer.legal.compliance\":\"Conformità\",\"footer.support\":\"Supporto\",\"footer.support.about\":\"Chi siamo\",\"footer.support.contact\":\"Contatti\",\"footer.support.blog\":\"Blog\",\"footer.support.security\":\"Sicurezza\",\"footer.support.status\":\"Stato\",\"footer.copyright\":\"© {year} WolvCapital, Inc. Tutti i diritti riservati.\",\"footer.badge.fincen\":\"🔒 FinCEN MSB Registrato\",\"footer.badge.ssl\":\"🔐 Crittografia SSL a 256 bit\",\"footer.badge.pci\":\"✓ Conforme PCI-DSS\",\"howitworks.eyebrow\":\"Processo\",\"howitworks.title\":\"Come funziona WolvCapital\",\"howitworks.description\":\"Il nostro processo semplificato garantisce sicurezza, trasparenza e conformità a ogni fase.\",\"howitworks.step1.title\":\"Crea account\",\"howitworks.step1.description\":\"Registrati e completa la verifica completa dell'identità KYC in linea con i requisiti normativi statunitensi.\",\"howitworks.step2.title\":\"Scegli portafoglio\",\"howitworks.step2.description\":\"Seleziona un livello di portafoglio gestito che corrisponda alla tua tolleranza al rischio e all'orizzonte di investimento. Rivedi prima le commissioni.\",\"howitworks.step3.title\":\"Deposita fondi\",\"howitworks.step3.description\":\"I fondi sono detenuti con un custode istituzionale autorizzato. Tutti i depositi sono soggetti alla revisione della conformità AML.\",\"howitworks.step4.title\":\"Monitora le performance\",\"howitworks.step4.description\":\"Monitora il tuo portafoglio tramite una dashboard in tempo reale. Estratti conto mensili verificati vengono forniti a tutti gli investitori.\",\"howitworks.cta\":\"Scopri di più sul nostro processo\",\"plans.eyebrow\":\"Livelli di investimento\",\"plans.title\":\"Scegli il tuo piano di portafoglio\",\"plans.subtitle\":\"Ogni livello riflette una strategia di rischio e una struttura di commissioni distinte — non una promessa di rendimento. Tutte le commissioni sono divulgate per intero prima dell'attivazione del conto.\",\"plans.minimum\":\"Minimo:\",\"plans.button.review\":\"Rivedi\",\"plans.button.getStarted\":\"Inizia\",\"plans.disclaimer\":\"Gli asset digitali sono speculativi. Potresti perdere parte o tutto il capitale investito.\",\"plans.feeDisclosure\":\"Le commissioni di gestione vengono addebitate come percentuale dell'AUM, dedotte mensilmente. Le commissioni di performance si applicano solo sui guadagni superiori al benchmark concordato. Non vengono offerti rendimenti garantiti. Tutte le commissioni sono divulgate per iscritto prima dell'attivazione del conto.\",\"plans.feeDisclosure.label\":\"Informativa sulle commissioni:\",\"regulated.title\":\"Regolamentato e conforme\",\"regulated.subtitle\":\"WolvCapital opera secondo rigorosi standard di conformità per proteggere il capitale degli investitori e garantire la trasparenza.\",\"regulated.kyc.title\":\"KYC verificato\",\"regulated.kyc.description\":\"Tutti gli investitori sono sottoposti a una verifica completa dell'identità prima dell'attivazione del conto, garantendo la conformità normativa e la protezione degli investitori.\",\"regulated.aml.title\":\"Conforme AML\",\"regulated.aml.description\":\"Sistemi avanzati antiriciclaggio monitorano tutte le transazioni in tempo reale, identificando e prevenendo attività sospette nel rispetto della privacy dei clienti.\",\"regulated.encryption.title\":\"Crittografia dei dati\",\"regulated.encryption.description\":\"La crittografia SSL/TLS di livello militare protegge tutte le comunicazioni e i dati finanziari, protetta con autenticazione a più fattori.\",\"regulated.standards.title\":\"Standard di sicurezza\",\"regulated.standard.2fa\":\"Autenticazione a due fattori\",\"regulated.standard.ssl\":\"Crittografia SSL\",\"regulated.standard.monitoring\":\"Monitoraggio frodi\",\"regulated.standard.pci\":\"Certificato Livello 1\",\"riskbar.title\":\"Divulgazione importante\",\"riskbar.body\":\"Tutti gli investimenti comportano rischi, inclusa la potenziale perdita del capitale. Le performance passate non garantiscono risultati futuri. Gli investimenti in asset digitali sono altamente volatili e non adatti a tutti gli investitori. WolvCapital non è una banca e non offre assicurazione FDIC o SIPC. Investi solo capitale che puoi permetterti di perdere completamente. Consulta la nostra\",\"riskbar.riskDisclosure\":\"Informativa sui rischi\",\"riskbar.and\":\"e\",\"riskbar.terms\":\"Termini di servizio\",\"riskbar.before\":\"prima di investire.\",\"riskbar.cta\":\"Leggi la divulgazione completa\",\"stats.eyebrow\":\"Metriche della piattaforma — Audit di terze parti in sospeso\",\"stats.body\":\"Le metriche verificate della piattaforma saranno pubblicate al completamento del nostro audit indipendente di terze parti. Previsto per il T3 2026.\",\"stats.supporting\":\"Il nostro impegno per la trasparenza include la verifica indipendente di tutte le metriche della piattaforma. Torna per statistiche dettagliate e rapporti di audit.\",\"stats.link\":\"Visualizza il nostro framework di conformità\",\"virtualcard.eyebrow\":\"Carta virtuale\",\"virtualcard.title\":\"Paga le bollette direttamente dalla tua dashboard\",\"virtualcard.subtitle\":\"Una volta che il tuo account è verificato KYC e attivato, puoi richiedere una carta Visa virtuale WolvCapital collegata direttamente al saldo del tuo portafoglio. Usala per pagare abbonamenti, fare acquisti online o collegarti ad Apple Pay e Google Pay.\",\"virtualcard.disclaimer\":\"La carta virtuale WolvCapital è attualmente disponibile solo per i residenti verificati dei paesi supportati. Un elenco completo dei paesi supportati è disponibile all'attivazione.\",\"virtualcard.cta\":\"Attiva la tua carta →\",\"virtualcard.feature.1\":\"Carta virtuale emessa istantaneamente all'approvazione KYC\",\"virtualcard.feature.2\":\"Paga Netflix, Spotify, Apple, Amazon e oltre 100 commercianti\",\"virtualcard.feature.3\":\"Collegati ai portafogli Apple Pay e Google Pay\",\"virtualcard.feature.4\":\"Imposta limiti di spesa personalizzati per categoria di commerciante\",\"virtualcard.feature.5\":\"Notifiche di transazione in tempo reale e monitoraggio della dashboard\",\"virtualcard.feature.6\":\"Blocca o sblocca istantaneamente dall'app\",\"virtualcard.feature.7\":\"Carta fisica disponibile per account verificati idonei\"}"));}),
"[project]/src/i18n/pt.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"nav.home\":\"Início\",\"nav.plans\":\"Planos\",\"nav.about\":\"Sobre\",\"nav.blog\":\"Blog\",\"nav.contact\":\"Contacto\",\"nav.login\":\"Entrar\",\"nav.signup\":\"Registar\",\"nav.virtualCard\":\"Cartão virtual\",\"nav.wolvToken\":\"Token WOLV\",\"nav.compliance\":\"Conformidade\",\"hero.eyebrow\":\"Gestão institucional de ativos digitais\",\"hero.title\":\"Portfólios de criptomoedas geridos com taxas transparentes e custódia profissional.\",\"hero.subtitle\":\"WolvCapital combina integração verificada por KYC, custódia institucional e estratégias de ativos digitais auditadas. O capital está em risco e os rendimentos não são garantidos.\",\"hero.button.viewPlans\":\"Ver planos\",\"hero.button.openAccount\":\"Abrir conta\",\"hero.badge.encryption\":\"Encriptação de 256 bits\",\"hero.badge.custody\":\"Custódia institucional\",\"hero.badge.fincen\":\"MSB registado FinCEN\",\"hero.welcome\":\"Bem-vindo à WolvCapital\",\"security.title\":\"Segurança e conformidade\",\"security.eyebrow\":\"Segurança\",\"security.description\":\"Controlos de nível empresarial, monitorização ativa de ameaças e custódia orientada para a conformidade.\",\"security.standards.heading\":\"Normas de segurança\",\"security.feature.kyc.title\":\"Verificação KYC\",\"security.feature.kyc.description\":\"Todos os investidores devem passar verificações de identidade antes de financiar.\",\"security.feature.aml.title\":\"Rastreio AML\",\"security.feature.aml.description\":\"Rastreio contínuo de transações contra listas de vigilância globais.\",\"security.feature.ssl.title\":\"Encriptação SSL\",\"security.feature.ssl.description\":\"Encriptação bancária para cada sessão do utilizador.\",\"security.feature.2fa.title\":\"Autenticação de dois fatores\",\"security.feature.2fa.description\":\"2FA opcional para proteger o acesso à conta e levantamentos.\",\"security.feature.monitoring.title\":\"Monitorização em tempo real\",\"security.feature.monitoring.description\":\"Monitorização de riscos 24/7 com alertas automáticos.\",\"security.feature.pci.title\":\"Conformidade PCI-DSS\",\"security.feature.pci.description\":\"Os nossos fluxos de pagamento são concebidos segundo as normas PCI-DSS.\",\"security.standard.2fa\":\"2FA opcional\",\"security.standard.ssl\":\"SSL de 256 bits\",\"security.standard.monitoring\":\"Monitorização de fraude em tempo real\",\"security.standard.pci\":\"Conforme PCI-DSS\",\"security.cta\":\"Rever as nossas práticas de segurança\",\"contact.title\":\"Entre em contacto\",\"contact.locationHeading\":\"O nosso escritório registado\",\"contact.location\":\"Estados Unidos\",\"contact.contactInformationHeading\":\"Informações de contacto\",\"contact.emailSupportHeading\":\"Suporte por e-mail\",\"contact.email\":\"support@wolvcapital.com\",\"contact.emailSupportResponse\":\"Normalmente respondemos dentro de 24 horas.\",\"contact.businessHoursHeading\":\"Horário de funcionamento\",\"contact.businessHoursValue\":\"Suporte 24/7 disponível\",\"contact.businessHoursNote\":\"Assistência contínua para todas as suas necessidades.\",\"contact.liveChatHeading\":\"Chat ao vivo\",\"contact.liveChatValue\":\"Disponível para titulares de conta\",\"contact.liveChatNote\":\"Inicie sessão para aceder ao suporte por chat ao vivo.\",\"contact.faqHeading\":\"Perguntas frequentes\",\"contact.faqIntro\":\"Antes de nos contactar, poderá encontrar respostas na nossa secção de FAQ.\",\"contact.faqLink\":\"Ver FAQ\",\"contact.formHeading\":\"Envie-nos uma mensagem\",\"contact.form.name\":\"Nome completo\",\"contact.form.email\":\"Endereço de e-mail\",\"contact.form.subject\":\"Assunto\",\"contact.form.message\":\"Mensagem\",\"contact.form.submit\":\"Enviar mensagem\",\"contact.form.requiredNote\":\"* Todos os campos são obrigatórios. Responderemos dentro de 24 horas.\",\"contact.mapAlt\":\"Escritório registado da WolvCapital — 516 High St, Palo Alto, CA 94301, Estados Unidos (sobreposição)\",\"compliance.eyebrow\":\"Visão geral da conformidade\",\"compliance.title\":\"O que isto significa para si\",\"compliance.description\":\"WolvCapital combina conformidade institucional, divulgações transparentes e custódia licenciada para oferecer aos investidores uma base clara e profissional para o investimento em ativos digitais.\",\"compliance.card.subtitle\":\"Seguro, auditado e transparente\",\"compliance.card.title\":\"Uma estrutura orientada para a conformidade criada para a confiança dos investidores\",\"compliance.card.body\":\"Cada etapa do nosso processo de integração e investimento é concebida para cumprir os padrões institucionais, mantendo-o informado e protegido.\",\"compliance.card.readMore\":\"Ler mais\",\"compliance.benefit.1\":\"Identidade verificada antes da aceitação de fundos\",\"compliance.benefit.2\":\"Fundos mantidos por um custodiante institucional licenciado — não diretamente pela WolvCapital\",\"compliance.benefit.3\":\"Todas as taxas divulgadas por escrito antes do investimento\",\"compliance.benefit.4\":\"Sem rendimentos de investimento garantidos ou prometidos\",\"compliance.benefit.5\":\"Relatórios de desempenho mensais auditados fornecidos\",\"compliance.benefit.6\":\"Condições de levantamento divulgadas antecipadamente — sem bloqueios ocultos\",\"compliance.benefit.7\":\"Todas as transações revistas pela nossa equipa de conformidade\",\"cta.title\":\"Inicie a sua candidatura\",\"cta.subtitle\":\"A abertura de conta está sujeita à verificação KYC, revisão de elegibilidade e requisitos regulamentares aplicáveis.\",\"cta.field.fullName\":\"Nome legal completo\",\"cta.field.fullName.placeholder\":\"João Silva\",\"cta.field.fullName.hint\":\"Utilizado para verificação de identidade e registos de conta.\",\"cta.field.email\":\"Endereço de e-mail\",\"cta.field.email.placeholder\":\"joao.silva@exemplo.com\",\"cta.field.email.hint\":\"Enviaremos a confirmação da sua conta para este endereço.\",\"cta.field.country\":\"País de residência\",\"cta.field.country.placeholder\":\"Selecione o seu país\",\"cta.field.country.hint\":\"Utilizado para avaliação de elegibilidade regulamentar.\",\"cta.field.amount\":\"Valor do investimento (USD)\",\"cta.field.amount.placeholder\":\"$5.000\",\"cta.field.amount.hint\":\"Este é um valor preliminar para a sua candidatura.\",\"cta.button\":\"Abrir conta\",\"cta.disclaimer\":\"Os ativos digitais são especulativos. Pode perder parte ou a totalidade do capital investido.\",\"faq.eyebrow\":\"Suporte\",\"faq.title\":\"Perguntas frequentes\",\"faq.subtitle\":\"Obtenha respostas a perguntas comuns sobre investir com a WolvCapital.\",\"faq.viewAll\":\"Ver todas as FAQ →\",\"faq.q1\":\"Como é que a WolvCapital gera rendimentos para os investidores?\",\"faq.a1\":\"A WolvCapital gere portfólios diversificados de ativos digitais através da valorização dos preços, rendimentos de staking e estratégias de liquidez DeFi. Os rendimentos dependem inteiramente do mercado e não são garantidos. Cobramos uma taxa de gestão independentemente do desempenho, e uma taxa de desempenho apenas sobre os ganhos que excedam o benchmark acordado.\",\"faq.q2\":\"A WolvCapital é regulamentada?\",\"faq.a2\":\"A WolvCapital opera segundo os padrões de conformidade KYC, AML e PCI-DSS e detém o registo FinCEN Money Services Business. Visite sec.gov ou contacte legal@wolvcapital.com para documentação regulamentar detalhada.\",\"faq.q3\":\"Os meus rendimentos são garantidos?\",\"faq.a3\":\"Não. A WolvCapital não garante qualquer rendimento de investimento. Os ativos digitais são altamente voláteis e especulativos. O valor do seu portfólio pode cair significativamente e pode perder parte ou todo o seu capital. O desempenho passado não indica resultados futuros.\",\"faq.q4\":\"Como e quando posso levantar?\",\"faq.a4\":\"As condições de levantamento variam consoante o plano: Pioneer (90 dias), Vanguard (150 dias), Horizon (180 dias) e Summit (365 dias). Os fundos estão bloqueados durante o prazo do contrato. Assim que o prazo terminar, pode solicitar o levantamento e os fundos regressam dentro de 5 dias úteis.\",\"faq.q5\":\"Quais são os prazos e as taxas de saída?\",\"faq.a5\":\"Cada plano tem um período mínimo de detenção. Pioneer 90 dias, Vanguard 150 dias, Horizon 180 dias, Summit 365 dias. Os levantamentos antecipados incorrem numa taxa de saída (Pioneer 2%, Vanguard 2,5%, Horizon 3%, Summit 3,5%), deduzida do seu capital.\",\"faq.q6\":\"Quem detém os meus ativos?\",\"faq.a6\":\"Os ativos dos clientes são detidos pela Coinbase Custody, um custodiante institucional de ativos digitais licenciado. Os seus fundos estão separados dos ativos da empresa WolvCapital e protegidos em caso de qualquer problema operacional da nossa parte.\",\"faq.q7\":\"Quais são as taxas?\",\"faq.a7\":\"As taxas de gestão variam de 1 a 2% do AUM anualmente (Pioneer 1%, Vanguard 1,25%, Horizon 1,5%, Summit 2%), cobradas mensalmente. As taxas de desempenho de 20% aplicam-se apenas aos ganhos que excedam o Bloomberg Crypto Index. Não há taxas ocultas.\",\"faq.q8\":\"Quais os países que a WolvCapital serve?\",\"faq.a8\":\"A WolvCapital apoia investidores de mais de 120 países, sujeito aos requisitos legais locais. Os residentes de jurisdições sancionadas pela OFAC não são elegíveis. Os serviços de cartão virtual estão disponíveis nos EUA, Reino Unido, UE e mercados asiáticos selecionados.\",\"faq.q9\":\"Como são tratados os impostos?\",\"faq.a9\":\"A WolvCapital gera relatórios fiscais trimestrais (Formulários K-1 para investidores dos EUA) com detalhes sobre ganhos realizados, perdas e rendimentos de staking. É responsável pela apresentação e pagamento de impostos sobre os seus ganhos de acordo com as leis fiscais locais.\",\"faq.q10\":\"O que acontece aos meus fundos se a WolvCapital fechar?\",\"faq.a10\":\"Os seus ativos são detidos pela Coinbase Custody e estão separados dos ativos da empresa WolvCapital. Em caso de qualquer problema operacional da WolvCapital, os seus fundos permanecem protegidos com o custodiante. Os direitos de levantamento são preservados e aplicados através do seu acordo de custódia.\",\"faq.q11\":\"Como é calculado o benchmark de desempenho?\",\"faq.a11\":\"As taxas de desempenho são calculadas em relação ao Bloomberg Crypto Index, um cabaz ponderado pela capitalização de mercado das principais criptomoedas. Para planos personalizados (Summit), o benchmark é negociado individualmente. Os cálculos são auditados trimestralmente pela Deloitte LLP.\",\"footer.brand.description\":\"Gestão regulamentada de portfólios de ativos digitais. Taxas transparentes. Custódia institucional. Capital em risco.\",\"footer.platform\":\"Plataforma\",\"footer.platform.createAccount\":\"Criar conta\",\"footer.platform.login\":\"Entrar\",\"footer.platform.plans\":\"Planos de investimento\",\"footer.platform.virtualCard\":\"Cartão virtual\",\"footer.platform.faq\":\"FAQ\",\"footer.legal\":\"Legal e conformidade\",\"footer.legal.terms\":\"Termos de serviço\",\"footer.legal.privacy\":\"Política de privacidade\",\"footer.legal.risk\":\"Divulgação de riscos\",\"footer.legal.disclaimer\":\"Aviso legal\",\"footer.legal.compliance\":\"Conformidade\",\"footer.support\":\"Suporte\",\"footer.support.about\":\"Sobre\",\"footer.support.contact\":\"Contacto\",\"footer.support.blog\":\"Blog\",\"footer.support.security\":\"Segurança\",\"footer.support.status\":\"Estado\",\"footer.copyright\":\"© {year} WolvCapital, Inc. Todos os direitos reservados.\",\"footer.badge.fincen\":\"🔒 FinCEN MSB Registado\",\"footer.badge.ssl\":\"🔐 Encriptação SSL de 256 bits\",\"footer.badge.pci\":\"✓ Conforme PCI-DSS\",\"howitworks.eyebrow\":\"Processo\",\"howitworks.title\":\"Como funciona a WolvCapital\",\"howitworks.description\":\"O nosso processo simplificado garante segurança, transparência e conformidade em cada etapa.\",\"howitworks.step1.title\":\"Criar conta\",\"howitworks.step1.description\":\"Registe-se e complete a verificação completa de identidade KYC de acordo com os requisitos regulamentares dos EUA.\",\"howitworks.step2.title\":\"Escolher portfólio\",\"howitworks.step2.description\":\"Selecione um nível de portfólio gerido que corresponda à sua tolerância ao risco e horizonte de investimento. Reveja primeiro as taxas.\",\"howitworks.step3.title\":\"Depositar fundos\",\"howitworks.step3.description\":\"Os fundos são mantidos com um custodiante institucional licenciado. Todos os depósitos estão sujeitos à revisão de conformidade AML.\",\"howitworks.step4.title\":\"Acompanhar desempenho\",\"howitworks.step4.description\":\"Monitorize o seu portfólio através de um painel em tempo real. Extratos mensais auditados são fornecidos a todos os investidores.\",\"howitworks.cta\":\"Saiba mais sobre o nosso processo\",\"plans.eyebrow\":\"Níveis de investimento\",\"plans.title\":\"Escolha o seu plano de portfólio\",\"plans.subtitle\":\"Cada nível reflete uma estratégia de risco e estrutura de taxas distintas — não uma promessa de rendimento. Todas as taxas são divulgadas integralmente antes da ativação da conta.\",\"plans.minimum\":\"Mínimo:\",\"plans.button.review\":\"Rever\",\"plans.button.getStarted\":\"Começar\",\"plans.disclaimer\":\"Os ativos digitais são especulativos. Pode perder parte ou a totalidade do capital investido.\",\"plans.feeDisclosure\":\"As taxas de gestão são cobradas como percentagem do AUM, deduzidas mensalmente. As taxas de desempenho aplicam-se apenas sobre os ganhos que excedam o benchmark acordado. Não são oferecidos rendimentos garantidos. Todas as taxas são divulgadas por escrito antes da ativação da conta.\",\"plans.feeDisclosure.label\":\"Divulgação de taxas:\",\"regulated.title\":\"Regulamentado e conforme\",\"regulated.subtitle\":\"A WolvCapital opera segundo rigorosas normas de conformidade para proteger o capital dos investidores e garantir a transparência.\",\"regulated.kyc.title\":\"KYC verificado\",\"regulated.kyc.description\":\"Todos os investidores são submetidos a verificação completa de identidade antes da ativação da conta, garantindo conformidade regulamentar e proteção dos investidores.\",\"regulated.aml.title\":\"Conforme AML\",\"regulated.aml.description\":\"Sistemas avançados de combate ao branqueamento de capitais monitorizam todas as transações em tempo real, identificando e prevenindo atividades suspeitas com respeito pela privacidade dos clientes.\",\"regulated.encryption.title\":\"Encriptação de dados\",\"regulated.encryption.description\":\"A encriptação SSL/TLS de grau militar protege todas as comunicações e dados financeiros, protegida com autenticação multifator.\",\"regulated.standards.title\":\"Normas de segurança\",\"regulated.standard.2fa\":\"Autenticação de dois fatores\",\"regulated.standard.ssl\":\"Encriptação SSL\",\"regulated.standard.monitoring\":\"Monitorização de fraude\",\"regulated.standard.pci\":\"Certificado Nível 1\",\"riskbar.title\":\"Divulgação importante\",\"riskbar.body\":\"Todos os investimentos acarretam riscos, incluindo a potencial perda de capital. O desempenho passado não garante resultados futuros. Os investimentos em ativos digitais são altamente voláteis e não adequados para todos os investidores. A WolvCapital não é um banco e não oferece seguro FDIC ou SIPC. Invista apenas capital que pode perder completamente. Por favor reveja a nossa\",\"riskbar.riskDisclosure\":\"Divulgação de riscos\",\"riskbar.and\":\"e\",\"riskbar.terms\":\"Termos de serviço\",\"riskbar.before\":\"antes de investir.\",\"riskbar.cta\":\"Ler divulgação completa\",\"stats.eyebrow\":\"Métricas da plataforma — Auditoria de terceiros pendente\",\"stats.body\":\"As métricas auditadas da plataforma serão publicadas após a conclusão da nossa auditoria independente de terceiros. Previsto para o T3 de 2026.\",\"stats.supporting\":\"O nosso compromisso com a transparência inclui a verificação independente de todas as métricas da plataforma. Volte para estatísticas detalhadas e relatórios de auditoria.\",\"stats.link\":\"Ver o nosso quadro de conformidade\",\"virtualcard.eyebrow\":\"Cartão virtual\",\"virtualcard.title\":\"Pague faturas diretamente a partir do seu painel\",\"virtualcard.subtitle\":\"Assim que a sua conta estiver verificada por KYC e ativada, pode solicitar um cartão Visa virtual WolvCapital ligado diretamente ao saldo do seu portfólio. Use-o para pagar subscrições, comprar online ou ligar ao Apple Pay e Google Pay.\",\"virtualcard.disclaimer\":\"O cartão virtual WolvCapital está atualmente disponível apenas para residentes verificados de países suportados. Uma lista completa de países suportados está disponível na ativação.\",\"virtualcard.cta\":\"Ativar o seu cartão →\",\"virtualcard.feature.1\":\"Cartão virtual emitido instantaneamente na aprovação KYC\",\"virtualcard.feature.2\":\"Pague Netflix, Spotify, Apple, Amazon e mais de 100 comerciantes\",\"virtualcard.feature.3\":\"Ligue às carteiras Apple Pay e Google Pay\",\"virtualcard.feature.4\":\"Defina limites de despesa personalizados por categoria de comerciante\",\"virtualcard.feature.5\":\"Notificações de transações em tempo real e acompanhamento no painel\",\"virtualcard.feature.6\":\"Congele ou descongele instantaneamente a partir da aplicação\",\"virtualcard.feature.7\":\"Cartão físico disponível para contas verificadas elegíveis\"}"));}),
"[project]/src/i18n/ru.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"nav.home\":\"Главная\",\"nav.plans\":\"Планы\",\"nav.about\":\"О нас\",\"nav.blog\":\"Блог\",\"nav.contact\":\"Контакты\",\"nav.login\":\"Войти\",\"nav.signup\":\"Регистрация\",\"nav.virtualCard\":\"Виртуальная карта\",\"nav.compliance\":\"Соответствие\",\"hero.eyebrow\":\"Институциональное управление цифровыми активами\",\"hero.title\":\"Управляемые портфели криптовалют с прозрачными комиссиями и профессиональным хранением.\",\"hero.subtitle\":\"WolvCapital сочетает верификацию KYC, институциональное хранение и проверенные стратегии цифровых активов. Капитал подвергается риску, доходность не гарантирована.\",\"hero.button.viewPlans\":\"Посмотреть планы\",\"hero.button.openAccount\":\"Открыть счёт\",\"hero.badge.encryption\":\"256-битное шифрование\",\"hero.badge.custody\":\"Институциональное хранение\",\"hero.badge.fincen\":\"Зарегистрированный MSB FinCEN\",\"hero.welcome\":\"Добро пожаловать в WolvCapital\",\"security.title\":\"Безопасность и соответствие\",\"security.eyebrow\":\"Безопасность\",\"security.description\":\"Корпоративные средства контроля, активный мониторинг угроз и хранение с приоритетом соответствия.\",\"security.standards.heading\":\"Стандарты безопасности\",\"security.feature.kyc.title\":\"Верификация KYC\",\"security.feature.kyc.description\":\"Все инвесторы должны пройти проверку личности перед пополнением счёта.\",\"security.feature.aml.title\":\"Проверка AML\",\"security.feature.aml.description\":\"Непрерывная проверка транзакций по глобальным спискам наблюдения.\",\"security.feature.ssl.title\":\"Шифрование SSL\",\"security.feature.ssl.description\":\"Банковское шифрование для каждой сессии пользователя.\",\"security.feature.2fa.title\":\"Двухфакторная аутентификация\",\"security.feature.2fa.description\":\"Дополнительная 2FA для защиты доступа к счёту и вывода средств.\",\"security.feature.monitoring.title\":\"Мониторинг в реальном времени\",\"security.feature.monitoring.description\":\"Круглосуточный мониторинг рисков с автоматическими оповещениями.\",\"security.feature.pci.title\":\"Соответствие PCI-DSS\",\"security.feature.pci.description\":\"Наши платёжные процессы разработаны по стандартам PCI-DSS.\",\"security.standard.2fa\":\"Дополнительная 2FA\",\"security.standard.ssl\":\"256-битный SSL\",\"security.standard.monitoring\":\"Мониторинг мошенничества в реальном времени\",\"security.standard.pci\":\"Соответствие PCI-DSS\",\"security.cta\":\"Ознакомиться с нашими практиками безопасности\",\"contact.title\":\"Свяжитесь с нами\",\"contact.locationHeading\":\"Наш зарегистрированный офис\",\"contact.location\":\"Соединённые Штаты\",\"contact.contactInformationHeading\":\"Контактная информация\",\"contact.emailSupportHeading\":\"Поддержка по электронной почте\",\"contact.email\":\"support@wolvcapital.com\",\"contact.emailSupportResponse\":\"Обычно мы отвечаем в течение 24 часов.\",\"contact.businessHoursHeading\":\"Часы работы\",\"contact.businessHoursValue\":\"Поддержка 24/7\",\"contact.businessHoursNote\":\"Круглосуточная помощь по всем вашим вопросам.\",\"contact.liveChatHeading\":\"Онлайн-чат\",\"contact.liveChatValue\":\"Доступен для владельцев аккаунтов\",\"contact.liveChatNote\":\"Войдите, чтобы получить доступ к поддержке через чат.\",\"contact.faqHeading\":\"Часто задаваемые вопросы\",\"contact.faqIntro\":\"Прежде чем обращаться к нам, возможно, вы найдёте ответы в разделе FAQ.\",\"contact.faqLink\":\"Перейти к FAQ\",\"contact.formHeading\":\"Отправьте нам сообщение\",\"contact.form.name\":\"Полное имя\",\"contact.form.email\":\"Адрес электронной почты\",\"contact.form.subject\":\"Тема\",\"contact.form.message\":\"Сообщение\",\"contact.form.submit\":\"Отправить сообщение\",\"contact.form.requiredNote\":\"* Все поля обязательны. Мы ответим в течение 24 часов.\",\"contact.mapAlt\":\"Зарегистрированный офис WolvCapital — 516 High St, Palo Alto, CA 94301, США (наложение)\",\"compliance.eyebrow\":\"Обзор соответствия\",\"compliance.title\":\"Что это значит для вас\",\"compliance.description\":\"WolvCapital сочетает институциональное соответствие, прозрачные раскрытия и лицензированное хранение, чтобы предоставить инвесторам чёткую профессиональную основу для инвестирования в цифровые активы.\",\"compliance.card.subtitle\":\"Безопасно, проверено и прозрачно\",\"compliance.card.title\":\"Система, ориентированная на соответствие, созданная для доверия инвесторов\",\"compliance.card.body\":\"Каждый шаг нашего процесса адаптации и инвестирования разработан для соответствия институциональным стандартам, сохраняя вас в курсе и под защитой.\",\"compliance.card.readMore\":\"Читать далее\",\"compliance.benefit.1\":\"Личность проверяется до принятия средств\",\"compliance.benefit.2\":\"Средства хранятся лицензированным институциональным хранителем — не напрямую WolvCapital\",\"compliance.benefit.3\":\"Все комиссии раскрываются в письменной форме до инвестирования\",\"compliance.benefit.4\":\"Никаких гарантированных или обещанных инвестиционных доходов\",\"compliance.benefit.5\":\"Предоставляются ежемесячные проверенные отчёты о производительности\",\"compliance.benefit.6\":\"Условия вывода средств раскрываются заранее — никаких скрытых блокировок\",\"compliance.benefit.7\":\"Все транзакции проверяются нашей командой по соответствию\",\"cta.title\":\"Начните заявку\",\"cta.subtitle\":\"Открытие счёта подлежит верификации KYC, проверке права на участие и применимым нормативным требованиям.\",\"cta.field.fullName\":\"Полное юридическое имя\",\"cta.field.fullName.placeholder\":\"Иван Иванов\",\"cta.field.fullName.hint\":\"Используется для верификации личности и записей счёта.\",\"cta.field.email\":\"Адрес электронной почты\",\"cta.field.email.placeholder\":\"ivan.ivanov@primer.com\",\"cta.field.email.hint\":\"Мы отправим подтверждение вашего счёта на этот адрес.\",\"cta.field.country\":\"Страна проживания\",\"cta.field.country.placeholder\":\"Выберите вашу страну\",\"cta.field.country.hint\":\"Используется для проверки нормативного права на участие.\",\"cta.field.amount\":\"Сумма инвестиций (USD)\",\"cta.field.amount.placeholder\":\"$5 000\",\"cta.field.amount.hint\":\"Это предварительная сумма для вашей заявки.\",\"cta.button\":\"Открыть счёт\",\"cta.disclaimer\":\"Цифровые активы носят спекулятивный характер. Вы можете потерять часть или весь инвестированный капитал.\",\"faq.eyebrow\":\"Поддержка\",\"faq.title\":\"Часто задаваемые вопросы\",\"faq.subtitle\":\"Получите ответы на распространённые вопросы об инвестировании с WolvCapital.\",\"faq.viewAll\":\"Посмотреть все FAQ →\",\"faq.q1\":\"Как WolvCapital генерирует доходы для инвесторов?\",\"faq.a1\":\"WolvCapital управляет диверсифицированными портфелями цифровых активов за счёт роста цен, доходности стейкинга и стратегий ликвидности DeFi. Доходность полностью зависит от рынка и не гарантирована. Мы взимаем комиссию за управление вне зависимости от результатов и комиссию за производительность только с доходов, превышающих согласованный ориентир.\",\"faq.q2\":\"Регулируется ли WolvCapital?\",\"faq.a2\":\"WolvCapital работает в соответствии со стандартами соответствия KYC, AML и PCI-DSS и имеет регистрацию FinCEN Money Services Business. Посетите sec.gov или свяжитесь с legal@wolvcapital.com для получения подробной нормативной документации.\",\"faq.q3\":\"Гарантирована ли моя доходность?\",\"faq.a3\":\"Нет. WolvCapital не гарантирует никакой инвестиционной доходности. Цифровые активы крайне волатильны и носят спекулятивный характер. Стоимость вашего портфеля может значительно снизиться, и вы можете потерять часть или весь капитал. Прошлые результаты не указывают на будущие.\",\"faq.q4\":\"Как и когда я могу вывести средства?\",\"faq.a4\":\"Условия вывода варьируются в зависимости от плана: Pioneer (90 дней), Vanguard (150 дней), Horizon (180 дней) и Summit (365 дней). Средства заблокированы на срок контракта. По истечении срока вы можете запросить вывод, и средства возвращаются в течение 5 рабочих дней.\",\"faq.q5\":\"Каковы сроки и комиссии за выход?\",\"faq.a5\":\"Каждый план имеет минимальный период удержания. Pioneer 90 дней, Vanguard 150 дней, Horizon 180 дней, Summit 365 дней. Досрочный вывод влечёт комиссию за выход (Pioneer 2%, Vanguard 2,5%, Horizon 3%, Summit 3,5%), которая вычитается из вашего капитала.\",\"faq.q6\":\"Кто хранит мои активы?\",\"faq.a6\":\"Активы клиентов хранятся в Coinbase Custody, лицензированном институциональном хранителе цифровых активов. Ваши средства отделены от активов компании WolvCapital и защищены в случае любых операционных проблем с нашей стороны.\",\"faq.q7\":\"Каковы комиссии?\",\"faq.a7\":\"Комиссии за управление варьируются от 1 до 2% AUM в год (Pioneer 1%, Vanguard 1,25%, Horizon 1,5%, Summit 2%), взимаются ежемесячно. Комиссии за производительность 20% применяются только к доходам, превышающим Bloomberg Crypto Index. Никаких скрытых комиссий нет.\",\"faq.q8\":\"Каким странам служит WolvCapital?\",\"faq.a8\":\"WolvCapital поддерживает инвесторов из 120+ стран в соответствии с местными правовыми требованиями. Жители юрисдикций под санкциями OFAC не имеют права. Услуги виртуальных карт доступны в США, Великобритании, ЕС и отдельных азиатских рынках.\",\"faq.q9\":\"Как обрабатываются налоги?\",\"faq.a9\":\"WolvCapital ежеквартально формирует налоговые отчёты (форма K-1 для инвесторов из США) с деталями реализованных доходов, убытков и дохода от стейкинга. Вы несёте ответственность за подачу и уплату налогов в соответствии с местным налоговым законодательством.\",\"faq.q10\":\"Что произойдёт с моими средствами, если WolvCapital закроется?\",\"faq.a10\":\"Ваши активы хранятся в Coinbase Custody и отделены от активов компании WolvCapital. В случае любых операционных проблем WolvCapital ваши средства остаются под защитой хранителя. Права на вывод сохраняются и исполняются в соответствии с вашим договором хранения.\",\"faq.q11\":\"Как рассчитывается ориентир производительности?\",\"faq.a11\":\"Комиссии за производительность рассчитываются относительно Bloomberg Crypto Index — корзины основных криптовалют, взвешенной по рыночной капитализации. Для индивидуальных планов (Summit) ориентир согласовывается отдельно. Расчёты ежеквартально проверяются Deloitte LLP.\",\"footer.brand.description\":\"Регулируемое управление портфелями цифровых активов. Прозрачные комиссии. Институциональное хранение. Капитал под риском.\",\"footer.platform\":\"Платформа\",\"footer.platform.createAccount\":\"Создать счёт\",\"footer.platform.login\":\"Войти\",\"footer.platform.plans\":\"Инвестиционные планы\",\"footer.platform.virtualCard\":\"Виртуальная карта\",\"footer.platform.faq\":\"FAQ\",\"footer.legal\":\"Правовые вопросы и соответствие\",\"footer.legal.terms\":\"Условия обслуживания\",\"footer.legal.privacy\":\"Политика конфиденциальности\",\"footer.legal.risk\":\"Раскрытие рисков\",\"footer.legal.disclaimer\":\"Правовая оговорка\",\"footer.legal.compliance\":\"Соответствие\",\"footer.support\":\"Поддержка\",\"footer.support.about\":\"О нас\",\"footer.support.contact\":\"Контакты\",\"footer.support.blog\":\"Блог\",\"footer.support.security\":\"Безопасность\",\"footer.support.status\":\"Статус\",\"footer.copyright\":\"© {year} WolvCapital, Inc. Все права защищены.\",\"footer.badge.fincen\":\"🔒 FinCEN MSB Зарегистрирован\",\"footer.badge.ssl\":\"🔐 256-битное SSL-шифрование\",\"footer.badge.pci\":\"✓ Соответствие PCI-DSS\",\"howitworks.eyebrow\":\"Процесс\",\"howitworks.title\":\"Как работает WolvCapital\",\"howitworks.description\":\"Наш оптимизированный процесс обеспечивает безопасность, прозрачность и соответствие на каждом этапе.\",\"howitworks.step1.title\":\"Создать счёт\",\"howitworks.step1.description\":\"Зарегистрируйтесь и пройдите полную верификацию личности KYC в соответствии с нормативными требованиями США.\",\"howitworks.step2.title\":\"Выбрать портфель\",\"howitworks.step2.description\":\"Выберите управляемый уровень портфеля, соответствующий вашей толерантности к риску и инвестиционному горизонту. Сначала ознакомьтесь с комиссиями.\",\"howitworks.step3.title\":\"Внести средства\",\"howitworks.step3.description\":\"Средства хранятся у лицензированного институционального хранителя. Все депозиты проходят проверку на соответствие AML.\",\"howitworks.step4.title\":\"Отслеживать результаты\",\"howitworks.step4.description\":\"Отслеживайте свой портфель через панель управления в реальном времени. Всем инвесторам предоставляются ежемесячные проверенные отчёты.\",\"howitworks.cta\":\"Узнайте больше о нашем процессе\",\"plans.eyebrow\":\"Инвестиционные уровни\",\"plans.title\":\"Выберите план портфеля\",\"plans.subtitle\":\"Каждый уровень отражает отдельную стратегию риска и структуру комиссий — не обещание доходности. Все комиссии полностью раскрываются до активации счёта.\",\"plans.minimum\":\"Минимум:\",\"plans.button.review\":\"Просмотреть\",\"plans.button.getStarted\":\"Начать\",\"plans.disclaimer\":\"Цифровые активы носят спекулятивный характер. Вы можете потерять часть или весь инвестированный капитал.\",\"plans.feeDisclosure\":\"Комиссии за управление взимаются как процент от AUM, вычитаются ежемесячно. Комиссии за производительность применяются только к доходам, превышающим согласованный ориентир. Гарантированная доходность не предлагается. Все комиссии раскрываются в письменной форме до активации счёта.\",\"plans.feeDisclosure.label\":\"Раскрытие комиссий:\",\"regulated.title\":\"Регулируемый и соответствующий\",\"regulated.subtitle\":\"WolvCapital работает в соответствии со строгими стандартами соответствия для защиты капитала инвесторов и обеспечения прозрачности.\",\"regulated.kyc.title\":\"KYC верифицирован\",\"regulated.kyc.description\":\"Все инвесторы проходят всестороннюю верификацию личности до активации счёта, обеспечивая нормативное соответствие и защиту инвесторов.\",\"regulated.aml.title\":\"Соответствие AML\",\"regulated.aml.description\":\"Передовые системы по противодействию отмыванию денег отслеживают все транзакции в реальном времени, выявляя и предотвращая подозрительную активность при сохранении конфиденциальности клиентов.\",\"regulated.encryption.title\":\"Шифрование данных\",\"regulated.encryption.description\":\"Военное шифрование SSL/TLS защищает все коммуникации и финансовые данные, защищённые многофакторной аутентификацией.\",\"regulated.standards.title\":\"Стандарты безопасности\",\"regulated.standard.2fa\":\"Двухфакторная аутентификация\",\"regulated.standard.ssl\":\"Шифрование SSL\",\"regulated.standard.monitoring\":\"Мониторинг мошенничества\",\"regulated.standard.pci\":\"Сертификат уровня 1\",\"riskbar.title\":\"Важное раскрытие\",\"riskbar.body\":\"Все инвестиции несут риски, включая возможную потерю основного капитала. Прошлые результаты не гарантируют будущих. Инвестиции в цифровые активы крайне волатильны и подходят не всем инвесторам. WolvCapital не является банком и не предлагает страхование FDIC или SIPC. Инвестируйте только тот капитал, который вы можете позволить себе потерять полностью. Пожалуйста, ознакомьтесь с нашим\",\"riskbar.riskDisclosure\":\"Раскрытием рисков\",\"riskbar.and\":\"и\",\"riskbar.terms\":\"Условиями обслуживания\",\"riskbar.before\":\"перед инвестированием.\",\"riskbar.cta\":\"Читать полное раскрытие\",\"stats.eyebrow\":\"Метрики платформы — Ожидание стороннего аудита\",\"stats.body\":\"Проверенные метрики платформы будут опубликованы после завершения независимого стороннего аудита. Ожидается в 3-м квартале 2026 года.\",\"stats.supporting\":\"Наша приверженность прозрачности включает независимую проверку всех метрик платформы. Заходите позже для подробных статистических данных и отчётов об аудите.\",\"stats.link\":\"Просмотреть нашу систему соответствия\",\"virtualcard.eyebrow\":\"Виртуальная карта\",\"virtualcard.title\":\"Оплачивайте счета прямо с панели управления\",\"virtualcard.subtitle\":\"После верификации KYC и активации счёта вы можете запросить виртуальную карту Visa WolvCapital, привязанную напрямую к балансу вашего портфеля. Используйте её для оплаты подписок, онлайн-покупок или подключения к Apple Pay и Google Pay.\",\"virtualcard.disclaimer\":\"Виртуальная карта WolvCapital в настоящее время доступна только для верифицированных жителей поддерживаемых стран. Полный список поддерживаемых стран доступен при активации.\",\"virtualcard.cta\":\"Активировать карту →\",\"virtualcard.feature.1\":\"Виртуальная карта выдаётся мгновенно при одобрении KYC\",\"virtualcard.feature.2\":\"Оплачивайте Netflix, Spotify, Apple, Amazon и 100+ магазинов\",\"virtualcard.feature.3\":\"Подключайтесь к кошелькам Apple Pay и Google Pay\",\"virtualcard.feature.4\":\"Устанавливайте индивидуальные лимиты расходов по категориям\",\"virtualcard.feature.5\":\"Уведомления о транзакциях в реальном времени и отслеживание в панели\",\"virtualcard.feature.6\":\"Мгновенная блокировка или разблокировка из приложения\",\"virtualcard.feature.7\":\"Физическая карта доступна для соответствующих верифицированных счетов\"}"));}),
"[project]/src/i18n/no.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"nav.home\":\"Hjem\",\"nav.plans\":\"Planer\",\"nav.about\":\"Om oss\",\"nav.blog\":\"Blogg\",\"nav.contact\":\"Kontakt\",\"nav.login\":\"Logg inn\",\"nav.signup\":\"Registrer deg\",\"nav.virtualCard\":\"Virtuelt kort\",\"nav.compliance\":\"Samsvar\",\"hero.eyebrow\":\"Institusjonell forvaltning av digitale eiendeler\",\"hero.title\":\"Forvaltede kryptovalutaporteføljer med transparente gebyrer og profesjonell forvaring.\",\"hero.subtitle\":\"WolvCapital kombinerer KYC-verifisert onboarding, institusjonell forvaring og reviderte strategier for digitale eiendeler. Kapitalen er i risiko og avkastningen er ikke garantert.\",\"hero.button.viewPlans\":\"Se planer\",\"hero.button.openAccount\":\"Åpne konto\",\"hero.badge.encryption\":\"256-bit kryptering\",\"hero.badge.custody\":\"Institusjonell forvaring\",\"hero.badge.fincen\":\"FinCEN-registrert MSB\",\"hero.welcome\":\"Velkommen til WolvCapital\",\"security.title\":\"Sikkerhet og samsvar\",\"security.eyebrow\":\"Sikkerhet\",\"security.description\":\"Bedriftsnivå kontroller, aktiv trusselovervåkning og samsvarsforankret forvaring.\",\"security.standards.heading\":\"Sikkerhetsstandarder\",\"security.feature.kyc.title\":\"KYC-verifisering\",\"security.feature.kyc.description\":\"Alle investorer må bestå identitetskontroller før finansiering.\",\"security.feature.aml.title\":\"AML-screening\",\"security.feature.aml.description\":\"Kontinuerlig transaksjonsskanning mot globale overvåkningslister.\",\"security.feature.ssl.title\":\"SSL-kryptering\",\"security.feature.ssl.description\":\"Banknivå kryptering for hver brøkterøkt.\",\"security.feature.2fa.title\":\"Tofaktorautentisering\",\"security.feature.2fa.description\":\"Valgfri 2FA for å beskytte kontotilgang og uttak.\",\"security.feature.monitoring.title\":\"Overvåkning i sanntid\",\"security.feature.monitoring.description\":\"24/7 risikoovervåkning med automatiske varsler.\",\"security.feature.pci.title\":\"PCI-DSS-samsvar\",\"security.feature.pci.description\":\"Betalingsarbeidsflytene våre er utformet etter PCI-DSS-standarder.\",\"security.standard.2fa\":\"Valgfri 2FA\",\"security.standard.ssl\":\"256-bit SSL\",\"security.standard.monitoring\":\"Sanntids svindelovervåkning\",\"security.standard.pci\":\"PCI-DSS-kompatibel\",\"security.cta\":\"Gjennomgå våre sikkerhetspraksiser\",\"contact.title\":\"Ta kontakt\",\"contact.locationHeading\":\"Vårt registrerte kontor\",\"contact.location\":\"USA\",\"contact.contactInformationHeading\":\"Kontaktinformasjon\",\"contact.emailSupportHeading\":\"E-poststøtte\",\"contact.email\":\"support@wolvcapital.com\",\"contact.emailSupportResponse\":\"Vi svarer vanligvis innen 24 timer.\",\"contact.businessHoursHeading\":\"Åpningstider\",\"contact.businessHoursValue\":\"24/7 støtte tilgjengelig\",\"contact.businessHoursNote\":\"Kontinuerlig hjelp for alle dine behov.\",\"contact.liveChatHeading\":\"Live chat\",\"contact.liveChatValue\":\"Tilgjengelig for kontoholdere\",\"contact.liveChatNote\":\"Logg inn for å få tilgang til live chat-støtte.\",\"contact.faqHeading\":\"Ofte stilte spørsmål\",\"contact.faqIntro\":\"Før du kontakter oss, kan du finne svar i FAQ-seksjonen vår.\",\"contact.faqLink\":\"Se FAQ\",\"contact.formHeading\":\"Send oss en melding\",\"contact.form.name\":\"Fullt navn\",\"contact.form.email\":\"E-postadresse\",\"contact.form.subject\":\"Emne\",\"contact.form.message\":\"Melding\",\"contact.form.submit\":\"Send melding\",\"contact.form.requiredNote\":\"* Alle felt er obligatoriske. Vi svarer innen 24 timer.\",\"contact.mapAlt\":\"WolvCapitals registrerte kontor — 516 High St, Palo Alto, CA 94301, USA (overlegg)\",\"compliance.eyebrow\":\"Samsvarsoversikt\",\"compliance.title\":\"Hva dette betyr for deg\",\"compliance.description\":\"WolvCapital kombinerer institusjonelt samsvar, transparente avsløringer og lisensiert forvaring for å gi investorer et klart, profesjonelt grunnlag for investering i digitale eiendeler.\",\"compliance.card.subtitle\":\"Sikkert, revidert og transparent\",\"compliance.card.title\":\"Et samsvarsforankret rammeverk bygget for investortillit\",\"compliance.card.body\":\"Hvert trinn i vår onboarding- og investeringsprosess er utformet for å møte institusjonelle standarder mens vi holder deg informert og beskyttet.\",\"compliance.card.readMore\":\"Les mer\",\"compliance.benefit.1\":\"Identitet verifisert før midler aksepteres\",\"compliance.benefit.2\":\"Midler oppbevart av en lisensiert institusjonell forvalter — ikke WolvCapital direkte\",\"compliance.benefit.3\":\"Alle gebyrer avslørt skriftlig før du investerer\",\"compliance.benefit.4\":\"Ingen garantert eller lovet investeringsavkastning\",\"compliance.benefit.5\":\"Reviderte månedlige ytelsesrapporter levert\",\"compliance.benefit.6\":\"Uttaksvilkår avslørt på forhånd — ingen skjulte låsinger\",\"compliance.benefit.7\":\"Alle transaksjoner gjennomgått av samsvarsTeamet vårt\",\"cta.title\":\"Start søknaden din\",\"cta.subtitle\":\"Kontoåpning er underlagt KYC-verifisering, egnethetsgjennomgang og gjeldende regulatoriske krav.\",\"cta.field.fullName\":\"Fullt juridisk navn\",\"cta.field.fullName.placeholder\":\"Ola Nordmann\",\"cta.field.fullName.hint\":\"Brukes til identitetsverifisering og kontoregistre.\",\"cta.field.email\":\"E-postadresse\",\"cta.field.email.placeholder\":\"ola.nordmann@eksempel.no\",\"cta.field.email.hint\":\"Vi sender kontobekreftelsen din til denne adressen.\",\"cta.field.country\":\"Bostedsland\",\"cta.field.country.placeholder\":\"Velg landet ditt\",\"cta.field.country.hint\":\"Brukes til regulatorisk egnethetsscreening.\",\"cta.field.amount\":\"Investeringsbeløp (USD)\",\"cta.field.amount.placeholder\":\"$5 000\",\"cta.field.amount.hint\":\"Dette er et foreløpig beløp for søknaden din.\",\"cta.button\":\"Åpne konto\",\"cta.disclaimer\":\"Digitale eiendeler er spekulative. Du kan miste noe eller all investert kapital.\",\"faq.eyebrow\":\"Støtte\",\"faq.title\":\"Ofte stilte spørsmål\",\"faq.subtitle\":\"Få svar på vanlige spørsmål om investering med WolvCapital.\",\"faq.viewAll\":\"Se alle FAQ →\",\"faq.q1\":\"Hvordan genererer WolvCapital avkastning for investorer?\",\"faq.a1\":\"WolvCapital forvalter diversifiserte porteføljer av digitale eiendeler gjennom prisstigning, staking-avkastning og DeFi-likviditetsstrategier. Avkastningen er helt markedsavhengig og ikke garantert. Vi tar et forvaltningsgebyr uavhengig av ytelse, og et ytelsesgebyr kun på gevinster over avtalt referanseindeks.\",\"faq.q2\":\"Er WolvCapital regulert?\",\"faq.a2\":\"WolvCapital opererer under KYC-, AML- og PCI-DSS-samsvarsstandarder og har FinCEN Money Services Business-registrering. Besøk sec.gov eller kontakt legal@wolvcapital.com for detaljert regulatorisk dokumentasjon.\",\"faq.q3\":\"Er avkastningen min garantert?\",\"faq.a3\":\"Nei. WolvCapital garanterer ingen investeringsavkastning. Digitale eiendeler er svært volatile og spekulative. Verdien av porteføljen din kan falle betydelig og du kan miste noe eller all kapital. Historisk ytelse indikerer ikke fremtidige resultater.\",\"faq.q4\":\"Hvordan og når kan jeg ta ut?\",\"faq.a4\":\"Uttaksvilkår varierer etter plan: Pioneer (90 dager), Vanguard (150 dager), Horizon (180 dager) og Summit (365 dager). Midler er låst i kontraktsperioden. Når perioden er over, kan du be om uttak og midler returneres innen 5 virkedager.\",\"faq.q5\":\"Hva er løpetider og utgangsgebyrer?\",\"faq.a5\":\"Hver plan har en minimumsoppholdstid. Pioneer 90 dager, Vanguard 150 dager, Horizon 180 dager, Summit 365 dager. Tidlige uttak medfører et utgangsgebyr (Pioneer 2%, Vanguard 2,5%, Horizon 3%, Summit 3,5%), som trekkes fra kapitalen din.\",\"faq.q6\":\"Hvem holder mine eiendeler?\",\"faq.a6\":\"Kundeeiendeler holdes av Coinbase Custody, en lisensiert institusjonell forvalter av digitale eiendeler. Midlene dine er adskilt fra WolvCapitals selskapsmidler og beskyttet i tilfelle operasjonelle problemer fra vår side.\",\"faq.q7\":\"Hva er gebyrene?\",\"faq.a7\":\"Forvaltningsgebyrer varierer fra 1 til 2% av AUM årlig (Pioneer 1%, Vanguard 1,25%, Horizon 1,5%, Summit 2%), belastet månedlig. Ytelsesgebyrer på 20% gjelder kun for gevinster over Bloomberg Crypto Index. Det er ingen skjulte gebyrer.\",\"faq.q8\":\"Hvilke land betjener WolvCapital?\",\"faq.a8\":\"WolvCapital støtter investorer fra 120+ land, underlagt lokale juridiske krav. Innbyggere i OFAC-sanksjonerte jurisdiksjoner er ikke kvalifisert. Virtuelle korttjenester er tilgjengelige i USA, Storbritannia, EU og utvalgte asiatiske markeder.\",\"faq.q9\":\"Hvordan håndteres skatter?\",\"faq.a9\":\"WolvCapital genererer kvartalsvise skatterapporter (K-1-skjemaer for amerikanske investorer) med detaljer om realiserte gevinster, tap og staking-inntekter. Du er ansvarlig for å inngi og betale skatter på gevinstene dine i henhold til lokale skattelover.\",\"faq.q10\":\"Hva skjer med midlene mine hvis WolvCapital stenger?\",\"faq.a10\":\"Eiendelene dine holdes av Coinbase Custody og er adskilt fra WolvCapitals selskapsmidler. I tilfelle operasjonelle problemer hos WolvCapital, forblir midlene dine beskyttet hos forvalteren. Uttaksrettigheter bevares og håndheves gjennom forvaltningsavtalen din.\",\"faq.q11\":\"Hvordan beregnes ytelsesreferansen?\",\"faq.a11\":\"Ytelsesgebyrer beregnes mot Bloomberg Crypto Index, en markedsverdi-vektet kurv av store kryptovalutaer. For tilpassede planer (Summit) forhandles referansen individuelt. Beregningene revideres kvartalsvis av Deloitte LLP.\",\"footer.brand.description\":\"Regulert forvaltning av digitale eiendelporteføljer. Transparente gebyrer. Institusjonell forvaring. Kapital i risiko.\",\"footer.platform\":\"Plattform\",\"footer.platform.createAccount\":\"Opprett konto\",\"footer.platform.login\":\"Logg inn\",\"footer.platform.plans\":\"Investeringsplaner\",\"footer.platform.virtualCard\":\"Virtuelt kort\",\"footer.platform.faq\":\"FAQ\",\"footer.legal\":\"Juridisk og samsvar\",\"footer.legal.terms\":\"Tjenestevilkår\",\"footer.legal.privacy\":\"Personvernregler\",\"footer.legal.risk\":\"Risikoavsløring\",\"footer.legal.disclaimer\":\"Juridisk ansvarsfraskrivelse\",\"footer.legal.compliance\":\"Samsvar\",\"footer.support\":\"Støtte\",\"footer.support.about\":\"Om oss\",\"footer.support.contact\":\"Kontakt\",\"footer.support.blog\":\"Blogg\",\"footer.support.security\":\"Sikkerhet\",\"footer.support.status\":\"Status\",\"footer.copyright\":\"© {year} WolvCapital, Inc. Alle rettigheter forbeholdt.\",\"footer.badge.fincen\":\"🔒 FinCEN MSB Registrert\",\"footer.badge.ssl\":\"🔐 256-bit SSL-kryptering\",\"footer.badge.pci\":\"✓ PCI-DSS-kompatibel\",\"howitworks.eyebrow\":\"Prosess\",\"howitworks.title\":\"Slik fungerer WolvCapital\",\"howitworks.description\":\"Vår strømlinjeformede prosess sikrer sikkerhet, transparens og samsvar i hvert trinn.\",\"howitworks.step1.title\":\"Opprett konto\",\"howitworks.step1.description\":\"Registrer deg og fullfør full KYC-identitetsverifisering i tråd med amerikanske regulatoriske krav.\",\"howitworks.step2.title\":\"Velg portefølje\",\"howitworks.step2.description\":\"Velg et forvaltet porteføljenivå som matcher din risikotoleranse og investeringshorisont. Gjennomgå gebyrer først.\",\"howitworks.step3.title\":\"Sett inn midler\",\"howitworks.step3.description\":\"Midler holdes hos en lisensiert institusjonell forvalter. Alle innskudd er underlagt AML-samsvarsvurdering.\",\"howitworks.step4.title\":\"Spor ytelse\",\"howitworks.step4.description\":\"Overvåk porteføljen din via et sanntids dashboard. Reviderte månedlige kontoutskrifter gis til alle investorer.\",\"howitworks.cta\":\"Lær mer om prosessen vår\",\"plans.eyebrow\":\"Investeringsnivåer\",\"plans.title\":\"Velg porteføljeplanen din\",\"plans.subtitle\":\"Hvert nivå gjenspeiler en distinkt risikostrategi og gebyrstruktur — ikke et avkastningsløfte. Alle gebyrer avsløres i sin helhet før kontoaktivering.\",\"plans.minimum\":\"Minimum:\",\"plans.button.review\":\"Gjennomgå\",\"plans.button.getStarted\":\"Kom i gang\",\"plans.disclaimer\":\"Digitale eiendeler er spekulative. Du kan miste noe eller all investert kapital.\",\"plans.feeDisclosure\":\"Forvaltningsgebyrer belastes som en prosentandel av AUM, trukket månedlig. Ytelsesgebyrer gjelder kun for gevinster over avtalt referanseindeks. Ingen garantert avkastning tilbys. Alle gebyrer avsløres skriftlig før kontoaktivering.\",\"plans.feeDisclosure.label\":\"Gebyrpolicy:\",\"regulated.title\":\"Regulert og compliant\",\"regulated.subtitle\":\"WolvCapital opererer under strenge samsvarsstandarder for å beskytte investorkapital og sikre transparens.\",\"regulated.kyc.title\":\"KYC-verifisert\",\"regulated.kyc.description\":\"Alle investorer gjennomgår omfattende identitetsverifisering før kontoaktivering, som sikrer regulatorisk samsvar og investorbeskyttelse.\",\"regulated.aml.title\":\"AML-kompatibel\",\"regulated.aml.description\":\"Avanserte anti-hvitvasking-systemer overvåker alle transaksjoner i sanntid, identifiserer og forhindrer mistenkelig aktivitet mens kundens personvern ivaretas.\",\"regulated.encryption.title\":\"Datakryptering\",\"regulated.encryption.description\":\"Militærklasse SSL/TLS-kryptering beskytter all kommunikasjon og finansielle data, sikret med multifaktorautentisering.\",\"regulated.standards.title\":\"Sikkerhetsstandarder\",\"regulated.standard.2fa\":\"Tofaktorautentisering\",\"regulated.standard.ssl\":\"SSL-kryptering\",\"regulated.standard.monitoring\":\"Svindelovervåkning\",\"regulated.standard.pci\":\"Nivå 1 sertifisert\",\"riskbar.title\":\"Viktig informasjon\",\"riskbar.body\":\"Alle investeringer medfører risiko, inkludert mulig tap av kapital. Historisk ytelse garanterer ikke fremtidige resultater. Investeringer i digitale eiendeler er svært volatile og ikke egnet for alle investorer. WolvCapital er ikke en bank og tilbyr ikke FDIC- eller SIPC-forsikring. Invester bare kapital du har råd til å tape fullstendig. Vennligst gjennomgå vår\",\"riskbar.riskDisclosure\":\"Risikoavsløring\",\"riskbar.and\":\"og\",\"riskbar.terms\":\"Tjenestevilkår\",\"riskbar.before\":\"før du investerer.\",\"riskbar.cta\":\"Les full avsløring\",\"stats.eyebrow\":\"Plattformberegninger — Venter på tredjeparts revisjon\",\"stats.body\":\"Reviderte plattformberegninger vil bli publisert etter fullføring av vår uavhengige tredjeparts revisjon. Forventet Q3 2026.\",\"stats.supporting\":\"Vår forpliktelse til transparens inkluderer uavhengig verifisering av alle plattformberegninger. Kom tilbake for detaljert statistikk og revisjonsrapporter.\",\"stats.link\":\"Se vårt samsvarsrammeverk\",\"virtualcard.eyebrow\":\"Virtuelt kort\",\"virtualcard.title\":\"Betal regninger direkte fra dashbordet ditt\",\"virtualcard.subtitle\":\"Når kontoen din er KYC-verifisert og aktivert, kan du be om et virtuelt WolvCapital Visa-kort koblet direkte til porteføljesaldoen din. Bruk det til å betale abonnementer, handle på nett eller koble til Apple Pay og Google Pay.\",\"virtualcard.disclaimer\":\"Det virtuelle WolvCapital-kortet er for øyeblikket kun tilgjengelig for verifiserte innbyggere i støttede land. En fullstendig liste over støttede land er tilgjengelig ved aktivering.\",\"virtualcard.cta\":\"Aktiver kortet ditt →\",\"virtualcard.feature.1\":\"Virtuelt kort utstedt umiddelbart ved KYC-godkjenning\",\"virtualcard.feature.2\":\"Betal Netflix, Spotify, Apple, Amazon og 100+ forhandlere\",\"virtualcard.feature.3\":\"Koble til Apple Pay og Google Pay-lommebøker\",\"virtualcard.feature.4\":\"Angi tilpassede forbruksgrenser per forhandlerkategori\",\"virtualcard.feature.5\":\"Sanntids transaksjonsvarslinger og dashboard-sporing\",\"virtualcard.feature.6\":\"Frys eller opphev frysing umiddelbart fra appen\",\"virtualcard.feature.7\":\"Fysisk kort tilgjengelig for kvalifiserte verifiserte kontoer\"}"));}),
"[project]/src/components/TranslationProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TranslationProvider",
    ()=>TranslationProvider,
    "useTranslation",
    ()=>useTranslation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$en$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/i18n/en.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$de$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/i18n/de.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$es$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/i18n/es.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$fr$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/i18n/fr.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$it$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/i18n/it.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$pt$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/i18n/pt.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$ru$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/i18n/ru.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$no$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/i18n/no.json (json)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const supportedLocales = [
    'en',
    'de',
    'es',
    'fr',
    'it',
    'pt',
    'ru',
    'no'
];
const localeCookieName = 'next-locale';
const dictionaries = {
    en: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$en$2e$json__$28$json$29$__["default"],
    de: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$de$2e$json__$28$json$29$__["default"],
    no: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$no$2e$json__$28$json$29$__["default"],
    fr: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$fr$2e$json__$28$json$29$__["default"],
    es: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$es$2e$json__$28$json$29$__["default"],
    ru: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$ru$2e$json__$28$json$29$__["default"],
    pt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$pt$2e$json__$28$json$29$__["default"],
    it: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$it$2e$json__$28$json$29$__["default"]
};
function normalizeLocale(input) {
    if (!input) return '';
    const base = String(input).toLowerCase().split('-')[0];
    return base;
}
const TranslationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function detectInitialLocale() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // 1. URL parameter is highest-priority for user-selected language.
    const urlSearch = new URLSearchParams(window.location.search);
    const paramLocale = normalizeLocale(urlSearch.get('lang'));
    if (supportedLocales.includes(paramLocale)) return paramLocale;
    // 2. Check explicit user preference in localStorage
    const storedRaw = window.localStorage.getItem('wolvcapital.locale');
    const stored = normalizeLocale(storedRaw);
    if (supportedLocales.includes(stored)) return stored;
    // 3. Check cookie set by middleware or legacy client code
    const cookieLocale = document.cookie.split(';').map((c)=>c.trim()).find((c)=>c.startsWith(`${localeCookieName}=`) || c.startsWith('wolvcapital_locale='));
    if (cookieLocale) {
        const value = normalizeLocale(cookieLocale.split('=')[1]);
        if (supportedLocales.includes(value)) return value;
    }
    // 4. Browser language fallback
    const nav = normalizeLocale(navigator.language);
    if (supportedLocales.includes(nav)) return nav;
    // 5. Default
    return 'en';
}
const TranslationProvider = ({ children, initialLocale = 'en' })=>{
    _s();
    const [locale, setLocaleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(supportedLocales.includes(initialLocale) ? initialLocale : 'en');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TranslationProvider.useEffect": ()=>{
            // If the server didn't pass a specific locale, detect it from the browser/URL
            const detected = detectInitialLocale();
            setLocaleState(detected);
        }
    }["TranslationProvider.useEffect"], [
        initialLocale
    ]);
    const setLocale = (loc)=>{
        const normalized = normalizeLocale(loc);
        if (!supportedLocales.includes(normalized)) return;
        setLocaleState(normalized);
        if ("TURBOPACK compile-time truthy", 1) {
            window.localStorage.setItem('wolvcapital.locale', normalized);
            document.cookie = `${localeCookieName}=${normalized};path=/;max-age=${60 * 60 * 24 * 365}`;
            document.cookie = `wolvcapital_locale=${normalized};path=/;max-age=${60 * 60 * 24 * 365}`;
        }
    };
    const t = (key)=>{
        const dict = supportedLocales.includes(locale) ? dictionaries[locale] : dictionaries.en;
        return dict[key] || key;
    };
    // Keep the <html lang="..."> attribute in sync with the active locale for
    // accessibility and correct language exposure to crawlers/assistive tech.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TranslationProvider.useEffect": ()=>{
            if (typeof document !== 'undefined' && locale) {
                document.documentElement.setAttribute('lang', locale);
            }
        }
    }["TranslationProvider.useEffect"], [
        locale
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TranslationContext.Provider, {
        value: {
            locale,
            t,
            setLocale
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/TranslationProvider.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TranslationProvider, "HiBPujpjExeKbxddA+o6BTjgXxM=");
_c = TranslationProvider;
function useTranslation() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TranslationContext);
    if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
    return ctx;
}
_s1(useTranslation, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "TranslationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/cn.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cn.ts [app-client] (ecmascript)");
;
;
;
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c = ({ variant = 'cta-sky', size = 'md', className, children, asLink = false, href, ...props }, ref)=>{
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-[7px] focus:outline-none';
    const variantStyles = {
        'cta-sky': 'bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold hover:from-sky-500 hover:to-sky-600 hover:brightness-110 active:translate-y-0.5',
        'white': 'bg-white text-brand-primary border-2 border-gray-300 hover:border-brand-secondary hover:shadow-lg active:translate-y-0.5',
        'plan': 'bg-transparent border border-white/18 text-[#0F172A]/75 hover:bg-white/7 active:translate-y-0.5',
        'plan-sky': 'bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold border-transparent hover:brightness-110 active:translate-y-0.5',
        'outline': 'border-2 border-current text-current hover:bg-current hover:text-[#0F172A] active:translate-y-0.5'
    };
    const sizeStyles = {
        'sm': 'px-3 py-2 text-sm',
        'md': 'px-6 py-2.5 text-base',
        'lg': 'px-8 py-3.5 text-base'
    };
    const buttonClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseStyles, variantStyles[variant], sizeStyles[size], className);
    if (asLink && href) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: href,
            className: buttonClassName,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/Button.tsx",
            lineNumber: 45,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        className: buttonClassName,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Button.tsx",
        lineNumber: 52,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = 'Button';
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/LanguageSwitcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LanguageSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TranslationProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const languages = [
    {
        code: 'en',
        label: 'English',
        flag: '🇺🇸'
    },
    {
        code: 'de',
        label: 'Deutsch',
        flag: '🇩🇪'
    },
    {
        code: 'es',
        label: 'Español',
        flag: '🇪🇸'
    },
    {
        code: 'fr',
        label: 'Français',
        flag: '🇫🇷'
    },
    {
        code: 'it',
        label: 'Italiano',
        flag: '🇮🇹'
    },
    {
        code: 'pt',
        label: 'Português',
        flag: '🇵🇹'
    },
    {
        code: 'ru',
        label: 'Русский',
        flag: '🇷🇺'
    },
    {
        code: 'no',
        label: 'Norsk',
        flag: '🇳🇴'
    }
];
function LanguageSwitcher() {
    _s();
    const { locale, setLocale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const handleLanguageChange = (event)=>{
        const nextLocale = event.target.value;
        setLocale(nextLocale);
        if ("TURBOPACK compile-time truthy", 1) {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', nextLocale);
            window.history.replaceState({}, '', url.toString());
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                "aria-label": "Change language",
                className: "appearance-none bg-transparent border border-white/20 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-white hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors cursor-pointer min-w-0",
                value: locale,
                onChange: handleLanguageChange,
                children: languages.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: l.code,
                        children: [
                            l.flag,
                            " ",
                            l.label
                        ]
                    }, l.code, true, {
                        fileName: "[project]/src/components/LanguageSwitcher.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/LanguageSwitcher.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 text-white/60",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M19 9l-7 7-7-7"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LanguageSwitcher.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/LanguageSwitcher.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/LanguageSwitcher.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LanguageSwitcher.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(LanguageSwitcher, "q3u2TioqO17wokav+du6u9i/GVs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = LanguageSwitcher;
var _c;
__turbopack_context__.k.register(_c, "LanguageSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/NavBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NavBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lenis/dist/lenis-react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LanguageSwitcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TranslationProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function NavBar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [mobileOpen, setMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const lenis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLenis"])();
    const handleHashClick = (e, href)=>{
        if (!href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (target && lenis) {
            e.preventDefault();
            lenis.scrollTo(target);
        }
    };
    const navItems = [
        {
            href: '/',
            labelKey: 'nav.home'
        },
        {
            href: '/wolv-token',
            label: 'WOLV Token'
        },
        {
            href: '/presale',
            label: 'Presale'
        },
        {
            href: '/tokenomics',
            label: 'Tokenomics'
        },
        {
            href: '/roadmap',
            label: 'Roadmap'
        },
        {
            href: '/whitepaper',
            label: 'Whitepaper'
        },
        {
            href: '/campaigns',
            label: 'Campaigns'
        },
        {
            href: '#plans',
            labelKey: 'nav.plans'
        },
        {
            href: '#compliance',
            labelKey: 'nav.compliance'
        },
        {
            href: '/blog',
            labelKey: 'nav.blog'
        },
        {
            href: '/contact',
            labelKey: 'nav.contact'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        style: {
            background: 'rgba(6,12,26,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(42,82,190,0.2)'
        },
        className: "sticky top-0 w-full z-50 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between h-[68px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/wolv-icon.svg",
                                    alt: "WolvCapital",
                                    width: 32,
                                    height: 32,
                                    style: {
                                        borderRadius: '50%'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl font-bold text-white",
                                    children: "WolvCapital"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/NavBar.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "hidden lg:flex items-center gap-9",
                            children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        onClick: (e)=>handleHashClick(e, item.href),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm font-medium transition-colors duration-200 tracking-tighter', item.label === 'WOLV Token' || item.label === 'Presale' ? 'text-[#00a896] hover:text-[#00c9b1] font-semibold' : pathname === item.href ? 'text-white border-b-2 border-[#00a896] pb-1' : 'text-[rgba(255,255,255,0.65)] hover:text-white'),
                                        children: [
                                            item.label || t(item.labelKey),
                                            (item.label === 'WOLV Token' || item.label === 'Presale') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    marginLeft: '6px',
                                                    fontSize: '9px',
                                                    background: '#00a896',
                                                    color: '#fff',
                                                    padding: '1px 6px',
                                                    borderRadius: '99px',
                                                    fontWeight: 700,
                                                    verticalAlign: 'middle',
                                                    letterSpacing: '0.5px'
                                                },
                                                children: "LIVE"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/NavBar.tsx",
                                                lineNumber: 69,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/NavBar.tsx",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, this)
                                }, item.href, false, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 54,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/NavBar.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden lg:flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/accounts/login",
                                    className: "text-sm font-medium text-white px-5 py-2 border border-[rgba(255,255,255,0.2)] rounded-[7px] hover:border-[#00a896] hover:text-[#00a896] transition-colors",
                                    children: t('nav.login')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    asLink: true,
                                    href: "/accounts/signup",
                                    className: "text-white px-5 py-2 rounded-[7px] font-bold text-sm transition-colors",
                                    style: {
                                        background: 'linear-gradient(135deg, #2A52BE, #00a896)',
                                        boxShadow: '0 0 20px rgba(0,168,150,0.3)'
                                    },
                                    children: t('nav.signup')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/NavBar.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 lg:hidden flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/accounts/login",
                                    className: "text-xs font-medium text-white px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-[7px] hover:border-[#00a896] transition-colors",
                                    children: t('nav.login')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setMobileOpen(!mobileOpen),
                                    className: "p-2 rounded-lg transition-colors",
                                    style: {
                                        background: 'rgba(255,255,255,0.06)'
                                    },
                                    "aria-label": "Toggle menu",
                                    children: mobileOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6 text-white",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M6 18L18 6M6 6l12 12"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NavBar.tsx",
                                            lineNumber: 116,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NavBar.tsx",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6 text-white",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M4 6h16M4 12h16M4 18h16"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NavBar.tsx",
                                            lineNumber: 120,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NavBar.tsx",
                                        lineNumber: 119,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/NavBar.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/NavBar.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/NavBar.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            mobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden",
                style: {
                    background: 'rgba(6,12,26,0.98)',
                    borderTop: '1px solid rgba(42,82,190,0.2)',
                    backdropFilter: 'blur(20px)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 py-4 flex flex-col gap-1",
                    children: [
                        navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                onClick: (e)=>{
                                    handleHashClick(e, item.href);
                                    setMobileOpen(false);
                                },
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors', item.label === 'WOLV Token' || item.label === 'Presale' ? 'text-[#00a896] font-semibold' : pathname === item.href ? 'text-[#00a896] font-semibold' : 'text-[rgba(255,255,255,0.75)] hover:text-white'),
                                style: item.label === 'WOLV Token' || item.label === 'Presale' ? {
                                    background: 'rgba(0,168,150,0.08)',
                                    border: '1px solid rgba(0,168,150,0.2)'
                                } : pathname === item.href ? {
                                    background: 'rgba(42,82,190,0.12)',
                                    border: '1px solid rgba(42,82,190,0.25)'
                                } : {},
                                onMouseEnter: (e)=>{
                                    if (item.label !== 'WOLV Token' && item.label !== 'Presale' && pathname !== item.href) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }
                                },
                                onMouseLeave: (e)=>{
                                    if (item.label !== 'WOLV Token' && item.label !== 'Presale' && pathname !== item.href) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.label || t(item.labelKey)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NavBar.tsx",
                                        lineNumber: 163,
                                        columnNumber: 17
                                    }, this),
                                    (item.label === 'WOLV Token' || item.label === 'Presale') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '9px',
                                            background: '#00a896',
                                            color: '#fff',
                                            padding: '2px 8px',
                                            borderRadius: '99px',
                                            fontWeight: 700,
                                            letterSpacing: '0.5px'
                                        },
                                        children: "LIVE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NavBar.tsx",
                                        lineNumber: 165,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/src/components/NavBar.tsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-3 mt-2",
                            style: {
                                borderTop: '1px solid rgba(42,82,190,0.2)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                asLink: true,
                                href: "/accounts/signup",
                                className: "w-full text-white px-5 py-3 rounded-[10px] font-bold text-sm text-center block",
                                style: {
                                    background: 'linear-gradient(135deg, #2A52BE, #00a896)',
                                    boxShadow: '0 0 20px rgba(0,168,150,0.25)'
                                },
                                children: t('nav.signup')
                            }, void 0, false, {
                                fileName: "[project]/src/components/NavBar.tsx",
                                lineNumber: 174,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/NavBar.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/NavBar.tsx",
                    lineNumber: 131,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/NavBar.tsx",
                lineNumber: 130,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/NavBar.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(NavBar, "7gq/SG3ygYt5JzBxUjq9IoR448U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLenis"]
    ];
});
_c = NavBar;
var _c;
__turbopack_context__.k.register(_c, "NavBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/DisclosureTicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DisclosureTicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function DisclosureTicker() {
    _s();
    const container = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DisclosureTicker.useEffect": ()=>{
            if (!container.current) return;
            // Clean up any previous widget
            container.current.innerHTML = '';
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                symbols: [
                    {
                        proName: 'BINANCE:BNBUSDT',
                        title: 'BNB/USDT'
                    },
                    {
                        proName: 'BINANCE:BTCUSDT',
                        title: 'BTC/USDT'
                    },
                    {
                        proName: 'BINANCE:ETHUSDT',
                        title: 'ETH/USDT'
                    },
                    {
                        proName: 'BINANCE:BUSDUSDT',
                        title: 'BUSD/USDT'
                    },
                    {
                        proName: 'CRYPTO:BNBUSD',
                        title: 'BNB/USD'
                    }
                ],
                showSymbolLogo: true,
                isTransparent: true,
                displayMode: 'adaptive',
                colorTheme: 'dark',
                locale: 'en'
            });
            container.current.appendChild(script);
        }
    }["DisclosureTicker.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: 'rgba(6,12,26,0.95)',
            borderBottom: '1px solid rgba(0,168,150,0.2)',
            height: '46px',
            overflow: 'hidden'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "tradingview-widget-container",
            ref: container,
            style: {
                height: '46px'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tradingview-widget-container__widget"
            }, void 0, false, {
                fileName: "[project]/src/components/DisclosureTicker.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/DisclosureTicker.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/DisclosureTicker.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(DisclosureTicker, "gP936EAkbq44zYYGRnj90r2fLhg=");
_c = DisclosureTicker;
var _c;
__turbopack_context__.k.register(_c, "DisclosureTicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/sections/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TranslationProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Footer() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-brand-dark",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-[#1E3A5F] py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-white mb-3",
                                        children: "WolvCapital"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 12,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[#64748B] text-sm leading-relaxed mb-4 max-w-xs",
                                        children: t('footer.brand.description')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 13,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/Footer.tsx",
                                lineNumber: 11,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4",
                                        children: t('footer.platform')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 16,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-2",
                                        children: [
                                            {
                                                key: 'footer.platform.createAccount',
                                                href: '/accounts/signup'
                                            },
                                            {
                                                key: 'footer.platform.login',
                                                href: '/accounts/login'
                                            },
                                            {
                                                key: 'footer.platform.plans',
                                                href: '/plans'
                                            },
                                            {
                                                key: 'footer.platform.virtualCard',
                                                href: '#virtual-card'
                                            },
                                            {
                                                key: 'footer.platform.faq',
                                                href: '/faq'
                                            },
                                            {
                                                key: 'WOLV Token',
                                                href: '/wolv-token'
                                            },
                                            {
                                                key: 'Whitepaper',
                                                href: '/whitepaper'
                                            },
                                            {
                                                key: 'Smart Contracts',
                                                href: '/smart-contracts'
                                            }
                                        ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.href,
                                                    className: "text-[#94A3B8] text-sm hover:text-white transition",
                                                    children: item.key.startsWith('footer') ? t(item.key) : item.key
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/sections/Footer.tsx",
                                                    lineNumber: 28,
                                                    columnNumber: 38
                                                }, this)
                                            }, item.key, false, {
                                                fileName: "[project]/src/components/sections/Footer.tsx",
                                                lineNumber: 28,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 17,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/Footer.tsx",
                                lineNumber: 15,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4",
                                        children: t('footer.legal')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 33,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-2",
                                        children: [
                                            {
                                                key: 'footer.legal.terms',
                                                href: '/terms-of-service'
                                            },
                                            {
                                                key: 'footer.legal.privacy',
                                                href: '/privacy'
                                            },
                                            {
                                                key: 'footer.legal.risk',
                                                href: '/risk-disclosure'
                                            },
                                            {
                                                key: 'footer.legal.disclaimer',
                                                href: '/legal-disclaimer'
                                            },
                                            {
                                                key: 'footer.legal.compliance',
                                                href: '#compliance'
                                            }
                                        ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.href,
                                                    className: "text-[#94A3B8] text-sm hover:text-white transition",
                                                    children: item.key.startsWith('footer') ? t(item.key) : item.key
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/sections/Footer.tsx",
                                                    lineNumber: 42,
                                                    columnNumber: 38
                                                }, this)
                                            }, item.key, false, {
                                                fileName: "[project]/src/components/sections/Footer.tsx",
                                                lineNumber: 42,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 34,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/Footer.tsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4",
                                        children: t('footer.support')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 47,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-2",
                                        children: [
                                            {
                                                key: 'footer.support.about',
                                                href: '/about'
                                            },
                                            {
                                                key: 'footer.support.contact',
                                                href: '/contact'
                                            },
                                            {
                                                key: 'footer.support.blog',
                                                href: '/blog'
                                            },
                                            {
                                                key: 'footer.support.security',
                                                href: '/security'
                                            },
                                            {
                                                key: 'footer.support.status',
                                                href: '#'
                                            }
                                        ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.href,
                                                    className: "text-[#94A3B8] text-sm hover:text-white transition",
                                                    children: item.key.startsWith('footer') ? t(item.key) : item.key
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/sections/Footer.tsx",
                                                    lineNumber: 56,
                                                    columnNumber: 38
                                                }, this)
                                            }, item.key, false, {
                                                fileName: "[project]/src/components/sections/Footer.tsx",
                                                lineNumber: 56,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/Footer.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/Footer.tsx",
                        lineNumber: 10,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/Footer.tsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/sections/Footer.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-[#1E3A5F] py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row items-center justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#475569] text-xs",
                                children: t('footer.copyright').replace('{year}', String(new Date().getFullYear()))
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/Footer.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 text-xs text-[#94A3B8]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1",
                                        children: t('footer.badge.fincen')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 68,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1",
                                        children: t('footer.badge.ssl')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1",
                                        children: t('footer.badge.pci')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Footer.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/Footer.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/Footer.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/Footer.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/sections/Footer.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sections/Footer.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_s(Footer, "zlIdU9EjM2llFt74AbE2KsUJXyM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AppChrome.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppChrome
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lenis/dist/lenis-react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NavBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NavBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DisclosureTicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DisclosureTicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sections$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/sections/Footer.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function AppChrome({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const hideChrome = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
    if (hideChrome) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactLenis"], {
            root: true,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/AppChrome.tsx",
            lineNumber: 14,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactLenis"], {
        root: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen flex-col bg-transparent",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DisclosureTicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/AppChrome.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NavBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/AppChrome.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "flex-1 w-full pt-16",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/AppChrome.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sections$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/AppChrome.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AppChrome.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/AppChrome.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(AppChrome, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AppChrome;
var _c;
__turbopack_context__.k.register(_c, "AppChrome");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/GaPageView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GaPageView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function GaPageView({ measurementId }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GaPageView.useEffect": ()=>{
            if (!measurementId) return;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (typeof window.gtag !== 'function') return;
            const search = searchParams?.toString();
            const pagePath = search ? `${pathname}?${search}` : pathname;
            window.gtag('config', measurementId, {
                page_path: pagePath
            });
        }
    }["GaPageView.useEffect"], [
        measurementId,
        pathname,
        searchParams
    ]);
    return null;
}
_s(GaPageView, "h6p6PpCFmP4Mu5bIMduBzSZThBE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = GaPageView;
var _c;
__turbopack_context__.k.register(_c, "GaPageView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SegmentProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SegmentProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
'use client';
;
;
function SegmentProvider({ writeKey, children }) {
    if (!writeKey) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "segment-analytics",
                strategy: "afterInteractive",
                dangerouslySetInnerHTML: {
                    __html: `
            !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="${writeKey}";;analytics.SNIPPET_VERSION="5.2.0";
            analytics.load("${writeKey}");
            analytics.page();
            }}();
          `
                }
            }, void 0, false, {
                fileName: "[project]/src/components/SegmentProvider.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true);
}
_c = SegmentProvider;
var _c;
__turbopack_context__.k.register(_c, "SegmentProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/_client/remove-sync-banner.ts [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

// src/_client/remove-sync-banner.ts
if ("TURBOPACK compile-time truthy", 1) {
    window.addEventListener("load", ()=>{
        try {
            const CTA = "Complete synchronization deposit";
            document.querySelectorAll('button, a, [role="button"]').forEach((el)=>{
                if (el.textContent?.trim() === CTA) {
                    const banner = el.closest('section, div, header, aside') || el.parentElement;
                    if (banner) banner.remove();
                }
            });
            document.querySelectorAll('div, section, header, aside').forEach((el)=>{
                if (el.textContent && el.textContent.includes("Action Required: Account Synchronization Deposit")) {
                    el.remove();
                }
            });
        } catch (err) {
            console.error("remove-sync-banner error", err);
        }
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/RemoveSyncBannerClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RemoveSyncBannerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$_client$2f$remove$2d$sync$2d$banner$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/_client/remove-sync-banner.ts [app-client] (ecmascript)");
"use client";
;
function RemoveSyncBannerClient() {
    return null;
}
_c = RemoveSyncBannerClient;
var _c;
__turbopack_context__.k.register(_c, "RemoveSyncBannerClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_910f18fc._.js.map