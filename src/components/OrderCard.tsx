import React from 'react';
import { EscrowOrder, OrderStatus } from '../types/escrow';
import { useWeb3 } from '../context/Web3Context';
import { SOL_IDR_RATE } from '../data/mockData';
import { Clock, ShieldAlert, CheckCircle2, RotateCcw, Package, AlertTriangle, ArrowRight, Wallet, UserCheck, TrendingUp } from 'lucide-react';

interface OrderCardProps {
  order: EscrowOrder;
  onOpenDetail: (order: EscrowOrder) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onOpenDetail }) => {
  const { activeAccount, currentSimulatedTime, depositSolTokens } = useWeb3();

  const isBuyer = activeAccount.address.toLowerCase() === order.buyer.toLowerCase();
  const isSeller = activeAccount.address.toLowerCase() === order.seller.toLowerCase();
  const isArbiter = activeAccount.address.toLowerCase() === order.arbiter.toLowerCase();

  const isExpired = currentSimulatedTime > order.deadlineTimestamp;
  const timeRemainingMs = order.deadlineTimestamp - currentSimulatedTime;
  const daysLeft = Math.ceil(timeRemainingMs / (24 * 60 * 60 * 1000));

  const getStatusBadge = () => {
    switch (order.status) {
      case OrderStatus.Draft:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Draft (Menunggu Deposit)
          </span>
        );
      case OrderStatus.Funded:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Funded (PDA Solana Locked)
          </span>
        );
      case OrderStatus.ConfirmedBySeller:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            Dikonfirmasi Penjual
          </span>
        );
      case OrderStatus.Shipped:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
            <Package className="w-3.5 h-3.5 text-teal-400" />
            Shipped (Resi On-Chain)
          </span>
        );
      case OrderStatus.Disputed:
      case OrderStatus.RefundRequested:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Disputed (Sengketa Tribunal)
          </span>
        );
      case OrderStatus.Completed:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Completed (Dana Dilepas)
          </span>
        );
      case OrderStatus.Refunded:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            Refunded (100% Kembali)
          </span>
        );
      default:
        return null;
    }
  };

  const idrAmount = Math.round((order.amountSol || 0) * SOL_IDR_RATE);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              #{order.id}
            </span>
            {order.isDefiYieldActive && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>6.8% APY</span>
              </span>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Product Name & Description */}
        <div>
          <h4 className="text-sm font-bold text-white line-clamp-1">
            {order.productName || order.desc}
          </h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {order.desc}
          </p>
        </div>

        {/* Financial Information */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-baseline justify-between font-mono">
          <div>
            <span className="text-xs text-slate-500 block">Nilai Escrow</span>
            <span className="text-base font-bold text-emerald-400">
              {order.amountSol} SOL
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Rupiah & AMN</span>
            <span className="text-xs text-slate-300">
              Rp {idrAmount.toLocaleString('id-ID')} ({order.amountAmn || Math.round(order.amountSol * 700)} AMN)
            </span>
          </div>
        </div>

        {/* Address Metadata */}
        <div className="space-y-1 text-[11px] font-mono text-slate-400">
          <div className="flex justify-between">
            <span className="text-slate-500">Pembeli:</span>
            <span className="text-slate-300 truncate max-w-[180px]">{order.buyer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Penjual:</span>
            <span className="text-slate-300 truncate max-w-[180px]">{order.seller}</span>
          </div>
          {order.courierTracking && (
            <div className="flex justify-between">
              <span className="text-slate-500">Resi:</span>
              <span className="text-teal-300 font-bold">{order.courierTracking}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {isExpired ? (
              <strong className="text-rose-400">Batas Waktu Habis</strong>
            ) : (
              <span>Sisa {daysLeft} Hari</span>
            )}
          </span>
        </div>

        <button
          onClick={() => onOpenDetail(order)}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Detail Rekber</span>
          <ArrowRight className="w-3 h-3 text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
