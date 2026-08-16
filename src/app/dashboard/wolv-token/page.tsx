import Link from "next/link";
import { WalletProvider } from "@/_client/WalletProvider";
import { WolvWalletSection } from "@/_client/WolvWalletSection";

const dashboardWolvStats = [
  { label: "Token Name", value: "WolvCapital", icon: "⬡" },
  { label: "Symbol", value: "WOLV", icon: "₩" },
  { label: "Network", value: "BNB Smart Chain", icon: "⛓" },
  { label: "Max Supply", value: "1B", icon: "📊" },
];

const wolvBenefits = [
  { title: "Proof of Returns", desc: "Every profit is recorded on blockchain", icon: "✓" },
  { title: "Reward Pool", desc: "600M WOLV allocated for distributions", icon: "🏆" },
  { title: "Staking Ready", desc: "Earn WOLV through investment returns", icon: "💰" },
];

export default function DashboardWolvTokenPage() {
  return (
    <div style={{ color: "#fff" }}>
      
      <style>{`
        .dashboard-wolv-container { max-width: 1200px; margin: 0 auto; }
        .dashboard-wolv-header { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 48px; }
        .dashboard-wolv-header .title-block { max-width: 720px; }
        .dashboard-wolv-header h1 { margin: 0; font-size: 42px; font-weight: 800; line-height: 1.15; letter-spacing: -1.2px; background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .dashboard-wolv-header p { margin: 12px 0 0; color: rgba(255,255,255,0.65); font-size: 16px; line-height: 1.6; max-width: 580px; }
        .dashboard-wolv-badge { display: inline-block; padding: 8px 16px; border-radius: 999px; background: rgba(0,168,150,0.15); border: 1px solid rgba(0,168,150,0.35); color: #00c9b1; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 16px; }
        .dashboard-wolv-header-actions { display: flex; flex-wrap: wrap; gap: 12px; }
        .dashboard-wolv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 36px; }
        .dashboard-wolv-card { background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%); border: 1px solid rgba(0,168,150,0.25); border-radius: 28px; padding: 32px; backdrop-filter: blur(20px); transition: all 0.3s ease; position: relative; overflow: hidden; }
        .dashboard-wolv-card::before { content: ''; position: absolute; top: 0; right: 0; width: 200px; height: 200px; background: radial-gradient(circle, rgba(0,168,150,0.1) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
        .dashboard-wolv-card:hover { border-color: rgba(0,168,150,0.45); background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,168,150,0.15); }
        .dashboard-wolv-card.premium { background: linear-gradient(135deg, rgba(42,82,190,0.15) 0%, rgba(0,168,150,0.1) 100%); border: 1px solid rgba(42,82,190,0.35); }
        .dashboard-wolv-card.premium:hover { border-color: rgba(42,82,190,0.55); box-shadow: 0 20px 60px rgba(42,82,190,0.2); }
        .dashboard-wolv-card h2 { margin: 0 0 16px; font-size: 22px; font-weight: 700; position: relative; z-index: 1; }
        .dashboard-wolv-card p { margin: 0; color: rgba(255,255,255,0.65); font-size: 14px; line-height: 1.8; position: relative; z-index: 1; }
        .dashboard-wolv-card-icon { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(135deg, rgba(0,168,150,0.25), rgba(42,82,190,0.15)); margin-bottom: 16px; font-size: 24px; }
        .dashboard-wolv-list { margin-top: 24px; display: grid; gap: 12px; position: relative; z-index: 1; }
        .dashboard-wolv-list-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-radius: 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s ease; }
        .dashboard-wolv-list-item:hover { background: rgba(255,255,255,0.07); border-color: rgba(0,168,150,0.3); }
        .dashboard-wolv-list-item span:first-child { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.65); font-size: 13px; font-weight: 500; }
        .dashboard-wolv-list-item span:last-child { color: #00c9b1; font-weight: 700; font-family: monospace; font-size: 13px; }
        .wolv-wallet-card { background: linear-gradient(135deg, rgba(42,82,190,0.18) 0%, rgba(0,168,150,0.12) 100%); border: 1px solid rgba(42,82,190,0.35); border-radius: 28px; padding: 32px; backdrop-filter: blur(20px); position: relative; overflow: hidden; }
        .wolv-wallet-card::before { content: ''; position: absolute; top: -40px; right: -40px; width: 160px; height: 160px; background: radial-gradient(circle, rgba(42,82,190,0.18) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
        .wolv-wallet-card::after { content: ''; position: absolute; bottom: -30px; left: -30px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(0,168,150,0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
        .wolv-wallet-inner { position: relative; z-index: 1; }
        .wolv-wallet-icon-ring { display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 20px; background: linear-gradient(135deg, rgba(42,82,190,0.35), rgba(0,168,150,0.25)); border: 1px solid rgba(42,82,190,0.3); margin-bottom: 20px; font-size: 28px; box-shadow: 0 8px 24px rgba(42,82,190,0.2); }
        .wolv-wallet-title { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 8px; }
        .wolv-wallet-desc { color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.7; margin: 0 0 24px; }
        .wolv-wallet-cta-wrap { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 20px; }
        .wolv-wallet-cta-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 12px; }
        .wolv-wallet-features { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px; }
        .wolv-wallet-feature { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.5); }
        .wolv-wallet-feature-dot { width: 6px; height: 6px; border-radius: 50%; background: #00c9b1; flex-shrink: 0; }
        .dashboard-wolv-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px; position: relative; z-index: 1; }
        .dashboard-wolv-link { color: #00c9b1; font-size: 13px; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .dashboard-wolv-link:hover { color: #00e8d1; text-decoration: underline; }
        .dashboard-wolv-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 14px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; text-decoration: none; font-weight: 700; font-size: 14px; transition: all 0.2s; box-shadow: 0 8px 20px rgba(37,99,235,0.3); }
        .dashboard-wolv-button:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(37,99,235,0.4); }
        .dashboard-wolv-button.secondary { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; box-shadow: none; }
        .dashboard-wolv-button.secondary:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); }
        .dashboard-wolv-benefits { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 36px; }
        .dashboard-wolv-benefit { background: linear-gradient(135deg, rgba(0,168,150,0.1) 0%, rgba(42,82,190,0.08) 100%); border: 1px solid rgba(0,168,150,0.2); border-radius: 24px; padding: 28px; text-align: center; transition: all 0.3s ease; }
        .dashboard-wolv-benefit:hover { border-color: rgba(0,168,150,0.4); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,168,150,0.1); }
        .dashboard-wolv-benefit-icon { font-size: 40px; margin-bottom: 16px; display: block; }
        .dashboard-wolv-benefit h3 { margin: 0 0 8px; font-size: 18px; font-weight: 700; }
        .dashboard-wolv-benefit p { margin: 0; color: rgba(255,255,255,0.55); font-size: 13px; line-height: 1.6; }
        @media (max-width: 768px) {
          .dashboard-wolv-header { gap: 16px; margin-bottom: 32px; }
          .dashboard-wolv-header h1 { font-size: 32px; }
          .dashboard-wolv-header p { font-size: 14px; }
          .dashboard-wolv-grid { gap: 16px; margin-bottom: 24px; }
          .dashboard-wolv-card { padding: 24px; }
        }
      `}</style>
      <div className="dashboard-wolv-container">

      <div className="dashboard-wolv-header">
        <div className="title-block">
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            WOLV Token Dashboard
          </div>
          <h1>WOLV rewards, staking, and wallet access — all inside your dashboard.</h1>
          <p>
            This dashboard page keeps your WOLV experience internal so you can connect your wallet,
            claim staking rewards, and learn about token utility without leaving the dashboard.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Link href="/dashboard" className="dashboard-wolv-button" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}>
            Back to Overview
          </Link>
          <Link href="/dashboard/new-investment" className="dashboard-wolv-button">
            New Investment
          </Link>
        </div>
      </div>

      <div className="dashboard-wolv-grid">
        <div className="wolv-wallet-card">
          <div className="wolv-wallet-inner">
            <div className="wolv-wallet-icon-ring">🔗</div>
            <h2 className="wolv-wallet-title">Connect Your Wallet</h2>
            <p className="wolv-wallet-desc">
              Link your Web3 wallet to claim WOLV tokens earned through staking rewards and monitor
              your on-chain reward balance directly from your dashboard.
            </p>
            <div className="wolv-wallet-cta-wrap">
              <div className="wolv-wallet-cta-label">Wallet Connection</div>
              <WalletProvider>
                <WolvWalletSection />
              </WalletProvider>
              <div className="wolv-wallet-features">
                <div className="wolv-wallet-feature"><span className="wolv-wallet-feature-dot" />BNB Smart Chain</div>
                <div className="wolv-wallet-feature"><span className="wolv-wallet-feature-dot" />Non-custodial</div>
                <div className="wolv-wallet-feature"><span className="wolv-wallet-feature-dot" />Instant rewards</div>
                <div className="wolv-wallet-feature"><span className="wolv-wallet-feature-dot" />Secure &amp; private</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-wolv-card">
          <h2>WOLV Token Overview</h2>
          <p>
            WOLV is the native utility token of WolvCapital. It represents proof of returns from your investments and is earned through our staking and rewards system.
          </p>
          <div className="dashboard-wolv-list">
            {dashboardWolvStats.map((stat) => (
              <div key={stat.label} className="dashboard-wolv-list-item">
                <span>{stat.label}</span>
                <span>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-wolv-grid">
        <div className="dashboard-wolv-card" style={{ gridColumn: "1 / -1" }}>
          <h2>Why WOLV stays inside your dashboard</h2>
          <p>
            This page keeps WOLV token details and wallet actions inside the dashboard so users do not get redirected away from their portfolio.
            If users need to return to their investments or dashboard tools, they can do so instantly from here.
          </p>
          <div className="dashboard-wolv-actions">
            <Link href="/dashboard/transactions" className="dashboard-wolv-link">View recent transactions</Link>
            <Link href="/dashboard/support" className="dashboard-wolv-link">Ask support</Link>
            <Link href="/dashboard/kyc" className="dashboard-wolv-link">Complete KYC</Link>
          </div>
        </div>
      </div>

      <div className="dashboard-wolv-benefits">
        {wolvBenefits.map((benefit) => (
          <div key={benefit.title} className="dashboard-wolv-benefit">
            <div className="dashboard-wolv-benefit-icon">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.desc}</p>
          </div>
        ))}
      </div>

      </div>
    </div>
  );
}