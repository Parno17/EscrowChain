import React, { useState, useRef } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { OrderStatus, ElectronicProduct } from '../types/escrow';
import { SOL_IDR_RATE, AMN_IDR_RATE, SOLANA_GAS_FEE_SOL } from '../data/mockData';
import { 
  Package, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Plus, 
  Clock, 
  X, 
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Tag,
  TrendingUp,
  FileCheck2,
  Edit,
  Trash2,
  Image as ImageIcon,
  Check,
  Store,
  Coins,
  Camera,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';

const PRODUCT_PHOTO_PRESETS = [
  {
    name: 'Smartphone Flagship OLED',
    category: 'Smartphone' as const,
    url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    description: 'Smartphone layar AMOLED 120Hz dengan kamera OIS 50MP dan chipset 4nm.'
  },
  {
    name: 'Ultrabook Laptop Pro 16"',
    category: 'Laptop & Komputer' as const,
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    description: 'Laptop tipis bodi aluminium dengan layar retina, baterai 18 jam, dan RAM 32GB.'
  },
  {
    name: 'Wireless ANC Headphone Hi-Res',
    category: 'Audio & Headphone' as const,
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Headphone nirkabel dengan peredam bising aktif dan sertifikasi audio resolusi tinggi.'
  },
  {
    name: 'Smartwatch Sport Titanium',
    category: 'Smartwatch' as const,
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: 'Smartwatch bezel titanium tahan air 50M dengan sensor ECG dan dual-frequency GPS.'
  },
  {
    name: 'Kamera Mirrorless 4K Creator',
    category: 'Kamera' as const,
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    description: 'Kamera hybrid 24MP video 4K 60fps dengan autofokus mata pintar untuk pembuat konten.'
  },
  {
    name: 'Smart Home Speaker AI',
    category: 'Elektronik Rumah' as const,
    url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80',
    description: 'Speaker audio 360 derajat terintegrasi asisten rumah tangga dan mikrofon beamforming.'
  }
];

export const SellerPortal: React.FC = () => {
  const { 
    products, 
    orders, 
    activeAccount, 
    uploadProduct, 
    updateProduct,
    deleteProduct,
    sellerConfirmOrder, 
    sellerReportUnavailable, 
    markShipped 
  } = useWeb3();

  // Navigation tab inside Seller Portal: 'orders' | 'products'
  const [sellerTab, setSellerTab] = useState<'orders' | 'products'>('orders');

  // Upload Product State (Point 4)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<'Smartphone' | 'Laptop & Komputer' | 'Audio & Headphone' | 'Smartwatch' | 'Kamera' | 'Elektronik Rumah'>('Smartphone');
  const [variationsInput, setVariationsInput] = useState('Titanium Black 12/256GB, Pearl White 16/512GB');
  const [stock, setStock] = useState(10);
  const [priceSol, setPriceSol] = useState(2.5);
  const [description, setDescription] = useState('Unit original garansi resmi ganti baru 1 tahun.');
  const [warranty, setWarranty] = useState('Garansi Resmi 1 Tahun');
  const [imageUrl, setImageUrl] = useState(PRODUCT_PHOTO_PRESETS[0].url);
  const [uploadSource, setUploadSource] = useState<'file' | 'preset' | 'url'>('file');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Product State (Point 5)
  const [editingProduct, setEditingProduct] = useState<ElectronicProduct | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<'Smartphone' | 'Laptop & Komputer' | 'Audio & Headphone' | 'Smartwatch' | 'Kamera' | 'Elektronik Rumah'>('Smartphone');
  const [editVariationsInput, setEditVariationsInput] = useState('');
  const [editStock, setEditStock] = useState(10);
  const [editPriceSol, setEditPriceSol] = useState(2.5);
  const [editDescription, setEditDescription] = useState('');
  const [editWarranty, setEditWarranty] = useState('Garansi Resmi 1 Tahun');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [editUploadSource, setEditUploadSource] = useState<'file' | 'preset' | 'url'>('url');
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Out of Stock Modal
  const [unavailableModalOrder, setUnavailableModalOrder] = useState<number | null>(null);
  const [unavailableReason, setUnavailableReason] = useState('Stok varian habis dari distributor pusat dan barang tidak dapat dipenuhi.');

  // Shipping Tracking Modal
  const [shippingModalOrder, setShippingModalOrder] = useState<number | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('JNE-');
  const [courierName, setCourierName] = useState('JNE Express Cargo Web3 Track');

  // Mapping kurir → prefix resi
  const courierPrefixMap: Record<string, string> = {
    'JNE Express Cargo Web3 Track': 'JNE-',
    'SiCepat Kilat Web3 Express': 'SICEPAT-',
    'J&T Express Logistics': 'JT-',
    'GoSend / GrabExpress Instant': 'GOSEND-',
    'AnterAja Express': 'ANTERAJA-',
    'Pos Indonesia': 'POS-',
    'Ninja Xpress': 'NINJA-',
    'Tiki': 'TIKI-',
  };

  const handleCourierChange = (newCourier: string) => {
    const prefix = courierPrefixMap[newCourier] || newCourier.split(' ')[0].toUpperCase() + '-';
    const newTracking = prefix + Math.floor(10000000 + Math.random() * 90000000);
    setCourierName(newCourier);
    setTrackingNumber(newTracking);
  };

  // Filter orders relevant to this seller
  const sellerOrders = orders.filter(
    o => o.seller.toLowerCase() === activeAccount.address.toLowerCase() || activeAccount.role === 'admin'
  );

  const pendingOrdersCount = sellerOrders.filter(
    o => o.status === OrderStatus.Funded
  ).length;

  const shippedOrdersCount = sellerOrders.filter(
    o => o.status === OrderStatus.Shipped
  ).length;

  const completedOrdersCount = sellerOrders.filter(
    o => o.status === OrderStatus.Completed
  ).length;

  // Filter products for this seller (or all products if admin/seller)
  const myProducts = products.filter(
    p => p.sellerAddress.toLowerCase() === activeAccount.address.toLowerCase() || activeAccount.role === 'admin' || !p.sellerAddress
  );

  // File Upload Handlers (Reading as Base64 DataURL)
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (isEditMode) {
        setEditImageUrl(result);
      } else {
        setImageUrl(result);
        setUploadedFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Product Submit
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const variationsList = variationsInput
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const priceIdr = Math.round(priceSol * SOL_IDR_RATE);
    const priceAmn = Math.round(priceSol * 700);

    await uploadProduct({
      name: productName,
      category,
      variations: variationsList.length > 0 ? variationsList : ['Standar'],
      stock,
      priceSol,
      priceAmn,
      priceIdr,
      description,
      warranty,
      defaultDeadlineDays: 4,
      imageUrl
    });

    setIsSubmitting(false);
    setShowUploadModal(false);
    setProductName('');
    setUploadedFileName(null);
  };

  // Edit Product Handlers (Point 5)
  const openEditModal = (product: ElectronicProduct) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditVariationsInput(product.variations.join(', '));
    setEditStock(product.stock);
    setEditPriceSol(product.priceSol);
    setEditDescription(product.description);
    setEditWarranty(product.warranty || 'Garansi Resmi 1 Tahun');
    setEditImageUrl(product.imageUrl);
    setEditIsAvailable(product.isAvailable !== false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);
    const variationsList = editVariationsInput
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const priceIdr = Math.round(editPriceSol * SOL_IDR_RATE);
    const priceAmn = Math.round(editPriceSol * 700);

    await updateProduct(editingProduct.id, {
      name: editName,
      category: editCategory,
      variations: variationsList.length > 0 ? variationsList : ['Standar'],
      stock: editStock,
      priceSol: editPriceSol,
      priceAmn,
      priceIdr,
      description: editDescription,
      warranty: editWarranty,
      imageUrl: editImageUrl,
      isAvailable: editIsAvailable
    });

    setIsSubmitting(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk '${productName}' dari etalase toko?`)) {
      await deleteProduct(productId);
    }
  };

  const handleConfirmOrder = async (orderId: number) => {
    await sellerConfirmOrder(orderId);
  };

  const handleReportUnavailable = async () => {
    if (!unavailableModalOrder) return;
    await sellerReportUnavailable(unavailableModalOrder, unavailableReason);
    setUnavailableModalOrder(null);
  };

  const handleShipOrder = async () => {
    if (!shippingModalOrder) return;
    await markShipped(shippingModalOrder, trackingNumber, courierName);
    setShippingModalOrder(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Merchant Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-2">
            <Store className="w-3.5 h-3.5" />
            Portal Penjual Resmi · {activeAccount.businessName || activeAccount.name}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Dashboard Merchant UMKM & Manajemen Etalase
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Pembayaran pelanggan dijamin 100% aman terkunci di smart contract Solana. Ketepatan pengiriman memberikan Anda <span className="text-emerald-400 font-semibold">bonus 40% hasil DeFi yield</span> di atas harga pokok barang saat pesanan selesai.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowUploadModal(true);
              setImageUrl(PRODUCT_PHOTO_PRESETS[0].url);
            }}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Foto Produk Baru</span>
          </button>
        </div>
      </div>

      {/* QUICK SELLER STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Saldo Kas Toko</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{activeAccount.balanceSol.toFixed(2)} SOL</div>
          <div className="text-[11px] text-slate-400 mt-0.5">≈ Rp {(activeAccount.balanceSol * SOL_IDR_RATE).toLocaleString('id-ID')}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pesanan Menunggu Konfirmasi</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{pendingOrdersCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Perlu diverifikasi stoknya</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sedang Dikirim Kurir</div>
          <div className="text-2xl font-bold font-mono text-teal-400 mt-1">{shippedOrdersCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Resi on-chain terverifikasi</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Produk di Etalase</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{myProducts.length} Item</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Dapat diedit & ditambah</div>
        </div>
      </div>

      {/* NAVIGATION TABS UNTUK PENJUAL */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setSellerTab('orders')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            sellerTab === 'orders'
              ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pesanan Masuk & Pengiriman ({sellerOrders.length})</span>
        </button>

        <button
          onClick={() => setSellerTab('products')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            sellerTab === 'products'
              ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Katalog & Edit Produk Toko ({myProducts.length})</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR PESANAN MASUK PENJUAL */}
      {sellerTab === 'orders' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-400" />
                <span>Daftar Pesanan Inbound ({sellerOrders.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfirmasi ketersediaan barang atau input resi kurir untuk mengalirkan dana escrow.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Gas kirim resi: ~0.000005 SOL
            </span>
          </div>

          {sellerOrders.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 text-xs">
              Belum ada pesanan masuk untuk toko Anda saat ini.
            </div>
          ) : (
            <div className="space-y-3">
              {sellerOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-teal-400">Order #{order.id}</span>
                      <span className="text-sm font-bold text-white">{order.productName}</span>
                      <span className="text-xs text-slate-400 font-mono">({order.selectedVariation || 'Default'})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono text-xs">
                        <span className="text-emerald-400 font-bold">{order.amountSol} SOL</span>
                        <div className="text-[10px] text-slate-400">Rp {order.amountIdr.toLocaleString('id-ID')}</div>
                      </div>

                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        order.status === OrderStatus.Completed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : order.status === OrderStatus.Refunded
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : order.status === OrderStatus.Shipped
                          ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {order.status === OrderStatus.Funded && 'Menunggu Konfirmasi Penjual'}
                        {order.status === OrderStatus.ConfirmedBySeller && 'Siap Kirimkan Barang'}
                        {order.status === OrderStatus.Shipped && 'Resi Kurir Aktif di Solana'}
                        {order.status === OrderStatus.RefundRequested && 'Komplain Refund Pembeli'}
                        {order.status === OrderStatus.Completed && 'Dana Pokok & Yield Diterima'}
                        {order.status === OrderStatus.Refunded && 'Pesanan Dibatalkan / Refund'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[10px]">PEMBELI:</span>
                      <span className="text-white">{order.buyer.slice(0, 10)}...</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">BONUS DEFI YIELD:</span>
                      <span className="text-teal-300">40% Bonus Fulfillment ({order.apyPercent}% APY)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">NOMOR RESI PENGIRIMAN:</span>
                      <span className="text-emerald-400 font-bold">{order.courierTracking || 'Belum Diinput'}</span>
                    </div>
                  </div>

                  {/* Seller Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sisa Waktu Proses: {order.daysToDeadline} Hari (Slot #{order.deadlineSlot})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Funded: Seller can confirm or declare out-of-stock */}
                      {order.status === OrderStatus.Funded && (
                        <>
                          <button
                            onClick={() => handleConfirmOrder(order.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Konfirmasi Stok Siap Kirim</span>
                          </button>

                          <button
                            onClick={() => {
                              setUnavailableModalOrder(order.id);
                              setUnavailableReason('Stok produk habis dari distributor pusat.');
                            }}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Barang Tidak Ada (Refund)</span>
                          </button>
                        </>
                      )}

                      {/* Status ConfirmedBySeller: Seller inputs tracking */}
                      {order.status === OrderStatus.ConfirmedBySeller && (
                        <button
                          onClick={() => {
                            setShippingModalOrder(order.id);
                            const prefix = courierPrefixMap[courierName] || 'JNE-';
                            setTrackingNumber(prefix + Math.floor(10000000 + Math.random() * 90000000));
                          }}
                          className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Kirim Barang (Input Resi On-Chain)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KATALOG & MANAJEMEN PRODUK TOKO (POINT 4 & 5) */}
      {sellerTab === 'products' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Etalase Produk Toko Anda ({myProducts.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola foto produk, harga dalam SOL/IDR, stok persediaan, variasi, dan ketersediaan barang.
              </p>
            </div>

            <button
              onClick={() => {
                setShowUploadModal(true);
                setImageUrl(PRODUCT_PHOTO_PRESETS[0].url);
              }}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Terbitkan Produk Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-3">
                  {/* Photo with Availability Badge */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-teal-300 border border-teal-500/30 backdrop-blur-sm">
                        {product.category}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm ${
                        product.isAvailable !== false
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      }`}>
                        {product.isAvailable !== false ? 'Aktif Dijual' : 'Nonaktif'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-400 text-[11px]">Harga:</span>
                      <span className="text-emerald-400 font-bold">{product.priceSol} SOL (~Rp {product.priceIdr.toLocaleString('id-ID')})</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Stok:</span>
                      <span className="text-white font-semibold">{product.stock} Unit</span>
                    </div>
                    <div className="flex justify-between text-[11px] truncate">
                      <span className="text-slate-500">Variasi:</span>
                      <span className="text-teal-300 truncate max-w-[150px]">{product.variations.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons (Point 5) */}
                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 py-2 px-3 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Produk</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs rounded-lg transition-colors cursor-pointer"
                    title="Hapus Produk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: UPLOAD FOTO & TERBITKAN PRODUK BARU (POINT 4) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="w-full max-w-xl my-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Upload Foto & Terbitkan Produk Baru</span>
                </h3>
                <span className="text-slate-400 text-[11px]">Katalog Penjual UMKM Amanah Solana</span>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              {/* BAGIAN UPLOAD FOTO (POINT 4) */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">1. Upload Foto Produk:</label>
                
                {/* Source switcher: File / Presets / URL */}
                <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setUploadSource('file')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold cursor-pointer ${
                      uploadSource === 'file' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    📁 Upload dari Perangkat
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadSource('preset')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold cursor-pointer ${
                      uploadSource === 'preset' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ✨ Galeri Gadget Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadSource('url')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold cursor-pointer ${
                      uploadSource === 'url' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🔗 URL Gambar
                  </button>
                </div>

                {/* Mode 1: Local File Upload */}
                {uploadSource === 'file' && (
                  <div className="p-4 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl bg-slate-950 text-center space-y-2 transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => handleLocalImageUpload(e, false)}
                      className="hidden"
                    />
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg cursor-pointer text-xs"
                      >
                        Pilih File Foto dari Komputer / HP
                      </button>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Format JPG, PNG, atau WebP (Maksimal 5MB)
                      </p>
                    </div>
                    {uploadedFileName && (
                      <span className="inline-block text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        ✓ {uploadedFileName}
                      </span>
                    )}
                  </div>
                )}

                {/* Mode 2: Presets Gallery */}
                {uploadSource === 'preset' && (
                  <div className="grid grid-cols-3 gap-2">
                    {PRODUCT_PHOTO_PRESETS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setImageUrl(preset.url);
                          setProductName(preset.name);
                          setCategory(preset.category);
                          setDescription(preset.description);
                        }}
                        className={`p-1.5 rounded-xl border cursor-pointer transition-all ${
                          imageUrl === preset.url
                            ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full aspect-video object-cover rounded-lg" />
                        <span className="text-[10px] text-slate-300 font-medium block truncate mt-1">
                          {preset.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mode 3: Direct URL */}
                {uploadSource === 'url' && (
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                )}

                {/* Live Photo Preview */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden border border-slate-800 shrink-0">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold block">✓ Foto Terverifikasi Siap Terbit</span>
                    <span className="text-slate-500 text-[10px]">Tersimpan di metadata PDA barang UMKM</span>
                  </div>
                </div>
              </div>

              {/* DETAIL INFORMASI PRODUK */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="block text-slate-300 font-bold">2. Detail Produk:</label>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Produk:</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="contoh: Tablet Pro 11-inch OLED 120Hz"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Kategori:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Smartphone">Smartphone</option>
                      <option value="Laptop & Komputer">Laptop & Komputer</option>
                      <option value="Audio & Headphone">Audio & Headphone</option>
                      <option value="Smartwatch">Smartwatch</option>
                      <option value="Kamera">Kamera</option>
                      <option value="Elektronik Rumah">Elektronik Rumah</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Harga (SOL):</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={priceSol}
                      onChange={(e) => setPriceSol(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      ≈ Rp {Math.round(priceSol * SOL_IDR_RATE).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Jumlah Stok Unit:</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={stock}
                      onChange={(e) => setStock(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Garansi Produk:</label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      placeholder="Garansi Resmi 1 Tahun"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Pilihan Variasi (pisahkan koma):</label>
                  <input
                    type="text"
                    value={variationsInput}
                    onChange={(e) => setVariationsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Deskripsi Spesifikasi:</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/20"
                >
                  {isSubmitting ? 'Menerbitkan di Solana...' : 'Terbitkan ke Etalase Toko →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PRODUK DARI SISI PENJUAL (POINT 5) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="w-full max-w-xl my-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-teal-400" />
                  <span>Edit Produk: {editingProduct.name}</span>
                </h3>
                <span className="text-slate-400 text-[11px]">Perbarui informasi barang, harga, dan ketersediaan stok</span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              
              {/* Photo Edit & Upload */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">1. Foto Produk:</label>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                    <img src={editImageUrl} alt="Edit preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      onChange={(e) => handleLocalImageUpload(e, true)}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs cursor-pointer font-medium"
                      >
                        Ganti Foto dari File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const randomPreset = PRODUCT_PHOTO_PRESETS[Math.floor(Math.random() * PRODUCT_PHOTO_PRESETS.length)];
                          setEditImageUrl(randomPreset.url);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs cursor-pointer"
                      >
                        Pilih Preset Acak
                      </button>
                    </div>
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="Atau masukkan URL gambar..."
                      className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="block text-slate-300 font-bold">2. Data & Ketersediaan:</label>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Produk:</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Kategori:</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Smartphone">Smartphone</option>
                      <option value="Laptop & Komputer">Laptop & Komputer</option>
                      <option value="Audio & Headphone">Audio & Headphone</option>
                      <option value="Smartwatch">Smartwatch</option>
                      <option value="Kamera">Kamera</option>
                      <option value="Elektronik Rumah">Elektronik Rumah</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Harga (SOL):</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={editPriceSol}
                      onChange={(e) => setEditPriceSol(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-teal-500"
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      ≈ Rp {Math.round(editPriceSol * SOL_IDR_RATE).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Stok Tersedia:</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editStock}
                      onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Garansi:</label>
                    <input
                      type="text"
                      value={editWarranty}
                      onChange={(e) => setEditWarranty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Variasi:</label>
                  <input
                    type="text"
                    value={editVariationsInput}
                    onChange={(e) => setEditVariationsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Deskripsi:</label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Status Ketersediaan Toggle */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Status Produk di Katalog:</div>
                    <div className="text-[11px] text-slate-400">Aktifkan agar pembeli dapat melakukan pemesanan rekber</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditIsAvailable(!editIsAvailable)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors ${
                      editIsAvailable
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {editIsAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{editIsAvailable ? 'Aktif Dijual' : 'Dinonaktifkan'}</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-teal-500/20"
                >
                  {isSubmitting ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Produk →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Out of Stock Modal */}
      {unavailableModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white">Laporkan Barang Tidak Ada (Refund Pembeli)</h3>
            <p className="text-slate-400">
              Jika stok barang fisik kosong, smart contract Solana akan mengembalikan 100% saldo SOL ke dompet pembeli seketika tanpa penalti.
            </p>
            <textarea
              rows={3}
              value={unavailableReason}
              onChange={(e) => setUnavailableReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setUnavailableModalOrder(null)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleReportUnavailable}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Kembalikan Dana ke Pembeli →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Modal */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-400" />
              <span>Input Nomor Resi Pengiriman On-Chain</span>
            </h3>
            <p className="text-slate-400">
              Nomor resi akan dicatat pada metadata akun PDA rekber dan menghasilkan hash bukti pengiriman.
            </p>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Kurir Ekspedisi:</label>
              <select
                value={courierName}
                onChange={(e) => handleCourierChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
              >
                <option value="JNE Express Cargo Web3 Track">JNE Express Cargo</option>
                <option value="J&T Express Logistics">J&amp;T Express</option>
                <option value="SiCepat Kilat Web3 Express">SiCepat Kilat</option>
                <option value="AnterAja Express">AnterAja Express</option>
                <option value="Pos Indonesia">Pos Indonesia</option>
                <option value="Ninja Xpress">Ninja Xpress</option>
                <option value="Tiki">Tiki</option>
                <option value="GoSend / GrabExpress Instant">GoSend / GrabExpress Instant</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nomor Resi / AWB:</label>
              <input
                type="text"
                required
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder={`contoh: ${courierPrefixMap[courierName] || 'KURIR-'}88294101`}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-teal-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Prefix otomatis sesuai ekspedisi. Bisa diedit manual.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShippingModalOrder(null)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleShipOrder}
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Simpan Resi di Solana →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
