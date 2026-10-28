import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ElectronicProduct, OrderStatus, EscrowOrder } from '../types/escrow';
import { SOL_IDR_RATE, AMN_IDR_RATE, SOLANA_GAS_FEE_SOL } from '../data/mockData';
import { 
  ShoppingBag, 
  CheckCircle2, 
  RotateCcw, 
  Package, 
  Truck, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Tag, 
  X, 
  ArrowRight,
  ShieldAlert,
  Coins,
  TrendingUp,
  KeyRound,
  Search,
  Filter,
  Info,
  ExternalLink,
  Check
} from 'lucide-react';

export const BuyerPortal: React.FC = () => {
  const { 
    products, 
    orders, 
    activeAccount, 
    buyProduct, 
    confirmOrderCompleted, 
    buyerRequestRefund,
    claimTimeoutRefund,
    currentSimulatedTime 
  } = useWeb3();

  // Search & Filter for Product Catalog
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Order List Filter: 'all' | 'active' | 'completed' | 'refund'
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed' | 'refund'>('all');

  // Selected product for buying
  const [selectedProduct, setSelectedProduct] = useState<ElectronicProduct | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notesInput, setNotesInput] = useState<string>('');
  const [isBuying, setIsBuying] = useState<boolean>(false);

  // Selected order for requesting refund (Barang Tidak Sesuai)
  const [refundModalOrder, setRefundModalOrder] = useState<EscrowOrder | null>(null);
  const [refundReason, setRefundReason] = useState<string>('Barang diterima mengalami kerusakan / variasi yang dikirim tidak sesuai spesifikasi pemesanan.');
  const [proofNote, setProofNote] = useState<string>('Bukti rekaman video unboxing dan foto kondisi fisik barang telah diunggah di IPFS storage.');

  // Filter buyer's orders
  const buyerOrders = orders.filter(
    o => o.buyer.toLowerCase() === activeAccount.address.toLowerCase() || activeAccount.role === 'admin'
  );

  const activeOrdersCount = buyerOrders.filter(
    o => o.status === OrderStatus.Funded || o.status === OrderStatus.ConfirmedBySeller || o.status === OrderStatus.Shipped
  ).length;

  const completedOrdersCount = buyerOrders.filter(
    o => o.status === OrderStatus.Completed
  ).length;

  const refundOrdersCount = buyerOrders.filter(
    o => o.status === OrderStatus.RefundRequested || o.status === OrderStatus.Refunded
  ).length;

  const totalRefundedSol = buyerOrders
    .filter(o => o.status === OrderStatus.Refunded)
    .reduce((sum, o) => sum + o.amountSol, 0);

  // Filtered orders based on selected tab
  const displayedOrders = buyerOrders.filter(order => {
    if (orderFilter === 'active') {
      return order.status === OrderStatus.Funded || order.status === OrderStatus.ConfirmedBySeller || order.status === OrderStatus.Shipped;
    }
    if (orderFilter === 'completed') {
      return order.status === OrderStatus.Completed;
    }
    if (orderFilter === 'refund') {
      return order.status === OrderStatus.RefundRequested || order.status === OrderStatus.Refunded;
    }
    return true;
  });

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesSearch && matchesCat && (p.isAvailable !== false);
  });

  const categories = ['Semua', 'Smartphone', 'Laptop & Komputer', 'Audio & Headphone', 'Smartwatch', 'Kamera', 'Elektronik Rumah'];

  const openBuyModal = (product: ElectronicProduct) => {
    setSelectedProduct(product);
    setSelectedVariation(product.variations[0] || 'Standar');
    setQuantity(1);
    setNotesInput(`Pesanan ${product.name}`);
  };

  const handleExecuteBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsBuying(true);
    const totalSol = Number((selectedProduct.priceSol * quantity).toFixed(4));

    await buyProduct({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variation: selectedVariation,
      quantity,
      amountSol: totalSol,
      sellerAddress: selectedProduct.sellerAddress,
      notes: notesInput
    });

    setIsBuying(false);
    setSelectedProduct(null);
  };

  const handleConfirmCompleted = async (orderId: number) => {
    await confirmOrderCompleted(orderId);
  };

  const handleExecuteRefund = async () => {
    if (!refundModalOrder) return;
    await buyerRequestRefund(refundModalOrder.id, refundReason, proofNote);
    setRefundModalOrder(null);
  };

  const handleClaimTimeout = async (orderId: number) => {
    await claimTimeoutRefund(orderId);
  };

  return (
    <div className="space-y-6">
      
      {/* Buyer Identity & Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            Portal Pembeli Terverifikasi · Jaminan Uang Kembali 100%
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Belanja Barang Elektronik UMKM Terlindungi Smart Contract
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Dana SOL dikunci di Program Derived Address (PDA) Solana. Jika barang tidak sampai atau tidak sesuai pesanan, Anda dilindungi <span className="text-rose-400 font-semibold">Garansi 100% Refund Otomatis</span>. Selama pengiriman, dana menghasilkan <span className="text-emerald-400 font-semibold">DeFi Yield Streaming</span> dengan cashback token $AMN.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs">
            <span className="text-slate-400 block text-[10px]">SALDO SOL ANDA:</span>
            <span className="text-base font-bold text-emerald-400">{activeAccount.balanceSol.toFixed(2)} SOL</span>
            <span className="text-[11px] text-teal-300 block">≈ Rp {(activeAccount.balanceSol * SOL_IDR_RATE).toLocaleString('id-ID')}</span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs">
            <span className="text-slate-400 block text-[10px]">CASHBACK $AMN:</span>
            <span className="text-base font-bold text-teal-300">{activeAccount.balanceAmn} AMN</span>
            <span className="text-[11px] text-slate-400 block">Loyalty Token Aktif</span>
          </div>
        </div>
      </div>

      {/* QUICK SUMMARY METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Pesanan Saya</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{buyerOrders.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Transaksi tercatat on-chain</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pesanan Dalam Proses</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{activeOrdersCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Dana aman di PDA Escrow</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pesanan Selesai</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{completedOrdersCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Dana dilepas ke penjual</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 bg-rose-950/10">
          <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Status Refund / Komplain</span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{refundOrdersCount} Kasus</div>
          <div className="text-[11px] text-rose-300/80 mt-0.5 font-mono">
            {totalRefundedSol.toFixed(2)} SOL berhasil dikembalikan
          </div>
        </div>
      </div>

      {/* SECTION 1: STATUS BAGIAN PEMBELIAN & REFUND (POINT 3) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Status Pembelian & Pengembalian Dana (Refund)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pantau status pengiriman, pengajuan komplain barang tidak sesuai, dan konfirmasi refund uang kembali.
            </p>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                orderFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({buyerOrders.length})
            </button>
            <button
              onClick={() => setOrderFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                orderFilter === 'active' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dalam Proses ({activeOrdersCount})
            </button>
            <button
              onClick={() => setOrderFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                orderFilter === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Selesai ({completedOrdersCount})
            </button>
            <button
              onClick={() => setOrderFilter('refund')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                orderFilter === 'refund' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/20'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Refund & Sengketa ({refundOrdersCount})</span>
            </button>
          </div>
        </div>

        {displayedOrders.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            <Info className="w-6 h-6 mx-auto text-slate-500 mb-2" />
            <p className="font-semibold text-slate-300">Tidak ada pesanan pada kategori filter ini.</p>
            <p className="text-slate-500 mt-1">Pilih tab "Semua" atau telusuri katalog elektronik di bawah untuk melakukan pembelian.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => {
              const isTimeoutPassed = currentSimulatedTime >= order.deadlineTimestamp && 
                                      order.status !== OrderStatus.Shipped && 
                                      order.status !== OrderStatus.Completed && 
                                      order.status !== OrderStatus.Refunded;

              const isRefundActive = order.status === OrderStatus.RefundRequested;
              const isRefundCompleted = order.status === OrderStatus.Refunded;

              return (
                <div
                  key={order.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 ${
                    isRefundActive
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : isRefundCompleted
                      ? 'bg-rose-950/15 border-rose-500/30'
                      : order.status === OrderStatus.Completed
                      ? 'bg-slate-900 border-emerald-500/30'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  {/* Order Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                        Order #{order.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">{order.productName}</h4>
                      {order.selectedVariation && (
                        <span className="text-xs text-slate-400 font-mono">({order.selectedVariation})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono text-xs">
                        <span className="text-white font-bold">{order.amountSol} SOL</span>
                        <div className="text-[10px] text-slate-400">≈ Rp {order.amountIdr.toLocaleString('id-ID')}</div>
                      </div>

                      {/* Prominent Status Pill */}
                      <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        order.status === OrderStatus.Completed
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : isRefundCompleted
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold'
                          : isRefundActive
                          ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 font-bold animate-pulse'
                          : order.status === OrderStatus.Shipped
                          ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      }`}>
                        {order.status === OrderStatus.Funded && 'Dana Terkunci di PDA Solana'}
                        {order.status === OrderStatus.ConfirmedBySeller && 'Pesanan Dikonfirmasi Penjual'}
                        {order.status === OrderStatus.Shipped && 'Sedang Dikirim Kurir (Resi Aktif)'}
                        {order.status === OrderStatus.RefundRequested && '⚠️ Barang Tidak Sesuai (Perlu Konfirmasi Admin)'}
                        {order.status === OrderStatus.Completed && '✅ Pesanan Selesai (Dana Dilepas)'}
                        {order.status === OrderStatus.Refunded && '🔄 Dana Dikembalikan (100% Refunded)'}
                      </span>
                    </div>
                  </div>

                  {/* SPECIAL HIGHLIGHT SECTION UNTUK STATUS REFUND (BARANG TIDAK SESUAI -> PERLU KONFIRMASI ADMIN) */}
                  {isRefundActive && (
                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2.5 text-xs">
                      <div className="flex items-center gap-2 font-bold text-amber-300">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Kondisi: Barang Diterima Tidak Sesuai — Memerlukan Konfirmasi Admin untuk Pengembalian Dana</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Anda telah melaporkan bahwa barang yang diterima tidak sesuai pesanan. Sesuai arsitektur *escrow* terdesentralisasi, dana pembeli (<strong className="text-white">{order.amountSol} SOL</strong>) ditahan secara aman di Program PDA Solana dan <strong className="text-amber-300">MEMERLUKAN KONFIRMASI OLEH ADMIN MULTI-SIG</strong> untuk mengesahkan pengembalian dana 100% ke dompet Anda.
                      </p>
                      <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                        <div>
                          <span className="text-slate-400 font-semibold">Alasan Komplain Pembeli: </span>
                          <span className="text-amber-200">"{order.refundReason || order.disputeReason || 'Barang tidak sesuai spesifikasi atau cacat produksi.'}"</span>
                        </div>
                        {order.refundProofNote && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            <span className="text-amber-400">Bukti Verifikasi (Video/IPFS): </span> {order.refundProofNote}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Dana terlindungi aman di Program PDA Solana, tidak dapat dicairkan penjual.</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Status: Menunggu Konfirmasi Admin Multi-Sig
                        </span>
                      </div>
                    </div>
                  )}

                  {isRefundCompleted && (
                    <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-rose-300">
                          <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Status: Pengembalian Dana Sukses 100% (Dana Telah Masuk Saldo Anda)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                          +{order.amountSol} SOL Dikreditkan
                        </span>
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400 font-semibold">Keterangan Refund: </span>
                        {order.outOfStockReason ? `Penjual membatalkan: "${order.outOfStockReason}"` : order.refundReason ? `Komplain disetujui: "${order.refundReason}"` : 'Auto-Refund deadline timeout smart contract terpenuhi.'}
                      </div>
                      {order.adminNotes && (
                        <div className="text-slate-400 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                          <strong className="text-slate-300">Berita Acara Otoritas Admin:</strong> {order.adminNotes}
                        </div>
                      )}
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono pt-0.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Solana Smart Contract telah melepaskan kembali 100% saldo ke wallet pembeli tanpa potongan penalti.</span>
                      </div>
                    </div>
                  )}

                  {/* Technical Escrow Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[10px]">PROGRAM PDA SOLANA:</span>
                      <span className="text-white">{order.pdaAddress ? order.pdaAddress.slice(0, 12) + '...' : 'Escrow PDA'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">DEFI YIELD STREAMING:</span>
                      <span className="text-teal-300">{order.apyPercent}% APY (Kamino Liquid)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">NO. RESI KURIR:</span>
                      <span className="text-emerald-400 font-bold">{order.courierTracking || 'Menunggu Resi Penjual'}</span>
                    </div>
                  </div>

                  {/* Actions for buyer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Batas Proteksi: {new Date(order.deadlineTimestamp).toLocaleDateString('id-ID')} (Slot #{order.deadlineSlot})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* If order is shipped, buyer can confirm received or request refund for non-matching goods */}
                      {order.status === OrderStatus.Shipped && (
                        <>
                          <button
                            onClick={() => handleConfirmCompleted(order.id)}
                            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Konfirmasi Barang Sesuai & Ambil Cashback</span>
                          </button>

                          <button
                            onClick={() => {
                              setRefundModalOrder(order);
                              setRefundReason('Barang diterima tetapi tidak sesuai spesifikasi / cacat fisik saat unboxing.');
                            }}
                            className="px-3.5 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>⚠️ Barang Tidak Sesuai (Minta Konfirmasi Refund Admin)</span>
                          </button>
                        </>
                      )}

                      {/* If deadline passed and not shipped, buyer can trigger auto-refund */}
                      {isTimeoutPassed && (
                        <button
                          onClick={() => handleClaimTimeout(order.id)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-amber-500/20"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Klaim Auto-Refund 100% (Batas Waktu Lewat)</span>
                        </button>
                      )}

                      {/* In case order is Funded or Confirmed, buyer can also request dispute if seller is unresponsive */}
                      {(order.status === OrderStatus.Funded || order.status === OrderStatus.ConfirmedBySeller) && (
                        <button
                          onClick={() => {
                            setRefundModalOrder(order);
                            setRefundReason('Penjual tidak merespon pengiriman barang melebihi batas waktu yang disepakati.');
                          }}
                          className="px-3 py-1.5 text-slate-400 hover:text-rose-300 text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Minta Pembatalan / Refund</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: KATALOG PEMBELIAN BARANG ELEKTRONIK */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Katalog Barang Elektronik & UMKM ({filteredProducts.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih produk terverifikasi pedagang UMKM dengan transaksi sub-second Solana (Gas fee ~Rp 12).
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari gadget, kamera, laptop..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat 
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' 
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden group shadow-md"
            >
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-300 border border-slate-800 backdrop-blur-sm">
                    Stok: {product.stock}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="text-[11px] text-slate-500 mt-2 font-mono flex items-center justify-between">
                    <span>Penjual: {product.sellerName}</span>
                    <span className="text-emerald-400 font-semibold">{product.warranty}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-baseline justify-between font-mono">
                    <div>
                      <span className="text-base font-bold text-emerald-400">
                        {product.priceSol} SOL
                      </span>
                      <div className="text-[10px] text-slate-400 font-sans">
                        ≈ Rp {product.priceIdr.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <span className="text-[11px] text-teal-300 font-mono">
                      {product.priceAmn} AMN
                    </span>
                  </div>

                  <button
                    onClick={() => openBuyModal(product)}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Beli dengan Rekber Solana</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buy Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">Konfirmasi Pembelian Escrow</h3>
                <span className="text-xs text-slate-400">{selectedProduct.name}</span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Anti-phishing phrase display */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Frasa Anti-Phishing Anda:</span>
              <span className="text-emerald-400 font-bold">"{activeAccount.securityPhrase}"</span>
            </div>

            <form onSubmit={handleExecuteBuy} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Pilih Variasi Produk:</label>
                <select
                  value={selectedVariation}
                  onChange={(e) => setSelectedVariation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                >
                  {selectedProduct.variations.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Jumlah Unit:</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">Total Nilai Escrow:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {(selectedProduct.priceSol * quantity).toFixed(4)} SOL
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Estimasi Rupiah:</span>
                  <span className="text-slate-300">
                    Rp {Math.round(selectedProduct.priceSol * quantity * SOL_IDR_RATE).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Biaya Gas Solana:</span>
                  <span className="text-slate-300">0.000005 SOL (~Rp 12)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Proteksi Garansi:</span>
                  <span className="text-rose-400 font-semibold">100% Refundable jika barang tidak sesuai</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isBuying}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isBuying ? 'Mengunci di Solana PDA...' : 'Kunci Dana & Pesan →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Complaint Modal */}
      {refundModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span>Ajukan Pengembalian Dana (Refund 100%)</span>
                </h3>
                <span className="text-[11px] text-slate-400">Order #{refundModalOrder.id} ({refundModalOrder.productName})</span>
              </div>
              <button
                onClick={() => setRefundModalOrder(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Dana Terkunci yang Di-refund:</span>
                <span className="text-emerald-400 font-bold">{refundModalOrder.amountSol} SOL</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 font-sans text-[11px] text-amber-200 leading-relaxed">
                <strong className="text-amber-300 block mb-0.5">ℹ️ Konfirmasi Admin Diperlukan:</strong>
                Sesuai arsitektur Escrow Smart Contract, pengembalian dana akibat barang tidak sesuai membutuhkan verifikasi dan persetujuan otorisasi oleh <strong>Admin Rekber (Multi-Sig)</strong> sebelum dana dilepaskan dari PDA Solana kembali ke saldo wallet Anda.
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Pilih Kategori Masalah Barang:</label>
              <div className="grid grid-cols-1 gap-1.5 mb-2">
                {[
                  'Barang diterima rusak / cacat fisik saat unboxing',
                  'Varian / warna / spesifikasi berbeda dengan pesanan',
                  'Barang elektronik tidak berfungsi / mati total',
                  'Kelengkapan aksesoris / unit utama tidak lengkap'
                ].map((reasonItem) => (
                  <button
                    key={reasonItem}
                    type="button"
                    onClick={() => setRefundReason(reasonItem)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-sans border transition-colors cursor-pointer ${
                      refundReason.startsWith(reasonItem.slice(0, 15))
                        ? 'bg-rose-500/20 text-rose-200 border-rose-500/50 font-semibold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                  >
                    • {reasonItem}
                  </button>
                ))}
              </div>

              <label className="block text-slate-300 font-medium mb-1">Rincian Komplain ke Admin:</label>
              <textarea
                rows={2}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Jelaskan kondisi barang tidak sesuai atau cacat secara detail..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Catatan Bukti Video / Foto Unboxing:</label>
              <input
                type="text"
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                placeholder="Contoh: ipfs://bafy... atau link rekaman unboxing pembeli"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefundModalOrder(null)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteRefund}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                Kirim ke Admin untuk Konfirmasi Refund →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
