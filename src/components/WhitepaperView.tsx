import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Cpu, 
  Coins, 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  GitBranch, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Lock, 
  Share2, 
  ChevronRight,
  Download,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  SOLANA_PROGRAM_ID, 
  TOKENOMICS_INFO, 
  SOL_IDR_RATE, 
  AMN_IDR_RATE, 
  SOLANA_GAS_FEE_SOL 
} from '../data/mockData';

interface WhitepaperViewProps {
  onBackToApp: () => void;
  onOpenAudit: () => void;
  onOpenAcademicReport: () => void;
}

export const WhitepaperView: React.FC<WhitepaperViewProps> = ({
  onBackToApp,
  onOpenAudit,
  onOpenAcademicReport
}) => {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'layer1' | 'layer2' | 'layer3' | 'tokenomics' | 'security' | 'governance'
  >('overview');

  const sections = [
    { id: 'overview', title: '00. Executive Summary & Problem' },
    { id: 'layer1', title: '01. Layer 1: Solana Settlement Engine' },
    { id: 'layer2', title: '02. Layer 2: Amanah DeFi & PDA Protocol' },
    { id: 'layer3', title: '03. Layer 3: UMKM Gateway & Blinks' },
    { id: 'tokenomics', title: '04. Tokenomics Amanah ($AMN)' },
    { id: 'security', title: '05. Security & Anchor Invariants' },
    { id: 'governance', title: '06. DAO Governance & Roadmap' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>← Kembali ke dApp Workspace</span>
            </button>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-sm font-bold text-white tracking-tight">
                EscrowChain Whitepaper v2.5 · Token Amanah ($AMN)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAudit}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <span>Anchor Smart Contract</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </button>
            <button
              onClick={onOpenAcademicReport}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
            >
              Dokumen Riset Kelompok 2 (PDF)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sticky Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="sticky top-24 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Daftar Isi Whitepaper:
              </div>
              
              <nav className="space-y-1">
                {sections.map(s => {
                  const isActive = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id as any)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate">{s.title}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 space-y-1 font-mono">
                <div>Program: {SOLANA_PROGRAM_ID.slice(0, 10)}...</div>
                <div>Standard: Solana SPL Token</div>
                <div>Status: Audited & Verified</div>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-9 space-y-8">
            
            {/* SECTION 00: OVERVIEW & PROBLEM STATEMENT */}
            {activeSection === 'overview' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 00 · Executive Summary
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Krisis Kepercayaan E-Commerce Indonesia & Paradigma Rekber Web3
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Pertumbuhan ekonomi digital Indonesia yang diproyeksikan melampaui $130 Miliar pada tahun 2030 menghadapi kendala struktural fundamental: <strong>krisis kepercayaan (trust deficit)</strong> antara pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) dan konsumen.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                    <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                      <div className="text-rose-400 text-xs font-bold uppercase">Tingkat Fraud COD Tinggi</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">12% - 18%</div>
                      <p className="text-xs text-rose-200/80 mt-1">
                        Paket Cash-on-Delivery (COD) ditolak konsumen saat tiba, menyebabkan kerugian ongkos kirim dan stok rusak bagi UMKM.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                      <div className="text-amber-400 text-xs font-bold uppercase">Potongan Marketplace Eksploitatif</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">6.5% - 12.0%</div>
                      <p className="text-xs text-amber-200/80 mt-1">
                        Komisi platform e-commerce terpusat menggerus margin laba bersih produsen lokal UMKM.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                      <div className="text-indigo-400 text-xs font-bold uppercase">Pencairan Dana Lambat</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">3 - 7 Hari Kerja</div>
                      <p className="text-xs text-indigo-200/80 mt-1">
                        Dana penjual ditahan di rekening bank terpusat tanpa bunga kompensasi, menghambat arus kas UMKM.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-2">
                    Solusi: Protokol Rekber Terdesentralisasi Solana (EscrowChain & Token Amanah)
                  </h3>

                  <p>
                    <strong>EscrowChain</strong> menghadirkan rekonstruksi penuh mekanisme rekening bersama berbasis teknologi blockchain Solana berbiaya rendah dengan dukungan native token <strong>Amanah ($AMN)</strong>. Dengan memanfaatkan kecepatan <strong>Solana Proof of History (400ms finalitas)</strong>, biaya gas mikrocent (~Rp 12/tx), dan integrasi <strong>DeFi Yield Streaming</strong>, dana jual beli dikunci secara matematis di Program Derived Addresses (PDA) tanpa campur tangan kustodian terpusat.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white">4 Pilar Utama Arsitektur Amanah:</div>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      <li><strong>Kecepatan & Biaya Rendah:</strong> Mengeliminasi biaya gas mahal Ethereum yang tidak terjangkau bagi transaksi mikro UMKM.</li>
                      <li><strong>DeFi Yield Sharing:</strong> Uang yang tertahan selama masa pengiriman tidak menganggur, melainkan menghasilkan bunga modal yang dibagi antara pembeli, penjual, dan token burn.</li>
                      <li><strong>Proteksi Auto-Refund Waktu:</strong> Menjamin pembeli mendapatkan pengembalian otomatis jika penjual tidak memproses pesanan sesuai batas deadline slot.</li>
                      <li><strong>Tokenomics $AMN:</strong> Menghadirkan insentif ekonomi berkelanjutan melalui diskon biaya, hadiah loyalitas, dan mekanisme deflasi buyback-and-burn on-chain.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setActiveSection('layer1')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Lanjut ke Layer 1: Solana Settlement →</span>
                  </button>
                </div>
              </article>
            )}

            {/* SECTION 01: LAYER 1 SOLANA SETTLEMENT ENGINE */}
            {activeSection === 'layer1' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 01 · Base Layer
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Layer 1: Fondasi Settlement Solana & Cryptographic Clock
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Sebagai settlement layer dasar, Amanah Protocol memanfaatkan arsitektur monolitik berkinerja tinggi Solana untuk menjamin skalabilitas masif transaksi e-commerce tanpa fragmentasi Layer 2 rollup.
                  </p>

                  {/* 4 Inovasi Solana */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <Clock className="w-4 h-4" />
                        <span>Proof of History (PoH)</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Verifiable Delay Function (VDF) berbasis SHA-256 berurutan yang menyediakan stempel waktu kriptografi universal sebelum konsensus dimulai, menghilangkan latensi negosiasi waktu antar validator.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                        <Cpu className="w-4 h-4" />
                        <span>Tower BFT Consensus</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Implementasi khusus PBFT yang sinkron dengan PoH, memungkinkan konfirmasi transaksi sub-detik (~400ms per slot) dengan keamanan Byzantine fault tolerant matematis.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                        <Layers className="w-4 h-4" />
                        <span>Sealevel Parallel Runtime</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Virtual Machine paralel pertama di industri blockchain. Transaksi rekber yang mengakses order ID berbeda dieksekusi secara simultan pada core CPU validator tanpa saling memblokir (non-blocking concurrency).
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                        <GitBranch className="w-4 h-4" />
                        <span>Gulf Stream (Mempool-less)</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Protokol penerusan transaksi langsung ke validator pemimpin slot berikutnya, meniadakan penumpukan mempool publik dan mencegah manipulasi MEV / front-running pada transaksi UMKM.
                      </p>
                    </div>
                  </div>

                  {/* Gas Fee Matrix */}
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                    <div className="p-3 bg-slate-950 font-semibold text-xs text-slate-200 border-b border-slate-800">
                      Tabel Komparasi Settlement: Solana vs Ethereum vs Tradisional
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="p-3">Parameter Evaluasi</th>
                            <th className="p-3">Solana (Amanah Protocol)</th>
                            <th className="p-3">Ethereum Sepolia / Mainnet</th>
                            <th className="p-3">Rekber Bank Tradisional</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                          <tr>
                            <td className="p-3 font-sans font-medium text-white">Biaya Transaksi (Gas Fee)</td>
                            <td className="p-3 text-emerald-400 font-bold">~0.000005 SOL (Rp 12)</td>
                            <td className="p-3 text-rose-400">0.0015 ETH (Rp 68.000+)</td>
                            <td className="p-3 text-amber-400">Rp 6.500 - Rp 25.000</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-sans font-medium text-white">Waktu Finalitas Konfirmasi</td>
                            <td className="p-3 text-emerald-400 font-bold">400 milidetik</td>
                            <td className="p-3 text-rose-400">15 – 60 detik</td>
                            <td className="p-3 text-amber-400">1 – 3 hari kerja</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-sans font-medium text-white">Throughput Maksimum (TPS)</td>
                            <td className="p-3 text-emerald-400 font-bold">65.000+ TPS</td>
                            <td className="p-3 text-rose-400">~15 – 30 TPS</td>
                            <td className="p-3 text-slate-400">Batasan kliring BI-FAST</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-sans font-medium text-white">Model Eksekusi Kontrak</td>
                            <td className="p-3 text-emerald-400 font-bold">Anchor PDA Parallel State</td>
                            <td className="p-3 text-slate-300">EVM Single Thread Serial</td>
                            <td className="p-3 text-slate-400">Server database terpusat</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveSection('overview')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ← Kembali ke Overview
                  </button>
                  <button
                    onClick={() => setActiveSection('layer2')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Lanjut ke Layer 2: DeFi Protocol & PDA →
                  </button>
                </div>
              </article>
            )}

            {/* SECTION 02: LAYER 2 AMANAH DEFI PROTOCOL & PDA */}
            {activeSection === 'layer2' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 02 · Protocol Layer
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Layer 2: Amanah DeFi Protocol & PDA State Machine
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Layer 2 mendefinisikan logika smart contract, transisi state mesin rekening bersama, dan integrasi DeFi yield streaming menggunakan kerangka kerja Solana Anchor.
                  </p>

                  <h3 className="text-lg font-bold text-white pt-2">
                    1. Arsitektur Program Derived Addresses (PDA)
                  </h3>
                  <p>
                    Tidak seperti smart contract EVM di mana kontrak menyimpan state di storage internal yang rentan terhadap serangan reentrancy, Solana memisahkan logika program dari akun data. Setiap pesanan dialokasikan pada PDA unik yang dihitung secara deterministik:
                  </p>

                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
{`// Derivasi Deterministik PDA Rekber Amanah:
Pubkey::find_program_address(
    &[
        b"escrow",
        order_id.to_le_bytes().as_ref()
    ],
    &program_id
);

// Derivasi PDA Token Vault:
Pubkey::find_program_address(
    &[
        b"vault",
        escrow_account.key().as_ref()
    ],
    &program_id
);`}
                  </pre>

                  <h3 className="text-lg font-bold text-white pt-2">
                    2. Inovasi Zero-Loss DeFi Escrow Yield Streaming
                  </h3>
                  <p>
                    Dalam transaksi fisik UMKM, waktu antara pembayaran pembeli hingga verifikasi pengiriman kurir membutuhkan waktu 2 hingga 5 hari. Pada rekening bersama tradisional, modal ini menjadi aset tidak produktif.
                  </p>
                  <p>
                    Amanah Protocol mengalirkan deposit pokok secara transparan ke pool likuiditas terisolasi (Solana Liquid Staking SOL / Kamino Lend) dengan jaminan keamanan modal 100%. Rumus kalkulasi hasil bunga modal:
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2 text-slate-200">
                    <div className="text-emerald-400 font-bold font-sans text-sm mb-1">
                      Formula Distribusi Bunga Modal Terdesentralisasi:
                    </div>
                    <div>Y_total = Principal * APY * (Transit_Days / 365)</div>
                    <div className="text-emerald-300">├── Y_buyer = 40% * Y_total (Cashback Loyalitas Pembeli dalam token AMN)</div>
                    <div className="text-teal-300">├── Y_seller = 40% * Y_total (Bonus Ketepatan Waktu Penjual dalam SOL)</div>
                    <div className="text-amber-300">└── Y_burn = 20% * Y_total (Alokasi Pembelian Kembali & Pembakaran $AMN On-Chain)</div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-2">
                    3. Alur Mesin State (State Transition Machine)
                  </h3>
                  <p>
                    State order mengikuti transisi ketat yang divalidasi oleh tanda tangan kriptografi (ed25519) dari masing-masing pihak:
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-white font-bold">[1] Draft</span>
                      <span>──(Pembeli Deposit SOL)──&gt;</span>
                      <span className="text-emerald-400 font-bold">[2] Funded & Yield Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-emerald-400 font-bold">[2] Funded</span>
                      <span>──(Penjual Kirim Resi)──&gt;</span>
                      <span className="text-teal-400 font-bold">[3] Shipped with Proof</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-teal-400 font-bold">[3] Shipped</span>
                      <span>──(Barang Diterima)──&gt;</span>
                      <span className="text-emerald-300 font-bold">[4] Completed + Yield Distributed</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-rose-400 font-bold">[Batas Timeout Lewat]</span>
                      <span>──(Auto-Refund Trigger)──&gt;</span>
                      <span className="text-rose-300 font-bold">[5] Refunded 100% to Buyer</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveSection('layer1')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ← Kembali ke Layer 1
                  </button>
                  <button
                    onClick={() => setActiveSection('layer3')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Lanjut ke Layer 3: UMKM Gateway →
                  </button>
                </div>
              </article>
            )}

            {/* SECTION 03: LAYER 3 UMKM GATEWAY & BLINKS */}
            {activeSection === 'layer3' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 03 · Application Layer
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Layer 3: UMKM Gateway, Solana Blinks & Abstraksi Akun
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Layer 3 menyelesaikan tantangan terbesar adopsi blockchain di Indonesia: <strong>kompleksitas antarmuka dan literasi Web3</strong>. Melalui abstraksi akun dan Solana Actions, UMKM dapat bertransaksi semudah berbelanja di aplikasi chat.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <Sparkles className="w-4 h-4" />
                        <span>Solana Blinks & Actions</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Penjual UMKM dapat membuat tautan pembayaran rekber satu-klik yang dapat disematkan langsung di WhatsApp, Instagram DM, atau Telegram. Konsumen dapat menyelesaikan transaksi escrow tanpa harus berpindah aplikasi.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                        <Lock className="w-4 h-4" />
                        <span>Web2.5 Non-Custodial Onboarding</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Otentikasi biometrik Passkey dan Google OAuth secara otomatis menerbitkan pasangan kunci kriptografi Ed25519 Solana di peramban pengguna tanpa perlu mengunduh ekstensi dompet pihak ketiga.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                        <Coins className="w-4 h-4" />
                        <span>Jembatan QRIS & Rupiah Gateway</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Mendukung on-ramp dan off-ramp instan dari Rupiah (IDR) melalui QRIS Standar Bank Indonesia dan Virtual Account perbankan nasional langsung menjadi saldo Solana (SOL/USDC/AMN).
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Tribunal Pengadilan Arbitrase Multi-Sig</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Jika terjadi sengketa barang tidak sesuai atau rusak, panel validator independen (DAO Jurors) memeriksa bukti SHA-256 rekaman video unboxing dan memvoting resolusi secara on-chain.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-2">
                    Spesifikasi Tindakan Solana Blink (URL Schema)
                  </h3>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`GET https://amanah.escrow/api/actions/pay?order=101
Headers: "Accept: application/json"

Response JSON:
{
  "icon": "https://amanah.escrow/assets/products/snapdragon8.jpg",
  "title": "Beli Smartphone Flagship via Amanah Solana Escrow",
  "description": "5.51 SOL dikunci di PDA Amanah. Bebas penipuan COD & yield 6.8% APY.",
  "label": "Kunci Dana Escrow (5.51 SOL)",
  "disabled": false
}`}
                  </pre>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveSection('layer2')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ← Kembali ke Layer 2
                  </button>
                  <button
                    onClick={() => setActiveSection('tokenomics')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Lanjut ke Tokenomics ($AMN) →
                  </button>
                </div>
              </article>
            )}

            {/* SECTION 04: TOKENOMICS AMANAH ($AMN) */}
            {activeSection === 'tokenomics' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 04 · Token Architecture
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Tokenomics Amanah ($AMN): Distribusi, Utilitas & Deflasi
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Token Amanah ($AMN) adalah token standar SPL Solana dengan pasokan tetap 100.000.000 AMN yang berfungsi sebagai token utilitas, diskon biaya escrow, imbal hasil staking, dan tata kelola protokol.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Total Pasokan Maksimum</div>
                      <div className="text-base font-bold font-mono text-white mt-0.5">100.000.000 AMN</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Pasokan Beredar</div>
                      <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">42.150.000 AMN</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Terkunci di Staking Pool</div>
                      <div className="text-base font-bold font-mono text-teal-400 mt-0.5">28.500.000 AMN</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Telah Dibakar (Burned)</div>
                      <div className="text-base font-bold font-mono text-rose-400 mt-0.5">1.420.500 AMN</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-2">
                    Tabel Alokasi Pasokan Token ($AMN)
                  </h3>

                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">Kategori Alokasi</th>
                          <th className="p-3">Persentase</th>
                          <th className="p-3">Jumlah Token</th>
                          <th className="p-3">Jadwal Vesting & Pelepasan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                        <tr>
                          <td className="p-3 font-sans font-medium text-white">Insentif Komunitas & Staking</td>
                          <td className="p-3 text-emerald-400 font-bold">30.0%</td>
                          <td className="p-3">30.000.000 AMN</td>
                          <td className="p-3 font-sans text-slate-400">Emisi bertahap selama 48 bulan</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-sans font-medium text-white">Dana Hibah & Adopsi UMKM</td>
                          <td className="p-3 text-teal-400 font-bold">25.0%</td>
                          <td className="p-3">25.000.000 AMN</td>
                          <td className="p-3 font-sans text-slate-400">Subsidi biaya gas dan voucher transaksi UMKM</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-sans font-medium text-white">Pool Likuiditas DEX (Raydium)</td>
                          <td className="p-3 text-indigo-400 font-bold">20.0%</td>
                          <td className="p-3">20.000.000 AMN</td>
                          <td className="p-3 font-sans text-slate-400">100% unlocked saat peluncuran pool likuiditas</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-sans font-medium text-white">Pengembangan Protokol Inti</td>
                          <td className="p-3 text-purple-400 font-bold">15.0%</td>
                          <td className="p-3">15.000.000 AMN</td>
                          <td className="p-3 font-sans text-slate-400">12 bulan cliff, 24 bulan linear vesting</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-sans font-medium text-white">Treasury Asuransi & Multi-Sig</td>
                          <td className="p-3 text-amber-400 font-bold">10.0%</td>
                          <td className="p-3">10.000.000 AMN</td>
                          <td className="p-3 font-sans text-slate-400">Dana cadangan perlindungan gagal bayar</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-2">
                    Tingkatan Utilitas Staking untuk Merchant UMKM
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-xs text-white">Tier Standard (0 AMN)</div>
                      <div className="text-xs text-slate-400 mt-1">Biaya protokol rekber normal 0.5%, proteksi timelock aktif.</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-xs text-emerald-400">Tier Silver (1.000 AMN Staked)</div>
                      <div className="text-xs text-slate-400 mt-1">Diskon biaya rekber 50%, lencana penjual terverifikasi on-chain.</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-xs text-amber-400">Tier Amanah VIP (5.000 AMN Staked)</div>
                      <div className="text-xs text-slate-400 mt-1">0% Biaya Rekber (Gratis), prioritas arbitrase DAO, 11.2% Staking APR.</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveSection('layer3')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ← Kembali ke Layer 3
                  </button>
                  <button
                    onClick={() => setActiveSection('security')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Lanjut ke Security & Audit →
                  </button>
                </div>
              </article>
            )}

            {/* SECTION 05: SECURITY & ANCHOR INVARIANTS */}
            {activeSection === 'security' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 05 · Smart Contract Formal Verification
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Arsitektur Keamanan & Invarian Anchor Program
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Amanah Protocol mengadopsi prinsip <strong>Defense-in-Depth</strong> untuk mengeliminasi seluruh vektor serangan umum blockchain (reentrancy, integer overflow, flash loan exploits, dan unauthorized authority).
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kekebalan Alami terhadap Reentrancy Attack</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Pada EVM, panggilan fungsi eksternal mentransfer kontrol eksekusi ke kontrak penerima sebelum state diperbarui. Pada Solana, model Sealevel memisahkan kode program dari data akun. Transfer lamports hanya terjadi melalui instruksi Cross-Program Invocation (CPI) dengan signed seeds internal, mencegah eksekusi ulang rekursif.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Presisi Aritmatika Aman di Level Kompilasi LLVM</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Rust secara default memicu <code>panic!()</code> saat terjadi arithmetic overflow atau underflow. Seluruh kalkulasi pembagian hasil yield DeFi menggunakan <code>checked_mul</code> dan <code>checked_div</code> dengan presisi 9 desimal (micro-lamports).
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Circuit Breaker & Emergency Freeze</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Program memiliki instruksi pemutus arus darurat yang dikendalikan oleh Multi-Sig Treasury 3-dari-5. Jika terdeteksi anomali pada protokol DeFi mitra, fungsi deposit dapat dibekukan seketika tanpa mempengaruhi kemampuan pengguna menarik dana pokok mereka.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenAudit}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Lihat Kode Sumber Lengkap Anchor lib.rs & Audit Log →</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveSection('tokenomics')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ← Kembali ke Tokenomics
                  </button>
                  <button
                    onClick={() => setActiveSection('governance')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Lanjut ke DAO & Roadmap →
                  </button>
                </div>
              </article>
            )}

            {/* SECTION 06: DAO GOVERNANCE & ROADMAP */}
            {activeSection === 'governance' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 06 · Evolution & Future
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Tata Kelola DAO, Roadmap Pengembangan & Provenansi Riset
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Amanah Protocol bertransisi menuju desentralisasi penuh di mana parameter protokol (besaran alokasi yield, strategi liquidity pool baru, dan standar bukti kurir) ditentukan melalui voting DAO pemegang st-AMN.
                  </p>

                  <h3 className="text-lg font-bold text-white pt-2">
                    Roadmap Strategis Protokol (2026 - 2027)
                  </h3>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-emerald-400 font-bold font-sans">Q1 - Q2 2026 · Foundation & Deployment</div>
                      <div className="text-slate-300 mt-1 font-sans">
                        Audit formal smart contract Solana Anchor, peluncuran testnet Devnet, integrasi percontohan 500 penjual gadget & laptop UMKM di Yogyakarta dan Jakarta.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-teal-400 font-bold font-sans">Q3 - Q4 2026 · DeFi Yield Expansion & Blinks</div>
                      <div className="text-slate-300 mt-1 font-sans">
                        Aktivasi modul Solana Blinks untuk WhatsApp Commerce, ekspansi yield vault ke Marinade dan Kamino, peluncuran portal arbitrase multi-sig publik.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-indigo-400 font-bold font-sans">2027 · Cross-Border Southeast Asia Escrow</div>
                      <div className="text-slate-300 mt-1 font-sans">
                        Ekspansi rekening bersama lintas negara untuk ekspor kerajinan & komoditas UMKM Indonesia ke pasar ASEAN dengan multi-currency settlement (SOL, USDC, AMN).
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-4">
                    Provenansi & Penghargaan Akademik
                  </h3>
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                    <p className="text-xs text-indigo-200">
                      Fondasi konseptual arsitektur rekening bersama desentralisasi ini dikembangkan pertama kali melalui penelitian akademik <strong>Kelompok 2 Universitas AMIKOM Yogyakarta</strong>. Seluruh dokumentasi penelitian asli, diagram sekuensial, dan studi kelayakan dipisahkan ke dalam arsip riset akademik yang dapat diakses mandiri:
                    </p>
                    <button
                      onClick={onOpenAcademicReport}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Buka Laporan Riset Kelompok 2 AMIKOM (PDF)</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveSection('security')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ← Kembali ke Security
                  </button>
                  <button
                    onClick={onBackToApp}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Buka dApp Workspace Sekarang →
                  </button>
                </div>
              </article>
            )}

          </main>

        </div>
      </div>

    </div>
  );
};
