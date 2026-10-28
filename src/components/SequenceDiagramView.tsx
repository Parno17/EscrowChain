import React, { useState } from 'react';
import { EscrowOrder, OrderStatus } from '../types/escrow';
import { useWeb3 } from '../context/Web3Context';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCcw, 
  Package, 
  Wallet, 
  ShieldCheck, 
  Eye, 
  Layers, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';

interface SequenceDiagramViewProps {
  selectedOrder?: EscrowOrder | null;
  onSelectOrder?: (order: EscrowOrder) => void;
  openCreateBuyerModal?: () => void;
  openCreateSellerModal?: () => void;
  onOpenOrderModal?: () => void;
}

export const SequenceDiagramView: React.FC<SequenceDiagramViewProps> = ({
  selectedOrder,
  onSelectOrder,
  openCreateBuyerModal,
  openCreateSellerModal,
  onOpenOrderModal
}) => {
  const { 
    orders, 
    activeAccount, 
    depositSolTokens, 
    markShipped, 
    confirmOrderCompleted, 
    claimTimeoutRefund, 
    currentSimulatedTime 
  } = useWeb3();

  const handleOpenModal = () => {
    if (onOpenOrderModal) onOpenOrderModal();
    else if (openCreateBuyerModal) openCreateBuyerModal();
  };

  const [activeInitiatorTab, setActiveInitiatorTab] = useState<'buyer' | 'seller'>('buyer');
  const [showOriginalImageModal, setShowOriginalImageModal] = useState(false);

  // Active order to trace (default to first or selected)
  const currentOrder = selectedOrder || orders[0];

  // Determine current active step in the sequence diagram
  const getActiveStep = () => {
    if (!currentOrder) return 1;
    if (currentOrder.status === OrderStatus.Draft) return 1; // Awaiting deposit
    if (currentOrder.status === OrderStatus.Funded) return 2; // Deposited, waiting delivery
    if (currentOrder.status === OrderStatus.Shipped) return 3; // Delivered, checking conditions
    if (currentOrder.status === OrderStatus.Completed) return 4; // Condition met -> Release tokens
    if (currentOrder.status === OrderStatus.Refunded) return 5; // Condition not met -> Tokens go back
    return 3;
  };

  const activeStep = getActiveStep();
  const isInitiatorBuyer = currentOrder ? currentOrder.initiator === 'buyer' : activeInitiatorTab === 'buyer';

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Alur Interaksi Aktor (UML Sequence Diagram Model)
          </div>
          <h2 className="text-xl font-bold text-white">
            Simulasi Diagram Sekuensial: Buyer · Escrow · Seller
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Representasi visual interaktif alur kerja rekening bersama berdasarkan diagram sekuensial yang Anda unggah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOriginalImageModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Lihat Diagram Gambar Asli</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleOpenModal}
              className="px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
            >
              + Inisiasi oleh Pembeli
            </button>
            <button
              onClick={handleOpenModal}
              className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              + Inisiasi oleh Penjual
            </button>
          </div>
        </div>
      </div>

      {/* Selector: Select which order to trace in the diagram */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Pilih Pesanan untuk Melacak Alur Lifeline:
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {orders.slice(0, 5).map((o) => (
            <button
              key={o.id}
              onClick={() => onSelectOrder?.(o)}
              className={`px-3 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                currentOrder?.id === o.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              #{o.id} ({o.initiator === 'seller' ? 'Seller init' : 'Buyer init'} · {OrderStatus[o.status]})
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Sequence Diagram Board */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-x-auto">
        
        {/* Lifeline Headers (Buyer, Escrow, Seller) */}
        <div className="grid grid-cols-3 max-w-4xl mx-auto text-center font-bold text-sm mb-4 relative z-10">
          <div className="flex flex-col items-center">
            <div className="px-6 py-2.5 rounded-xl bg-slate-900 border-2 border-slate-700 text-white shadow-md inline-block">
              Buyer (Pembeli)
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {currentOrder ? currentOrder.buyer.slice(0, 8) + '...' : '7Z1uYm8T...'}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="px-6 py-2.5 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 shadow-md inline-block">
              Escrow (Solana PDA)
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              Solana Anchor Program
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="px-6 py-2.5 rounded-xl bg-slate-900 border-2 border-slate-700 text-white shadow-md inline-block">
              Seller (Penjual UMKM)
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {currentOrder ? currentOrder.seller.slice(0, 8) + '...' : '0x89D2...'}
            </div>
          </div>
        </div>

        {/* Lifeline vertical dashed lines */}
        <div className="relative max-w-4xl mx-auto pt-2 pb-6 min-h-[560px]">
          {/* Vertical Guides */}
          <div className="absolute top-0 bottom-0 left-[16.66%] w-px border-l-2 border-dashed border-slate-700 pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-[50%] w-px border-l-2 border-dashed border-indigo-500/40 pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-[83.33%] w-px border-l-2 border-dashed border-slate-700 pointer-events-none" />

          {/* DIAGRAM SECTION 1: ALT [Buyer initiates] vs [Seller initiates] */}
          <div className="relative border-2 border-slate-700 rounded-xl bg-slate-900/40 p-4 mb-5">
            <div className="absolute -top-3 left-3 bg-slate-800 border border-slate-600 px-2.5 py-0.5 rounded text-[11px] font-bold text-slate-200 uppercase">
              alt [Inisiasi Transaksi]
            </div>

            {/* Path A: [Buyer initiates] */}
            <div className={`p-3 rounded-lg transition-all mb-3 ${
              isInitiatorBuyer
                ? 'bg-indigo-950/30 border border-indigo-500/50'
                : 'opacity-50'
            }`}>
              <div className="text-[11px] font-bold text-indigo-400 mb-2 flex items-center justify-between">
                <span>[Buyer initiates]</span>
                {isInitiatorBuyer && <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">Aktif pada Pesanan Ini</span>}
              </div>

              {/* Arrow: Buyer -> Escrow */}
              <div className="grid grid-cols-3 items-center">
                <div className="col-span-2 flex items-center">
                  <div className="w-1/4"></div>
                  <div className="w-3/4 flex items-center">
                    <div className="h-0.5 flex-1 bg-indigo-500 border-t border-dashed border-indigo-400"></div>
                    <ArrowRight className="w-4 h-4 text-indigo-400 -ml-1" />
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono pr-2">
                  createOrder()
                </div>
              </div>
              <div className="text-center text-xs font-semibold text-slate-300 mt-1">
                "Specify settlement procedure and conditions"
              </div>
              {currentOrder && isInitiatorBuyer && (
                <div className="text-center text-[11px] text-indigo-300 mt-0.5 italic">
                  "{currentOrder.settlementTerms || currentOrder.desc}"
                </div>
              )}
            </div>

            {/* Divider between alt conditions */}
            <div className="border-t border-dashed border-slate-700 my-2 relative">
              <span className="absolute -top-2.5 right-4 bg-slate-900 px-2 text-[10px] text-slate-500 uppercase">atau</span>
            </div>

            {/* Path B: [Seller initiates] */}
            <div className={`p-3 rounded-lg transition-all ${
              !isInitiatorBuyer
                ? 'bg-sky-950/30 border border-sky-500/50'
                : 'opacity-50'
            }`}>
              <div className="text-[11px] font-bold text-sky-400 mb-2 flex items-center justify-between">
                <span>[Seller initiates]</span>
                {!isInitiatorBuyer && <span className="text-[10px] bg-sky-500/20 px-2 py-0.5 rounded text-sky-300">Aktif pada Pesanan Ini</span>}
              </div>

              {/* Arrow: Seller -> Escrow */}
              <div className="grid grid-cols-3 items-center">
                <div className="text-left text-[11px] text-slate-400 font-mono pl-2">
                  sellerCreateInvoice()
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <div className="w-3/4 flex items-center">
                    <ArrowLeft className="w-4 h-4 text-sky-400 -mr-1" />
                    <div className="h-0.5 flex-1 bg-sky-500 border-t border-dashed border-sky-400"></div>
                  </div>
                  <div className="w-1/4"></div>
                </div>
              </div>
              <div className="text-center text-xs font-semibold text-slate-300 mt-1">
                "Specify settlement procedure and conditions"
              </div>
              {currentOrder && !isInitiatorBuyer && (
                <div className="text-center text-[11px] text-sky-300 mt-0.5 italic">
                  "{currentOrder.settlementTerms || currentOrder.desc}"
                </div>
              )}
            </div>
          </div>

          {/* DIAGRAM STEP 2: Buyer -> Escrow: Deposit tokens */}
          <div className="relative py-3 my-3">
            <div className="grid grid-cols-3 items-center">
              <div className="col-span-2 flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4 flex items-center">
                  <div className="h-0.5 flex-1 bg-emerald-400 shadow-sm shadow-emerald-400/50"></div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 -ml-1" />
                </div>
              </div>
              <div className="text-right text-xs font-mono font-bold text-emerald-400 pr-4">
                Deposit tokens ({currentOrder?.amountSol || 1.5} SOL)
              </div>
            </div>
            <div className="text-center text-xs font-semibold text-slate-300 mt-1">
              Buyer menyetor SOL/AMN yang dikunci dalam Solana PDA Escrow
            </div>
          </div>

          {/* DIAGRAM STEP 3: WIDE ACTIVITY BAR: Deliver product / service */}
          <div className="my-5 p-3.5 rounded-xl bg-slate-900 border-2 border-slate-700 text-center relative shadow-lg">
            <div className="text-xs font-bold text-white flex items-center justify-center gap-2">
              <Package className="w-4 h-4 text-sky-400" />
              <span>Deliver product / service (Pengiriman Barang Fisik / Jasa UMKM)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Penjual mengirimkan barang ke Pembeli dan memasukkan resi kurir via <code className="text-sky-300 font-mono">markShipped()</code>
            </div>
            {currentOrder?.courierTracking && (
              <div className="mt-1 font-mono text-[11px] text-sky-300 font-semibold">
                Nomor Resi: {currentOrder.courierTracking}
              </div>
            )}
          </div>

          {/* DIAGRAM STEP 4: SELF-MESSAGE: Check conditions */}
          <div className="my-4 flex items-center justify-center">
            <div className="px-4 py-2 rounded-lg bg-slate-900 border border-indigo-500/50 text-indigo-300 text-xs font-mono flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Check conditions (Verifikasi Penerimaan / Batas Waktu / Sengketa)</span>
            </div>
          </div>

          {/* DIAGRAM SECTION 5: ALT [condition is met] vs [condition is not met] */}
          <div className="relative border-2 border-slate-700 rounded-xl bg-slate-900/40 p-4 mt-5">
            <div className="absolute -top-3 left-3 bg-slate-800 border border-slate-600 px-2.5 py-0.5 rounded text-[11px] font-bold text-slate-200 uppercase">
              alt [Hasil Pemeriksaan Syarat]
            </div>

            {/* Path A: [condition is met] -> Release tokens to Seller */}
            <div className={`p-3 rounded-lg transition-all mb-3 ${
              currentOrder?.status === OrderStatus.Completed
                ? 'bg-emerald-950/30 border border-emerald-500/60 ring-2 ring-emerald-500/30'
                : 'opacity-70'
            }`}>
              <div className="text-[11px] font-bold text-emerald-400 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  [condition is met]
                </span>
                {currentOrder?.status === OrderStatus.Completed && (
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                    Status Pesanan Saat Ini: Selesai
                  </span>
                )}
              </div>

              {/* Arrow: Escrow -> Seller: Release tokens */}
              <div className="grid grid-cols-3 items-center">
                <div></div>
                <div className="col-span-2 flex items-center">
                  <div className="w-1/4"></div>
                  <div className="w-3/4 flex items-center">
                    <div className="h-0.5 flex-1 bg-emerald-400"></div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 -ml-1" />
                  </div>
                </div>
              </div>
              <div className="text-center text-xs font-bold text-emerald-300 mt-1">
                Release tokens (Dana cair ke dompet Penjual)
              </div>
              <div className="text-center text-[10px] text-slate-400 mt-0.5">
                Dipicu oleh confirmReceived() pembeli, claimTimeout() batas waktu, atau resolve(true) arbiter
              </div>
            </div>

            {/* Divider between alt conditions */}
            <div className="border-t border-dashed border-slate-700 my-2 relative">
              <span className="absolute -top-2.5 right-4 bg-slate-900 px-2 text-[10px] text-slate-500 uppercase">atau</span>
            </div>

            {/* Path B: [condition is not met] -> Tokens go back to Buyer */}
            <div className={`p-3 rounded-lg transition-all ${
              currentOrder?.status === OrderStatus.Refunded
                ? 'bg-rose-950/30 border border-rose-500/60 ring-2 ring-rose-500/30'
                : 'opacity-70'
            }`}>
              <div className="text-[11px] font-bold text-rose-400 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  [condition is not met]
                </span>
                {currentOrder?.status === OrderStatus.Refunded && (
                  <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">
                    Status Pesanan Saat Ini: Dikembalikan
                  </span>
                )}
              </div>

              {/* Arrow: Escrow -> Buyer: Tokens go back to Buyer */}
              <div className="grid grid-cols-3 items-center">
                <div className="col-span-2 flex items-center">
                  <div className="w-1/4"></div>
                  <div className="w-3/4 flex items-center">
                    <ArrowLeft className="w-4 h-4 text-rose-400 -mr-1" />
                    <div className="h-0.5 flex-1 bg-rose-400"></div>
                  </div>
                </div>
                <div></div>
              </div>
              <div className="text-center text-xs font-bold text-rose-300 mt-1">
                Tokens go back to Buyer (Dana refund kembali ke Pembeli)
              </div>
              <div className="text-center text-[10px] text-slate-400 mt-0.5">
                Dipicu oleh refund() (pembatalan/melebihi tenggat) atau resolve(false) putusan sengketa
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Modal: View Original Image Reference */}
      {showOriginalImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowOriginalImageModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-2">
              Gambar Referensi Diagram Sekuensial Asli
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              File referensi: <code className="font-mono text-indigo-300">image_fd9440ba.png</code>
            </p>

            <div className="rounded-xl border border-slate-800 bg-white p-4 flex justify-center">
              <img
                src="/assets/aistudio/image_fd9440ba.png"
                alt="Diagram Sekuensial Escrow"
                className="max-h-[600px] object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
