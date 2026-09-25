# WolvCapital
[![Network: BNB Smart Chain](https://img.shields.io/badge/network-BNB%20Smart%20Chain-F0B90B?logo=binance&logoColor=white)](https://www.bnbchain.org/en/smartchain)
[![Framework: Next.js](https://img.shields.io/badge/framework-Next.js%2016-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

WolvCapital is a JavaScript-first Next.js web application for a structured digital-asset investment platform. The frontend combines product and investment-plan pages, wallet connectivity, BNB Smart Chain staking flows, token and reward-pool visibility, educational content, and legal and risk-disclosure pages.

> **Important:** This repository is software documentation, not financial advice or an investment recommendation. Digital assets are volatile and smart-contract interactions carry technical and financial risk. Review the application, contracts, disclosures, and applicable law independently before using the platform.

## Project status

The application is configured for **BNB Smart Chain mainnet** through `wagmi` and RainbowKit's `bsc` chain configuration. The frontend is intended to be used with the WolvCapital web application and its separately managed Django/API backend. The repository is public source code; a DappBay listing, security review, audit, or BNB Chain endorsement is **not implied** by this README.

## What the application provides

- Responsive marketing, product, plan, dashboard, and account experiences.
- Wallet connection through RainbowKit and Wagmi, with BNB Smart Chain as the configured chain.
- On-chain staking interactions for BNB and BUSD-denominated plans.
- WOLV token and reward-pool visibility with BSCScan and DEX reference links.
- Content and education pages sourced from the `posts/` directory.
- Legal, privacy, terms, risk-disclosure, withdrawal-policy, and methodology routes.
- API proxying from Next.js to a separately deployed Django-compatible backend.
- Search and social metadata, Open Graph assets, optimized images, and sitemap/robots routes.
- Jest foundations and Playwright browser-test configuration.

## BNB Smart Chain integration

BNB Chain support is explicit in both the code and the runtime configuration:

- `src/_client/WalletProvider.tsx` configures Wagmi with `wagmi/chains` → `bsc`.
- The application uses BSCScan endpoints at `https://api.bscscan.com/api` for chain statistics.
- Contract and transaction links use `https://bscscan.com`.
- The staking UI identifies the network as **BNB Smart Chain** and reads and writes contract state through Wagmi.

The configured chain is BNB Smart Chain mainnet, chain ID `56`. Testnet support is not enabled by default. Do not use production contract addresses with a testnet wallet or a modified local configuration.

### Contract references

These addresses are read by the frontend and should be re-confirmed against the current deployment before every public listing update or production release.

| Contract | Address | Explorer |
| --- | --- | --- |
| WOLV token | `0xe0167279aef7bf4ad313d261da82e8366822270c` | [View on BSCScan](https://bscscan.com/token/0xe0167279aef7bf4ad313d261da82e8366822270c) |
| Staking | `0x7cd22f3c08b4195225da7d043cbe00da118d31ec` | [View on BSCScan](https://bscscan.com/address/0x7cd22f3c08b4195225da7d043cbe00da118d31ec) |
| Reward pool | `0x7310f3e07627ce98246973e068bf2ff294f84e5f` | [View on BSCScan](https://bscscan.com/address/0x7310f3e07627ce98246973e068bf2ff294f84e5f) |
| BUSD reference | `0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56` | [View on BSCScan](https://bscscan.com/token/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56) |

The frontend does not replace an independent contract review. Verify source code, ownership, permissions, token balances, upgradeability, and current deployment state directly on the relevant explorer.

## Technology

| Area | Technology |
| --- | --- |
| Application | Next.js 16 App Router, React 18 |
| Language | JavaScript with TypeScript and TSX components |
| Styling and motion | Tailwind CSS, Framer Motion, Lenis |
| Wallet and chain | Wagmi, Viem, RainbowKit, WalletConnect |
| Content | Markdown, `gray-matter`, unified/remark/rehype |
| Testing | Jest, Testing Library, Playwright |
| Deployment | Vercel-compatible Next.js deployment with a separate API backend |

## Repository layout

```text
.
├── src/
│   ├── app/                 # App Router pages, API routes, and layouts
│   └── _client/             # Client-only wallet and interactive components
├── public/                  # Logos, icons, whitepaper, images, and static assets
├── posts/                   # Markdown educational and product content
├── tests/                   # Jest-oriented test files
├── e2e/                    # Playwright browser tests
├── scripts/                 # Maintained maintenance and generation scripts
├── .env.example             # Documented environment variable template
├── next.config.js           # Rewrites, redirects, image policy, and build checks
├── package.json             # Development, test, lint, and build commands
└── playwright.config.ts     # Browser-test configuration
```

## Local development

### Prerequisites

- Node.js 18 or newer. Node.js 20 or newer is recommended for the current dependency set.
- npm 9 or newer.
- A running or reachable backend when using authenticated or API-backed flows.
- A WalletConnect project ID for wallet-connection features.

### Install

```bash
git clone https://github.com/sollid-web/solid-succotash.git
cd solid-succotash
npm install
cp .env.example .env.local
```

Edit `.env.local` with local, non-secret values. Never commit `.env.local`, API keys, private keys, seed phrases, or wallet credentials.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Production and API-backed flows | Django/API origin used by the Next.js rewrites. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical public frontend origin for metadata and links. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Wallet connection | WalletConnect project identifier used by RainbowKit. |
| `BSCSCAN_API_KEY` | Optional | BSCScan API access for chain statistics; the route has a fallback response. |
| `NEXT_PUBLIC_API_BASE_URL` | Optional | Legacy/client API base URL used by selected integrations. |
| `TELEGRAM_BOT_TOKEN` | Optional/server-only | Telegram automation integration. Keep this secret. |
| `TELEGRAM_CHAT_ID` | Optional/server-only | Telegram destination used by automation. |

On Vercel, `NEXT_PUBLIC_API_URL` must be set. `next.config.js` intentionally fails the Vercel build when that value is missing because otherwise authenticated API requests would silently point at the local fallback.

## Quality checks

Run the following before opening a pull request or submitting an updated repository to DappBay:

```bash
npm run lint
npm run type-check
npm test
npm run build
```

Run browser tests against the configured local application when the required backend and test data are available:

```bash
npm run dev
npm run test:e2e
```

The end-to-end suite may require environment-specific authentication or seeded data. Record any unavailable external dependency in the pull request rather than weakening the test configuration.

## Deployment notes

The frontend can be deployed as a standard Next.js application on Vercel or another Node-compatible host. Configure the same environment variables in the deployment environment, set the production API origin, and verify that the API rewrite reaches the Django backend.

Before a production release:

1. Confirm the wallet provider still targets BNB Smart Chain mainnet.
2. Confirm every contract address and explorer link in the UI and documentation.
3. Verify the deployed frontend origin and API origin.
4. Exercise a read-only wallet flow before testing any write transaction.
5. Review legal, risk, token, staking, and withdrawal copy with the responsible legal and compliance reviewers.
6. Run linting, type checking, tests, and a production build from a clean checkout.

## DappBay listing profile

BNB Chain's DappBay submission form asks for a concise project profile, a public source repository, a logo, screenshots, social links, contract information, and the supported BNB ecosystem network. The following draft keeps within the form's visible limits and should be reviewed by the project owner before submission.

| Field | Draft |
| --- | --- |
| dApp name | `WolvCapital` |
| Categories | `DeFi`, `AI`, `Infra-and-Tools` — select no more than three and keep only categories that accurately describe the live product. |
| Tagline | `Structured digital-asset investing and BNB Smart Chain staking in one transparent platform.` |
| Description | `WolvCapital is a digital-asset platform built on BNB Smart Chain. The application combines structured investment-plan information, WOLV token visibility, wallet-connected staking for BNB and BUSD, reward-pool transparency, educational content, and risk disclosures. Users should verify contracts and review all disclosures before interacting with the platform.` |
| Status | `Live` only if the public application and required backend are operational; otherwise select `Work in progress`. |
| Supported network | `BNB Smart Chain` |
| Primary repository | `https://github.com/sollid-web/solid-succotash` |

DappBay's form currently limits the name to 40 characters, the tagline to 200 characters, the description to 1,000 characters, and repository descriptions to 200 characters. It requests one logo of at least 160 × 160 pixels and no more than 1 MB, plus one to five screenshots. It also allows audit-report links for projects that have them; an audit is not represented here because no audit provider or report has been verified in this repository.

The repository itself is intended to satisfy the repository-side verification signals: it is public, identifies BNB Smart Chain explicitly, configures `bsc` in code, and documents the relevant contract references. DappBay review and listing remain subject to BNB Chain's own process and should be updated whenever the logo, description, repository, contract, or deployment changes.

## Security and risk disclosure

This repository contains client-side blockchain transaction flows. A connected wallet signs transactions locally; the frontend cannot remove the need for the user to review network, destination, amount, gas, allowance, and contract details. Never paste a private key or seed phrase into the application, repository, issue tracker, or chat.

The DappBay risk scanner and third-party explorers are useful reference tools, not guarantees of safety, profitability, or endorsement. Users are responsible for their own research and transaction decisions. Report suspected vulnerabilities privately using the repository's [security policy](./SECURITY.md) rather than publishing exploitable details in a public issue.

## Contribution guidance

Keep pull requests focused and explain user-facing, contract-facing, or deployment-facing effects. Do not commit build output, dependency directories, local environment files, archives of source trees, editor backups, or temporary debugging artifacts. For changes that affect wallet transactions, include the affected chain, contract address, function names, and a clear test plan. See the [security policy](./SECURITY.md) for private vulnerability reporting and responsible disclosure guidance.

## License

This project is released under the [MIT License](./LICENSE). See the [`LICENSE`](./LICENSE) file for the complete terms. The MIT License applies to the source code in this repository; it does not make financial, investment, token, or smart-contract claims, disclosures, or third-party services safe or endorsed.

## References

[1]: https://docs.bnbchain.org/join-ecosystem/platforms/dappbay/ "BNB Chain documentation: Submit Project on DappBay & DappRadar"
[2]: https://dappbay.bnbchain.org/submit-dapp "DappBay: Submit a dApp"
[3]: https://github.com/bnb-chain/bnb-chain-tutorial/blob/main/Readme-and-config-file-guideline.md "BNB Chain Repository Submission Guidelines"
[4]: https://wagmi.sh/react/api/chains/bsc "Wagmi BNB Smart Chain configuration"
[5]: https://bscscan.com/ "BSCScan block explorer"

DappBay submission guidance is summarized from the official sources above and should be rechecked before filing because form fields and review criteria can change.
