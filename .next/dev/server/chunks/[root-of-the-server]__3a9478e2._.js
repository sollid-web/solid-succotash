module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
;
const supportedLocales = [
    'en',
    'de'
];
const localeCookieName = 'next-locale';
function normalizeLocale(locale) {
    if (!locale) return '';
    return locale.trim().toLowerCase().split(';')[0].split('-')[0];
}
function parseAcceptLanguage(header) {
    return header.split(',').map((item)=>{
        const [tag, q] = item.trim().split(';q=');
        return {
            locale: normalizeLocale(tag),
            weight: q ? Number(q) : 1
        };
    }).filter((item)=>item.locale).sort((a, b)=>b.weight - a.weight).map((item)=>item.locale);
}
function proxy(request) {
    const url = request.nextUrl;
    const { pathname, searchParams } = url;
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    const isStatic = pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/images') || pathname.startsWith('/api') || pathname.endsWith('.ico') || pathname.endsWith('.txt') || pathname.endsWith('.xml');
    if (isStatic) return res;
    const explicitLang = normalizeLocale(searchParams.get('lang'));
    if (explicitLang && supportedLocales.includes(explicitLang)) {
        res.cookies.set(localeCookieName, explicitLang, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365
        });
        return res;
    }
    const localeCookie = normalizeLocale(request.cookies.get(localeCookieName)?.value);
    const preferredLanguages = parseAcceptLanguage(request.headers.get('accept-language') || '');
    const resolvedLocale = (localeCookie && supportedLocales.includes(localeCookie) ? localeCookie : preferredLanguages.find((lang)=>supportedLocales.includes(lang))) || 'en';
    if (!localeCookie || !supportedLocales.includes(localeCookie)) {
        res.cookies.set(localeCookieName, resolvedLocale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365
        });
    }
    return res;
}
const config = {
    matcher: [
        '/:path*'
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3a9478e2._.js.map