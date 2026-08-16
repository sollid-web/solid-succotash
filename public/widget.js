(function() {
  'use strict';

  var config = window.NeuralSupportConfig || {};

  // Auto-fix: force .convex.cloud — /api/query and /api/mutation only work on .convex.cloud, not .convex.site
  var CONVEX_URL = (config.convexUrl || 'https://quirky-spider-81.convex.cloud').replace(/\/+$/, '').replace('.convex.site', '.convex.cloud');

  var SITE_URL = config.siteUrl || 'https://wolvcapital.com';
  var PRIMARY = config.primaryColor || '#2A52BE';
  var GREETING = config.greeting || 'Hi! How can I help you today?';
  var AGENT_NAME = config.agentName || 'Alex';
  var POSITION = config.position || 'right'; // 'right' | 'left'


  // ── Session ID ──────────────────────────────────────────────────────────────
  var SESSION_KEY = 'ns_session_' + SITE_URL;
  var sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  // ── State ───────────────────────────────────────────────────────────────────
  var isOpen = false;
  var conversationId = null;
  var agentMode = false;
  var messages = [];
  var isTyping = false;
  var lastMsgTimestamp = null;
  var visitorName = localStorage.getItem('ns_name_' + SITE_URL) || '';
  var visitorEmail = localStorage.getItem('ns_email_' + SITE_URL) || '';
  var pollInterval = null;

  // ── Convex helpers ──────────────────────────────────────────────────────────
  function convexMutation(name, args) {
    return fetch(CONVEX_URL + '/api/mutation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: name, args: args, format: 'json' }),
    }).then(function(r) { return r.json(); }).then(function(d) { return d.value; });
  }

  function convexQuery(name, args) {
    return fetch(CONVEX_URL + '/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: name, args: args, format: 'json' }),
    }).then(function(r) { return r.json(); }).then(function(d) { return d.value; });
  }

  // ── Inject CSS ──────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = `
    #ns-widget * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    #ns-widget { position: fixed; ${POSITION === 'left' ? 'left: 16px' : 'right: 16px'}; bottom: 16px; z-index: 2147483647; }
    #ns-bubble {
      width: 56px; height: 56px; border-radius: 50%;
      background: ${PRIMARY}; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s; position: relative;
    }
    #ns-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0,0,0,0.35); }
    #ns-bubble svg { width: 24px; height: 24px; fill: white; }
    #ns-badge {
      position: absolute; top: -4px; right: -4px; width: 16px; height: 16px;
      background: #ef4444; border-radius: 50%; border: 2px solid white;
      display: none; align-items: center; justify-content: center;
      font-size: 8px; color: white; font-weight: bold;
    }
    #ns-window {
      position: fixed; ${POSITION === 'left' ? 'left: 16px' : 'right: 16px'}; bottom: 82px;
      width: 360px; max-width: calc(100vw - 32px);
      height: 560px; max-height: calc(100vh - 100px);
      border-radius: 16px; overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);
      display: none; flex-direction: column;
      background: #0f1120; color: #e8eaf0;
      transform: translateY(12px) scale(0.96); opacity: 0;
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
    }
    #ns-window.ns-open { transform: translateY(0) scale(1); opacity: 1; display: flex; }
    #ns-header {
      padding: 14px 16px; display: flex; align-items: center; gap: 12px;
      background: ${PRIMARY}; color: white; flex-shrink: 0;
    }
    #ns-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: rgba(255,255,255,0.22); display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: white;
    }
    #ns-avatar svg { width: 19px; height: 19px; }
    #ns-header-info { flex: 1; min-width: 0; }
    #ns-header-name { font-size: 15px; font-weight: 600; }
    #ns-header-status { font-size: 12px; opacity: 0.88; display: flex; align-items: center; gap: 5px; margin-top: 1px; }
    #ns-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; }
    #ns-close { background: none; border: none; cursor: pointer; color: white; opacity: 0.8; padding: 4px; }
    #ns-close:hover { opacity: 1; }
    #ns-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px;
      scroll-behavior: smooth;
    }
    #ns-messages::-webkit-scrollbar { width: 3px; }
    #ns-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    .ns-msg { display: flex; gap: 8px; max-width: 85%; }
    .ns-msg.ns-visitor { align-self: flex-end; flex-direction: row-reverse; }
    .ns-msg.ns-ai, .ns-msg.ns-agent { align-self: flex-start; }
    .ns-msg-icon {
      width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 11px; margin-top: 2px;
    }
    .ns-msg.ns-ai .ns-msg-icon { background: rgba(99,102,241,0.2); color: #818cf8; }
    .ns-msg.ns-agent .ns-msg-icon { background: rgba(34,197,94,0.2); color: #4ade80; }
    .ns-msg-body { display: flex; flex-direction: column; gap: 2px; }
    .ns-msg-label { font-size: 11px; color: rgba(255,255,255,0.45); padding: 0 6px; font-weight: 500; }
    .ns-bubble-text {
      padding: 10px 14px; border-radius: 14px; font-size: 14.5px; line-height: 1.55;
      word-break: break-word; box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    }
    .ns-msg.ns-visitor .ns-bubble-text { background: ${PRIMARY}; color: white; border-radius: 14px 14px 4px 14px; }
    .ns-msg.ns-ai .ns-bubble-text { background: rgba(255,255,255,0.07); color: #e8eaf0; border-radius: 4px 14px 14px 14px; }
    .ns-msg.ns-agent .ns-bubble-text { background: rgba(34,197,94,0.12); color: #d1fae5; border: 1px solid rgba(34,197,94,0.2); border-radius: 4px 14px 14px 14px; }
    .ns-typing {
      align-self: flex-start; display: flex; gap: 8px; align-items: center;
    }
    .ns-typing-dots { display: flex; gap: 4px; padding: 10px 14px; background: rgba(255,255,255,0.07); border-radius: 14px; }
    .ns-typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.4); animation: ns-bounce 1.2s infinite; }
    .ns-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .ns-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ns-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
    #ns-identity-form { padding: 16px; background: rgba(255,255,255,0.04); border-top: 1px solid rgba(255,255,255,0.07); flex-shrink: 0; }
    #ns-identity-form p { font-size: 12.5px; color: rgba(255,255,255,0.55); margin: 0 0 10px; }
    .ns-input-row { display: flex; gap: 8px; margin-bottom: 8px; }
    .ns-identity-input {
      flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px; padding: 9px 12px; color: #e8eaf0; font-size: 13.5px; outline: none;
    }
    .ns-identity-input:focus { border-color: ${PRIMARY}; }
    .ns-identity-input::placeholder { color: rgba(255,255,255,0.3); }
    #ns-input-area {
      padding: 12px 12px 14px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; gap: 8px; flex-shrink: 0;
      background: rgba(0,0,0,0.2);
    }
    #ns-input {
      flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 10px 14px; color: #e8eaf0; font-size: 14.5px; outline: none; resize: none;
      line-height: 1.45; max-height: 100px; transition: border-color 0.2s;
    }
    #ns-input:focus { border-color: ${PRIMARY}; }
    #ns-input::placeholder { color: rgba(255,255,255,0.3); }
    #ns-send {
      width: 38px; height: 38px; border-radius: 10px; border: none; cursor: pointer;
      background: ${PRIMARY}; color: white; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: opacity 0.2s, transform 0.1s; align-self: flex-end;
    }
    #ns-send:disabled { opacity: 0.4; cursor: default; }
    #ns-send:not(:disabled):hover { opacity: 0.9; transform: scale(1.05); }
    #ns-powered { text-align: center; font-size: 10.5px; color: rgba(255,255,255,0.28); padding: 6px 0 8px; flex-shrink: 0; }
    @media (max-width: 420px) {
      #ns-window { width: calc(100vw - 16px) !important; left: 8px !important; right: 8px !important; height: calc(100vh - 90px) !important; }
    }
  `;
  document.head.appendChild(style);

  // ── Build DOM ───────────────────────────────────────────────────────────────
  var widget = document.createElement('div');
  widget.id = 'ns-widget';
  widget.innerHTML = `
    <div id="ns-window" role="dialog" aria-label="Support Chat">
      <div id="ns-header">
        <div id="ns-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg></div>
        <div id="ns-header-info">
          <div id="ns-header-name">${AGENT_NAME}</div>
          <div id="ns-header-status"><div id="ns-status-dot"></div> Online · Typically replies instantly</div>
        </div>
        <button id="ns-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div id="ns-messages"></div>
      <div id="ns-identity-form" style="display:none">
        <p>Help us personalize your support (optional)</p>
        <div class="ns-input-row">
          <input id="ns-name-inp" class="ns-identity-input" placeholder="Your name" value="">
          <input id="ns-email-inp" class="ns-identity-input" placeholder="Email address" value="">
        </div>
        <button id="ns-identity-skip" style="font-size:11px;background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;padding:0">Skip</button>
      </div>
      <div id="ns-input-area">
        <textarea id="ns-input" placeholder="Type a message..." rows="1" aria-label="Message input"></textarea>
        <button id="ns-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div id="ns-powered">Powered by NeuralSupport AI</div>
    </div>
    <button id="ns-bubble" aria-label="Open support chat">
      <div id="ns-badge"></div>
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  var $window = document.getElementById('ns-window');
  var $bubble = document.getElementById('ns-bubble');
  var $messages = document.getElementById('ns-messages');
  var $input = document.getElementById('ns-input');
  var $send = document.getElementById('ns-send');
  var $badge = document.getElementById('ns-badge');
  var $identityForm = document.getElementById('ns-identity-form');

  // ── Render a message ────────────────────────────────────────────────────────
  function renderMsg(msg) {
    var div = document.createElement('div');
    div.className = 'ns-msg ns-' + msg.role;
    div.dataset.id = msg._id || msg.tempId || '';

    var AGENT_ICON = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>';
    var AI_ICON = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>';
    var iconSvg = msg.role === 'agent' ? AGENT_ICON : msg.role === 'ai' ? AI_ICON : '';
    var icon = msg.role !== 'visitor' ? '<div class="ns-msg-icon">' + iconSvg + '</div>' : '';
    var label = '';
    if (msg.role === 'agent' && msg.agentName) label = '<div class="ns-msg-label">' + msg.agentName + '</div>';

    div.innerHTML = icon + '<div class="ns-msg-body">' + label + '<div class="ns-bubble-text">' + (msg.role === 'visitor' ? escapeHtml(msg.content) : renderMarkdown(msg.content)) + '</div></div>';
    return div;
  }

  function renderMarkdown(s) {
    var e = String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    e = e.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    e = e.replace(/\*(.+?)\*/g, '<em>$1</em>');
    e = e.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#818cf8;text-decoration:underline;">$1</a>');
    e = e.replace(/^[\-\*] (.+)$/gm, '<li style="margin:2px 0;">$1</li>');
    e = e.replace(/(<li[^>]*>(?:.|\n)*?<\/li>(?:\n<li[^>]*>(?:.|\n)*?<\/li>)*)/g, '<ul style="margin:4px 0;padding-left:16px;list-style:disc;">$1</ul>');
    e = e.replace(/\n/g, '<br>');
    return e;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function addMessage(msg) {
    messages.push(msg);
    $messages.appendChild(renderMsg(msg));
    scrollToBottom();
  }

  function scrollToBottom() {
    $messages.scrollTop = $messages.scrollHeight;
  }

  function showTyping() {
    removeTyping();
    var t = document.createElement('div');
    t.className = 'ns-msg ns-ai ns-typing';
    t.id = 'ns-typing';
    t.innerHTML = '<div class="ns-typing-dots"><span></span><span></span><span></span></div>';
    $messages.appendChild(t);
    scrollToBottom();
  }

  function removeTyping() {
    var t = document.getElementById('ns-typing');
    if (t) t.remove();
  }

  // ── Open / close ────────────────────────────────────────────────────────────
  function openWidget() {
    isOpen = true;
    $window.style.display = 'flex';
    requestAnimationFrame(function() { $window.classList.add('ns-open'); });
    $badge.style.display = 'none';
    $input.focus();
    if (messages.length === 0) {
      addMessage({ _id: 'greeting', role: 'ai', content: GREETING });
      if (!visitorName) showIdentityForm();
    }
    startPolling();
  }

  function closeWidget() {
    isOpen = false;
    $window.classList.remove('ns-open');
    setTimeout(function() { $window.style.display = 'none'; }, 250);
    stopPolling();
  }

  $bubble.addEventListener('click', function() {
    if (isOpen) closeWidget(); else openWidget();
  });
  document.getElementById('ns-close').addEventListener('click', closeWidget);

  // ── Identity form ───────────────────────────────────────────────────────────
  function showIdentityForm() {
    $identityForm.style.display = 'block';
    var nameInp = document.getElementById('ns-name-inp');
    var emailInp = document.getElementById('ns-email-inp');
    nameInp.value = visitorName;
    emailInp.value = visitorEmail;

    function saveIdentity() {
      visitorName = nameInp.value.trim();
      visitorEmail = emailInp.value.trim();
      if (visitorName) localStorage.setItem('ns_name_' + SITE_URL, visitorName);
      if (visitorEmail) localStorage.setItem('ns_email_' + SITE_URL, visitorEmail);
      $identityForm.style.display = 'none';
      updateVisitorInfo();
    }

    document.getElementById('ns-identity-skip').onclick = function() { $identityForm.style.display = 'none'; };
    nameInp.onkeydown = emailInp.onkeydown = function(e) { if (e.key === 'Enter') saveIdentity(); };
  }

  function updateVisitorInfo() {
    if (visitorName || visitorEmail) {
      convexMutation('visitors:upsertVisitor', {
        sessionId: sessionId,
        name: visitorName || undefined,
        email: visitorEmail || undefined,
      }).catch(function(){});
    }
  }

  // ── Send message ────────────────────────────────────────────────────────────
  function sendMessage() {
    var content = $input.value.trim();
    if (!content) return;
    $input.value = '';
    $input.style.height = '';

    addMessage({ tempId: 'tmp_' + Date.now(), role: 'visitor', content: content });
    showTyping();

    convexMutation('widget:visitorSendMessage', {
      sessionId: sessionId,
      content: content,
      siteUrl: SITE_URL,
    }).then(function(result) {
      if (result) conversationId = result.conversationId;
    }).catch(function(e) {
      removeTyping();
      addMessage({ tempId: 'err_' + Date.now(), role: 'ai', content: 'Sorry, something went wrong. Please try again.' });
    });
  }

  $send.addEventListener('click', sendMessage);
  $input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  $input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  });

  // ── Polling for new messages ─────────────────────────────────────────────────
  function startPolling() {
    if (pollInterval) return;
    pollInterval = setInterval(pollMessages, 1500);
  }

  function stopPolling() {
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
  }

  function pollMessages() {
    var convoId = conversationId;
    if (!convoId) {
      convexQuery('conversations:getConversationBySession', { sessionId: sessionId }).then(function(convo) {
        if (convo) conversationId = convo._id;
      }).catch(function(){});
      return;
    }

    convexQuery('messages:getMessages', { conversationId: convoId }).then(function(serverMsgs) {
      if (!serverMsgs || !serverMsgs.length) return;

      var knownIds = new Set(messages.map(function(m) { return m._id; }));
      var newMsgs = serverMsgs.filter(function(m) { return !knownIds.has(m._id) && m.role !== 'visitor'; });

      if (newMsgs.length > 0) {
        removeTyping();
        newMsgs.forEach(function(m) {
          addMessage(m);
          if (!isOpen) {
            $badge.style.display = 'flex';
            $badge.textContent = '!';
          }
        });
      }

      convexQuery('conversations:getConversationBySession', { sessionId: sessionId }).then(function(convo) {
        if (convo) agentMode = convo.agentMode;
      }).catch(function(){});
    }).catch(function(){});
  }

  // ── Init widget ─────────────────────────────────────────────────────────────
  convexMutation('widget:widgetInit', {
    sessionId: sessionId,
    currentPage: window.location.href,
    currentPageTitle: document.title,
    referrer: document.referrer || undefined,
    userAgent: navigator.userAgent,
    siteUrl: SITE_URL,
  }).catch(function(){});

  // Track page navigation (SPA-friendly)
  var lastPage = window.location.href;
  setInterval(function() {
    if (window.location.href !== lastPage) {
      lastPage = window.location.href;
      convexMutation('visitors:updateVisitorPage', {
        sessionId: sessionId,
        currentPage: window.location.href,
        currentPageTitle: document.title,
      }).catch(function(){});
    }
  }, 1500);

  // Get geo location
  fetch('https://ip-api.com/json/?fields=country,city,query').then(function(r) { return r.json(); }).then(function(geo) {
    convexMutation('visitors:updateVisitorLocation', {
      sessionId: sessionId,
      country: geo.country || undefined,
      city: geo.city || undefined,
      ip: geo.query || undefined,
    }).catch(function(){});
  }).catch(function(){});

  // Mark offline on page leave
  window.addEventListener('beforeunload', function() {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(CONVEX_URL + '/api/mutation', JSON.stringify({
        path: 'visitors:markVisitorOffline',
        args: { sessionId: sessionId },
        format: 'json',
      }));
    }
  });

})();