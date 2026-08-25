module.exports=[918622,(a,b,c)=>{b.exports=a.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},342602,(a,b,c)=>{"use strict";b.exports=a.r(918622)},572131,(a,b,c)=>{"use strict";b.exports=a.r(342602).vendored["react-ssr"].React},187924,(a,b,c)=>{"use strict";b.exports=a.r(342602).vendored["react-ssr"].ReactJsxRuntime},28420,a=>{"use strict";var b=a.i(187924),c=a.i(572131);let d="https://supportai-maxmmdqp.manus.space";function e(){let a=(0,c.useRef)(null),[e,f]=(0,c.useState)(null);return((0,c.useEffect)(()=>{f(`${d}/embed?page=${encodeURIComponent(window.location.href)}`)},[]),(0,c.useEffect)(()=>{let b=a.current;if(!b)return;function c(){b?.contentWindow?.postMessage({source:"wolvcapital-ai",type:"navigation",pageUrl:window.location.href,pageTitle:document.title},d)}b.addEventListener("load",c);let e={};return["pushState","replaceState"].forEach(a=>{e[a]=window.history[a],window.history[a]=function(...b){let d=e[a].apply(this,b);return c(),d}}),window.addEventListener("popstate",c),()=>{b.removeEventListener("load",c),["pushState","replaceState"].forEach(a=>{e[a]&&(window.history[a]=e[a])}),window.removeEventListener("popstate",c)}},[e]),e)?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
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
      `}),(0,b.jsx)("iframe",{id:"wolvai-widget-frame",ref:a,src:e,title:"Wolvcapital AI support",allow:"clipboard-write",loading:"lazy"})]}):null}a.s(["default",()=>e])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__8c41edf1._.js.map