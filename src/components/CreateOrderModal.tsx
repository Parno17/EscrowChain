import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { SOL_IDR_RATE, AMN_IDR_RATE, SOL_TO_AMN_RATE, PRESET_ACCOUNTS, SOLANA_GAS_FEE_SOL } from '../data/mockData';
import { X, ShieldCheck, ArrowRight, Wallet, AlertCircle, Sparkles, User, FileText, KeyRound, Clock } from 'lucide-react';
import { InitiatorType } from '../types/escrow';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: {
    title: string;
    priceSol: number;
    sellerAddress: string;
    category: string;
  };
  initialInitiator?: InitiatorType;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
  initialInitiator = 'buyer'
}) => {
  const { activeAccount, createOrderAsBuyer, sellerCreateInvoice } = useWeb3();

  const [initiatorType, setInitiatorType] = useState<InitiatorType>(initialInitiator);

  const otherAccounts = PRESET_ACCOUNTS.filter(
    (a) => a.address.toLowerCase() !== activeAccount.address.toLowerCase()
  );

  const [seller, setSeller] = useState<string>(
    initialProduct?.sellerAddress || otherAccounts[1]?.address || otherAccounts[0]?.address || ''
  );
  const [buyer, setBuyer] = useState<string>(
    otherAccounts[0]?.address || '7Z1uYm8T4K3qB6hP2wRk9vLaE8nDcX5jM3490zK1'
  );
  const [desc, setDesc] = useState<string>(
    initialProduct ? `Pembelian ${initialProduct.title}` : 'Pembelian Smartphone Flagship Snapdragon 8 Gen 3'
  );
  const [productName, setProductName] = useState<string>(
    initialProduct?.title || 'Smartphone Flagship Snapdragon 8 Gen 3'
  );
  const [category, setCategory] = useState<string>(
    initialProduct?.category || 'Smartphone'
  );
  const [amountSol, setAmountSol] = useState<number>(
    initialProduct?.priceSol || 1.5
  );
  const [daysToDeadline, setDaysToDeadline] = useState<number>(4);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const idrEquivalent = Math.round(amountSol * SOL_IDR_RATE);
  const amnEquivalent = Math.round(amountSol * SOL_TO_AMN_RATE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (amountSol <= 0) {
      setErrorMessage('Nominal SOL harus lebih besar dari 0.');
      return;
    }

    if (initiatorType === 'buyer' && activeAccount.balanceSol < amountSol) {
      setErrorMessage(`Saldo SOL Anda (${activeAccount.balanceSol.toFixed(2)} SOL) tidak cukup.`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (initiatorType === 'buyer') {
        const res = await createOrderAsBuyer({
          seller,
          desc,
          daysToDeadline,
          amountSol,
          productName,
          category
        });
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal membuat pesanan rekber.');
          setIsSubmitting(false);
          return;
        }
      } else {
        const res = await sellerCreateInvoice({
          buyer,
          desc,
          daysToDeadline,
          amountSol,
          productName,
          category
        });
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal membuat invoice rekber.');
          setIsSubmitting(false);
          return;
        }
      }
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Inisiasi Kontrak Rekening Bersama Solana
            </h2>
            <p className="text-xs text-slate-400">
              Biaya gas: 0.000005 SOL (~Rp 12) · Terproteksi DeFi Yield & Kamino Vault
            </p>
          </div>
        </div>

        {/* Dual Initiation Selector */}
        <div className="mb-5 p-1 bg-slate-950 rounded-xl border border-slate-800 flex gap-1">
          <button
            type="button"
            onClick={() => setInitiatorType('buyer')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              initiatorType === 'buyer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pembeli Menginisiasi Pesanan (Bayar & Kunci)
          </button>
          <button
            type="button"
            onClick={() => setInitiatorType('seller')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              initiatorType === 'seller'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Penjual Menginisiasi Invoice (Minta Bayar)
          </button>
        </div>

        {/* Anti-Phishing Safety Verification Badge */}
        <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Frasa Anti-Phishing Anda:</span>
          </div>
          <span className="text-emerald-400 font-bold">
            "{activeAccount.securityPhrase || 'Garuda-Solana-Proteksi-2026'}"
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Nama Produk / Layanan
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {initiatorType === 'buyer' ? 'Pilih Penjual (Merchant UMKM):' : 'Pilih Pembeli (Konsumen):'}
            </label>
            <select
              value={initiatorType === 'buyer' ? seller : buyer}
              onChange={(e) => initiatorType === 'buyer' ? setSeller(e.target.value) : setBuyer(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
            >
              {otherAccounts.map((acc) => (
                <option key={acc.address} value={acc.address}>
                  {acc.name} - {acc.label} ({acc.address.slice(0, 8)}...{acc.address.slice(-6)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Nilai Transaksi (SOL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amountSol}
                onChange={(e) => setAmountSol(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                ≈ Rp {idrEquivalent.toLocaleString('id-ID')} · ({amnEquivalent} AMN)
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Batas Waktu Pengiriman (Deadline Hari)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                required
                value={daysToDeadline}
                onChange={(e) => setDaysToDeadline(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <div className="text-[11px] text-emerald-400 mt-1">
                Proteksi Auto-Refund jika lewat batas waktu
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Deskripsi Ketentuan & Catatan Pesanan
            </label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Gas Fee & DeFi Summary */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Biaya Jaringan Solana (Gas Fee):</span>
              <span className="text-emerald-400 font-bold">0.000005 SOL (~Rp 12)</span>
            </div>
            <div className="flex justify-between">
              <span>DeFi Kamino Yield Streaming:</span>
              <span className="text-white font-bold">6.8% APY (Otomatis Aktif)</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/20"
            >
              {isSubmitting ? 'Memproses Kontrak Anchor...' : initiatorType === 'buyer' ? 'Deposit & Kunci di PDA →' : 'Terbitkan Invoice On-Chain →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
