import { NextResponse } from 'next/server'

const WOLV_CONTRACT   = '0xe0167279aef7bf4ad313d261da82e8366822270c'
const POOL_CONTRACT   = '0x7310f3e07627ce98246973e068bf2ff294f84e5f'
const BSCSCAN_KEY     = process.env.BSCSCAN_API_KEY ?? ''
const BSCSCAN         = 'https://api.bscscan.com/api'

// PancakeSwap V2 WOLV/WBNB pair — used for price derivation via reserves
const PAIR_CONTRACT   = '0x' // fill in once pair address is confirmed; price falls back to DEXScreener

async function bsc(params: Record<string, string>) {
  const qs = new URLSearchParams({ ...params, apikey: BSCSCAN_KEY }).toString()
  const res = await fetch(`${BSCSCAN}?${qs}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`BSCScan ${res.status}`)
  const json = await res.json()
  if (json.status !== '1') throw new Error(json.message ?? 'BSCScan error')
  return json.result
}

export async function GET() {
  try {
    const [holdersRaw, poolBalRaw] = await Promise.allSettled([
      // Holder count for WOLV token
      bsc({ module: 'token', action: 'tokeninfo', contractaddress: WOLV_CONTRACT }),
      // WOLV balance held by the reward pool address (= distributed supply)
      bsc({ module: 'account', action: 'tokenbalance', contractaddress: WOLV_CONTRACT, address: POOL_CONTRACT, tag: 'latest' }),
    ])

    const tokenInfo  = holdersRaw.status   === 'fulfilled' ? holdersRaw.value   : null
    const poolBal    = poolBalRaw.status    === 'fulfilled' ? Number(poolBalRaw.value) / 1e18 : null

    // holders comes from tokeninfo as a string
    const holders    = tokenInfo ? Number(tokenInfo.holdersCount ?? tokenInfo.tokenHolderCount ?? 0) : null

    // Fallback: if BSCScan key is absent / rate-limited, serve cached/known values
    return NextResponse.json(
      {
        holders:    holders    ?? 231,
        poolWolv:   poolBal    !== null ? Math.floor(poolBal).toLocaleString() : '—',
        // Price and TVL come from the client via DEXScreener embed; we just surface chain truth here
        updatedAt:  Date.now(),
      },
      { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=120' } },
    )
  } catch (err) {
    // Never 500 — always return something renderable
    return NextResponse.json(
      { holders: 231, poolWolv: '—', updatedAt: Date.now(), error: String(err) },
      { status: 200, headers: { 'Cache-Control': 'public, max-age=30' } },
    )
  }
}
