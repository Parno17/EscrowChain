import React, { useState } from 'react';
import { EscrowOrder, OrderStatus } from '../types/escrow';
import { useWeb3 } from '../context/Web3Context';
import { StateDiagram } from './StateDiagram';
import { SOL_IDR_RATE, SOLANA_PROGRAM_ID, SOLANA_GAS_FEE_SOL } from '../data/mockData';
import { 
  X, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Truck, 
  UserCheck, 
  FileCode2, 
  ArrowRight,
  Info,
  Hash,
  Wallet,
  TrendingUp,
  KeyRound
} from 'lucide-react';

interface OrderDetailModalProps {
  order: EscrowOrder | null;
  onClose: () => void;
  onOpenExplorerTx?: (txHash: string) => void;
  onOpenWalletModal: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onOpenExplorerTx,
  onOpenWalletModal
}) => {
  const { 
    activeAccount, 
    currentSimulatedTime, 
    depositSolTokens,
    markShipped, 
    confirmOrderCompleted, 
    claimTimeoutRefund, 
    buyerRequestRefund, 
    adminReleaseFundsToSeller,
    adminReleaseRefundToBuyer
  } = useWeb3();

  const [trackingInput, setTrackingInput] = useState('');
  const [courierNameInput, setCourierNameInput] = useState('JNE Express Cargo');
  const [disputeInput, setDisputeInput] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const isBuyer = activeAccount.address.toLowerCase() === order.buyer.toLowerCase();
  const isSeller = activeAccount.address.toLowerCase() === order.seller.toLowerCase();
  const isAdmin = activeAccount.role === 'admin';

  const isExpired = currentSimulatedTime > order.deadlineTimestamp;
  const timeRemainingMs = order.deadlineTimestamp - currentSimulatedTime;
  const daysLeft = Math.ceil(timeRemainingMs / (24 * 60 * 60 * 1000));

  const handleDepositSol = async () => {
    setIsSubmitting(true);
    await depositSolTokens(order.id);
    setIsSubmitting(false);
  };

  const handleMarkShipped = async () => {
    setIsSubmitting(true);
    await markShipped(order.id, trackingInput || 'JNE-SOL-' + Math.floor(10000000 + Math.random() * 90000000), courierNameInput);
    setIsSubmitting(false);
    setShowShippingForm(false);
  };

  const handleConfirmReceived = async () => {
    setIsSubmitting(true);
    await confirmOrderCompleted(order.id);
    setIsSubmitting(false);
  };

  const handleClaimTimeout = async () => {
    setIsSubmitting(true);
    await claimTimeoutRefund(order.id);
    setIsSubmitting(false);
  };

  const handleRaiseDispute = async () => {
    if (!disputeInput.trim()) return;
    setIsSubmitting(true);
    await buyerRequestRefund(order.id, disputeInput);
    setIsSubmitting(false);
    setShowDisputeForm(false);
  };

  const idrAmount = Math.round((order.amountSol || 0) * SOL_IDR_RATE);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl my-auto p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Solana Escrow Order #{order.id}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Program ID: {SOLANA_PROGRAM_ID.slice(0, 10)}...
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            {order.productName || order.desc}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {order.desc}
          </p>
        </div>

        {/* State Machine Diagram */}
        <div>
          <StateDiagram currentStatus={order.status} />
        </div>

        {/* Key Values & Deadline Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Nilai Escrow Terkunci (PDA)
            </span>
            <div className="text-lg font-bold text-emerald-400">
              {order.amountSol} SOL
            </div>
            <div className="text-[11px] text-slate-400">
              ≈ Rp {idrAmount.toLocaleString('id-ID')} ({order.amountAmn || Math.round(order.amountSol * 700)} AMN)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              DeFi Yield Streaming
            </span>
            <div className="text-lg font-bold text-teal-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>{order.apyPercent}% APY</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Kamino SOL Liquid Vault
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Batas Waktu Pengiriman
            </span>
            <div className={`text-base font-bold ${isExpired ? 'text-rose-400' : 'text-slate-200'}`}>
              {isExpired ? 'Batas Waktu Berakhir' : `Sisa ${daysLeft} Hari`}
            </div>
            <div className="text-[11px] text-slate-400">
              Slot: #{order.deadlineSlot}
            </div>
          </div>
        </div>

        {/* Resi Pengiriman jika sudah Shipped */}
        {order.courierTracking && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-500/30 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[11px]">Resi Pengiriman On-Chain:</span>
              <span className="text-teal-300 font-bold text-sm">{order.courierTracking}</span>
              <span className="text-slate-400 ml-2">({order.courierName || 'Ekspedisi'})</span>
            </div>
            <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20">
              Terverifikasi
            </span>
          </div>
        )}

        {/* Refund Status Alerts (Point 3) */}
        {order.status === OrderStatus.RefundRequested && (
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Status: Pengajuan Komplain Refund Aktif</span>
            </div>
            <p className="text-slate-300">
              <strong>Alasan:</strong> {order.refundReason || 'Barang tidak sesuai spesifikasi atau rusak.'}
            </p>
            {order.refundProofNote && (
              <p className="text-[11px] text-slate-400 font-mono">
                <strong>Bukti:</strong> {order.refundProofNote}
              </p>
            )}
            <div className="text-[11px] text-amber-300/80 font-mono">
              Dana {order.amountSol} SOL tetap aman di PDA Solana menunggu persetujuan Admin atau kesepakatan penjual.
            </div>
          </div>
        )}

        {order.status === OrderStatus.Refunded && (
          <div className="p-4 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-300 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Status: Pengembalian Dana (100% Refunded) Berhasil</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">
                +{order.amountSol} SOL Kembali ke Dompet
              </span>
            </div>
            <p className="text-slate-300">
              {order.outOfStockReason ? `Penjual membatalkan: "${order.outOfStockReason}"` : order.refundReason ? `Komplain disetujui: "${order.refundReason}"` : 'Auto-refund timeout smart contract terpenuhi.'}
            </p>
            {order.adminNotes && (
              <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800">
                <strong>Berita Acara Admin:</strong> {order.adminNotes}
              </p>
            )}
          </div>
        )}

        {/* Skenario Aksi Interaktif */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Aksi Kontrak Berdasarkan Peran Anda:
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* Pembeli membayar Draft */}
            {order.status === OrderStatus.Draft && isBuyer && (
              <button
                onClick={handleDepositSol}
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Deposit {order.amountSol} SOL ke Rekber
              </button>
            )}

            {/* Penjual kirim barang */}
            {(order.status === OrderStatus.Funded || order.status === OrderStatus.ConfirmedBySeller) && isSeller && (
              <button
                onClick={() => setShowShippingForm(true)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Kirim Barang (Input Resi)</span>
              </button>
            )}

            {/* Pembeli konfirmasi barang diterima */}
            {order.status === OrderStatus.Shipped && isBuyer && (
              <>
                <button
                  onClick={handleConfirmReceived}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Konfirmasi Diterima & Ambil Cashback AMN</span>
                </button>

                <button
                  onClick={() => setShowDisputeForm(true)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Ajukan Sengketa (Komplain)</span>
                </button>
              </>
            )}

            {/* Auto-refund timeout */}
            {isExpired && order.status !== OrderStatus.Shipped && order.status !== OrderStatus.Completed && order.status !== OrderStatus.Refunded && isBuyer && (
              <button
                onClick={handleClaimTimeout}
                disabled={isSubmitting}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Klaim Auto-Refund 100% (Deadline Lewat)</span>
              </button>
            )}
          </div>

          {/* AKSI OTORITAS ADMIN: APPROVE LEPAS DANA / REFUND (POINT 6) */}
          {isAdmin && order.adminHeldTokenStatus === 'HELD_IN_PDA' && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Otoritas Admin: Persetujuan Lepas Dana Smart Contract (Point 6)</span>
                </span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded">
                  Multi-Sig Quorum 3/5
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Sebagai Admin Protocol, Anda memiliki wewenang Multi-Sig untuk menyetujui pelepasan {order.amountSol} SOL dari PDA ke Penjual atau mengembalikannya ke Pembeli.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    setIsSubmitting(true);
                    await adminReleaseFundsToSeller(order.id, 'Persetujuan Admin: Dana dan bonus yield resmi dilepaskan ke Penjual.');
                    setIsSubmitting(false);
                    onClose();
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Lepas ke Penjual ({order.amountSol} SOL)</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    setIsSubmitting(true);
                    await adminReleaseRefundToBuyer(order.id, 'Persetujuan Admin: Komplain disetujui, dana 100% di-refund ke Pembeli.');
                    setIsSubmitting(false);
                    onClose();
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Approve Refund ke Pembeli ({order.amountSol} SOL)</span>
                </button>
              </div>
            </div>
          )}

          {/* Shipping Form Toggle */}
          {showShippingForm && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <label className="block text-slate-300 font-medium">Nomor Resi Ekspedisi:</label>
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="contoh: JNE-SOL-88294101"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-teal-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowShippingForm(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleMarkShipped}
                  className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Konfirmasi Pengiriman On-Chain
                </button>
              </div>
            </div>
          )}

          {/* Dispute Form Toggle */}
          {showDisputeForm && (
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-3 text-xs">
              <label className="block text-slate-300 font-medium">Jelaskan Permasalahan Barang:</label>
              <textarea
                rows={2}
                value={disputeInput}
                onChange={(e) => setDisputeInput(e.target.value)}
                placeholder="Barang mengalami kerusakan / variasi yang dikirim salah..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDisputeForm(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleRaiseDispute}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Kirim ke Pengadilan Tribunal DAO
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History Log */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Riwayat Transaksi di Blockchain Solana:
          </div>

          <div className="space-y-1.5">
            {order.txHistory.map((tx, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-emerald-400 font-bold">{tx.method}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{tx.note}</div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => onOpenExplorerTx && onOpenExplorerTx(tx.txHash)}
                    className="text-[11px] text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Solana Signature ({tx.txHash.slice(0, 8)}...)</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <div className="text-[10px] text-slate-500">Slot #{tx.slotNumber || 289410291}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
