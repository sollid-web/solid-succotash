(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/sections/ComplianceSectionInner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComplianceSectionInner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useReadContract.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/unit/formatUnits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$_client$2f$WalletProviderClient$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/_client/WalletProviderClient.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const WOLV_ADDRESS = '0xe0167279aef7bf4ad313d261da82e8366822270c';
const POOL_ADDRESS = '0x7310f3e07627ce98246973e068bf2ff294f84e5f';
const STAKING_ADDRESS = '0x7cd22f3c08b4195225da7d043cbe00da118d31ec';
const BNB_BEP20_ABI = [
    {
        name: 'totalSupply',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            {
                type: 'uint256'
            }
        ]
    }
];
const POOL_ABI = [
    {
        name: 'poolBalance',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            {
                type: 'uint256'
            }
        ]
    }
];
const STAKING_ABI = [
    {
        name: 'getBnbPrice',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            {
                type: 'uint256'
            }
        ]
    },
    {
        name: 'wolvPerUsd',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            {
                type: 'uint256'
            }
        ]
    }
];
function fmt(val) {
    if (!val) return '—';
    return Number((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUnits"])(val, 18)).toLocaleString(undefined, {
        maximumFractionDigits: 0
    });
}
function Metrics() {
    _s();
    const { data: totalSupply } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: WOLV_ADDRESS,
        abi: BNB_BEP20_ABI,
        functionName: 'totalSupply'
    });
    const { data: poolBalance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: POOL_ADDRESS,
        abi: POOL_ABI,
        functionName: 'poolBalance'
    });
    const { data: bnbPrice } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'getBnbPrice'
    });
    const { data: wolvPerUsd } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'wolvPerUsd'
    });
    const bnbPriceFmt = bnbPrice ? `$${(Number(bnbPrice) / 1e8).toFixed(2)}` : '—';
    const rewardRateFmt = wolvPerUsd ? `$${(1 / Number((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUnits"])(wolvPerUsd, 18))).toFixed(2)}` : '—';
    const stats = [
        {
            label: 'WOLV Minted',
            value: fmt(totalSupply),
            sub: 'Total supply on-chain',
            icon: '⬡',
            color: '#2A52BE'
        },
        {
            label: 'Reward Pool',
            value: fmt(poolBalance),
            sub: 'Available for stakers',
            icon: '🏦',
            color: '#00a896'
        },
        {
            label: 'BNB Price',
            value: bnbPriceFmt,
            sub: 'Live via Chainlink oracle',
            icon: '⚡',
            color: '#3b82f6'
        },
        {
            label: 'Max Supply',
            value: '1,000,000,000',
            sub: 'Hard capped · No inflation',
            icon: '🔒',
            color: '#60a5fa'
        },
        {
            label: 'Staking Plans',
            value: '4 Active',
            sub: '8% – 25% APY',
            icon: '📈',
            color: '#2A52BE'
        },
        {
            label: 'Reward Rate',
            value: rewardRateFmt,
            sub: 'Per WOLV · set on-chain, adjustable',
            icon: '💎',
            color: '#00a896'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "compliance",
        style: {
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0f1a35 100%)',
            padding: '80px 24px',
            position: 'relative',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(42,82,190,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(42,82,190,0.04) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    pointerEvents: 'none'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: '1100px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'center',
                            marginBottom: '56px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'rgba(0,168,150,0.1)',
                                    border: '1px solid rgba(0,168,150,0.25)',
                                    borderRadius: '99px',
                                    padding: '6px 16px',
                                    marginBottom: '20px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: '#00a896',
                                            display: 'inline-block',
                                            boxShadow: '0 0 8px #00a896'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                        lineNumber: 57,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '12px',
                                            color: '#00a896',
                                            fontWeight: 600
                                        },
                                        children: "Live On-Chain Data · BNB Smart Chain"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: 'clamp(28px, 4vw, 42px)',
                                    fontWeight: 800,
                                    color: '#fff',
                                    letterSpacing: '-1px',
                                    marginBottom: '12px'
                                },
                                children: "Verify Everything On-Chain"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: 'rgba(255,255,255,0.45)',
                                    fontSize: '16px',
                                    maxWidth: '520px',
                                    margin: '0 auto',
                                    lineHeight: 1.7
                                },
                                children: "Every number below is pulled directly from BNB Smart Chain in real time. No intermediaries. No trust required."
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            marginBottom: '40px'
                        },
                        children: stats.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${s.color}25`,
                                    borderRadius: '18px',
                                    padding: '24px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '12px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '20px'
                                                },
                                                children: s.icon
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                                lineNumber: 71,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'rgba(255,255,255,0.35)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px'
                                                },
                                                children: s.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                                lineNumber: 72,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '22px',
                                            fontWeight: 700,
                                            color: s.color,
                                            fontFamily: "'DM Mono', monospace",
                                            marginBottom: '4px'
                                        },
                                        children: s.value
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            color: 'rgba(255,255,255,0.3)'
                                        },
                                        children: s.sub
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, s.label, true, {
                                fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginBottom: '24px'
                        },
                        children: [
                            {
                                name: 'WOLV Token',
                                addr: WOLV_ADDRESS
                            },
                            {
                                name: 'Reward Pool',
                                addr: POOL_ADDRESS
                            },
                            {
                                name: 'Staking Contract',
                                addr: STAKING_ADDRESS
                            }
                        ].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: c.name === 'Reward Pool' ? `https://bscscan.com/token/${WOLV_ADDRESS}?a=${c.addr}` : `https://bscscan.com/address/${c.addr}#code`,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                style: {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    background: 'rgba(42,82,190,0.1)',
                                    border: '1px solid rgba(42,82,190,0.25)',
                                    color: '#fff',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: '#00a896',
                                            display: 'inline-block'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                        lineNumber: 87,
                                        columnNumber: 15
                                    }, this),
                                    c.name,
                                    " ↗"
                                ]
                            }, c.name, true, {
                                fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'center',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.2)'
                        },
                        children: "Data refreshes on every page load · Powered by BNB Smart Chain · Verified by Chainlink"
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(Metrics, "vAwAoKqkmLui62A2wkwE/DD3vUw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"]
    ];
});
_c = Metrics;
function ComplianceSectionInner() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$_client$2f$WalletProviderClient$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletProviderClient"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metrics, {}, void 0, false, {
            fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
            lineNumber: 103,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/sections/ComplianceSectionInner.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, this);
}
_c1 = ComplianceSectionInner;
var _c, _c1;
__turbopack_context__.k.register(_c, "Metrics");
__turbopack_context__.k.register(_c1, "ComplianceSectionInner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/sections/ComplianceSectionInner.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/sections/ComplianceSectionInner.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_sections_ComplianceSectionInner_tsx_1d758799._.js.map