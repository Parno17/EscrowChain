import React, { useState } from 'react';
import { 
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
  ChevronRight,
  Download,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  TOKENOMICS_INFO, 
  SOLANA_GAS_FEE_SOL 
} from '../data/mockData';

interface WhitepaperViewProps {
  onBackToApp: () => void;
  onOpenAudit: () => void;
  onOpenAcademicReport: () => void;
}

type WhitepaperSection =
  | 'overview'
  | 'layer1'
  | 'layer2'
  | 'layer3'
  | 'tokenomics'
  | 'security'
  | 'governance'
  | 'status'
  | 'references';

export const WhitepaperView: React.FC<WhitepaperViewProps> = ({
  onBackToApp,
  onOpenAudit,
  onOpenAcademicReport
}) => {
  const [activeSection, setActiveSection] = useState<WhitepaperSection>('overview');

  const sections: { id: WhitepaperSection; title: string }[] = [
    { id: 'overview', title: '00. Abstrak & Ringkasan Eksekutif' },
    { id: 'layer1', title: '01. Fondasi & Model Settlement' },
    { id: 'layer2', title: '02. Arsitektur & Siklus Escrow' },
    { id: 'layer3', title: '03. Pengalaman Pengguna & Integrasi' },
    { id: 'tokenomics', title: '04. Utilitas & Tokenomics AMN' },
    { id: 'security', title: '05. Keamanan, Risiko & Asumsi' },
    { id: 'governance', title: '06. Tata Kelola & Roadmap' },
    { id: 'status', title: '07. Status Implementasi & Batasan' },
    { id: 'references', title: '08. Referensi & Glosarium' },
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
                EscrowChain Whitepaper v3.0 · Token Amanah ($AMN)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAudit}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <span>Contoh Kode Anchor</span>
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
                      onClick={() => setActiveSection(s.id)}
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
                <div>Dokumen: EscrowChain · v3.0</div>
                <div>Jaringan target: Solana</div>
                <div>Status produk: Prototipe simulasi</div>
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
                    Chapter 00 · Abstract & Executive Summary
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    EscrowChain - Rancang Bangun Sistem Rekening Bersama Berbasis Smart Contract Solana untuk Meningkatkan Kepercayaan Transaksi Jual Beli Elektronik
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    EscrowChain adalah rancangan aplikasi rekening bersama digital yang bertujuan membantu pembeli dan penjual barang elektronik mengelola pembayaran, bukti pemenuhan pesanan, serta penyelesaian sengketa secara lebih transparan. Dokumen ini menjelaskan masalah, arsitektur yang direncanakan, token Amanah ($AMN), model risiko, dan status implementasi prototipe.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white">Ruang lingkup dokumen</div>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      <li>Tujuan dan batasan sistem rekening bersama untuk transaksi jual beli barang elektronik.</li>
                      <li>Lifecycle pesanan, pembayaran SOL atau AMN, refund, dan peran pihak terkait.</li>
                      <li>Model utilitas AMN yang masih berupa parameter prototipe, bukan penawaran aset.</li>
                      <li>Asumsi keamanan, risiko operasional, rencana validasi, serta sumber teknis.</li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-2">
                    Solusi: Protokol Rekber Terdesentralisasi Solana (EscrowChain & Token Amanah)
                  </h3>

                  <p>
                    Prototipe <strong>EscrowChain</strong> memodelkan mekanisme rekber dan pengalaman pengguna dengan SOL dan token <strong>Amanah ($AMN)</strong>. Implementasi antarmuka saat ini menggunakan state dan transaksi simulasi lokal; belum ada escrow nyata pada Solana, transfer SPL, integrasi yield, ataupun audit yang dapat diverifikasi. Rencana on-chain memerlukan program escrow teruji, mint token sah, wallet signer, dan mekanisme pemulihan yang ditetapkan.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white">4 Pilar Utama Arsitektur Amanah:</div>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      <li><strong>Settlement terprogram:</strong> Dana dapat ditahan dan dilepas berdasarkan state serta otorisasi yang eksplisit setelah program on-chain dibuat dan diaudit.</li>
                      <li><strong>Alur dua sisi:</strong> Pembeli mendanai pesanan, penjual mengirimkan barang, dan pembeli atau mekanisme penyelesaian menangani konfirmasi/refund.</li>
                      <li><strong>Metode pembayaran:</strong> Antarmuka prototipe menyediakan simulasi SOL dan AMN; transaksi keduanya masih lokal.</li>
                      <li><strong>Insentif AMN:</strong> Model prototipe menampilkan cashback 0,5% untuk pembayaran SOL dan 3% untuk AMN; parameter ini perlu governance, pendanaan, serta validasi ekonomi sebelum peluncuran.</li>
                    </ul>
                  </div>
                  <p className="text-xs text-amber-300">
                    EscrowChain adalah proyek mandiri pada Solana. Axelar digunakan hanya sebagai referensi publik untuk susunan dokumentasi protokol; tidak ada integrasi, afiliasi, atau dukungan Axelar.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setActiveSection('layer1')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Lanjut ke Fondasi & Settlement →</span>
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
                    Fondasi Settlement & Model Akun Solana
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Solana dipilih sebagai jaringan target untuk settlement karena mendukung program dan akun yang dapat diprogram. Pilihan jaringan tidak menjamin throughput, biaya, atau finalitas tertentu; nilai aktual berubah sesuai kondisi jaringan dan harus diukur kembali saat implementasi.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <Clock className="w-4 h-4" />
                        <span>Proof of History (PoH)</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Mekanisme pengurutan waktu yang menjadi bagian dari rancangan Solana. Ini bukan jaminan bahwa transaksi aplikasi akan final dalam durasi tetap.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                        <Cpu className="w-4 h-4" />
                        <span>Tower BFT Consensus</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Sistem konsensus Solana berperan dalam mengonfirmasi blok. Aplikasi harus memeriksa status transaksi dan tingkat komitmen yang sesuai, bukan mengasumsikan transaksi berhasil hanya dari pengiriman.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                        <Layers className="w-4 h-4" />
                        <span>Sealevel Parallel Runtime</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Runtime Solana mengelola eksekusi program dan akses akun. EscrowChain tetap harus merancang kepemilikan akun, izin, dan validasi instruksi dengan benar.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                        <GitBranch className="w-4 h-4" />
                        <span>Gulf Stream (Mempool-less)</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Infrastruktur propagasi transaksi berada pada level jaringan; penggunaan Solana sendiri tidak menghilangkan seluruh risiko MEV, urutan transaksi, kegagalan RPC, atau transaksi yang kedaluwarsa.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                    <strong>Biaya jaringan:</strong> estimasi gas fee {SOLANA_GAS_FEE_SOL} SOL hanya nilai simulasi aplikasi. Biaya transaksi riil bergantung pada instruksi, priority fee, kondisi cluster, dan wallet; periksa estimasi sebelum pengguna menandatangani.
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
                    Lanjut ke Arsitektur Escrow →
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
                    Arsitektur Escrow & Siklus Pesanan
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Bagian ini menjelaskan rancangan logika escrow. Siklus di bawah adalah model produk; penerapan sebenarnya harus menegakkan setiap transisi dan otorisasi di program Solana, bukan hanya di UI.
                  </p>

                  <h3 className="text-lg font-bold text-white pt-2">
                    1. Arsitektur Program Derived Addresses (PDA)
                  </h3>
                  <p>
                    Program Solana memisahkan kode program dan akun data. Dalam rancangan EscrowChain, akun escrow dan vault dapat diturunkan dari seeds deterministik yang mencakup identitas pesanan. Contoh berikut adalah pseudocode konseptual, bukan derivasi yang sudah dipakai program ter-deploy:
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
                    2. Pembayaran, biaya jaringan, dan cashback
                  </h3>
                  <p>
                    Pembelian katalog langsung pada prototipe menyediakan pilihan SOL atau AMN; invoice yang dibuat penjual saat ini hanya dapat didanai dengan SOL. Untuk menjaga pembukuan, nominal rupiah, padanan token, biaya jaringan SOL, serta metode bayar perlu disimpan sebagai nilai terpisah. Saldo SOL tetap diperlukan untuk biaya jaringan walaupun nominal katalog dibayar dengan AMN.
                  </p>
                  <p>
                    Parameter cashback prototipe dihitung dari nilai pembelian: pembayaran SOL mendapat 0,5% nilai pembelian dalam AMN, sedangkan pembayaran AMN mendapat 3% dari jumlah AMN yang dibayarkan. Cashback hanya dikreditkan saat penyelesaian pesanan pada simulasi. Persentase tersebut bukan yield, bukan jaminan imbal hasil, dan belum didukung treasury atau aturan token on-chain.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2 text-slate-200">
                    <div className="text-emerald-400 font-bold font-sans text-sm mb-1">
                      Parameter Cashback Pembelian (prototipe):
                    </div>
                    <div>Cashback_SOL = nilai_SOL × 0,5% dikonversi ke AMN memakai kurs simulasi</div>
                    <div>Cashback_AMN = jumlah_AMN × 3%</div>
                    <div className="text-amber-300">Kedua nilai baru diberikan jika pesanan selesai; refund tidak menghasilkan cashback pembelian.</div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-2">
                    3. Alur Mesin State (State Transition Machine)
                  </h3>
                  <p>
                    Alur pada prototipe saat ini. Status diubah di state aplikasi; belum ada transaksi yang dieksekusi smart contract on-chain.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                    <div className="text-emerald-400">Pembeli ──(membeli produk dan membayar langsung dengan SOL/AMN)──&gt; Funded.</div>
                    <div className="text-indigo-300">Penjual ──(menerbitkan invoice)──&gt; Draft ──(pembeli membayar dengan SOL + fee SOL)──&gt; Funded.</div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-emerald-400 font-bold">Funded</span>
                      <span>──(Penjual konfirmasi pesanan)──&gt;</span>
                      <span className="text-teal-300 font-bold">ConfirmedBySeller</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-teal-300 font-bold">ConfirmedBySeller</span>
                      <span>──(Penjual mengirim barang dan memasukkan resi)──&gt;</span>
                      <span className="text-sky-300 font-bold">Shipped</span>
                    </div>
                    <div className="text-sky-200">Kurir ──(mengunggah foto paket di lokasi penerima dan catatan pengantaran)──&gt; Bukti pengiriman terlihat oleh pembeli; status tetap Shipped sampai pembeli mengonfirmasi.</div>
                    <div className="text-emerald-300">Shipped ──(Pembeli mengonfirmasi barang diterima)──&gt; Completed; token pembayaran dilepas ke penjual dan cashback AMN dikreditkan.</div>
                    <div className="text-rose-300">Funded/ConfirmedBySeller ──(Penjual melaporkan stok tidak tersedia)──&gt; Refunded dalam token pembayaran.</div>
                    <div className="text-amber-300">Shipped ──(Pembeli mengajukan komplain)──&gt; RefundRequested ──(Admin menyetujui)──&gt; Refunded.</div>
                    <div className="text-rose-300">Deadline lewat dan pesanan belum Shipped ──(Pembeli memicu klaim timeout)──&gt; Refunded dalam token pembayaran.</div>
                    <div className="text-amber-200">Tribunal dapat memutus pelepasan/refund setelah kuorum tercapai; alur ini masih simulasi.</div>
                  </div>
                  <p className="text-xs text-amber-300">
                    Pembayaran dan refund mempertahankan token pembayaran awal. Gas fee tetap memerlukan SOL. Timeout bukan otomatis: pengguna memicu klaim dan prototipe menolak klaim jika barang sudah berstatus Shipped. Cashback 0,5% (bayar SOL) atau 3% (bayar AMN) baru dikreditkan ketika dana diselesaikan ke penjual, termasuk penyelesaian oleh admin/tribunal yang disetujui. Bukti foto kurir disimpan sebagai data aplikasi lokal, bukan bukti resmi dari ekspedisi atau data on-chain. Semua saldo, signature, dan perubahan status di atas adalah simulasi lokal; yield vault tidak aktif.
                  </p>
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
                    Lanjut ke Pengalaman Pengguna →
                  </button>
                </div>
              </article>
            )}

            {/* SECTION 03: LAYER 3 E-COMMERCE GATEWAY & BLINKS */}
            {activeSection === 'layer3' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 03 · Application Layer
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Pengalaman Pengguna, Bukti Pesanan & Integrasi
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Tujuan desain antarmuka adalah mengurangi kompleksitas penggunaan wallet dan membantu pihak-pihak memahami status pesanan. Fitur yang belum terhubung ke layanan atau program on-chain di bawah ini merupakan rancangan, bukan kemampuan produksi.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <Sparkles className="w-4 h-4" />
                        <span>Solana Blinks & Actions</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Tautan berbasis Solana Actions/Blinks dapat dipertimbangkan untuk memulai pembayaran dari platform lain. EscrowChain saat ini belum menyediakan endpoint Actions/Blinks, dan contoh URL di bawah bersifat ilustratif.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                        <Lock className="w-4 h-4" />
                        <span>Onboarding Email & Dompet Web3</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Pengguna dapat masuk dengan email atau menghubungkan dompet Web3 seperti Phantom, Solflare, Backpack, dan MetaMask. Pada prototipe ini, akun dan saldo disimulasikan di aplikasi; autentikasi email belum menerbitkan pasangan kunci Solana atau menyimpan dana secara on-chain.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                        <Coins className="w-4 h-4" />
                        <span>Fiat Gateway (rencana)</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Integrasi QRIS, virtual account, atau on/off-ramp dapat dievaluasi di masa depan melalui penyedia berizin. Fitur tersebut belum tersedia dan tidak ada koneksi langsung dari Rupiah ke saldo wallet pada prototipe.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Tribunal Pengadilan Arbitrase Multi-Sig</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        UI prototipe menyediakan alur komplain dan keputusan admin/tribunal yang disimulasikan. Bukti berkas perlu disimpan off-chain dengan kontrol akses; hash saja tidak membuktikan isi atau kebenaran bukti.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-2">
                    Contoh payload konseptual (belum tersedia sebagai endpoint)
                  </h3>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`GET https://example.invalid/api/actions/pay?order=101
Headers: "Accept: application/json"

Response JSON:
{
  "icon": "https://example.invalid/assets/product.jpg",
  "title": "EscrowChain order payment",
  "description": "Review order and escrow terms before signing.",
  "label": "Review payment",
  "disabled": false
}`}
                  </pre>
                  <p className="text-xs text-amber-300">
                    QRIS, virtual account, fiat on-ramp/off-ramp, wallet abstraction, dan integrasi marketplace tidak tersedia pada versi prototipe ini. Integrasi fiat membutuhkan penyedia layanan dan kepatuhan yang sesuai.
                  </p>
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
                    Lanjut ke Utilitas & Tokenomics AMN →
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
                    Token Amanah ($AMN): Utilitas & Parameter Ekonomi Ilustratif
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    $AMN dirancang sebagai token utilitas pada ekosistem EscrowChain. Informasi mint, supply, dan distribusi berikut adalah parameter contoh dari data prototipe, belum diverifikasi melalui mint SPL on-chain, dan tidak menyatakan nilai pasar atau janji keuntungan.
                  </p>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                    <div className="font-bold text-amber-300">Insentif pembelian pada prototipe</div>
                    <div>Bayar SOL: cashback 0,5% dari nilai pembelian, dikonversi ke AMN menggunakan kurs simulasi.</div>
                    <div>Bayar AMN: cashback 3% dari jumlah AMN yang dibayarkan.</div>
                    <div>Cashback dikreditkan setelah pesanan selesai; gas fee jaringan tetap dibayar dalam SOL. Nilai ini dapat berubah sebelum peluncuran.</div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Pasokan Maksimum (contoh)</div>
                      <div className="text-base font-bold font-mono text-white mt-0.5">{TOKENOMICS_INFO.totalSupply.toLocaleString('id-ID')} AMN</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Pasokan Beredar</div>
                      <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">{TOKENOMICS_INFO.circulatingSupply.toLocaleString('id-ID')} AMN</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Terkunci di Staking Pool</div>
                      <div className="text-base font-bold font-mono text-teal-400 mt-0.5">{TOKENOMICS_INFO.stakedSupply.toLocaleString('id-ID')} AMN</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Telah Dibakar (Burned)</div>
                      <div className="text-base font-bold font-mono text-rose-400 mt-0.5">{TOKENOMICS_INFO.totalBurned.toLocaleString('id-ID')} AMN</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-2">
                    Usulan Alokasi Pasokan ($AMN, belum ditetapkan on-chain)
                  </h3>

                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">Kategori Alokasi</th>
                          <th className="p-3">Persentase</th>
                          <th className="p-3">Jumlah Token</th>
                          <th className="p-3">Catatan (usulan)</th>
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
                          <td className="p-3 font-sans font-medium text-white">Adopsi Penjual & Ekosistem</td>
                          <td className="p-3 text-teal-400 font-bold">25.0%</td>
                          <td className="p-3">25.000.000 AMN</td>
                          <td className="p-3 font-sans text-slate-400">Usulan subsidi biaya jaringan dan insentif transaksi elektronik</td>
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
                    Tingkatan Utilitas Staking untuk Penjual Barang Elektronik
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-xs text-white">Tier Standard (0 AMN)</div>
                        <div className="text-xs text-slate-400 mt-1">Rancangan biaya dasar; belum ditagihkan atau diterapkan on-chain.</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-xs text-emerald-400">Tier Silver (1.000 AMN Staked)</div>
                      <div className="text-xs text-slate-400 mt-1">Diskon dan lencana merchant masih usulan; perlu aturan eligibility yang dapat diverifikasi.</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-xs text-amber-400">Tier Amanah VIP (5.000 AMN Staked)</div>
                      <div className="text-xs text-slate-400 mt-1">Fitur premium masih usulan. Tingkat imbal hasil tidak ditetapkan dan tidak dijamin.</div>
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
                    Lanjut ke Keamanan & Risiko →
                  </button>
                </div>
              </article>
            )}

            {/* SECTION 05: SECURITY & ANCHOR INVARIANTS */}
            {activeSection === 'security' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 05 · Security & Risk Model
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Batas Keamanan, Ancaman & Mitigasi yang Direncanakan
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    Keamanan belum dapat diklaim terjamin hanya dari rancangan UI atau penggunaan Solana/Anchor. Sebelum escrow nyata, program harus ditulis, diuji, ditinjau secara independen, dan dikonfigurasi dengan otorisasi yang eksplisit. Risiko utama dan kontrol yang perlu diterapkan meliputi:
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Otorisasi dan penyalahgunaan akun</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Program perlu memvalidasi signer, owner akun, PDA seeds, token mint, token account, hubungan buyer/seller, serta state order pada setiap instruksi. Jangan mengandalkan nilai yang dikirim UI.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kesalahan state, aritmetika, dan token</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Gunakan aritmetika checked, unit integer terkecil, batas nilai, dan pengujian invariant untuk mencegah overflow, rounding, double settlement, pembayaran token yang salah, atau refund berulang.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Risiko eksternal dan respons insiden</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Risiko meliputi kegagalan RPC/wallet, kunci admin bocor, token mint palsu, bug program, gangguan jaringan, oracle/kurs yang salah, serta kerugian pada protokol yield pihak ketiga. Kebijakan pause, multisig, monitoring, dan prosedur pemulihan masih harus dirancang serta diuji.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenAudit}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Lihat ilustrasi kode & alur teknis (bukan audit) →</span>
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
                    Lanjut ke Tata Kelola & Roadmap →
                  </button>
                </div>
              </article>
            )}

            {/* SECTION 06: DAO GOVERNANCE & ROADMAP */}
            {activeSection === 'governance' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 06 · Governance & Roadmap
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Tata Kelola, Tahapan Pengembangan & Riset
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>
                    DAO merupakan arah tata kelola yang diusulkan, bukan organisasi atau kontrak voting yang sudah aktif. Perubahan parameter keuangan harus disertai batas risiko, transparansi, masa jeda, dan mekanisme darurat; kepemilikan token saja tidak membuktikan hak tata kelola saat ini.
                  </p>

                  <h3 className="text-lg font-bold text-white pt-2">
                    Roadmap pengembangan bertahap
                  </h3>
                  <p className="text-xs text-slate-400">
                    Status prototipe menggambarkan kondisi saat ini. Tahapan bertahun berikutnya adalah perkiraan perencanaan, bukan jadwal yang dijanjikan. Setiap tahap bergantung pada hasil tahap sebelumnya, kesiapan tim dan sumber daya, validasi risiko dan kepatuhan, serta keputusan untuk melanjutkan atau menunda.
                  </p>

                  <div className="relative space-y-3 border-l border-slate-700 pl-5 font-mono text-xs sm:pl-7">
                    <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                      <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full border-2 border-emerald-400 bg-slate-950 sm:-left-[35px]" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-sans font-bold text-emerald-400">Saat ini · Prototipe dan simulasi</div>
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">Berjalan</span>
                      </div>
                      <div className="text-slate-300 mt-1 font-sans">
                        Menguji pengalaman rekening bersama melalui demo lokal: alur pembeli dan penjual, status pesanan, serta dokumentasi arsitektur. Saldo, escrow, dan transaksi masih simulasi; tidak ada aset nyata yang dikelola.
                      </div>
                    </div>

                    <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                      <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full border-2 border-emerald-400 bg-slate-950 sm:-left-[35px]" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-sans font-bold text-emerald-400">01 · Fondasi dan validasi desain · Perkiraan 2027</div>
                        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">Perkiraan</span>
                      </div>
                      <div className="text-slate-300 mt-1 font-sans">
                        Validasi kebutuhan UMKM dan pengguna; tetapkan state machine, skema akun/IDL, kebijakan biaya dan refund, serta model ancaman. Bangun proof of concept dan test case tanpa menerima aset nyata.
                      </div>
                    </div>

                    <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                      <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full border-2 border-teal-400 bg-slate-950 sm:-left-[35px]" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-sans font-bold text-teal-400">02 · Implementasi dan uji Devnet · Perkiraan 2028</div>
                        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">Bersyarat</span>
                      </div>
                      <div className="text-slate-300 mt-1 font-sans">
                        Jika rancangan dan sumber daya memadai, implementasikan wallet signing dan program escrow di Devnet. Uji deposit SOL/AMN, pengiriman, bukti kurir, penyelesaian, timeout, refund, sengketa, pemulihan, dan kondisi gagal. Yield tetap di luar lingkup awal.
                      </div>
                    </div>

                    <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                      <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full border-2 border-indigo-400 bg-slate-950 sm:-left-[35px]" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-sans font-bold text-indigo-400">03 · Review independen dan pilot terbatas · Perkiraan 2029</div>
                        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">Gerbang keamanan</span>
                      </div>
                      <div className="text-slate-300 mt-1 font-sans">
                        Hanya setelah pengujian Devnet memadai: lakukan audit/review independen, tutup temuan kritis, siapkan pemantauan, dukungan, serta respons insiden, lalu uji coba dengan peserta dan batas nominal yang ditentukan. Jangan lanjut bila risiko belum dapat diterima.
                      </div>
                    </div>

                    <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                      <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full border-2 border-amber-400 bg-slate-950 sm:-left-[35px]" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-sans font-bold text-amber-400">04 · Evaluasi peluncuran dan tata kelola · 2030+</div>
                        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">Keputusan belum dibuat</span>
                      </div>
                      <div className="text-slate-300 mt-1 font-sans">
                        Pertimbangkan mainnet hanya jika audit, kepatuhan, operasi, keamanan, dan ekonomi protokol telah tervalidasi serta ada persetujuan eksplisit. Token AMN, governance DAO, integrasi resmi ekspedisi, dan fitur DeFi merupakan jalur terpisah yang memerlukan evaluasi serta persetujuan baru.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                    Timeline ini bersifat indikatif dan dapat bergeser atau dihentikan. Tidak menyatakan bahwa implementasi, audit, integrasi kurir, peluncuran mainnet, tokenomics, DAO, yield vault, Actions/Blinks, maupun ekspansi lintas negara telah disetujui atau dijamin terjadi.
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
                    onClick={() => setActiveSection('status')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Lanjut ke Status Implementasi →
                  </button>
                </div>
              </article>
            )}

            {activeSection === 'status' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 07 · Implementation Status
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Status Implementasi, Asumsi & Batasan
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
                    <div className="font-bold text-amber-300">Status saat ini: prototipe UI dengan simulasi lokal.</div>
                    <p className="text-xs text-amber-100 mt-1">
                      Saldo, pembelian SOL/AMN, biaya transaksi yang ditampilkan, cashback, staking, yield, transaksi, dan sebagian alur governance dikelola sebagai data aplikasi. Signature simulasi bukan bukti transaksi pada explorer.
                    </p>
                  </div>

                  <h3 className="text-lg font-bold text-white">Belum tersedia untuk penggunaan aset nyata</h3>
                  <ul className="list-disc list-inside space-y-2 text-xs">
                    <li>Program escrow produksi, deployment yang dapat diverifikasi, IDL dan mint AMN resmi belum dikonfigurasi pada prototipe ini.</li>
                    <li>Wallet signing dan transfer token on-chain belum menjadi bagian dari alur pembelian yang disimulasikan.</li>
                    <li>Yield vault, oracle harga, QRIS/on-ramp, arbitrase DAO, dan mekanisme multisig tidak diaktifkan sebagai layanan nyata.</li>
                    <li>Angka tokenomics, kurs, biaya, cashback, APY, dan jadwal roadmap adalah parameter contoh, bukan data pasar atau komitmen.</li>
                  </ul>

                  <h3 className="text-lg font-bold text-white">Kriteria sebelum mainnet</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Program Anchor dan IDL diverifikasi; unit, integration, dan invariant tests lulus.',
                      'Audit/review independen selesai dan temuan kritis ditangani.',
                      'Devnet menguji pembayaran SOL/AMN, refund token asli, timeout, stok, retry dan penolakan transaksi.',
                      'Mint, authority, multisig, monitoring, incident response, dan recovery dipublikasikan.',
                      'Biaya, aturan cashback, sumber pendanaan dan risiko dijelaskan kepada pengguna.',
                      'Kelayakan hukum, perlindungan konsumen, privasi, dan kewajiban operasional dievaluasi.'
                    ].map(item => (
                      <div key={item} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-2" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400">
                    Dokumen ini menjelaskan desain dan status kode yang tersedia, bukan jaminan keamanan, performa, hasil finansial, atau ketersediaan layanan.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveSection('governance')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ← Kembali ke Roadmap
                  </button>
                  <button
                    onClick={() => setActiveSection('references')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Referensi & Glosarium →
                  </button>
                </div>
              </article>
            )}

            {activeSection === 'references' && (
              <article className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    Chapter 08 · References
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    Referensi, Glosarium & Disclaimer
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <h3 className="text-lg font-bold text-white">Referensi teknis</h3>
                  <ol className="list-decimal list-inside space-y-3 text-xs">
                    <li>
                      <a className="text-emerald-300 hover:text-emerald-200 underline" href="https://docs.axelar.dev/infrastructure" target="_blank" rel="noreferrer">
                        Axelar Documentation — Infrastructure Overview
                      </a>
                      <span className="text-slate-400">. Acuan publik untuk organisasi dokumentasi protokol (overview, arsitektur, keamanan/verifikasi, protokol aplikasi, dan bagian referensi). EscrowChain tidak menggunakan atau mengklaim integrasi Axelar.</span>
                    </li>
                    <li>
                      <a className="text-emerald-300 hover:text-emerald-200 underline" href="https://solana.com/docs" target="_blank" rel="noreferrer">
                        Solana Documentation
                      </a>
                      <span className="text-slate-400">. Referensi primer untuk transaksi, akun, program, jaringan, dan wallet Solana.</span>
                    </li>
                    <li>
                      <a className="text-emerald-300 hover:text-emerald-200 underline" href="https://www.anchor-lang.com/docs" target="_blank" rel="noreferrer">
                        Anchor Documentation
                      </a>
                      <span className="text-slate-400">. Referensi framework untuk membangun, menguji, dan berinteraksi dengan program Solana.</span>
                    </li>
                  </ol>

                  <h3 className="text-lg font-bold text-white pt-3">Glosarium</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800"><dt className="font-bold text-white">Escrow</dt><dd className="text-slate-400 mt-1">Dana yang ditahan dengan aturan pelepasan atau refund tertentu.</dd></div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800"><dt className="font-bold text-white">PDA</dt><dd className="text-slate-400 mt-1">Program Derived Address; alamat akun yang diturunkan secara deterministik dari program dan seeds.</dd></div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800"><dt className="font-bold text-white">IDL</dt><dd className="text-slate-400 mt-1">Interface Description Language, deskripsi antarmuka program untuk client.</dd></div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800"><dt className="font-bold text-white">AMN</dt><dd className="text-slate-400 mt-1">Token utilitas yang direncanakan untuk ekosistem EscrowChain; status mint perlu diverifikasi.</dd></div>
                  </dl>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
                    <div className="font-bold text-slate-200">Disclaimer</div>
                    <p>
                      Whitepaper ini adalah dokumen desain/prototipe untuk tujuan informasi dan pendidikan. Isinya bukan nasihat investasi, hukum, pajak, atau keuangan; bukan penawaran token; dan tidak menjamin keamanan, likuiditas, harga, APY, cashback, atau pengembalian dana. Penggunaan blockchain memiliki risiko kehilangan aset, kesalahan pengguna, kerentanan program, volatilitas token, dan gangguan jaringan. Periksa deployment dan konfigurasi resmi secara mandiri sebelum berinteraksi dengan aset nyata.
                    </p>
                    <p>Referensi pihak ketiga ditautkan untuk konteks teknis; isi dan perubahan dokumen tersebut berada di luar kendali EscrowChain.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveSection('status')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ← Kembali ke Status
                  </button>
                  <button
                    onClick={onBackToApp}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Kembali ke aplikasi →
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
