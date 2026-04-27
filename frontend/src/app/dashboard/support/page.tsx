'use client'
import Link from 'next/link'

export default function DashboardSupportPage() {
  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>Support</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Get help from our team</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", maxWidth: "800px", marginBottom: "32px" }}>
        {[
          { icon: "💬", title: "Live Chat", desc: "Get instant help with your account or investments", link: "/contact", label: "Start Chat", color: "#3b82f6" },
          { icon: "📧", title: "Email Support", desc: "Send us your questions and we'll respond within 24h", link: "mailto:support@mail.wolvcapital.com", label: "Send Email", color: "#00a896" },
          { icon: "📋", title: "FAQ & Guides", desc: "Browse our help center for common questions", link: "/", label: "Visit Help Center", color: "#8b5cf6" },
        ].map(item => (
          <div key={item.title} style={{ borderRadius: "20px", padding: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>{item.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "20px", lineHeight: 1.6 }}>{item.desc}</p>
            <Link href={item.link} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "10px", background: `rgba(${item.color === "#3b82f6" ? "59,130,246" : item.color === "#00a896" ? "0,168,150" : "139,92,246"},0.15)`, border: `1px solid ${item.color}30`, color: item.color, fontSize: "13px", fontWeight: 600 }}>
              {item.label} →
            </Link>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: "20px", padding: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", maxWidth: "500px" }}>
        <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, marginBottom: "12px" }}>Contact Information</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[["Email", "support@mail.wolvcapital.com"], ["Website", "www.wolvcapital.com"], ["Response Time", "Within 24 hours"]].map(([l,v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{l}</span>
              <span style={{ color: "#fff", fontSize: "13px" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}