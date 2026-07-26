from django.http import HttpResponse
from django.views.decorators.http import require_GET

WIDGET_JS = r"""(function(){
  if (window.__wolvChat) return;
  window.__wolvChat = true;
  var API = "https://api.wolvcapital.com/api/chat";
  var SS_KEY = "wolv_chat_session";
  var sid = localStorage.getItem(SS_KEY);
  if (!sid) { sid = "wv_" + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(SS_KEY, sid); }

  var host = document.createElement("div");
  host.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:2147483647;";
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: "open" });

  var css = "*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}"
    + ".bubble{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#0a1628,#1e3a5f);border:2px solid #d4af37;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.4);transition:transform .2s}"
    + ".bubble:hover{transform:scale(1.06)} .bubble svg{width:28px;height:28px;fill:#d4af37}"
    + ".panel{position:absolute;bottom:80px;right:0;width:380px;max-width:calc(100vw - 40px);height:560px;max-height:calc(100vh - 120px);background:#0a1628;border:1px solid #1e3a5f;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);display:none;flex-direction:column;overflow:hidden;color:#e5e7eb}"
    + ".panel.open{display:flex}"
    + ".hdr{padding:16px 18px;background:linear-gradient(135deg,#0a1628,#162846);border-bottom:1px solid #1e3a5f;display:flex;align-items:center;gap:12px}"
    + ".hdr .logo{width:36px;height:36px;border-radius:8px;background:#d4af37;display:flex;align-items:center;justify-content:center;font-weight:700;color:#0a1628}"
    + ".hdr .meta{flex:1} .hdr .name{font-weight:600;font-size:14px;color:#fff} .hdr .sub{font-size:11px;color:#8aa0c0;display:flex;align-items:center;gap:6px}"
    + ".hdr .dot{width:6px;height:6px;border-radius:50%;background:#10b981} .hdr .close{background:transparent;border:0;color:#8aa0c0;cursor:pointer;font-size:20px;padding:4px}"
    + ".msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#06101f}"
    + ".msgs::-webkit-scrollbar{width:6px} .msgs::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:3px}"
    + ".m{max-width:80%;padding:10px 14px;border-radius:14px;font-size:13.5px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}"
    + ".m.user{align-self:flex-end;background:#d4af37;color:#0a1628;border-bottom-right-radius:4px}"
    + ".m.assistant{align-self:flex-start;background:#162846;color:#e5e7eb;border-bottom-left-radius:4px;border:1px solid #1e3a5f}"
    + ".m.system{align-self:center;font-size:11px;color:#6b7d99;text-align:center;background:transparent}"
    + ".typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:#162846;border-radius:14px;border:1px solid #1e3a5f}"
    + ".typing span{width:6px;height:6px;border-radius:50%;background:#8aa0c0;animation:tp 1.2s infinite}"
    + ".typing span:nth-child(2){animation-delay:.2s} .typing span:nth-child(3){animation-delay:.4s}"
    + "@keyframes tp{0%,60%,100%{opacity:.3}30%{opacity:1}}"
    + ".frm{padding:12px;border-top:1px solid #1e3a5f;background:#0a1628}"
    + ".row{display:flex;gap:8px}"
    + ".ipt{flex:1;background:#162846;border:1px solid #1e3a5f;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;outline:none;font-family:inherit;resize:none;max-height:100px}"
    + ".ipt:focus{border-color:#d4af37}"
    + ".btn{background:#d4af37;color:#0a1628;border:0;border-radius:10px;padding:0 14px;font-weight:600;cursor:pointer;font-size:13px}"
    + ".btn:disabled{opacity:.5;cursor:not-allowed}"
    + ".actions{display:flex;justify-content:center;padding:8px 0 0} .lnk{background:transparent;border:0;color:#8aa0c0;font-size:11px;cursor:pointer;text-decoration:underline}";
  var style = document.createElement("style"); style.textContent = css; root.appendChild(style);

  var wrap = document.createElement("div");
  wrap.innerHTML = '<button class="bubble" id="bub" aria-label="Open chat"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></button>'
    + '<div class="panel" id="pnl">'
    + '<div class="hdr"><div class="logo">W</div><div class="meta"><div class="name">WolvCapital Support</div><div class="sub"><span class="dot"></span>Typically replies instantly</div></div><button class="close" id="cls">&times;</button></div>'
    + '<div class="msgs" id="msgs"></div>'
    + '<div class="frm"><div class="row"><textarea class="ipt" id="ipt" rows="1" placeholder="Ask about investments, staking, fees..."></textarea><button class="btn" id="snd">Send</button></div>'
    + '<div class="actions"><button class="lnk" id="hum">Talk to a human agent</button></div></div>'
    + '</div>';
  root.appendChild(wrap);

  var bub = root.getElementById("bub"), pnl = root.getElementById("pnl"), cls = root.getElementById("cls");
  var msgs = root.getElementById("msgs"), ipt = root.getElementById("ipt"), snd = root.getElementById("snd"), hum = root.getElementById("hum");
  var state = { opened:false, sending:false, lastCount:0, pollTimer:null };

  function el(role, content){ var d=document.createElement("div"); d.className="m "+role; d.textContent=content; return d; }
  function addMsg(role, content){ msgs.appendChild(el(role, content)); msgs.scrollTop = msgs.scrollHeight; }
  function showTyping(on){ var t=root.getElementById("typing"); if(on&&!t){t=document.createElement("div");t.id="typing";t.className="typing";t.innerHTML="<span></span><span></span><span></span>";msgs.appendChild(t);msgs.scrollTop=msgs.scrollHeight;} else if(!on&&t)t.remove(); }

  async function loadHistory(){
    try {
      var r = await fetch(API + "/messages/" + sid + "/");
      var j = await r.json();
      var list = j.messages || [];
      msgs.innerHTML = "";
      if (!list.length) {
        addMsg("assistant", "Welcome to WolvCapital! I'm Alex, your support advisor. Ask me about our investment plans, staking, fees, or how to get started.");
      } else {
        list.forEach(function(m){ addMsg(m.role, m.content); });
      }
      state.lastCount = list.length;
    } catch(e){}
  }

  function startPolling(){
    if (state.pollTimer) return;
    state.pollTimer = setInterval(async function(){
      if (!pnl.classList.contains("open")) return;
      try {
        var r = await fetch(API + "/messages/" + sid + "/");
        var j = await r.json();
        var list = j.messages || [];
        if (list.length > state.lastCount) {
          for (var i=state.lastCount; i<list.length; i++){ addMsg(list[i].role, list[i].content); }
          state.lastCount = list.length;
        }
      } catch(e){}
    }, 4000);
  }

  async function send(){
    var v = ipt.value.trim(); if(!v || state.sending) return;
    state.sending = true; snd.disabled = true;
    ipt.value=""; ipt.style.height="auto";
    addMsg("user", v); state.lastCount++;
    showTyping(true);
    try {
      var r = await fetch(API + "/", { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ session_id: sid, message: v }) });
      var j = await r.json();
      showTyping(false);
      if (j.reply){ addMsg("assistant", j.reply); state.lastCount++; }
      else if (j.human_active){ /* human handling, reply will arrive via poll */ }
      else if (j.error){ addMsg("system", "Something went wrong. Please try again."); }
    } catch(e){ showTyping(false); addMsg("system", "Connection error. Please try again."); }
    state.sending = false; snd.disabled = false;
  }

  function openChat(){
    pnl.classList.add("open");
    if (!state.opened){ state.opened = true; loadHistory(); startPolling(); }
    setTimeout(function(){ ipt.focus(); }, 100);
  }

  bub.addEventListener("click", openChat);
  cls.addEventListener("click", function(){ pnl.classList.remove("open"); });
  snd.addEventListener("click", send);
  ipt.addEventListener("keydown", function(e){ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } });
  ipt.addEventListener("input", function(){ ipt.style.height="auto"; ipt.style.height=Math.min(ipt.scrollHeight,100)+"px"; });
  hum.addEventListener("click", async function(){
    try {
      await fetch(API + "/human/", { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ session_id: sid }) });
      addMsg("system", "Connecting you with a human agent...");
    } catch(e){}
  });

  try {
    fetch(API + "/visitor/", { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ session_id: sid, page: location.href }) });
  } catch(e){}
})();"""


@require_GET
def widget_js(request):
    resp = HttpResponse(WIDGET_JS, content_type="application/javascript; charset=utf-8")
    resp["Access-Control-Allow-Origin"] = "*"
    resp["Cache-Control"] = "public, max-age=300"
    return resp
