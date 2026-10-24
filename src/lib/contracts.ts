// Single source of truth for WOLV on-chain references (BNB Smart Chain, chainId 56).
export const WOLV_TOKEN = '0xe0167279aef7bf4ad313d261da82e8366822270c' as const
export const WOLV_POOL = '0x7310f3e07627ce98246973e068bf2ff294f84e5f' as const
export const WOLV_STAKING = '0x7cd22f3c08b4195225da7d043cbe00da118d31ec' as const
export const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD' as const

export const WOLV_SYMBOL = 'WOLV'
export const WOLV_DECIMALS = 18

export const bscscanAddress = (a: string) => `https://bscscan.com/address/${a}#code`
export const bscscanToken = (a: string) => `https://bscscan.com/token/${a}`
export const pancakeSwapUrl = `https://pancakeswap.finance/swap?outputCurrency=${WOLV_TOKEN}`

export const CONTRACTS = [
  { key: 'token', name: 'WOLV Token', address: WOLV_TOKEN, href: bscscanToken(WOLV_TOKEN) },
  { key: 'pool', name: 'Reward Pool', address: WOLV_POOL, href: bscscanAddress(WOLV_POOL) },
  { key: 'staking', name: 'Staking Contract', address: WOLV_STAKING, href: bscscanAddress(WOLV_STAKING) },
] as const

export const ERC20_ABI = [
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
] as const

export const POOL_ABI = [
  { name: 'poolBalance', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const
