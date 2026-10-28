import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { 
  SOL_IDR_RATE, 
  AMN_IDR_RATE, 
  SOL_TO_AMN_RATE, 
  SOLANA_GAS_FEE_SOL, 
  DEFI_YIELD_VAULT_PDA 
} from '../data/mockData';
import { 
  TrendingUp, 
  Coins, 
  Flame, 
  ArrowRightLeft, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const AmanahDefiHub: React.FC = () => {
  const { 
    activeAccount, 
    tokenomics, 
    orders, 
    stakeAmnTokens, 
    unstakeAmnTokens, 
    swapTokens,
    requestAmnAirdrop 
  } = useWeb3();

  // Staking Form State
  const [stakeAmountInput, setStakeAmountInput] = useState('');
  const [unstakeAmountInput, setUnstakeAmountInput] = useState('');
  const [isStakingLoading, setIsStakingLoading] = useState(false);

  // Swap State
  const [swapFrom, setSwapFrom] = useState<'SOL' | 'AMN' | 'USDC'>('SOL');
  const [swapTo, setSwapTo] = useState<'SOL' | 'AMN' | 'USDC'>('AMN');
  const [swapAmountInput, setSwapAmountInput] = useState('1');
  const [isSwapLoading, setIsSwapLoading] = useState(false);

  // Calculate swap estimate
  const numSwapAmount = parseFloat(swapAmountInput) || 0;
  let estimatedReceive = 0;
  if (swapFrom === 'SOL' && swapTo === 'AMN') {
    estimatedReceive = +(numSwapAmount * SOL_TO_AMN_RATE).toFixed(2);
  } else if (swapFrom === 'AMN' && swapTo === 'SOL') {
    estimatedReceive = +(numSwapAmount / SOL_TO_AMN_RATE).toFixed(4);
  } else if (swapFrom === 'USDC' && swapTo === 'AMN') {
    estimatedReceive = +(numSwapAmount * (SOL_IDR_RATE / 16000 / (AMN_IDR_RATE / 16000))).toFixed(2);
  } else if (swapFrom === 'AMN' && swapTo === 'USDC') {
    estimatedReceive = +(numSwapAmount * (AMN_IDR_RATE / 16000)).toFixed(2);
  }

  // Calculate active escrow yield across all orders
  const activeLockedSol = orders
    .filter(o => o.status === 0 || o.status === 1 || o.status === 2)
    .reduce((sum, o) => sum + o.amountSol, 0);

  const totalYieldAccruedSol = orders.reduce((sum, o) => sum + (o.yieldAccruedSol || 0), 0);
  const totalCashbackAmnDistributed = orders.reduce((sum, o) => sum + (o.buyerYieldShare || 0), 0);

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(stakeAmountInput);
    if (!val || val <= 0) return;
    setIsStakingLoading(true);
    await stakeAmnTokens(val);
    setStakeAmountInput('');
    setIsStakingLoading(false);
  };

  const handleUnstake = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(unstakeAmountInput);
    if (!val || val <= 0) return;
    setIsStakingLoading(true);
    await unstakeAmnTokens(val);
    setUnstakeAmountInput('');
    setIsStakingLoading(false);
  };

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numSwapAmount || numSwapAmount <= 0) return;
    setIsSwapLoading(true);
    await swapTokens(swapFrom, swapTo, numSwapAmount);
    setIsSwapLoading(false);
  };

  const flipSwapTokens = () => {
    const temp = swapFrom;
    setSwapFrom(swapTo);
    setSwapTo(temp);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner with Visual Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 p-6 sm:p-8 space-y-3 z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>Solana SPL Tokenomics</span>
              <span>·</span>
              <span>Kamino / Marinade DeFi Yield Vault</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Amanah DeFi Hub: Zero-Loss Escrow & $AMN Staking
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Dana pesanan yang terkunci di rekening bersama tidak menganggur. Protokol mengalirkan agunan ke yield pool Solana liquid staking dengan imbal hasil 6.8% APY yang dibagikan kepada pembeli (cashback) dan penjual (bonus), serta membakar token $AMN.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-500">Saldo Anda:</span>
                <span className="text-white font-bold">{activeAccount.balanceAmn.toLocaleString()} AMN</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="text-slate-500">Staked:</span>
                <span className="font-bold">{activeAccount.stakedAmn.toLocaleString()} AMN</span>
              </div>
              <button
                onClick={() => requestAmnAirdrop(500)}
                className="text-[11px] px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md cursor-pointer transition-colors"
              >
                + Faucet +500 AMN
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 h-48 lg:h-full relative overflow-hidden">
            <img
              src="/src/assets/images/defi_vault_yield_1792757843028.jpg"
              alt="DeFi Escrow Vault"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Protocol Metrics KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dana Terkunci Escrow</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {activeLockedSol.toFixed(2)} SOL
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            ≈ Rp {(activeLockedSol * SOL_IDR_RATE).toLocaleString('id-ID')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Escrow Yield APY</span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {tokenomics.escrowYieldApy}% APY
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Bunga modal berjalan otomatis
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Staking Pool Reward</span>
            <Coins className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {tokenomics.stakingApy}% APR
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            {tokenomics.stakedSupply.toLocaleString()} AMN dikunci
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total AMN Dibakar</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {tokenomics.totalBurned.toLocaleString()} AMN
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Deflasi berkelanjutan
          </div>
        </div>
      </div>

      {/* Main Grid: AMN Staking vs AMN Swap DEX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AMN Staking Pool */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>Staking Pool Amanah ($AMN)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kunci token AMN untuk mendapatkan 11.2% APR dan bebas biaya rekber.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                11.2% APR
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">AMN Anda Tersedia</span>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {activeAccount.balanceAmn.toLocaleString()} AMN
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">AMN Anda di-Staking</span>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                  {activeAccount.stakedAmn.toLocaleString()} AMN
                </div>
              </div>
            </div>

            {/* Stake Form */}
            <form onSubmit={handleStake} className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Jumlah Staking (AMN)</span>
                  <button
                    type="button"
                    onClick={() => setStakeAmountInput(activeAccount.balanceAmn.toString())}
                    className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    Maksimum ({activeAccount.balanceAmn} AMN)
                  </button>
                </div>
                <input
                  type="number"
                  min="1"
                  max={activeAccount.balanceAmn}
                  value={stakeAmountInput}
                  onChange={(e) => setStakeAmountInput(e.target.value)}
                  placeholder="contoh: 500"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isStakingLoading || !stakeAmountInput || parseFloat(stakeAmountInput) <= 0}
                className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isStakingLoading ? 'Menandatangani Transaksi Solana...' : 'Stake AMN Sekarang →'}
              </button>
            </form>

            {/* Unstake Form */}
            {activeAccount.stakedAmn > 0 && (
              <form onSubmit={handleUnstake} className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Tarik Staking (Unstake)</span>
                  <button
                    type="button"
                    onClick={() => setUnstakeAmountInput(activeAccount.stakedAmn.toString())}
                    className="text-[11px] text-slate-300 hover:underline cursor-pointer"
                  >
                    Tarik Semua ({activeAccount.stakedAmn} AMN)
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max={activeAccount.stakedAmn}
                    value={unstakeAmountInput}
                    onChange={(e) => setUnstakeAmountInput(e.target.value)}
                    placeholder="Jumlah unstake"
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isStakingLoading || !unstakeAmountInput}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Unstake
                  </button>
                </div>
              </form>
            )}

            {/* Tier Benefits */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Status Keuntungan Akun Anda:</div>
              <div>• Biaya Rekber: <strong className="text-emerald-400">{activeAccount.stakedAmn >= 5000 ? '0% (VIP Gratis)' : activeAccount.stakedAmn >= 1000 ? 'Diskon 50%' : 'Normal 0.5%'}</strong></div>
              <div>• Hak Suara DAO Tribunal: <strong className="text-white">{activeAccount.stakedAmn >= 1000 ? 'Aktif' : 'Perlu min. 1.000 AMN'}</strong></div>
            </div>
          </div>
        </div>

        {/* Right Column: AMN Swap DEX (AMM Instant Liquidity) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                  <span>Amanah Swap DEX (Solana AMM)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tukar SOL, AMN, atau USDC dengan eksekusi instan sub-detik.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Fee: 0.000005 SOL
              </span>
            </div>

            <form onSubmit={handleSwap} className="space-y-4">
              {/* Token From */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Anda Membayar:</span>
                  <span className="font-mono">
                    Saldo: {swapFrom === 'SOL' ? `${activeAccount.balanceSol.toFixed(2)} SOL` : swapFrom === 'AMN' ? `${activeAccount.balanceAmn} AMN` : `$${activeAccount.balanceUsdc} USDC`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="any"
                    min="0.001"
                    value={swapAmountInput}
                    onChange={(e) => setSwapAmountInput(e.target.value)}
                    className="flex-1 bg-transparent text-lg font-mono font-bold text-white focus:outline-none"
                    placeholder="0.0"
                  />
                  <select
                    value={swapFrom}
                    onChange={(e) => setSwapFrom(e.target.value as any)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="SOL">SOL</option>
                    <option value="AMN">AMN</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              {/* Flip Button */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  type="button"
                  onClick={flipSwapTokens}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shadow-md"
                  title="Tukar Arah"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Token To */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Anda Menerima (Estimasi):</span>
                  <span className="font-mono text-emerald-400">Slippage &lt; 0.1%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-lg font-mono font-bold text-emerald-400">
                    {estimatedReceive || '0.00'}
                  </div>
                  <select
                    value={swapTo}
                    onChange={(e) => setSwapTo(e.target.value as any)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="AMN">AMN</option>
                    <option value="SOL">SOL</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Kurs Pertukaran:</span>
                  <span className="text-white">1 SOL = 700 AMN (Rp 2.450.000)</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Fee Solana:</span>
                  <span className="text-emerald-400">0.000005 SOL (~Rp 12)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSwapLoading || !numSwapAmount || numSwapAmount <= 0}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                {isSwapLoading ? 'Mengeksekusi Swap di Solana AMM...' : `Tukar ${swapFrom} ke ${swapTo} →`}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
