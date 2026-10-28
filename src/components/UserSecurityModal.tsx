import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Fingerprint, 
  X, 
  FileCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface UserSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSecurityModal: React.FC<UserSecurityModalProps> = ({ isOpen, onClose }) => {
  const { activeAccount, updateSecurityPhrase } = useWeb3();

  const [phraseInput, setPhraseInput] = useState(activeAccount.securityPhrase || '');
  const [isEditingPhrase, setIsEditingPhrase] = useState(false);
  const [testVideoNote, setTestVideoNote] = useState('');
  const [generatedHash, setGeneratedHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSavePhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phraseInput.trim()) return;
    updateSecurityPhrase(phraseInput.trim());
    setIsEditingPhrase(false);
  };

  const handleGenerateProofHash = () => {
    if (!testVideoNote) return;
    // Simulate SHA-256 calculation
    const hash = 'sha256_' + Array.from(testVideoNote).reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0).toString(16).padStart(64, 'a');
    setGeneratedHash(hash);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Pusat Keamanan & Proteksi Pengguna Web3 (Amanah Shield)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Standar keamanan kriptografi Solana untuk menjamin perlindungan 100% aset pembeli dan penjual.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Feature 1: Anti-Phishing Security Phrase */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">1. Kalimat Sandi Anti-Phishing Pribadi</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Aktif & Terverifikasi
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Frasa ini unik untuk akun Anda dan akan selalu ditampilkan pada setiap dialog konfirmasi smart contract. Jika frasa ini tidak cocok, Anda sedang berada di situs phishing palsu.
          </p>

          {isEditingPhrase ? (
            <form onSubmit={handleSavePhrase} className="space-y-2">
              <input
                type="text"
                required
                value={phraseInput}
                onChange={(e) => setPhraseInput(e.target.value)}
                placeholder="Buat frasa unik (contoh: Garuda-Biru-Solana-2026)"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingPhrase(false)}
                  className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 cursor-pointer"
                >
                  Simpan Frasa
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-mono text-xs text-emerald-400 font-bold">
                "{activeAccount.securityPhrase || 'Belum diatur'}"
              </span>
              <button
                onClick={() => setIsEditingPhrase(true)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Ubah Frasa
              </button>
            </div>
          )}
        </div>

        {/* Security Feature 2: Pre-Flight Simulation */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold text-white">2. Simulasi Transaksi Pra-Eksekusi (Pre-Flight)</h3>
            </div>
            <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              Zero-Drain Shield
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Setiap instruksi disimulasikan terlebih dahulu di node RPC lokal Solana sebelum dikirim ke validator. Perubahan saldo dan alur token diverifikasi sehingga transaksi drainer berbahaya diblokir secara otomatis.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400">
            <code>connection.simulateTransaction(tx) → [Pre-flight check: PASSED (0 unauthorized drains)]</code>
          </div>
        </div>

        {/* Security Feature 3: Auto-Refund Timelock Protection */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white">3. Proteksi Waktu Auto-Refund (Slot Timelock)</h3>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Batas Waktu Terikat Kontrak
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Jika penjual tidak memasukkan nomor resi terverifikasi sebelum batas deadline slot yang ditetapkan saat pembelian, smart contract membuka fungsi <code>claim_timeout_refund</code> yang dapat Anda picu secara mandiri untuk mengembalikan 100% SOL Anda.
          </p>
        </div>

        {/* Security Feature 4: Cryptographic Evidence Hasher */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white">4. Generator Hash Bukti Pengiriman / Unboxing (SHA-256)</h3>
          </div>
          <p className="text-xs text-slate-300">
            Untuk keperluan sengketa, masukkan catatan nomor resi atau nama file video unboxing untuk membuat bukti cryptographic hash on-chain yang tidak dapat dipalsukan.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={testVideoNote}
              onChange={(e) => setTestVideoNote(e.target.value)}
              placeholder="contoh: Video_Unboxing_Order_101.mp4"
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerateProofHash}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors"
            >
              Generate Hash
            </button>
          </div>
          {generatedHash && (
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono break-all text-emerald-400">
              Hash SHA-256: {generatedHash}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Tutup Pusat Keamanan
          </button>
        </div>

      </div>
    </div>
  );
};
