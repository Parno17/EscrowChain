import React, { useState } from 'react';
import { 
  SOLANA_ANCHOR_PROGRAM_CODE, 
  SECURITY_RISK_ITEMS, 
  SOLANA_PROGRAM_ID,
  SOL_IDR_RATE,
  SOLANA_GAS_FEE_SOL,
  ETH_EQUIVALENT_GAS_IDR 
} from '../data/mockData';
import { 
  ShieldCheck, 
  FileCode, 
  Copy, 
  Check, 
  Lock, 
  Cpu, 
  Zap, 
  TrendingUp, 
  ChevronRight,
  ExternalLink,
  Coins
} from 'lucide-react';

export const SolanaAuditView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'anchor' | 'security' | 'calculator'>('anchor');
  const [copiedCode, setCopiedCode] = useState(false);
  const [txVolume, setTxVolume] = useState(100);

  const handleCopy = () => {
    navigator.clipboard.writeText(SOLANA_ANCHOR_PROGRAM_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Gas Savings Calculation
  const ethCostIdr = txVolume * ETH_EQUIVALENT_GAS_IDR;
  const solCostIdr = txVolume * (SOLANA_GAS_FEE_SOL * SOL_IDR_RATE);
  const savingsIdr = ethCostIdr - solCostIdr;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span>Rust / Anchor Framework v0.30</span>
          <span>·</span>
          <span>Program ID: {SOLANA_PROGRAM_ID}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Smart Contract Solana Anchor & Audit Keamanan
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Kontrak pintar dibangun di atas jaringan Solana menggunakan kerangka kerja Anchor. Menghilangkan ketergantungan pada Ethereum EVM yang memiliki biaya gas mahal dan risiko serangan reentrancy.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveTab('anchor')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'anchor' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Kode Sumber Anchor (lib.rs)
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'security' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Matriks Audit Keamanan
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'calculator' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Kalkulator Efisiensi Gas Fee Solana
          </button>
        </div>
      </div>

      {/* TAB 1: ANCHOR CODE */}
      {activeTab === 'anchor' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl space-y-0">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white">programs/amanah-escrow/src/lib.rs</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs text-slate-300 leading-relaxed">
            <pre className="text-emerald-300/90">
              <code>{SOLANA_ANCHOR_PROGRAM_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY AUDIT MATRIX */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECURITY_RISK_ITEMS.map(item => (
              <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">{item.code}: {item.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {item.statusInEscrow}
                  </span>
                </div>
                
                <div>
                  <div className="text-[11px] font-semibold text-rose-400 uppercase">Potensi Risiko:</div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.riskDescription}</p>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase">Mitigasi di Solana Anchor:</div>
                  <p className="text-xs text-slate-300 mt-0.5">{item.mitigation}</p>
                </div>

                {item.solanaAnchorSnippet && (
                  <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-teal-300 overflow-x-auto">
                    {item.solanaAnchorSnippet}
                  </pre>
                )}

                <div className="text-[10px] text-slate-500 font-mono">
                  Standar Verifikasi: {item.citation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GAS EFFICIENCY CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Simulasi Penghematan Biaya Transaksi UMKM (Solana vs Ethereum)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hitung berapa ratus juta rupiah yang dapat dihemat komunitas pedagang UMKM dengan beralih ke Solana.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs text-slate-300">
              Jumlah Transaksi Jual Beli Per Bulan: <span className="font-bold font-mono text-emerald-400">{txVolume.toLocaleString()} Transaksi</span>
            </label>
            <input
              type="range"
              min="10"
              max="10000"
              step="10"
              value={txVolume}
              onChange={(e) => setTxVolume(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>10 Transaksi</span>
              <span>1.000 Transaksi</span>
              <span>10.000 Transaksi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-200">
              <span className="text-xs text-rose-400 font-bold uppercase">Biaya Gas di Ethereum (EVM)</span>
              <div className="text-xl font-bold font-mono text-white mt-1">
                Rp {ethCostIdr.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-rose-300/80 mt-1">
                Rata-rata Rp 68.000 per transaksi
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200">
              <span className="text-xs text-emerald-400 font-bold uppercase">Biaya Gas di Solana (Amanah)</span>
              <div className="text-xl font-bold font-mono text-white mt-1">
                Rp {Math.round(solCostIdr).toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-emerald-300 mt-1">
                Hanya ~Rp 12 per transaksi
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-white">
              <span className="text-xs text-emerald-400 font-bold uppercase">Total Dana Yang Dihemat UMKM</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                Rp {Math.round(savingsIdr).toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Efisiensi biaya 99.98%
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
