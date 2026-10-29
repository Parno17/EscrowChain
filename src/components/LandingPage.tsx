import React from 'react';
import heroSolanaImg from '../assets/images/hero_solana_escrow_1792757841783.jpg';
import defiVaultImg from '../assets/images/defi_vault_yield_1792757843028.jpg';
import amanahTokenImg from '../assets/images/amanah_token_emblem_1792757841936.jpg';
import { useWeb3 } from '../context/Web3Context';
import { 
  SOL_IDR_RATE, 
  AMN_IDR_RATE, 
  SOLANA_GAS_FEE_SOL, 
  ETH_EQUIVALENT_GAS_IDR, 
  TOKENOMICS_INFO,
  PRESET_ACCOUNTS 
} from '../data/mockData';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Coins, 
  Layers, 
  Sparkles, 
  FileText, 
  KeyRound, 
  ExternalLink,
  ChevronRight,
  Store,
  ShoppingBag,
  LogIn,
  UserPlus
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (targetTab?: 'buyer' | 'seller' | 'admin') => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenWhitepaper: () => void;
  onOpenAcademicReport: () => void;
  onOpenAudit: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenAuth,
  onOpenWhitepaper,
  onOpenAcademicReport,
  onOpenAudit
}) => {
  const { orders, tokenomics, setActiveAccount, loginWithMetaMask } = useWeb3();

  const handleQuickDemo = (index: number) => {
    const acc = PRESET_ACCOUNTS[index];
    setActiveAccount(acc);
    const target = acc.role === 'admin' ? 'admin' : acc.role === 'seller' ? 'seller' : 'buyer';
    onEnterApp(target);
  };

  const handleMetaMaskQuick = async (role: 'buyer' | 'seller' = 'buyer') => {
    await loginWithMetaMask(role);
    onEnterApp(role);
  };

  const totalVolumeSol = orders.reduce((acc, o) => acc + o.amountSol, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Bar Contract: Brand - 4-5 Nav Links - 1 Primary Action */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark: EscrowChain */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              EscrowChain <span className="text-emerald-400 font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Solana Web3</span>
            </span>
          </div>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#solana-advantage" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
              Solana vs EVM
            </a>
            <a href="#defi-yield" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
              DeFi Yield Escrow
            </a>
            <a href="#tokenomics" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
              Token Amanah ($AMN)
            </a>
            <button 
              onClick={onOpenWhitepaper} 
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Whitepaper (Layer 1-3)
            </button>
            <button 
              onClick={onOpenAudit} 
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Anchor Contract
            </button>
            <button 
              onClick={onOpenAcademicReport} 
              className="text-slate-500 hover:text-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs"
              title="Lihat dokumen riset penelitian asli Kelompok 2"
            >
              Arsip Riset PDF
            </button>
          </nav>

          {/* Zone 3: 1 primary action: Masuk / Daftar */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Masuk</span>
            </button>

            <button
              onClick={() => onOpenAuth('signup')}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Akun →</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Clean 2-Column Split & Hero Image */}
      <section className="relative pt-12 pb-20 border-b border-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Unboxed Metadata Kicker */}
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <span>EscrowChain Network</span>
                <span aria-hidden="true">·</span>
                <span>Solana Anchor Framework</span>
                <span aria-hidden="true">·</span>
                <span>Gas Fee ~Rp 12 / tx</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
                Platform Rekening Bersama Terdesentralisasi Solana Pertama di Indonesia
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                <strong>EscrowChain</strong> mengamankan transaksi jual beli daring UMKM dengan Smart Contract Solana berkecepatan 400ms dan biaya gas mikrocent. Selama barang dikirim, dana otomatis dialirkan ke <span className="text-emerald-400 font-semibold">DeFi Yield Streaming</span> untuk menghasilkan imbal hasil bagi pembeli dan penjual, didukung token utilitas <span className="text-emerald-400 font-semibold">Amanah ($AMN)</span>.
              </p>

              {/* Action Buttons: Sign In / Sign Up / Explore */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Akun</span>
                </button>

                <button
                  onClick={() => handleMetaMaskQuick('buyer')}
                  className="px-5 py-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 hover:text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-950/20 flex items-center gap-2"
                  title="Hubungkan dompet MetaMask Web3"
                >
                  <span className="text-base">🦊</span>
                  <span>Masuk via MetaMask</span>
                </button>

                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>Daftar Akun Baru</span>
                </button>

                <button
                  onClick={onOpenWhitepaper}
                  className="px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Whitepaper (L1-3)</span>
                </button>
              </div>

              {/* Gas Fee & Performance Comparison Badge */}
              <div id="solana-advantage" className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Perbandingan Efisiensi Biaya Transaksi Escrow:</span>
                  <span className="text-emerald-400 font-mono">Solana Hemat 99.98%</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/20 text-rose-200">
                    <div className="font-semibold text-rose-400 mb-0.5">Ethereum (EVM)</div>
                    <div className="font-mono text-sm font-bold">Rp 68.000 ($4.20)</div>
                    <div className="text-[11px] text-rose-300/80 mt-1">Finalitas: 15–30 detik</div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200">
                    <div className="font-semibold text-emerald-400 mb-0.5">Solana Anchor (EscrowChain)</div>
                    <div className="font-mono text-sm font-bold text-white">Rp 12.25 (0.000005 SOL)</div>
                    <div className="text-[11px] text-emerald-300/90 mt-1">Finalitas: 400 milidetik</div>
                  </div>
                </div>
              </div>

              {/* Quick Demo Sandbox Access */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Uji Coba Langsung (Mode Sandbox Demo):
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickDemo(0)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Masuk sebagai Pembeli (Zayyini)</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => handleQuickDemo(1)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Masuk sebagai Penjual (Parno)</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => handleQuickDemo(2)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/40 text-xs text-indigo-200 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Admin & Treasury Multi-Sig</span>
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <img
                  src={heroSolanaImg}
                  alt="EscrowChain Solana Decentralized Escrow Vault"
                  referrerPolicy="no-referrer"
                  className="w-full h-96 lg:h-[480px] object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>EscrowChain PDA Engine</span>
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">Anchor v0.30</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dana pembeli dikunci di Program Derived Address (PDA) tanpa perantara manusia, menjamin keamanan transaksi 100% transparan on-chain.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visual Showcase: DeFi Yield Streaming & Solana Vault */}
      <section id="defi-yield" className="py-16 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-800 group">
              <img
                src={defiVaultImg}
                alt="EscrowChain DeFi Escrow Yield Streaming Vault"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>DeFi Yield Streaming Aktif</span>
                  </span>
                  <span className="text-emerald-400 font-mono">6.8% - 7.1% APY</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dana pokok escrow mengalir aman ke liquidity vault Kamino/Marinade saat barang dalam perjalanan ekspedisi kurir.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Mekanisme Finansial EscrowChain
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Dana Tidak Diam: Menghasilkan Nilai Tambah bagi Pembeli dan Penjual
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Pada rekening bersama tradisional (Web 2.0), pihak ketiga mengendapkan dana escrow tanpa bunga. <strong>EscrowChain</strong> merevolusi alur tersebut:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">40% Bunga ke Pembeli (Cashback Token Amanah)</h3>
                    <p className="text-slate-400 mt-0.5">
                      Pembeli menerima cashback loyalitas dalam bentuk token Amanah ($AMN) setiap kali pesanan diverifikasi selesai.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">40% Bunga ke Penjual (Bonus Fulfillment)</h3>
                    <p className="text-slate-400 mt-0.5">
                      Penjual UMKM mendapatkan insentif tambahan di atas harga jual produk karena ketepatan waktu pengiriman.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">20% Pembakaran Deflasi ($AMN Buyback & Burn)</h3>
                    <p className="text-slate-400 mt-0.5">
                      20% dari imbal hasil dialokasikan untuk membeli kembali token Amanah ($AMN) di DEX dan membakarnya secara permanen di blockchain.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Tokenomics Amanah ($AMN) Section */}
      <section id="tokenomics" className="py-16 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Token Utilitas Asli EscrowChain
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Tokenomics Amanah ($AMN): Utilitas Nyata untuk Ekosistem UMKM
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Token <strong>Amanah ($AMN)</strong> adalah SPL Token asli Solana dengan pasokan tetap 100.000.000 AMN yang dirancang sebagai instrumen utilitas, diskon biaya escrow, imbal hasil staking, dan tata kelola platform EscrowChain.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Total Pasokan</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">100.000.000 AMN</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Telah Dibakar (Burn)</div>
                  <div className="text-sm font-bold font-mono text-rose-400 mt-0.5">1.420.500 AMN</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Staking Pool</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">11.2% APR</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Diskon Biaya Rekber</div>
                  <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">Hingga 100% (VIP)</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={onOpenWhitepaper}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Baca Spesifikasi Lengkap Whitepaper EscrowChain (L1 - 3)</span>
                </button>
              </div>

            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl p-4 bg-slate-900 border border-slate-800 text-center max-w-sm">
                <img
                  src={amanahTokenImg}
                  alt="Amanah Token AMN Cryptographic Emblem"
                  referrerPolicy="no-referrer"
                  className="w-56 h-56 mx-auto rounded-full object-cover shadow-2xl border-2 border-emerald-500/30"
                />
                <div className="mt-4 font-mono text-xs text-slate-400">
                  SPL Token Mint (Amanah):
                  <div className="text-emerald-400 text-[11px] truncate mt-0.5">
                    AMNtokEn91823HkJd9823hdkajs9823hka928374jka
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Arsitektur Keamanan EscrowChain
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Perlindungan Berlapis untuk Pembeli dan Penjual
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Dibangun dengan standar keamanan kriptografi mutakhir Solana untuk menjamin tidak ada dana yang hilang atau disalahgunakan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Program Derived Addresses (PDA)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dana escrow tidak disimpan di akun pribadi siapa pun, melainkan di PDA Solana yang dikendalikan oleh kode smart contract secara matematis tanpa private key eksternal.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Auto-Refund Timelock Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jika penjual tidak memasukkan nomor resi valid sebelum batas deadline slot Solana, pembeli dapat menarik kembali 100% dananya dengan 1 klik tanpa persetujuan penjual.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Anti-Phishing & Pre-Flight Simulation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Setiap persetujuan transaksi memverifikasi kalimat sandi anti-phishing pribadi pengguna dan menampilkan simulasi perubahan saldo Solana sebelum instruksi ditandatangani.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="py-8 bg-slate-950 text-slate-500 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">EscrowChain Web3</span>
            <span>·</span>
            <span>Solana Anchor Rekening Bersama · Token Utilitas Amanah ($AMN)</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onOpenAuth('signin')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Masuk / Login
            </button>
            <button onClick={onOpenWhitepaper} className="hover:text-slate-300 transition-colors cursor-pointer">
              Whitepaper (L1-L3)
            </button>
            <button onClick={onOpenAudit} className="hover:text-slate-300 transition-colors cursor-pointer">
              Anchor Contract Audit
            </button>
            <button onClick={onOpenAcademicReport} className="hover:text-slate-300 transition-colors cursor-pointer text-slate-400">
              Dokumen Riset Kelompok 2 (PDF)
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
