(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,233525,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"warnOnce",{enumerable:!0,get:function(){return o}});let o=e=>{}},37973,e=>{"use strict";var t=e.i(843476),i=e.i(271645);let o="https://supportai-maxmmdqp.manus.space";function n(){let e=(0,i.useRef)(null),[n,r]=(0,i.useState)(null);return((0,i.useEffect)(()=>{r(`${o}/embed?page=${encodeURIComponent(window.location.href)}`)},[]),(0,i.useEffect)(()=>{let t=e.current;if(!t)return;function i(){t?.contentWindow?.postMessage({source:"wolvcapital-ai",type:"navigation",pageUrl:window.location.href,pageTitle:document.title},o)}t.addEventListener("load",i);let n={};return["pushState","replaceState"].forEach(e=>{n[e]=window.history[e],window.history[e]=function(...t){let o=n[e].apply(this,t);return i(),o}}),window.addEventListener("popstate",i),()=>{t.removeEventListener("load",i),["pushState","replaceState"].forEach(e=>{n[e]&&(window.history[e]=n[e])}),window.removeEventListener("popstate",i)}},[n]),n)?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:`
        #wolvai-widget-frame {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 400px;
          height: 660px;
          max-width: 100vw;
          max-height: 100vh;
          border: 0;
          background: transparent;
          z-index: 2147483000;
          color-scheme: light;
        }
        @media (max-width: 480px) {
          #wolvai-widget-frame {
            width: 100vw;
            height: 220px;
          }
        }
      `}),(0,t.jsx)("iframe",{id:"wolvai-widget-frame",ref:e,src:n,title:"Wolvcapital AI support",allow:"clipboard-write",loading:"lazy"})]}):null}e.s(["default",()=>n])}]);