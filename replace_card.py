import re

with open("src/app/dashboard/card/page.tsx", "r") as f:
    content = f.read()

new_faces = '''              {/* FRONT FACE */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              >
                <div className="w-full h-full relative" style={{
                  background: "linear-gradient(135deg, #1a3a8f 0%, #1e4db7 20%, #2060cc 40%, #1a8fc1 70%, #0ea5c9 100%)",
                }}>
                  <div className="absolute" style={{
                    top: 0, right: 0, width: "60%", height: "70%",
                    background: "linear-gradient(210deg, rgba(56,189,248,0.32) 0%, rgba(30,120,200,0.08) 55%, transparent 100%)",
                    clipPath: "polygon(100% 0%, 100% 75%, 25% 100%, 0% 35%, 45% 0%)",
                  }} />
                  <div className="absolute" style={{
                    bottom: 0, left: 0, width: "45%", height: "50%",
                    background: "linear-gradient(45deg, rgba(15,40,110,0.4) 0%, transparent 80%)",
                    clipPath: "polygon(0% 100%, 0% 15%, 75% 0%, 100% 55%, 35% 100%)",
                  }} />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(155deg, transparent 25%, rgba(255,255,255,0.05) 50%, transparent 75%)",
                  }} />
                  <div className="absolute top-0 left-0 right-0 px-4 pt-3 flex justify-between items-start">
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <span style={{ color: "#fff", fontWeight: 800, fontSize: "14px", fontFamily: "Georgia, serif" }}>Wolv</span>
                      <span style={{ color: "#7dd3fc", fontWeight: 800, fontSize: "14px", fontFamily: "Georgia, serif" }}>Capital</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1 }}>
                      <span style={{ color: "#fff", fontFamily: "serif", fontStyle: "italic", fontWeight: 900, fontSize: "19px", letterSpacing: "1px" }}>VISA</span>
                      <span style={{ color: "rgba(255,255,255,0.72)", fontSize: "7.5px", letterSpacing: "2px", marginTop: "1px" }}>Infinite</span>
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: "37%", left: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "36px", height: "27px", borderRadius: "4px",
                      background: "linear-gradient(135deg, #b8860b 0%, #f5d06e 35%, #daa520 55%, #b8860b 100%)",
                      boxShadow: "0 1px 5px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.25)",
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,0.08) 4px,rgba(0,0,0,0.08) 5px), repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(0,0,0,0.08) 4px,rgba(0,0,0,0.08) 5px)",
                      }} />
                      <div style={{
                        position: "absolute", top: "5px", left: "5px", right: "5px", bottom: "5px",
                        background: "linear-gradient(135deg, #c8960c, #f0c83a)",
                        borderRadius: "2px", border: "0.5px solid rgba(0,0,0,0.2)",
                      }} />
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3C8 7 8 17 12 21" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M15.5 6C13 8.5 13 15.5 15.5 18" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M19 9C17.5 10.5 17.5 13.5 19 15" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{ position: "absolute", bottom: "14px", left: "16px", right: "16px" }}>
                    <div style={{ fontFamily: "'Courier New', monospace", color: "#fff", fontSize: "14px", letterSpacing: "0.2em", opacity: 0.92, textShadow: "0 1px 4px rgba(0,0,0,0.4)", marginBottom: "8px" }}>
                      {displayNumber}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ color: "rgba(255,255,255,0.52)", fontSize: "7px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>Card Holder</div>
                        <div style={{ color: "#fff", fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}>{card.cardholder_name || "CARD HOLDER"}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "rgba(255,255,255,0.52)", fontSize: "7px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>Valid Thru</div>
                        <div style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>{formatExpiry(card.expiry_month, card.expiry_year)}</div>
                      </div>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "conic-gradient(from 0deg, #a78bfa, #60a5fa, #34d399, #fbbf24, #f472b6, #a78bfa)",
                        opacity: 0.78, boxShadow: "0 0 10px rgba(167,139,250,0.45)", flexShrink: 0,
                      }} />
                    </div>
                  </div>
                  {isFrozen && (
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(10,30,60,0.72)", backdropFilter: "blur(3px)" }}>
                      <div className="text-center">
                        <div className="text-5xl mb-2">\u2744\ufe0f</div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: "12px", letterSpacing: "3px" }}>CARD FROZEN</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BACK FACE */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="w-full h-full relative" style={{
                  background: "linear-gradient(135deg, #1a3a8f 0%, #1e4db7 30%, #1a8fc1 75%, #0ea5c9 100%)",
                }}>
                  <div className="absolute" style={{
                    top: 0, right: 0, width: "55%", height: "60%",
                    background: "linear-gradient(210deg, rgba(56,189,248,0.22) 0%, transparent 65%)",
                    clipPath: "polygon(100% 0%, 100% 70%, 20% 100%, 0% 30%, 50% 0%)",
                  }} />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(155deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)",
                  }} />
                  <div style={{ position: "absolute", top: "17%", left: 0, right: 0, height: "38px", background: "linear-gradient(180deg, #111 0%, #1a1a1a 50%, #0a0a0a 100%)", boxShadow: "0 2px 6px rgba(0,0,0,0.5)" }} />
                  <div style={{ position: "absolute", top: "7%", left: "14px" }}>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "6.5px", letterSpacing: "0.5px", lineHeight: 1.6 }}>Tel. +1 800 XXX XXXX (Toll-Free USA)</div>
                    <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "6px" }}>WolvCapital Global Contact Center</div>
                  </div>
                  <div style={{ position: "absolute", left: "14px", right: "14px", top: "46%" }}>
                    <div style={{ color: "rgba(255,255,255,0.48)", fontSize: "6.5px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" }}>
                      Authorised Signature — Not valid unless signed
                    </div>
                    <div style={{ display: "flex", alignItems: "stretch", borderRadius: "4px", overflow: "hidden", height: "30px" }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "8px", background: "repeating-linear-gradient(90deg, #ddd 0px, #ddd 1px, #fff 1px, #fff 7px)" }}>
                        <span style={{ fontFamily: "cursive", color: "#aaa", fontSize: "10px", opacity: 0.55 }}>WolvCapital Online Banking</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 10px", background: "#fff", minWidth: "44px" }}>
                        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, color: "#111", fontSize: "13px", letterSpacing: "2px" }}>
                          {showCvv ? card.cvv : "\u2022\u2022\u2022"}
                        </div>
                        <div style={{ color: "#999", fontSize: "5.5px" }}>CVV/CVC</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", left: "14px", right: "14px", top: "67%" }}>
                    <div style={{ color: "rgba(255,255,255,0.42)", fontSize: "6px", lineHeight: 1.65 }}>
                      Issued by WolvCapital Global Services Ltd. Visa Infinite benefits apply. Use this card to manage your account and access bespoke financial features.
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "5.5px", marginTop: "2px" }}>
                      www.wolvcapital.com | global.support@wolvcapital.com
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: "10px", right: "14px", display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1 }}>
                    <span style={{ color: "#fff", fontFamily: "serif", fontStyle: "italic", fontWeight: 900, fontSize: "17px", letterSpacing: "1px" }}>VISA</span>
                    <span style={{ color: "rgba(255,255,255,0.58)", fontSize: "6.5px", letterSpacing: "2px" }}>Infinite</span>
                    <span style={{ color: "rgba(255,255,255,0.38)", fontSize: "5.5px", marginTop: "1px", letterSpacing: "1px" }}>WOLVCAPITAL</span>
                  </div>
                </div>
              </div>'''

# Find and replace between FRONT FACE and closing </div> before </motion.div>
start_marker = '              {/* FRONT FACE */}'
end_marker = '            </motion.div>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("ERROR: Could not find markers!")
    print(f"FRONT FACE found: {start_idx != -1}")
    print(f"motion.div close found: {end_idx != -1}")
else:
    new_content = content[:start_idx] + new_faces + "\n" + content[end_idx:]
    with open("src/app/dashboard/card/page.tsx", "w") as f:
        f.write(new_content)
    print("SUCCESS: Card faces replaced!")

