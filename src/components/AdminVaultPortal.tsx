import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { EscrowOrder, OrderStatus } from '../types/escrow';
import { 
  SOL_IDR_RATE, 
  AMN_IDR_RATE, 
  SOLANA_PROGRAM_ID, 
  DEFI_YIELD_VAULT_PDA, 
  TOKENOMICS_INFO 
} from '../data/mockData';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  Clock, 
  X, 
  Coins, 
  FileCheck2, 
  ExternalLink,
  Cpu,
  Flame,
  TrendingUp,
  ShieldAlert,
  Sliders,
  Scale,
  Activity,
  Server,
  UserX,
  Vote,
  FileSignature,
  Check,
  Package
} from 'lucide-react';

export const AdminVaultPortal: React.FC = () => {
  const { 
    orders, 
    activeAccount, 
    tokenomics, 
    isProtocolPaused,
    currentSlot,
    adminReleaseFundsToSeller, 
    adminReleaseRefundToBuyer,
    adminTriggerBuybackBurn,
    adminToggleCircuitBreaker,
    adminVoteDisputeTribunal 
  } = useWeb3();

  // Admin Sub-Tab: 'approvals' as primary default (Point 6)
  const [adminTab, setAdminTab] = useState<'approvals' | 'treasury' | 'defi' | 'tribunal' | 'escrows' | 'security' | 'telemetry'>('approvals');

  // Approval Sub-Filter
  const [approvalFilter, setApprovalFilter] = useState<'pending' | 'complaint' | 'all' | 'released' | 'refunded'>('pending');

  // Action Modal State (Point 6)
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<EscrowOrder | null>(null);
  const [actionType, setActionType] = useState<'toSeller' | 'toBuyer'>('toSeller');
  const [adminNotes, setAdminNotes] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // DeFi Controls State
  const [burnAmountInput, setBurnAmountInput] = useState('5000');
  const [isBurningLoading, setIsBurningLoading] = useState(false);

  // Blacklist screening
  const [screenAddressInput, setScreenAddressInput] = useState('');
  const [screenResult, setScreenResult] = useState<{ status: 'clean' | 'flagged'; reason?: string } | null>(null);

  // Metrics
  const heldOrders = orders.filter(o => o.adminHeldTokenStatus === 'HELD_IN_PDA');
  const releasedOrders = orders.filter(o => o.adminHeldTokenStatus === 'RELEASED_TO_SELLER');
  const refundedOrders = orders.filter(o => o.adminHeldTokenStatus === 'REFUNDED_TO_BUYER');
  const complaintOrders = orders.filter(o => o.status === OrderStatus.RefundRequested);

  const totalHeldSol = heldOrders.reduce((sum, o) => sum + o.amountSol, 0);
  const totalReleasedSol = releasedOrders.reduce((sum, o) => sum + o.amountSol, 0);
  const totalRefundedSol = refundedOrders.reduce((sum, o) => sum + o.amountSol, 0);

  const disputeOrders = orders.filter(o => o.status === OrderStatus.Disputed || o.status === OrderStatus.RefundRequested);

  // Filtered orders for Approvals Hub
  const displayedApprovalOrders = orders.filter(order => {
    if (approvalFilter === 'complaint') {
      return order.status === OrderStatus.RefundRequested;
    }
    if (approvalFilter === 'pending') {
      return order.adminHeldTokenStatus === 'HELD_IN_PDA';
    }
    if (approvalFilter === 'released') {
      return order.adminHeldTokenStatus === 'RELEASED_TO_SELLER';
    }
    if (approvalFilter === 'refunded') {
      return order.adminHeldTokenStatus === 'REFUNDED_TO_BUYER';
    }
    return true;
  });

  const openActionModal = (order: EscrowOrder, type: 'toSeller' | 'toBuyer') => {
    setSelectedOrderForAction(order);
    setActionType(type);
    if (type === 'toSeller') {
      setAdminNotes(`Verifikasi pengiriman pesanan #${order.id} selesai. Otoritas Admin Multi-Sig menyetujui pelepasan dana pokok ${order.amountSol} SOL dan bonus yield ke Penjual.`);
    } else {
      if (order.status === OrderStatus.RefundRequested) {
        setAdminNotes(`Admin memverifikasi laporan barang tidak sesuai pada pesanan #${order.id}. Bukti unboxing valid & terkonfirmasi. Otoritas Admin mengesahkan konfirmasi pengembalian dana 100% (${order.amountSol} SOL) dari PDA Solana kembali ke dompet pembeli.`);
      } else {
        setAdminNotes(`Pemeriksaan komplain pesanan #${order.id} disetujui. Otoritas Admin menyetujui pengembalian dana 100% (${order.amountSol} SOL) kembali ke dompet Pembeli.`);
      }
    }
  };

  const handleExecuteRelease = async () => {
    if (!selectedOrderForAction) return;
    setIsExecuting(true);
    if (actionType === 'toSeller') {
      await adminReleaseFundsToSeller(selectedOrderForAction.id, adminNotes);
    } else {
      await adminReleaseRefundToBuyer(selectedOrderForAction.id, adminNotes);
    }
    setIsExecuting(false);
    setSelectedOrderForAction(null);
  };

  const handleTriggerBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(burnAmountInput);
    if (!val || val <= 0) return;
    setIsBurningLoading(true);
    await adminTriggerBuybackBurn(val);
    setIsBurningLoading(false);
  };

  const handleScreenAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenAddressInput) return;
    if (screenAddressInput.toLowerCase().includes('bad') || screenAddressInput.toLowerCase().includes('drain')) {
      setScreenResult({ status: 'flagged', reason: 'Terdeteksi pada daftar hitam OFAC / Solana Scam Drainer Report.' });
    } else {
      setScreenResult({ status: 'clean', reason: 'Alamat bersih. Skor reputasi: 98/100, nol laporan penipuan.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Protocol Status Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isProtocolPaused 
          ? 'bg-rose-950/60 border-rose-500/50 text-rose-200' 
          : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isProtocolPaused ? 'bg-rose-600/30 border-rose-500 text-rose-300' : 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
          }`}>
            {isProtocolPaused ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {isProtocolPaused ? 'PERINGATAN: PROTOCOL CIRCUIT BREAKER AKTIF' : 'Enterprise Protocol Governance & Multi-Sig Treasury'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                Solana Anchor v0.30
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isProtocolPaused 
                ? 'Semua transaksi baru dibekukan sementara untuk pencegahan ancaman keamanan.' 
                : 'Otoritas Root Multi-Sig · Quorum 3-dari-5 Validator · Pengawas Rekber UMKM'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={adminToggleCircuitBreaker}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              isProtocolPaused
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/30'
            }`}
          >
            {isProtocolPaused ? 'Pulihkan Operasional Normal' : 'Aktifkan Circuit Breaker (Freeze)'}
          </button>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-xs">
        
        {/* TAB 1: APPROVAL LEPAS DANA (POINT 6) */}
        <button
          onClick={() => setAdminTab('approvals')}
          className={`flex items-center gap-2 px-3.5 py-2 font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'approvals' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSignature className="w-4 h-4 text-emerald-400" />
          <span>Approve Lepas Dana & Refund ({heldOrders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('treasury')}
          className={`flex items-center gap-2 px-3.5 py-2 font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'treasury' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Treasury & Reserves</span>
        </button>

        <button
          onClick={() => setAdminTab('tribunal')}
          className={`flex items-center gap-2 px-3.5 py-2 font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'tribunal' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Tribunal Sengketa ({disputeOrders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('defi')}
          className={`flex items-center gap-2 px-3.5 py-2 font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'defi' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>DeFi Yield & Burn</span>
        </button>

        <button
          onClick={() => setAdminTab('escrows')}
          className={`flex items-center gap-2 px-3.5 py-2 font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'escrows' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Buku Besar PDA</span>
        </button>

        <button
          onClick={() => setAdminTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'security' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>AML Screening</span>
        </button>

        <button
          onClick={() => setAdminTab('telemetry')}
          className={`flex items-center gap-2 px-3.5 py-2 font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'telemetry' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Telemetry</span>
        </button>
      </div>

      {/* MODULE 0: PUSAT APPROVAL LEPAS DANA & REFUND (POINT 6) */}
      {adminTab === 'approvals' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Header & Sub-filters */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-emerald-400" />
                  <span>Pusat Persetujuan (Approve) & Pelepasan Dana Escrow Admin</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sebagai Admin / Pengawas Multi-Sig, Anda berhak menyetujui pelepasan dana dari Program PDA Solana ke Penjual, atau menyetujui pengembalian dana (refund) 100% ke Pembeli.
                </p>
              </div>

              <div className="text-right font-mono text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                <span className="text-slate-400 block text-[10px]">TOTAL DANA MENUNGGU APPROVAL:</span>
                <span className="text-emerald-400 font-bold text-sm">{totalHeldSol.toFixed(2)} SOL</span>
                <span className="text-[11px] text-slate-500 block">({heldOrders.length} Pesanan Terkunci)</span>
              </div>
            </div>

            {/* Sub-Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 border-t border-slate-800/80">
              <button
                onClick={() => setApprovalFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  approvalFilter === 'pending'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                }`}
              >
                Menunggu Tindakan Admin ({heldOrders.length})
              </button>

              <button
                onClick={() => setApprovalFilter('complaint')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  approvalFilter === 'complaint'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm'
                    : 'text-amber-400 hover:text-amber-300 bg-slate-950 border border-amber-500/30'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Barang Tidak Sesuai ({complaintOrders.length})</span>
              </button>

              <button
                onClick={() => setApprovalFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  approvalFilter === 'all'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                }`}
              >
                Semua Pesanan ({orders.length})
              </button>

              <button
                onClick={() => setApprovalFilter('released')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  approvalFilter === 'released'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                }`}
              >
                Sudah Dilepas ke Penjual ({releasedOrders.length})
              </button>

              <button
                onClick={() => setApprovalFilter('refunded')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  approvalFilter === 'refunded'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                }`}
              >
                Sudah Di-Refund ({refundedOrders.length})
              </button>
            </div>
          </div>

          {/* List of Orders for Approval */}
          {displayedApprovalOrders.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-60" />
              <div className="font-semibold text-slate-300">Tidak ada pesanan yang perlu tindakan pada kategori ini.</div>
              <p className="text-slate-500 mt-1">Semua pesanan berjalan aman sesuai parameter smart contract.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {displayedApprovalOrders.map((order) => {
                const isHeld = order.adminHeldTokenStatus === 'HELD_IN_PDA';
                const isDisputed = order.status === OrderStatus.RefundRequested || order.status === OrderStatus.Disputed;
                
                return (
                  <div
                    key={order.id}
                    className={`p-5 rounded-2xl border transition-all space-y-4 ${
                      isDisputed && isHeld
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                        : isHeld
                        ? 'bg-slate-900 border-indigo-500/40 shadow-sm'
                        : 'bg-slate-900/70 border-slate-800'
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-950 text-indigo-400 border border-indigo-500/30">
                          Rekber Order #{order.id}
                        </span>
                        <h4 className="text-sm font-bold text-white">{order.productName}</h4>
                        <span className="text-xs text-slate-400 font-mono">({order.category})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono text-xs">
                          <span className="text-emerald-400 font-bold">{order.amountSol} SOL</span>
                          <span className="text-slate-400 text-[10px] block">≈ Rp {order.amountIdr.toLocaleString('id-ID')}</span>
                        </div>

                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          order.adminHeldTokenStatus === 'RELEASED_TO_SELLER'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : order.adminHeldTokenStatus === 'REFUNDED_TO_BUYER'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : isDisputed
                            ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 font-bold'
                            : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        }`}>
                          {order.adminHeldTokenStatus === 'HELD_IN_PDA' ? 'Terkunci di PDA (Menunggu Approval)' : order.adminHeldTokenStatus === 'RELEASED_TO_SELLER' ? 'Dana Sukses Dilepas ke Penjual' : 'Dana Sukses Di-Refund ke Pembeli'}
                        </span>
                      </div>
                    </div>

                    {/* Operational Details Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[10px]">ALAMAT PEMBELI:</span>
                        <span className="text-white truncate block">{order.buyer}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ALAMAT PENJUAL:</span>
                        <span className="text-teal-300 truncate block">{order.seller}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">RESI PENGIRIMAN:</span>
                        <span className="text-emerald-400 font-bold block">{order.courierTracking || 'Belum Diinput'}</span>
                      </div>
                    </div>

                    {/* Context Notice for Admin */}
                    {isDisputed && (
                      <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Komplain Pembeli Membutuhkan Keputusan Admin:</span>
                        </div>
                        <p className="text-slate-300">"{order.refundReason || order.disputeReason || 'Barang tidak sesuai spesifikasi atau cacat.'}"</p>
                        {order.refundProofNote && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            <strong>Bukti:</strong> {order.refundProofNote}
                          </div>
                        )}
                      </div>
                    )}

                    {order.adminNotes && (
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                        <span className="text-indigo-400 font-bold font-sans">Catatan Riwayat Admin: </span>
                        {order.adminNotes}
                      </div>
                    )}

                    {/* ACTION BUTTONS (POINT 6: APPROVE LEPAS DANA BAGIAN ADMIN) */}
                    {isHeld ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                        <div className="text-[11px] text-slate-400 font-mono">
                          PDA Vault: {order.pdaAddress ? order.pdaAddress.slice(0, 16) + '...' : 'System'} · Quorum 3/5 Validator
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* 1. APPROVE LEPAS DANA KE PENJUAL */}
                          <button
                            type="button"
                            onClick={() => openActionModal(order, 'toSeller')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✅ Approve Lepas Dana ke Penjual ({order.amountSol} SOL)</span>
                          </button>

                          {/* 2. APPROVE REFUND KE PEMBELI */}
                          <button
                            type="button"
                            onClick={() => openActionModal(order, 'toBuyer')}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-600/20"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>🔄 Approve Refund ke Pembeli ({order.amountSol} SOL)</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>Penyelesaian On-Chain Selesai</span>
                        <span className="text-emerald-400 font-bold">✓ Eksekusi Tanda Tangan Multi-Sig Terverifikasi</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODULE 1: TREASURY & VAULT RESERVES */}
      {adminTab === 'treasury' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total SOL di PDA Vault</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {totalHeldSol.toFixed(2)} SOL
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                ≈ Rp {(totalHeldSol * SOL_IDR_RATE).toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Treasury Reserve SOL</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                450.00 SOL
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Cadangan likuiditas multi-sig
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Treasury USDC Liquidity</div>
              <div className="text-2xl font-bold font-mono text-teal-400 mt-1">
                $95,000 USDC
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Solana SPL Stablecoin
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total Dana Sukses Dilepas</div>
              <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
                {totalReleasedSol.toFixed(2)} SOL
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Terkirim ke penjual UMKM
              </div>
            </div>
          </div>

          {/* Multi-Sig Signers Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">Status Otoritas Multi-Sig Governance (3-dari-5)</h3>
                <p className="text-xs text-slate-400">Kunci publik validator yang berhak menandatangani perubahan parameter protokol.</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                Quorum Terpenuhi (5/5 Online)
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold">[Signer 1 - Active Admin]</span>
                  <span className="text-slate-300 ml-2">12FrEskRoWvaULT999AmnhTreasuryX1111111111</span>
                </div>
                <span className="text-emerald-400">Verified Root Key</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-teal-400 font-bold">[Signer 2 - Sentinel Node]</span>
                  <span className="text-slate-300 ml-2">Sent1neLvaLidAt0rSolanaAnchor777888999X</span>
                </div>
                <span className="text-teal-400">Auto-Signer Active</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-indigo-400 font-bold">[Signer 3 - AMIKOM Validator]</span>
                  <span className="text-slate-300 ml-2">Amik0mReseaRchVaLidat0r998822334455AA</span>
                </div>
                <span className="text-indigo-400">Academic Anchor</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: DEFI YIELD & BUYBACK BURN */}
      {adminTab === 'defi' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* DeFi Strategy Configuration */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Pengaturan Alokasi Yield Vault Solana</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Protokol mengalirkan deposit escrow ke lending / liquid staking pool teraman.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Kamino SOL Yield Pool</div>
                    <div className="text-slate-400 text-[11px]">Strategi utama: Jaminan modal pokok 100%</div>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">6.8% APY (Aktif)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Marinade Liquid Staking (mSOL)</div>
                    <div className="text-slate-400 text-[11px]">Strategi sekunder untuk transaksi lebih dari 5 hari</div>
                  </div>
                  <span className="font-mono text-teal-400 font-bold">7.1% APY (Aktif)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">Rasio Pembagian Imbal Hasil Terdesentralisasi:</div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    • 40% Cashback Loyalitas Pembeli ($AMN)<br />
                    • 40% Bonus Fulfillment Penjual (SOL)<br />
                    • 20% Pembelian Kembali & Pembakaran $AMN On-Chain
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Buyback & Burn Controller */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Mesin Deflasi: $AMN Buyback & Burn</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Eksekusi pembakaran token on-chain dari pool cadangan treasury protokol.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Total Telah Dibakar</span>
                  <div className="text-sm font-bold font-mono text-rose-400 mt-0.5">
                    {tokenomics.totalBurned.toLocaleString()} AMN
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Pool Buyback Solana</span>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {tokenomics.buybackPoolSol.toFixed(2)} SOL
                  </div>
                </div>
              </div>

              <form onSubmit={handleTriggerBurn} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Jumlah Token AMN untuk Dibakar Permanen:
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={burnAmountInput}
                    onChange={(e) => setBurnAmountInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-rose-400 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isBurningLoading}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isBurningLoading ? 'Mengeksekusi SPL Burn Instruction...' : 'Bakar $AMN di Blockchain Solana (Burn) →'}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* MODULE 3: PENGADILAN SENGKETA (DAO DISPUTE TRIBUNAL) */}
      {adminTab === 'tribunal' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">Pengadilan Tribunal Sengketa Multi-Sig</h3>
              <p className="text-xs text-slate-400">Kasus komplain barang tidak sesuai atau pesanan bermasalah yang membutuhkan keputusan juri validator.</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
              {disputeOrders.length} Kasus Membutuhkan Voting
            </span>
          </div>

          {disputeOrders.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-900/50 border border-slate-800 text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-60" />
              <div>Tidak ada sengketa aktif saat ini. Semua transaksi berjalan damai dan lancar.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {disputeOrders.map(order => {
                const votes = order.tribunalVotes || [];
                const sellerVotes = votes.filter(v => v.vote === 'release_to_seller').length;
                const buyerVotes = votes.filter(v => v.vote === 'refund_to_buyer').length;

                return (
                  <div key={order.id} className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-400">Kasus #{order.id}</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{order.productName}</h4>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <span className="text-white font-bold">{order.amountSol} SOL</span>
                        <div className="text-[11px] text-slate-400">≈ Rp {order.amountIdr.toLocaleString('id-ID')}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-rose-400 font-semibold">Alasan Komplain Pembeli:</span>
                        <p className="text-slate-300">{order.refundReason || order.disputeReason || 'Barang tidak sesuai spesifikasi atau cacat produksi.'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
                        <span className="text-emerald-400 font-semibold font-sans">Hash Bukti Video Unboxing (SHA-256):</span>
                        <p className="text-slate-400 text-[11px] break-all">{order.securityProofHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</p>
                      </div>
                    </div>

                    {/* Voting Progress */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span>Suara Validator:</span>
                      <div className="flex gap-4">
                        <span className="text-emerald-400">Menangkan Penjual: {sellerVotes}/3</span>
                        <span className="text-rose-400">Menangkan Pembeli: {buyerVotes}/3</span>
                      </div>
                    </div>

                    {/* Judge Voting Actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => adminVoteDisputeTribunal(order.id, activeAccount.name, 'release_to_seller')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Vote className="w-3.5 h-3.5" />
                        <span>Vote: Lepas Dana ke Penjual ({order.amountSol} SOL)</span>
                      </button>

                      <button
                        onClick={() => adminVoteDisputeTribunal(order.id, activeAccount.name, 'refund_to_buyer')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Vote className="w-3.5 h-3.5" />
                        <span>Vote: Refund 100% ke Pembeli ({order.amountSol} SOL)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODULE 4: GLOBAL ESCROW PDA LEDGER */}
      {adminTab === 'escrows' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Seluruh Pesanan Rekber Solana On-Chain</h3>
            <span className="text-xs font-mono text-slate-400">{orders.length} Total Transaksi</span>
          </div>

          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">Order #{order.id}</span>
                    <span className="text-xs font-semibold text-white">{order.productName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      PDA: {order.pdaAddress ? order.pdaAddress.slice(0, 8) + '...' : 'System'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Pembeli: {order.buyer.slice(0, 8)}... · Penjual: {order.seller.slice(0, 8)}...
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Status: <strong className="text-slate-300">{order.adminHeldTokenStatus}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono text-xs">
                    <div className="font-bold text-white">{order.amountSol} SOL</div>
                    <div className="text-slate-400 text-[10px]">Rp {order.amountIdr.toLocaleString('id-ID')}</div>
                  </div>

                  {order.adminHeldTokenStatus === 'HELD_IN_PDA' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openActionModal(order, 'toSeller')}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Lepas ke Penjual
                      </button>
                      <button
                        onClick={() => openActionModal(order, 'toBuyer')}
                        className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Refund Pembeli
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 5: AML & BLACKLIST SCREENING */}
      {adminTab === 'security' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 animate-fade-in">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Pemeriksaan Sanksi & Screening Anti-Money Laundering (AML)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Validasi alamat dompet Solana pedagang untuk mencegah pencucian uang dan akun penipuan (drainer).
            </p>
          </div>

          <form onSubmit={handleScreenAddress} className="flex gap-2">
            <input
              type="text"
              required
              value={screenAddressInput}
              onChange={(e) => setScreenAddressInput(e.target.value)}
              placeholder="Masukkan alamat Solana Base58 (contoh: 89DbKaG9T5xM8rQ2p...)"
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Cek Keamanan Alamat →
            </button>
          </form>

          {screenResult && (
            <div className={`p-4 rounded-xl border text-xs ${
              screenResult.status === 'clean'
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}>
              <div className="font-bold mb-1">
                {screenResult.status === 'clean' ? 'Hasil Screening: Alamat Bersih & Terverifikasi' : 'Peringatan: Alamat Terindikasi Risiko Tinggi'}
              </div>
              <p>{screenResult.reason}</p>
            </div>
          )}
        </div>
      )}

      {/* MODULE 6: SOLANA NODE TELEMETRY */}
      {adminTab === 'telemetry' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Solana Network TPS</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">3.248 TPS</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Kapasitas peak 65.000 TPS</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Current Slot Height</div>
              <div className="text-xl font-bold font-mono text-white mt-1">#{currentSlot}</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">400ms slot duration</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Current Epoch</div>
              <div className="text-xl font-bold font-mono text-teal-400 mt-1">Epoch 682 (74.2%)</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Sisa ~14 jam</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">RPC Latency (Jakarta)</div>
              <div className="text-xl font-bold font-mono text-indigo-400 mt-1">42 ms</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Sub-second ping</div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION CONFIRMATION MODAL DENGAN MULTI-SIG CHECKLIST (POINT 6) */}
      {selectedOrderForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-emerald-400" />
                  <span>
                    {actionType === 'toSeller' 
                      ? 'Otorisasi Persetujuan: Lepas Dana ke Penjual' 
                      : 'Otorisasi Persetujuan: Pengembalian Dana ke Pembeli'}
                  </span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Solana Escrow Order #{selectedOrderForAction.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForAction(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Financial Parameters */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Barang:</span>
                <span className="text-white font-sans font-semibold">{selectedOrderForAction.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jumlah Dana Dilepas:</span>
                <span className="text-emerald-400 font-bold text-sm">{selectedOrderForAction.amountSol} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimasi Rupiah:</span>
                <span className="text-slate-300">Rp {selectedOrderForAction.amountIdr.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Penerima Transfer:</span>
                <span className="text-teal-300 truncate max-w-[200px]">
                  {actionType === 'toSeller' ? selectedOrderForAction.seller : selectedOrderForAction.buyer}
                </span>
              </div>
            </div>

            {/* Multi-Sig Quorum Validation Checklist */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs space-y-2">
              <span className="font-bold text-indigo-300 block">Checklist Validasi Multi-Sig (Quorum 3/5):</span>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Kunci 1: Root Administrator Protocol (12FrEskR...X111) [Signed]</span>
                </div>
                <div className="flex items-center gap-1.5 text-teal-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Kunci 2: Sentinel Node Auto-Validation [Passed]</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Kunci 3: AMIKOM Research Multi-Sig DAO Anchor [Confirmed]</span>
                </div>
              </div>
            </div>

            {/* Admin Record Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Catatan Berita Acara / Rationale Admin:
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedOrderForAction(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isExecuting}
                onClick={handleExecuteRelease}
                className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-md ${
                  actionType === 'toSeller' 
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' 
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                }`}
              >
                {isExecuting ? 'Menandatangani di Solana...' : `Eksekusi Tanda Tangan ${actionType === 'toSeller' ? 'Lepas ke Penjual' : 'Refund ke Pembeli'} →`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
