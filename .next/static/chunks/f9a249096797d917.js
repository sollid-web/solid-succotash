(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,37973,e=>{"use strict";var t=e.i(843476),i=e.i(271645);let o="https://supportai-maxmmdqp.manus.space";function a(){let e=(0,i.useRef)(null),[a,n]=(0,i.useState)(null);return((0,i.useEffect)(()=>{n(`${o}/embed?page=${encodeURIComponent(window.location.href)}`)},[]),(0,i.useEffect)(()=>{let t=e.current;if(!t)return;function i(){t?.contentWindow?.postMessage({source:"wolvcapital-ai",type:"navigation",pageUrl:window.location.href,pageTitle:document.title},o)}t.addEventListener("load",i);let a={};return["pushState","replaceState"].forEach(e=>{a[e]=window.history[e],window.history[e]=function(...t){let o=a[e].apply(this,t);return i(),o}}),window.addEventListener("popstate",i),()=>{t.removeEventListener("load",i),["pushState","replaceState"].forEach(e=>{a[e]&&(window.history[e]=a[e])}),window.removeEventListener("popstate",i)}},[a]),a)?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:`
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
      `}),(0,t.jsx)("iframe",{id:"wolvai-widget-frame",ref:e,src:a,title:"Wolvcapital AI support",allow:"clipboard-write",loading:"lazy"})]}):null}e.s(["default",()=>a])}]);