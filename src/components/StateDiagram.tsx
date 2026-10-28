import React from 'react';
import { OrderStatus } from '../types/escrow';
import { ArrowRight, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle, Package, Wallet } from 'lucide-react';

interface StateDiagramProps {
  currentStatus: OrderStatus;
  interactive?: boolean;
  onSelectStatus?: (status: OrderStatus) => void;
}

export const StateDiagram: React.FC<StateDiagramProps> = ({ currentStatus }) => {
  const getStepStyle = (step: OrderStatus) => {
    const isCurrent = currentStatus === step;
    if (isCurrent) {
      if (step === OrderStatus.Completed) return 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30';
      if (step === OrderStatus.Refunded) return 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/30';
      if (step === OrderStatus.Disputed) return 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30';
      return 'bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30';
    }
    return 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
        <span className="font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Mesin Status Smart Contract Solana (Anchor PDA)
        </span>
        <span className="text-emerald-400 font-mono text-[11px]">Solana Anchor Engine</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 relative">
        {/* Step 1: Funded */}
        <div className={`border rounded-lg p-3 transition-all ${getStepStyle(OrderStatus.Funded)}`}>
          <div className="flex items-center gap-2 text-xs font-semibold mb-1">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>1. FUNDED</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Pembeli deposit SOL via <code className="font-mono text-emerald-300 text-[10px]">initialize_escrow()</code>. Dana dikunci di PDA + Yield Aktif.
          </p>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
            <span>Actor: Pembeli</span>
          </div>
        </div>

        {/* Step 2: Shipped */}
        <div className={`border rounded-lg p-3 transition-all ${getStepStyle(OrderStatus.Shipped)}`}>
          <div className="flex items-center gap-2 text-xs font-semibold mb-1">
            <Package className="w-4 h-4 text-sky-400" />
            <span>2. SHIPPED</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Penjual kirim barang fisik dan panggil <code className="font-mono text-sky-300 text-[10px]">markShipped()</code>.
          </p>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
            <span>Actor: Penjual</span>
          </div>
        </div>

        {/* Step 3: Disputed */}
        <div className={`border rounded-lg p-3 transition-all ${getStepStyle(OrderStatus.Disputed)}`}>
          <div className="flex items-center gap-2 text-xs font-semibold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>3. DISPUTED</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Jika ada kendala, panggil <code className="font-mono text-amber-300 text-[10px]">raiseDispute()</code>. Arbiter memutuskan.
          </p>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
            <span>Actor: Pembeli / Penjual</span>
          </div>
        </div>

        {/* Step 4: Final (Completed or Refunded) */}
        <div className="space-y-2">
          {/* Completed */}
          <div className={`border rounded-lg p-2.5 transition-all ${getStepStyle(OrderStatus.Completed)}`}>
            <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                COMPLETED
              </span>
              <span className="text-[10px] text-emerald-400/80 font-mono">Dana ke Penjual</span>
            </div>
            <p className="text-[10px] leading-tight text-slate-300">
              Via <span className="font-mono text-emerald-300">confirmReceived</span>, <span className="font-mono text-emerald-300">claimTimeout</span>, atau <span className="font-mono text-emerald-300">resolve(true)</span>
            </p>
          </div>

          {/* Refunded */}
          <div className={`border rounded-lg p-2.5 transition-all ${getStepStyle(OrderStatus.Refunded)}`}>
            <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
              <span className="flex items-center gap-1.5 text-rose-400">
                <RotateCcw className="w-3.5 h-3.5" />
                REFUNDED
              </span>
              <span className="text-[10px] text-rose-400/80 font-mono">Dana ke Pembeli</span>
            </div>
            <p className="text-[10px] leading-tight text-slate-300">
              Via <span className="font-mono text-rose-300">refund()</span> (batal/lewat batas) atau <span className="font-mono text-rose-300">resolve(false)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-300 font-mono">
          <ArrowRight className="w-3.5 h-3.5" />
          Solana Sealevel: Program Derived Address (PDA) dengan validasi kepemilikan akun (Kebal Reentrancy)
        </span>
        <span className="text-slate-500">Status Completed & Refunded bersifat final</span>
      </div>
    </div>
  );
};
