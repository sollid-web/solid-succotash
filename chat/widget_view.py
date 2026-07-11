from django.http import HttpResponse
from django.views.decorators.http import require_GET

WIDGET_JS = r"""(function(){
if(window.__wolvChat)return;
window.__wolvChat=true;

var API="https://django-beige.vercel.app/api/chat";
var SK="wolv_sid";
var sid=localStorage.getItem(SK);
if(!sid){sid="wv_"+Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem(SK,sid);}

/* ── Shadow host ── */
var host=document.createElement("div");
host.style.cssText="position:fixed;bottom:20px;right:20px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
document.body.appendChild(host);
var root=host.attachShadow({mode:"open"});

/* ── Styles ── */
var css=`
*{box-sizing:border-box;margin:0;padding:0;}
.bubble{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#0d1f3c,#1a3a6e);border:2px solid #d4af37;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(0,0,0,.45);transition:transform .2s;}
.bubble:hover{transform:scale(1.07);}
.bubble svg{width:26px;height:26px;fill:#d4af37;}
.badge{position:absolute;top:-3px;right:-3px;width:18px;height:18px;background:#ef4444;border-radius:50%;border:2px solid #0a0e1a;display:none;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;}
.badge.show{display:flex;}
.panel{position:absolute;bottom:70px;right:0;width:370px;max-width:calc(100vw - 24px);height:580px;max-height:calc(100dvh - 110px);background:#07101f;border:1px solid rgba(255,255,255,.08);border-radius:18px;box-shadow:0 24px 64px rgba(0,0,0,.6);display:none;flex-direction:column;overflow:hidden;}
.panel.open{display:flex;}
/* Header */
.hdr{padding:14px 16px;background:linear-gradient(135deg,#0a1628,#0f2044);border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:12px;flex-shrink:0;}
.av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#1e3a5f,#2563eb);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:#fff;flex-shrink:0;border:2px solid #d4af37;}
.hdr-meta{flex:1;}
.hdr-name{font-size:14px;font-weight:600;color:#f0f4ff;}
.hdr-sub{font-size:11px;color:#64748b;display:flex;align-items:center;gap:5px;margin-top:2px;}
.dot{width:6px;height:6px;border-radius:50%;background:#10b981;flex-shrink:0;}
.close-btn{background:transparent;border:0;color:#475569;cursor:pointer;font-size:22px;line-height:1;padding:2px 4px;}
.close-btn:hover{color:#94a3b8;}
/* Agent banner */
.agent-banner{background:rgba(37,99,235,.12);border-bottom:1px solid rgba(37,99,235,.2);padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}
.agent-av{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#2563eb);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;}
.agent-info{flex:1;}
.agent-name{font-size:12px;font-weight:600;color:#93c5fd;}
.agent-role{font-size:11px;color:#475569;}
/* Messages */
.msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:8px;background:#060d1c;}
.msgs::-webkit-scrollbar{width:4px;}
.msgs::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:4px;}
/* Bubbles */
.m{max-width:82%;display:flex;flex-direction:column;}
.m.user{align-self:flex-end;}
.m.assistant{align-self:flex-start;}
.m.system{align-self:center;}
.bubble-inner{padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.55;white-space:pre-wrap;word-wrap:break-word;}
.m.user .bubble-inner{background:#d4af37;color:#0a1628;border-bottom-right-radius:4px;font-weight:500;}
.m.assistant .bubble-inner{background:#0f1f38;color:#e2e8f0;border:1px solid rgba(255,255,255,.07);border-bottom-left-radius:4px;}
.m.agent .bubble-inner{background:rgba(37,99,235,.18);color:#bfdbfe;border:1px solid rgba(37,99,235,.25);border-bottom-left-radius:4px;}
.m.system .bubble-inner{background:transparent;color:#475569;font-size:11px;text-align:center;border:none;padding:4px 8px;}
.meta{font-size:10px;color:#334155;margin-top:3px;padding:0 2px;}
.m.user .meta{text-align:right;}
/* Typing */
.typing .bubble-inner{display:flex;gap:4px;align-items:center;padding:12px 14px;}
.typing span{width:6px;height:6px;border-radius:50%;background:#475569;animation:tp 1.2s infinite;}
.typing span:nth-child(2){animation-delay:.2s;}
.typing span:nth-child(3){animation-delay:.4s;}
@keyframes tp{0%,60%,100%{opacity:.25;}30%{opacity:1;}}
/* Plan cards */
.plans-wrap{display:flex;flex-direction:column;gap:8px;width:100%;max-width:340px;}
.plan-card{background:#0d1f38;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;cursor:pointer;transition:border-color .2s;}
.plan-card:hover{border-color:rgba(99,179,237,.3);}
.plan-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
.plan-name{font-size:14px;font-weight:600;color:#f0f4ff;}
.plan-apy{font-size:18px;font-weight:700;}
.plan-meta{display:flex;gap:12px;margin-bottom:8px;}
.plan-meta span{font-size:11px;color:#64748b;}
.plan-meta strong{color:#94a3b8;}
.plan-cta{display:block;text-align:center;background:rgba(37,99,235,.2);border:1px solid rgba(37,99,235,.3);color:#93c5fd;border-radius:7px;padding:7px;font-size:12px;font-weight:600;text-decoration:none;transition:background .2s;}
.plan-cta:hover{background:rgba(37,99,235,.35);}
/* Input area */
.frm{padding:10px 12px;border-top:1px solid rgba(255,255,255,.07);background:#07101f;flex-shrink:0;}
.frm-row{display:flex;gap:8px;}
.ipt{flex:1;background:#0f1f38;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px;color:#e2e8f0;font-size:13px;outline:none;font-family:inherit;resize:none;max-height:90px;line-height:1.4;}
.ipt:focus{border-color:#d4af37;}
.ipt::placeholder{color:#334155;}
.snd{background:#d4af37;color:#0a1628;border:0;border-radius:10px;padding:0 16px;font-weight:700;cursor:pointer;font-size:13px;flex-shrink:0;}
.snd:disabled{opacity:.4;cursor:not-allowed;}
.actions{display:flex;justify-content:center;padding:7px 0 0;}
.human-btn{background:transparent;border:0;color:#475569;font-size:11px;cursor:pointer;text-decoration:underline;}
.human-btn:hover{color:#94a3b8;}
`;
var style=document.createElement("style");style.textContent=css;root.appendChild(style);

/* ── HTML ── */
var wrap=document.createElement("div");
wrap.innerHTML=`
<div style="position:relative;display:inline-block;">
  <button class="bubble" id="bub" aria-label="Chat with WolvCapital">
    <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
  </button>
  <div class="badge" id="bdg">1</div>
</div>
<div class="panel" id="pnl">
  <div class="hdr">
    <div class="av">W</div>
    <div class="hdr-meta">
      <div class="hdr-name" id="agentName">WolvCapital Support</div>
      <div class="hdr-sub"><span class="dot"></span><span id="agentStatus">Alex · Typically replies instantly</span></div>
    </div>
    <button class="close-btn" id="cls">&times;</button>
  </div>
  <div class="agent-banner" id="agentBanner" style="display:none;">
    <div class="agent-av">A</div>
    <div class="agent-info">
      <div class="agent-name">Agent joined the conversation</div>
      <div class="agent-role">WolvCapital Support Specialist</div>
    </div>
  </div>
  <div class="msgs" id="msgs"></div>
  <div class="frm">
    <div class="frm-row">
      <textarea class="ipt" id="ipt" rows="1" placeholder="Ask about investments, staking, fees..."></textarea>
      <button class="snd" id="snd">Send</button>
    </div>
    <div class="actions">
      <button class="human-btn" id="hum">Talk to a human agent</button>
    </div>
  </div>
</div>
`;
root.appendChild(wrap);

var bub=root.getElementById("bub"),
    pnl=root.getElementById("pnl"),
    cls=root.getElementById("cls"),
    msgs=root.getElementById("msgs"),
    ipt=root.getElementById("ipt"),
    snd=root.getElementById("snd"),
    hum=root.getElementById("hum"),
    bdg=root.getElementById("bdg"),
    agentBanner=root.getElementById("agentBanner"),
    agentName=root.getElementById("agentName"),
    agentStatus=root.getElementById("agentStatus");

var state={opened:false,sending:false,lastCount:0,pollTimer:null,humanActive:false};

/* ── Helpers ── */
function ts(iso){
  var d=new Date(iso);
  return d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
}

function addTextMsg(role,content,isoTime,isHuman){
  var cls2=isHuman?"agent":role;
  var d=document.createElement("div");
  d.className="m "+cls2;
  var label=isHuman?"👤 Agent":role==="assistant"?"🤖 Alex":"";
  d.innerHTML='<div class="bubble-inner">'+escHtml(content)+'</div>'
    +(isoTime?'<div class="meta">'+(label?label+" · ":"")+ts(isoTime)+'</div>':"");
  msgs.appendChild(d);
  msgs.scrollTop=msgs.scrollHeight;
}

function addSystemMsg(text){
  var d=document.createElement("div");
  d.className="m system";
  d.innerHTML='<div class="bubble-inner">'+escHtml(text)+'</div>';
  msgs.appendChild(d);
  msgs.scrollTop=msgs.scrollHeight;
}

function addPlanCards(plans,isoTime){
  var d=document.createElement("div");
  d.className="m assistant";
  var cards='<div class="plans-wrap">';
  plans.forEach(function(p){
    cards+='<div class="plan-card">'
      +'<div class="plan-top"><span class="plan-name">'+escHtml(p.name)+'</span>'
      +'<span class="plan-apy" style="color:'+p.color+'">'+escHtml(p.apy)+'</span></div>'
      +'<div class="plan-meta">'
      +'<span><strong>'+escHtml(p.min)+'</strong> min</span>'
      +'<span><strong>'+escHtml(p.duration)+'</strong></span>'
      +'<span>'+escHtml(p.best_for)+'</span>'
      +'</div>'
      +'<a class="plan-cta" href="'+p.url+'" target="_blank">View '+escHtml(p.name)+' Plan →</a>'
      +'</div>';
  });
  cards+='</div>';
  d.innerHTML=cards+(isoTime?'<div class="meta" style="margin-top:6px;">'+ts(isoTime)+'</div>':"");
  msgs.appendChild(d);
  msgs.scrollTop=msgs.scrollHeight;
}

function addUserMsg(content){
  var d=document.createElement("div");
  d.className="m user";
  d.innerHTML='<div class="bubble-inner">'+escHtml(content)+'</div>'
    +'<div class="meta">'+new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})+'</div>';
  msgs.appendChild(d);
  msgs.scrollTop=msgs.scrollHeight;
}

function showTyping(on){
  var t=root.getElementById("typing-ind");
  if(on&&!t){
    t=document.createElement("div");t.id="typing-ind";t.className="m assistant typing";
    t.innerHTML='<div class="bubble-inner"><span></span><span></span><span></span></div>';
    msgs.appendChild(t);msgs.scrollTop=msgs.scrollHeight;
  }else if(!on&&t)t.remove();
}

function setAgentMode(on){
  state.humanActive=on;
  if(on){
    agentBanner.style.display="flex";
    agentName.textContent="Support Specialist";
    agentStatus.textContent="Human agent · Active now";
    hum.style.display="none";
  }
}

function escHtml(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* ── Load history ── */
async function loadHistory(){
  try{
    var r=await fetch(API+"/messages/"+sid+"/");
    var j=await r.json();
    var list=j.messages||[];
    msgs.innerHTML="";
    if(!list.length){
      addTextMsg("assistant","Welcome to WolvCapital! I'm Alex, your support advisor. Ask me about our investment plans, staking, fees, or how to get started.");
    }else{
      list.forEach(function(m){
        if(m.is_human_handover){setAgentMode(true);addTextMsg("assistant",m.content,m.created_at,true);}
        else addTextMsg(m.role,m.content,m.created_at,false);
      });
    }
    state.lastCount=list.length;
  }catch(e){}
}

/* ── Poll ── */
function startPolling(){
  if(state.pollTimer)return;
  state.pollTimer=setInterval(async function(){
    if(!pnl.classList.contains("open"))return;
    try{
      var r=await fetch(API+"/messages/"+sid+"/");
      var j=await r.json();
      var list=j.messages||[];
      if(list.length>state.lastCount){
        for(var i=state.lastCount;i<list.length;i++){
          var m=list[i];
          if(m.is_human_handover){setAgentMode(true);addTextMsg("assistant",m.content,m.created_at,true);}
          else if(m.role==="assistant")addTextMsg("assistant",m.content,m.created_at,false);
        }
        state.lastCount=list.length;
        if(!pnl.classList.contains("open")){bdg.classList.add("show");}
      }
    }catch(e){}
  },3500);
}

/* ── Send ── */
async function send(){
  var v=ipt.value.trim();if(!v||state.sending)return;
  state.sending=true;snd.disabled=true;
  ipt.value="";ipt.style.height="auto";
  addUserMsg(v);state.lastCount++;
  showTyping(true);
  try{
    var r=await fetch(API+"/",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({session_id:sid,message:v})});
    var j=await r.json();
    showTyping(false);
    if(j.human_active){
      /* silent — agent reply will arrive via poll */
    }else if(j.type==="plans"&&j.plans){
      addTextMsg("assistant",j.reply);
      addPlanCards(j.plans);
      state.lastCount+=2;
    }else if(j.reply){
      addTextMsg("assistant",j.reply);
      state.lastCount++;
    }else if(j.error){
      addSystemMsg("Something went wrong. Please try again.");
    }
  }catch(e){showTyping(false);addSystemMsg("Connection error. Please try again.");}
  state.sending=false;snd.disabled=false;
}

/* ── Open/close ── */
function openChat(){
  pnl.classList.add("open");
  bdg.classList.remove("show");
  if(!state.opened){state.opened=true;loadHistory();startPolling();}
  setTimeout(function(){ipt.focus();},100);
}

bub.addEventListener("click",openChat);
cls.addEventListener("click",function(){pnl.classList.remove("open");});
snd.addEventListener("click",send);
ipt.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}});
ipt.addEventListener("input",function(){ipt.style.height="auto";ipt.style.height=Math.min(ipt.scrollHeight,90)+"px";});

/* ── Human handover ── */
hum.addEventListener("click",async function(){
  try{
    await fetch(API+"/human/",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({session_id:sid})});
    addSystemMsg("Connecting you with a support specialist…");
    hum.disabled=true;
  }catch(e){}
});

/* ── Visitor ping ── */
try{fetch(API+"/visitor/",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({session_id:sid,page:location.href})});}catch(e){}
})();"""

@require_GET
def widget_js(request):
    resp = HttpResponse(WIDGET_JS, content_type="application/javascript; charset=utf-8")
    resp["Access-Control-Allow-Origin"] = "*"
    resp["Cache-Control"] = "public, max-age=60"
    return resp
