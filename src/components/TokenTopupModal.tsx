import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { SOL_IDR_RATE, AMN_IDR_RATE, SOL_TO_AMN_RATE, SOLANA_GAS_FEE_SOL } from '../data/mockData';
import { AMNTokenLogo } from './EscrowChainLogo';
import {
  Coins,
  ArrowDownToLine,
  Send,
  Users,
  ShieldCheck,
  Zap,
  TrendingUp,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ExternalLink,
  ChevronDown,
  Gift,
} from 'lucide-react';

interface TokenTopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TopupTab = 'topup' | 'distribute' | 'airdrop';

const TOPUP_PACKAGES = [
  { amn: 500, solCost: 0.72, label: 'Starter Pack', desc: 'Cocok untuk coba fitur staking pertama kali', badge: null },
  { amn: 1000, solCost: 1.43, label: 'Silver Pack', desc: 'Unlock diskon 50% biaya rekber', badge: 'POPULER' },
  { amn: 5000, solCost: 7.14, label: 'VIP Amanah Pack', desc: 'Gratis biaya rekber selamanya (0%)', badge: 'VIP' },
  { amn: 10000, solCost: 14.28, label: 'Whale Pack', desc: 'Hak governance DAO penuh & prioritas arbitrase', badge: 'WHALE' },
];

const DISTRIBUTION_PRESETS = [
  { label: 'Bonus Tepat Waktu', icon: '⚡', pct: 10, desc: 'Bonus untuk penjual yang kirim dalam 24 jam' },
  { label: 'Hadiah Ulasan Produk', icon: '⭐', pct: 5, desc: 'Reward pembeli yang meninggalkan review on-chain' },
  { label: 'Subsidi Gas Fee', icon: '⛽', pct: 3, desc: 'Subsidi biaya gas untuk transaksi UMKM kecil' },
  { label: 'Burn Deflasi', icon: '🔥', pct: 2, desc: 'Bakar token untuk menjaga deflasi supply AMN' },
];

export const TokenTopupModal: React.FC<TokenTopupModalProps> = ({ isOpen, onClose }) => {
  const { activeAccount, topupAmnToken, distributeAmnToken, requestAmnAirdrop, notification } = useWeb3();

  const [activeTab, setActiveTab] = useState<TopupTab>('topup');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [customAmnAmount, setCustomAmnAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Distribute Tab State
  const [distributeAmount, setDistributeAmount] = useState('');
  const [distributeTarget, setDistributeTarget] = useState<'community' | 'stakers' | 'sellers' | 'burn'>('community');
  const [distributeNote, setDistributeNote] = useState('');

  // Airdrop tab
  const [airdropAmount, setAirdropAmount] = useState('500');

  if (!isOpen) return null;

  const selectedPkg = selectedPackage !== null ? TOPUP_PACKAGES[selectedPackage] : null;
  const parsedCustomAmn = Number(customAmnAmount);
  const customAmn = Number.isFinite(parsedCustomAmn) ? parsedCustomAmn : 0;
  const customSolCost = +(customAmn / SOL_TO_AMN_RATE).toFixed(9);

  const finalAmn = selectedPkg ? selectedPkg.amn : customAmn;
  const finalSol = selectedPkg ? selectedPkg.solCost : customSolCost;
  const totalSolCost = +(finalSol + SOLANA_GAS_FEE_SOL).toFixed(9);
  const canAfford = activeAccount.balanceSol >= totalSolCost;

  const handleTopup = async () => {
    if (!Number.isFinite(finalAmn) || finalAmn <= 0 || !canAfford) return;
    setIsLoading(true);
    try {
      const result = await topupAmnToken(finalAmn, finalSol);
      if (result.success) {
        setSelectedPackage(null);
        setCustomAmnAmount('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistribute = async () => {
    const amt = parseFloat(distributeAmount);
    if (!amt || amt <= 0 || amt > activeAccount.balanceAmn) return;
    setIsLoading(true);
    await distributeAmnToken(amt, distributeTarget, distributeNote);
    setIsLoading(false);
    setDistributeAmount('');
    setDistributeNote('');
  };

  const handleAirdrop = async () => {
    const amt = parseFloat(airdropAmount) || 500;
    setIsLoading(true);
    await requestAmnAirdrop(amt);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <AMNTokenLogo size={28} />
            <div>
              <h2 className="font-bold text-sm text-white">Token Amanah ($AMN)</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Saldo: <span className="text-amber-400 font-bold">{activeAccount.balanceAmn.toLocaleString()} AMN</span>
                <span className="mx-1.5 text-slate-600">·</span>
                <span className="text-slate-300">{activeAccount.balanceSol.toFixed(2)} SOL tersedia</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-0.5 p-2 bg-slate-950/50 border-b border-slate-800 shrink-0">
          {([
            { id: 'topup', label: 'Top Up AMN', icon: <ArrowDownToLine className="w-3.5 h-3.5" /> },
            { id: 'distribute', label: 'Distribusi', icon: <Send className="w-3.5 h-3.5" /> },
            { id: 'airdrop', label: 'Faucet Dev', icon: <Gift className="w-3.5 h-3.5" /> },
          ] as { id: TopupTab; label: string; icon: React.ReactNode }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── TAB: TOP UP ── */}
          {activeTab === 'topup' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Mode simulasi: beli AMN dengan SOL dan saldo akun lokal akan diperbarui; belum ada transaksi on-chain. Semakin banyak AMN di-stake, semakin besar diskon biaya rekber dan hak suara DAO.</span>
              </div>

              {/* Paket */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pilih Paket:</div>
                <div className="grid grid-cols-2 gap-2">
                  {TOPUP_PACKAGES.map((pkg, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedPackage(i); setCustomAmnAmount(''); }}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative ${
                        selectedPackage === i
                          ? 'bg-emerald-500/15 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {pkg.badge && (
                        <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          pkg.badge === 'VIP' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          pkg.badge === 'WHALE' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>{pkg.badge}</span>
                      )}
                      <div className="flex items-center gap-1.5 mb-1">
                        <AMNTokenLogo size={16} />
                        <span className="text-sm font-bold font-mono text-white">{pkg.amn.toLocaleString()} AMN</span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400">= {pkg.solCost} SOL</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-sans">{pkg.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Atau Jumlah Kustom:</div>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="1"
                    value={customAmnAmount}
                    onChange={e => { setCustomAmnAmount(e.target.value); setSelectedPackage(null); }}
                    placeholder="Jumlah AMN kustom..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                  <div className="text-xs text-slate-400 whitespace-nowrap">
                    ≈ <span className="text-emerald-400 font-mono font-bold">{customSolCost} SOL</span>
                  </div>
                </div>
              </div>

              {/* Summary & Buy */}
              {(selectedPkg || customAmn > 0) && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Anda mendapatkan:</span>
                    <span className="text-amber-400 font-bold font-mono">{finalAmn.toLocaleString()} AMN</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Anda membayar:</span>
                    <span className="text-white font-bold font-mono">{finalSol} SOL</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Setara (IDR):</span>
                    <span className="text-slate-300 font-mono">Rp {(finalSol * SOL_IDR_RATE).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-slate-800 pt-2">
                    <span className="text-slate-400">Gas Fee Solana:</span>
                    <span className="text-emerald-400 font-mono">{SOLANA_GAS_FEE_SOL} SOL (Rp {(SOLANA_GAS_FEE_SOL * SOL_IDR_RATE).toLocaleString('id-ID')})</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Total potongan saldo:</span>
                    <span className="text-white font-mono">{totalSolCost} SOL</span>
                  </div>
                  {!canAfford && (
                    <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Saldo SOL tidak cukup. Deposit SOL terlebih dahulu.
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleTopup}
                disabled={isLoading || !Number.isFinite(finalAmn) || finalAmn <= 0 || !canAfford}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Memproses simulasi top-up...</>
                ) : (
                  <><ArrowDownToLine className="w-3.5 h-3.5" /> Simulasikan top-up {finalAmn ? `${finalAmn.toLocaleString()} AMN` : 'AMN'} →</>
                )}
              </button>
            </div>
          )}

          {/* ── TAB: DISTRIBUSI ── */}
          {activeTab === 'distribute' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
                <Users className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Distribusikan token AMN ke komunitas, stakers, penjual UMKM, atau mekanisme burn deflasi protokol.</span>
              </div>

              {/* Distribusi Presets Info */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Program Distribusi Umum:</div>
                <div className="grid grid-cols-2 gap-2">
                  {DISTRIBUTION_PRESETS.map((p, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                      <div className="font-bold text-white">{p.icon} {p.label}</div>
                      <div className="text-slate-500 mt-0.5">{p.desc}</div>
                      <div className="text-emerald-400 font-mono mt-1">{(activeAccount.balanceAmn * p.pct / 100).toLocaleString()} AMN ({p.pct}%)</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Distribusi:</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: 'community', label: '🌐 Komunitas', desc: 'Semua pengguna aktif' },
                    { id: 'stakers', label: '💎 Stakers', desc: 'Pemegang st-AMN aktif' },
                    { id: 'sellers', label: '🏪 Penjual UMKM', desc: 'Merchant terverifikasi' },
                    { id: 'burn', label: '🔥 Burn Deflasi', desc: 'Mekanisme burn on-chain' },
                  ] as { id: 'community' | 'stakers' | 'sellers' | 'burn'; label: string; desc: string }[]).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setDistributeTarget(t.id)}
                      className={`p-2.5 rounded-xl text-left border text-[11px] cursor-pointer transition-all ${
                        distributeTarget === t.id
                          ? t.id === 'burn'
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                            : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold">{t.label}</div>
                      <div className="opacity-70 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Jumlah */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Jumlah AMN (Saldo: {activeAccount.balanceAmn.toLocaleString()} AMN):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max={activeAccount.balanceAmn}
                    value={distributeAmount}
                    onChange={e => setDistributeAmount(e.target.value)}
                    placeholder="Jumlah AMN yang didistribusikan..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => setDistributeAmount(Math.floor(activeAccount.balanceAmn * 0.1).toString())}
                    className="px-2.5 py-1.5 bg-slate-800 text-xs text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
                    title="10% dari saldo"
                  >10%</button>
                </div>
              </div>

              {/* Memo */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Memo On-Chain (opsional):</label>
                <input
                  type="text"
                  maxLength={80}
                  value={distributeNote}
                  onChange={e => setDistributeNote(e.target.value)}
                  placeholder="contoh: Q4 2026 seller bonus distribution..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {parseFloat(distributeAmount) > activeAccount.balanceAmn && (
                <div className="flex items-center gap-1.5 text-rose-400 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" /> Jumlah melebihi saldo AMN Anda.
                </div>
              )}

              <button
                onClick={handleDistribute}
                disabled={isLoading || !distributeAmount || parseFloat(distributeAmount) <= 0 || parseFloat(distributeAmount) > activeAccount.balanceAmn}
                className={`w-full py-2.5 font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  distributeTarget === 'burn'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isLoading ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Memproses distribusi on-chain...</>
                ) : distributeTarget === 'burn' ? (
                  <><Flame className="w-3.5 h-3.5" /> Bakar {distributeAmount || '0'} AMN Permanen →</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Distribusikan {distributeAmount || '0'} AMN →</>
                )}
              </button>
            </div>
          )}

          {/* ── TAB: FAUCET / AIRDROP ── */}
          {activeTab === 'airdrop' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <Gift className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Faucet khusus untuk pengujian (Devnet/Testnet). Gunakan untuk mencoba semua fitur platform sebelum transaksi nyata.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <AMNTokenLogo size={24} />
                  <div>
                    <div className="text-sm font-bold text-white">Airdrop Token AMN (Testnet)</div>
                    <div className="text-[11px] text-slate-400">Simulasi distribusi awal dari Treasury Protocol</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 5000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setAirdropAmount(amt.toString())}
                      className={`py-2 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                        airdropAmount === amt.toString()
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {amt.toLocaleString()} AMN
                    </button>
                  ))}
                </div>

                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Nilai AMN:</span>
                    <span className="text-slate-300">Rp {((parseFloat(airdropAmount) || 0) * AMN_IDR_RATE).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sumber:</span>
                    <span className="text-slate-300 font-mono truncate">Protokol Treasury (Dev)</span>
                  </div>
                </div>
              </div>

              {/* Sejarah Distribusi Token */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Alokasi Distribusi $AMN (Tokenomics):</div>
                <div className="space-y-2">
                  {[
                    { label: 'Insentif Komunitas & Staking', pct: 30, color: 'bg-emerald-500', amt: '30.000.000' },
                    { label: 'Dana Hibah UMKM', pct: 25, color: 'bg-teal-500', amt: '25.000.000' },
                    { label: 'Pool Likuiditas DEX', pct: 20, color: 'bg-indigo-500', amt: '20.000.000' },
                    { label: 'Pengembangan Protokol', pct: 15, color: 'bg-purple-500', amt: '15.000.000' },
                    { label: 'Treasury Multi-Sig', pct: 10, color: 'bg-amber-500', amt: '10.000.000' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="text-slate-400 font-mono">{item.amt} AMN ({item.pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAirdrop}
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Meminta Airdrop...</>
                ) : (
                  <><Gift className="w-3.5 h-3.5" /> Klaim {(parseFloat(airdropAmount) || 500).toLocaleString()} AMN Airdrop →</>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Transaksi diamankan oleh Solana SPL Token Program</span>
          </div>
          <div className="font-mono">1 AMN = Rp {AMN_IDR_RATE.toLocaleString('id-ID')}</div>
        </div>
      </div>
    </div>
  );
};
