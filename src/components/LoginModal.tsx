import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, ShieldCheck, Check, Sparkles, ArrowRight, User, Mail, KeyRound, Store, ShoppingBag, Lock } from 'lucide-react';
import { PRESET_ACCOUNTS } from '../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoleTab?: (role: 'buyer' | 'seller' | 'admin') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSelectRoleTab }) => {
  const { loginWithWallet, loginWithMetaMask, loginWithEmail, registerWithEmail, setActiveAccount } = useWeb3();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [roleInput, setRoleInput] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  
  const getRoleEmail = (r: 'buyer' | 'seller' | 'admin') => {
    if (r === 'buyer') return 'z.alimatus@students.amikom.ac.id';
    if (r === 'seller') return 'parno.elektronik@gadget-official.id';
    return 'admin.escrow@amikom.ac.id';
  };

  const getRoleName = (r: 'buyer' | 'seller' | 'admin') => {
    if (r === 'buyer') return 'Zayyini Alimatus';
    if (r === 'seller') return 'Sentra Gadget Elektronik';
    return 'M. Reza D. Nur (Admin)';
  };

  const [emailInput, setEmailInput] = useState(() => getRoleEmail('buyer'));
  const [nameInput, setNameInput] = useState(() => getRoleName('buyer'));
  const [securityPhraseInput, setSecurityPhraseInput] = useState('Garuda-Solana-Proteksi-2026');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: 'buyer' | 'seller' | 'admin') => {
    setRoleInput(newRole);
    setEmailInput(getRoleEmail(newRole));
    setNameInput(getRoleName(newRole));
  };

  const handleMetaMaskLogin = async () => {
    setLoading(true);
    await loginWithMetaMask(roleInput);
    setLoading(false);
    if (onSelectRoleTab) onSelectRoleTab(roleInput);
    onClose();
  };

  const handleWalletSelect = async (walletType: 'phantom' | 'solflare' | 'backpack') => {
    setLoading(true);
    await loginWithWallet(walletType);
    const target = PRESET_ACCOUNTS.find(a => a.role === roleInput);
    if (target) {
      setActiveAccount(target);
    }
    setLoading(false);
    if (onSelectRoleTab) onSelectRoleTab(roleInput);
    onClose();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (tab === 'signin') {
      await loginWithEmail(emailInput, nameInput || undefined, roleInput);
    } else {
      await registerWithEmail(emailInput, nameInput || 'Pengguna Baru', roleInput, securityPhraseInput);
    }
    setLoading(false);
    if (onSelectRoleTab) onSelectRoleTab(roleInput);
    onClose();
  };

  const handleQuickPresetLogin = (presetIndex: number) => {
    const acc = PRESET_ACCOUNTS[presetIndex];
    setActiveAccount(acc);
    if (onSelectRoleTab) {
      const target = acc.role === 'arbiter' ? 'admin' : acc.role;
      onSelectRoleTab(target);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-4">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center">
          <div className={`w-11 h-11 rounded-2xl mx-auto flex items-center justify-center font-bold text-lg mb-2 shadow-lg ${
            roleInput === 'admin'
              ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
              : roleInput === 'seller'
              ? 'bg-teal-500/10 border border-teal-500/30 text-teal-400'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}>
            {roleInput === 'admin' ? <Lock className="w-5 h-5" /> : roleInput === 'seller' ? <Store className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Pilih Akses Login EscrowChain Web3
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Login terpisah untuk Pembeli, Penjual UMKM, dan Admin Multi-Sig
          </p>
        </div>

        {/* PEMISAH PERAN: BUYER / SELLER / ADMIN */}
        <div className="p-1 bg-slate-950 rounded-xl border border-slate-800">
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => handleRoleChange('buyer')}
              className={`py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                roleInput === 'buyer'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>1. Pembeli</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('seller')}
              className={`py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                roleInput === 'seller'
                  ? 'bg-teal-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>2. Penjual</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                roleInput === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>3. Admin</span>
            </button>
          </div>
        </div>

        {/* 1-Click Fast Persona Login */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
          <div className="text-xs">
            <span className="font-semibold text-white block">
              {roleInput === 'buyer' && 'Akun Demo Pembeli: Zayyini Alimatus'}
              {roleInput === 'seller' && 'Akun Demo Penjual: Parno Husni (Sentra Gadget)'}
              {roleInput === 'admin' && 'Akun Demo Admin: M. Reza D. Nur (Vault DAO)'}
            </span>
            <span className="text-[11px] text-slate-400">
              {roleInput === 'buyer' && '14.50 SOL · Belanja & Klaim Refund'}
              {roleInput === 'seller' && '38.25 SOL · Upload & Edit Produk'}
              {roleInput === 'admin' && '450.00 SOL · Approve Lepas Dana'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickPresetLogin(roleInput === 'buyer' ? 0 : roleInput === 'seller' ? 1 : 2)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap ${
              roleInput === 'admin'
                ? 'bg-indigo-500 text-white hover:bg-indigo-400'
                : roleInput === 'seller'
                ? 'bg-teal-400 text-slate-950 hover:bg-teal-300'
                : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
            }`}
          >
            Masuk 1-Klik →
          </button>
        </div>

        {/* Tabs Sign In / Sign Up */}
        <div className="flex gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'signin' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Masuk (Sign In)
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'signup' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daftar Baru (Sign Up)
          </button>
        </div>

        {/* MetaMask & Web3 Wallet Selection */}
        <div className="space-y-2">
          {/* Featured MetaMask button */}
          <button
            onClick={handleMetaMaskLogin}
            disabled={loading}
            className="w-full p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 hover:border-amber-400 text-left transition-all cursor-pointer shadow-sm group flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-base shadow-inner group-hover:scale-110 transition-transform">
                🦊
              </div>
              <div>
                <span className="block font-bold text-white text-xs">
                  Login dengan MetaMask
                </span>
                <span className="block text-[10px] text-amber-300/90 font-mono">
                  EVM / Sepolia Web3 · Akses Portal {roleInput.toUpperCase()}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform">
              Masuk →
            </span>
          </button>

          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Atau Dompet Solana Web3 ({roleInput.toUpperCase()}):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleWalletSelect('phantom')}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-center transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 mx-auto rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-1">
                P
              </div>
              <span className="text-[11px] font-medium text-slate-300 group-hover:text-white block">Phantom</span>
            </button>

            <button
              onClick={() => handleWalletSelect('solflare')}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-center transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-1">
                S
              </div>
              <span className="text-[11px] font-medium text-slate-300 group-hover:text-white block">Solflare</span>
            </button>

            <button
              onClick={() => handleWalletSelect('backpack')}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-center transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs mb-1">
                B
              </div>
              <span className="text-[11px] font-medium text-slate-300 group-hover:text-white block">Backpack</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 text-[10px] uppercase tracking-wider text-slate-500">
            atau login email non-custodial
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
          {tab === 'signup' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {roleInput === 'seller' ? 'Nama Usaha UMKM:' : 'Nama Lengkap:'}
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email ({roleInput}):</label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md disabled:opacity-50 ${
              roleInput === 'admin'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : roleInput === 'seller'
                ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {loading ? 'Memproses...' : `Lanjutkan Masuk Portal ${roleInput === 'admin' ? 'Admin' : roleInput === 'seller' ? 'Penjual' : 'Pembeli'} →`}
          </button>
        </form>

      </div>
    </div>
  );
};
