import React, { useState } from 'react';
import { X, ExternalLink, CheckCircle2, ShieldCheck, ArrowRight, Copy, Check, Terminal, Cpu } from 'lucide-react';
import { SOLANA_PROGRAM_ID, SOL_IDR_RATE, SOLANA_GAS_FEE_SOL } from '../data/mockData';
import { useWeb3 } from '../context/Web3Context';

interface SolanaExplorerModalProps {
  txHash: string | null;
  onClose: () => void;
}

export const SolanaExplorerModal: React.FC<SolanaExplorerModalProps> = ({ txHash, onClose }) => {
  const { orders } = useWeb3();
  const [copied, setCopied] = useState(false);

  if (!txHash) return null;

  // Search in all order histories
  let foundTx: any = null;
  let orderParent: any = null;

  for (const o of orders) {
    const tx = o.txHistory.find(t => t.txHash.toLowerCase() === txHash.toLowerCase());
    if (tx) {
      foundTx = tx;
      orderParent = o;
      break;
    }
  }

  // Fallback data
  const txData = foundTx || {
    txHash,
    method: 'initialize_escrow_pda',
    from: orders[0]?.buyer || '7Z1uYm8T4K3qB6hP2wRk9vLaE8nDcX5jM3490zK1',
    to: orders[0]?.pdaAddress || '4q8vSknm8vK6Zq2mR9vL4wE6kZ1cY39281XoLa99',
    valueSol: orders[0]?.amountSol || 1.47,
    feeSol: SOLANA_GAS_FEE_SOL,
    computeUnitsUsed: 12450,
    timestamp: Date.now() - 3600000,
    slotNumber: 289410291,
    note: 'Amanah Escrow Anchor Program Execution'
  };

  const idrValue = Math.round(txData.valueSol * SOL_IDR_RATE);

  const copySignature = () => {
    navigator.clipboard.writeText(txData.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Solana Explorer & Solscan Simulator
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Finalized (400ms)
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span>Solana Transaction Details</span>
        </h3>

        {/* Signature Box */}
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
          <div className="truncate text-xs font-mono text-emerald-400 font-semibold">
            {txData.txHash}
          </div>
          <button
            onClick={copySignature}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
            title="Salin Signature"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Transaction Overview Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px]">Hasil Transaksi</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Success (Commitment: Max)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px]">Slot Height (Block)</span>
            <div className="font-mono text-white font-bold mt-0.5">
              #{txData.slotNumber.toLocaleString()}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px]">Biaya Transaksi (Fee)</span>
            <div className="font-mono text-emerald-400 font-bold mt-0.5">
              {txData.feeSol || SOLANA_GAS_FEE_SOL} SOL (~Rp 12)
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px]">Compute Units Digunakan</span>
            <div className="font-mono text-teal-400 font-bold mt-0.5">
              {(txData.computeUnitsUsed || 12450).toLocaleString()} of 200,000 CUs
            </div>
          </div>
        </div>

        {/* Account Flow */}
        <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 text-xs">
          <div className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
            Alur Akun & Program Solana:
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Pengirim (Signer / Payer):</span>
            <span className="font-mono text-slate-200 truncate max-w-[320px]">{txData.from}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Penerima / PDA Account:</span>
            <span className="font-mono text-emerald-400 truncate max-w-[320px]">{txData.to}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Program ID (Anchor):</span>
            <span className="font-mono text-indigo-400 truncate max-w-[320px]">{SOLANA_PROGRAM_ID}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400">Nilai Transfer SOL:</span>
            <span className="font-mono text-white font-bold">
              {txData.valueSol} SOL <span className="text-slate-400 font-normal">(≈ Rp {idrValue.toLocaleString('id-ID')})</span>
            </span>
          </div>
        </div>

        {/* Instruction Logs */}
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Solana Program Instruction Logs:</span>
          </div>
          <div className="text-slate-500">&gt; Program {SOLANA_PROGRAM_ID} invoke [1]</div>
          <div className="text-emerald-400/90">&gt; Program log: Instruction: {txData.method}</div>
          <div className="text-teal-400/90">&gt; Program log: Anchor PDA validated [seeds: b"escrow", order_id]</div>
          <div className="text-slate-400">&gt; Program consumed {txData.computeUnitsUsed || 12450} of 200000 compute units</div>
          <div className="text-emerald-400 font-bold">&gt; Program {SOLANA_PROGRAM_ID} success</div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};

// Also export as SepoliaExplorerModal for backwards compatibility
export const SepoliaExplorerModal = SolanaExplorerModal;
