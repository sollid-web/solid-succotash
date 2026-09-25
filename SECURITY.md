# Security Policy

## Scope

This policy applies to the WolvCapital source code and deployment configuration in this repository, including the Next.js frontend, API proxy routes, wallet-connection flows, client-side contract interactions, and publicly shipped static assets.

The separately managed backend, deployed infrastructure, smart contracts, third-party services, and external websites may have their own security owners and disclosure processes. A report about one of those systems is still useful, but it may need to be redirected to the responsible maintainer.

## Supported versions

Security fixes are applied to the default branch. Older commits, forks, archived builds, and unsupported deployment copies may not receive security updates.

| Version or branch | Security support |
| --- | --- |
| `main` | Supported |
| Other branches and released copies | Not guaranteed |

## Reporting a vulnerability

Please report suspected vulnerabilities privately. Do not open a public GitHub issue, publish exploit code, or disclose sensitive details before the maintainers have had an opportunity to investigate.

Use GitHub's private vulnerability reporting or private security advisory workflow for this repository when it is available. If that workflow is not enabled, contact the repository maintainers through a private channel associated with the official `sollid-web/solid-succotash` repository and request a secure disclosure route. Do not include private keys, seed phrases, production credentials, or unrelated personal data in a report.

A useful report should include:

- A concise description of the vulnerability and its potential impact.
- The affected commit, branch, route, component, contract interaction, or deployment configuration.
- Clear reproduction steps or a minimal proof of concept that does not access other users' data or funds.
- Any relevant logs, screenshots, transaction hashes, or test-wallet addresses with sensitive information removed.
- A suggested remediation, if one is known.

Please use a disposable test wallet with no funds when demonstrating a wallet or smart-contract issue. Never test against another person's wallet, production funds, or infrastructure without explicit authorization.

## What to report

Examples of in-scope issues include:

- Authentication, authorization, or account-takeover vulnerabilities.
- Exposure of API keys, tokens, credentials, private data, or server-only environment variables.
- Cross-site scripting, injection, request forgery, or unsafe server-side proxy behavior.
- Wallet-connection or transaction-flow issues that could cause users to sign an unintended transaction.
- Incorrect contract address, chain, recipient, token, allowance, or transaction-parameter handling that creates a material user risk.
- Dependency or build-configuration vulnerabilities that affect the deployed application.
- Security controls or disclosures that materially misrepresent the behavior of the application.

The following are generally not security vulnerabilities by themselves: ordinary product bugs, visual defects, unsupported browsers, publicly documented third-party behavior, low-impact information disclosure with no sensitive data, speculative investment or token-price concerns, and issues that require a user to ignore a clear warning and voluntarily authorize an unrelated transaction. These may still be useful product feedback and should be reported through the normal project channels.

## Response and disclosure process

The maintainers will acknowledge a private report when practicable, validate the issue, assess its severity and affected versions, and coordinate remediation or mitigation. Response timing depends on report quality, reproducibility, maintainer availability, and whether an affected third-party service or smart contract is involved.

Please allow reasonable time for investigation and remediation before public disclosure. The maintainers may coordinate disclosure timing with reporters and affected service providers. A public advisory should not include credentials, private user data, exploit details that remain actionable, or unverified claims.

## Smart-contract and financial-risk reports

A security report is not a guarantee that a contract, token, investment plan, yield assumption, or third-party service is safe or profitable. Contract interactions are irreversible or difficult to reverse in some circumstances. Before submitting a report or testing a flow, verify the network, contract address, recipient, token, amount, allowance, and wallet used.

This policy does not authorize testing or modification of deployed contracts. Contract vulnerabilities should be reported privately with the network, contract address, affected function, transaction hash if applicable, and a safe reproduction that does not risk user funds.

## Recognition

The project may acknowledge reporters who help improve security, subject to the reporter's consent. No bounty, payment, employment relationship, or legal safe harbor is promised by this policy.
