import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  X, 
  BookOpen, 
  GraduationCap, 
  Users, 
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

interface AcademicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicReportModal: React.FC<AcademicReportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'abstract' | 'pdf' | 'team'>('abstract');

  if (!isOpen) return null;

  const pdfUrl = '/assets/aistudio/LAPORAN_KELOMPOK_2_BLOCKCHAIN_e71d16ba.pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Arsip Riset Akademik: Kelompok 2 AMIKOM
                </h2>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/30">
                  Dokumen Riset Terpisah
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Studi Perancangan Rekening Bersama (Escrow) Terdesentralisasi untuk Keamanan Transaksi E-Commerce UMKM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download="LAPORAN_KELOMPOK_2_BLOCKCHAIN.pdf"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="px-6 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('abstract')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'abstract' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ringkasan Eksekutif & Metodologi
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'pdf' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pratinjau PDF Lengkap
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'team' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tim Peneliti & Lembaga
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-xs sm:text-sm leading-relaxed space-y-6">
          
          {/* TAB 1: ABSTRACT & METHODOLOGY */}
          {activeTab === 'abstract' && (
            <div className="space-y-5 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Abstrak Penelitian
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Penelitian ini mengkaji penerapan teknologi blockchain dalam mengatasi kelemahan mendasar model transaksi online di Indonesia, khususnya maraknya penipuan Cash on Delivery (COD) dan ketergantungan pada rekening bersama terpusat pihak ketiga yang membebankan potongan komisi tinggi. Melalui pemodelan smart contract, transaksi dieksekusi secara otomatis (self-executing) melalui multi-kondisi: inisiasi pesanan (dual initiation), deposit token, verifikasi resi pengiriman, hingga pelepasan dana terdesentralisasi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Fokus Masalah Penelitian</span>
                  </div>
                  <ul className="text-slate-400 space-y-1 list-disc list-inside">
                    <li>Ketiadaan jaminan kepercayaan transaksi peer-to-peer online.</li>
                    <li>Risiko gagal bayar COD yang merugikan penjual UMKM hingga 18%.</li>
                    <li>Pencairan dana rekening bersama konvensional yang memakan waktu 3–7 hari.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    <span>Metodologi Desain Sistem</span>
                  </div>
                  <ul className="text-slate-400 space-y-1 list-disc list-inside">
                    <li>Diagram Sekuensial Interaktif (Dual Inisiasi Buyer & Seller).</li>
                    <li>State Machine Transisi Kontrak (Funded → Shipped → Completed/Refunded).</li>
                    <li>Evolusi ke Solana Anchor untuk efisiensi gas fee mikrocent.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Ingin membaca naskah ilmiah lengkap?</div>
                  <div className="text-[11px] text-slate-400">Tersedia dokumen 24 halaman laporan format PDF.</div>
                </div>
                <button
                  onClick={() => setActiveTab('pdf')}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Buka Viewer PDF →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PDF VIEWER */}
          {activeTab === 'pdf' && (
            <div className="w-full h-full min-h-[500px] flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1`}
                title="Laporan Kelompok 2 Blockchain AMIKOM"
                className="w-full flex-1 border-0"
              />
            </div>
          )}

          {/* TAB 3: TEAM CREDITS */}
          {activeTab === 'team' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    K2
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Kelompok 2 - Riset Teknologi Blockchain</h3>
                    <p className="text-xs text-slate-400">Universitas AMIKOM Yogyakarta</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Karya riset ini disusun sebagai proyek penelitian teknologi buku besar terdistribusi (Distributed Ledger Technology) untuk memajukan digitalisasi UMKM Indonesia secara terdesentralisasi dan aman.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Arsip Riset Terpisah · Terbuka untuk Keperluan Audit Akademik</span>
          <button onClick={onClose} className="hover:text-white transition-colors cursor-pointer">
            Tutup [ESC]
          </button>
        </div>

      </div>
    </div>
  );
};
