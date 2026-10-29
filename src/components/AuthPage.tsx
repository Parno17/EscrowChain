import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { PRESET_ACCOUNTS } from '../data/mockData';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles,
  Store,
  ShoppingBag,
  ShieldAlert,
  Coins,
  Cpu
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  initialRole?: 'buyer' | 'seller' | 'admin';
  onSuccess: (targetRole?: 'buyer' | 'seller' | 'admin') => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  initialRole = 'buyer',
  onSuccess,
  onBackToLanding
}) => {
  const { 
    loginWithWallet, 
    loginWithMetaMask,
    loginWithEmail, 
    registerWithEmail, 
    setActiveAccount 
  } = useWeb3();

  // Role separation: 'buyer' | 'seller' | 'admin'
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'admin'>(initialRole);
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Pre-fill email depending on selected role
  const getRoleDefaultEmail = (r: 'buyer' | 'seller' | 'admin') => {
    if (r === 'buyer') return 'z.alimatus@students.amikom.ac.id';
    if (r === 'seller') return 'parno.elektronik@gadget-official.id';
    return 'admin.escrow@amikom.ac.id';
  };

  const getRoleDefaultName = (r: 'buyer' | 'seller' | 'admin') => {
    if (r === 'buyer') return 'Zayyini Alimatus';
    if (r === 'seller') return 'Sentra Gadget Elektronik';
    return 'M. Reza D. Nur (Admin Vault)';
  };

  const [email, setEmail] = useState(() => getRoleDefaultEmail(initialRole));
  const [password, setPassword] = useState('Amanah2026!Sol');
  const [confirmPassword, setConfirmPassword] = useState('Amanah2026!Sol');
  const [name, setName] = useState(() => getRoleDefaultName(initialRole));
  const [securityPhrase, setSecurityPhrase] = useState('Garuda-Solana-Proteksi-2026');
  const [adminSecurityKey, setAdminSecurityKey] = useState('AMIKOM-ROOT-MULTISIG-9988');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleRoleChange = (newRole: 'buyer' | 'seller' | 'admin') => {
    setSelectedRole(newRole);
    setEmail(getRoleDefaultEmail(newRole));
    setName(getRoleDefaultName(newRole));
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const handleMetaMaskLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await loginWithMetaMask(selectedRole);
      setIsLoading(false);
      if (res.success) {
        onSuccess(selectedRole);
      } else {
        setErrorMessage(res.error || 'Gagal terhubung dengan MetaMask.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Koneksi MetaMask gagal: ' + (err.message || 'Error'));
    }
  };

  const handleWalletLogin = async (walletType: 'phantom' | 'solflare' | 'backpack') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithWallet(walletType);
      // Synchronize role
      const matched = PRESET_ACCOUNTS.find(a => a.role === selectedRole);
      if (matched) {
        setActiveAccount(matched);
      }
      setIsLoading(false);
      onSuccess(selectedRole);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Gagal menghubungkan dompet Solana: ' + (err.message || 'Koneksi ditolak'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }

    if (selectedRole === 'admin' && mode === 'signin' && !adminSecurityKey) {
      setErrorMessage('Kunci otentikasi Root Multi-Sig Admin wajib dimasukkan.');
      return;
    }

    if (mode === 'signup') {
      if (!name) {
        setErrorMessage('Nama atau nama usaha UMKM wajib diisi.');
        return;
      }
      if (!password) {
        setErrorMessage('Kata sandi wajib diisi.');
        return;
      }
      if (!confirmPassword) {
        setErrorMessage('Konfirmasi kata sandi wajib diisi.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Konfirmasi kata sandi tidak cocok.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('Anda harus menyetujui ketentuan layanan EscrowChain.');
        return;
      }

      setIsLoading(true);
      await registerWithEmail(email, name, selectedRole, securityPhrase);
      setIsLoading(false);
      onSuccess(selectedRole);
    } else {
      setIsLoading(true);
      await loginWithEmail(email, name || undefined, selectedRole);
      setIsLoading(false);
      onSuccess(selectedRole);
    }
  };

  const handleQuickDemoByRole = () => {
    if (selectedRole === 'buyer') {
      setActiveAccount(PRESET_ACCOUNTS[0]);
    } else if (selectedRole === 'seller') {
      setActiveAccount(PRESET_ACCOUNTS[1]);
    } else {
      setActiveAccount(PRESET_ACCOUNTS[2]);
    }
    onSuccess(selectedRole);
  };

  const handleForgotPassword = () => {
    setInfoMessage('Tautan pemulihan kata sandi non-custodial telah dikirim ke ' + (email || 'email Anda') + '.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Bar with Back Link */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda EscrowChain</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Solana Anchor Network</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 font-semibold">Amanah ($AMN) Token</span>
        </div>
      </header>

      {/* Main Centered Login Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-lg space-y-5">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div 
              onClick={onBackToLanding}
              className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-1 shadow-lg transition-colors cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-indigo-500/10'
                  : selectedRole === 'seller'
                  ? 'bg-teal-500/10 border border-teal-500/30 text-teal-400 shadow-teal-500/10'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
              }`}
            >
              {selectedRole === 'admin' ? (
                <Lock className="w-6 h-6" />
              ) : selectedRole === 'seller' ? (
                <Store className="w-6 h-6" />
              ) : (
                <ShoppingBag className="w-6 h-6" />
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              {selectedRole === 'buyer' && (mode === 'signin' ? 'Login Portal Pembeli' : 'Daftar Akun Pembeli')}
              {selectedRole === 'seller' && (mode === 'signin' ? 'Login Portal Penjual UMKM' : 'Daftar Mitra Penjual')}
              {selectedRole === 'admin' && (mode === 'signin' ? 'Login Portal Admin & Arbiter' : 'Registrasi Otoritas Multi-Sig')}
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {selectedRole === 'buyer' && 'Akses belanja aman barang elektronik UMKM dengan jaminan auto-refund dan cashback $AMN.'}
              {selectedRole === 'seller' && 'Kelola etalase produk UMKM, unggah foto barang, kirim resi, dan klaim bonus 40% DeFi yield.'}
              {selectedRole === 'admin' && 'Otoritas DAO Multi-Sig untuk approve pelepasan dana escrow, verifikasi refund, dan arbitrase.'}
            </p>
          </div>

          {/* STEP 1: PEMISAH LOGIN PERAN (BUYER, SELLER, ADMIN) */}
          <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
              Pilih Portal Akses Login:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleRoleChange('buyer')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'buyer'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Pembeli</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('seller')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'seller'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Store className="w-4 h-4 shrink-0" />
                <span>Penjual</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Card Container */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md space-y-4">
            
            {/* Quick 1-Click Demo Login Button for Selected Role */}
            <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
              selectedRole === 'admin'
                ? 'bg-indigo-950/40 border-indigo-500/40'
                : selectedRole === 'seller'
                ? 'bg-teal-950/40 border-teal-500/40'
                : 'bg-emerald-950/40 border-emerald-500/40'
            }`}>
              <div className="text-xs">
                <span className="font-bold text-white block">
                  {selectedRole === 'buyer' && '🚀 Masuk Langsung sbg Pembeli (Zayyini)'}
                  {selectedRole === 'seller' && '🏪 Masuk Langsung sbg Penjual (Parno Husni)'}
                  {selectedRole === 'admin' && '🛡️ Masuk Langsung sbg Admin Multi-Sig (Reza)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedRole === 'buyer' && 'Saldo: 14.50 SOL · Riwayat Pesanan & Refund Aktif'}
                  {selectedRole === 'seller' && 'Saldo: 38.25 SOL · Manajemen Produk & Order Toko'}
                  {selectedRole === 'admin' && 'Saldo: 450.00 SOL · Otoritas Approve Lepas Dana'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoByRole}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer shrink-0 transition-transform hover:scale-105 ${
                  selectedRole === 'admin'
                    ? 'bg-indigo-500 text-white hover:bg-indigo-400'
                    : selectedRole === 'seller'
                    ? 'bg-teal-400 text-slate-950 hover:bg-teal-300'
                    : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                }`}
              >
                1-Klik Masuk →
              </button>
            </div>

            {/* Segmented Auth Mode Switcher (Sign in vs Sign up) */}
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-slate-800 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Masuk (Sign In)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setConfirmPassword(password);
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-slate-800 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Daftar Baru (Sign Up)
              </button>
            </div>

            {/* Notification Messages */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs">
                {errorMessage}
              </div>
            )}
            {infoMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs">
                {infoMessage}
              </div>
            )}

            {/* Featured MetaMask Web3 Login Button */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>Login dengan Dompet MetaMask (EVM / Sepolia):</span>
                <span className="font-mono text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded">Rekomendasi Web3</span>
              </span>
              
              <button
                type="button"
                onClick={handleMetaMaskLogin}
                disabled={isLoading}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 hover:border-amber-400 text-left transition-all cursor-pointer shadow-lg shadow-amber-950/30 group disabled:opacity-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    🦊
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Hubungkan MetaMask</span>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold px-1 rounded bg-amber-500/20">
                        {selectedRole === 'admin' ? 'Admin Vault' : selectedRole === 'seller' ? 'Penjual UMKM' : 'Pembeli'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Otentikasi 1-klik dengan browser extension MetaMask atau akun tes EVM
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Alternatif Dompet Web3 Lainnya */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Atau Dompet Web3 Lainnya ({selectedRole.toUpperCase()}):
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={handleMetaMaskLogin}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-center transition-all cursor-pointer group disabled:opacity-50"
                  title="Masuk dengan MetaMask"
                >
                  <div className="w-5 h-5 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-1 group-hover:scale-110 transition-transform">
                    🦊
                  </div>
                  <span className="text-[11px] font-medium text-amber-300 group-hover:text-white block">MetaMask</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWalletLogin('phantom')}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-center transition-all cursor-pointer group disabled:opacity-50"
                  title="Masuk dengan Phantom Solana"
                >
                  <div className="w-5 h-5 mx-auto rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-1 group-hover:scale-110 transition-transform">
                    P
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 group-hover:text-white block">Phantom</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWalletLogin('solflare')}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-center transition-all cursor-pointer group disabled:opacity-50"
                  title="Masuk dengan Solflare"
                >
                  <div className="w-5 h-5 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-1 group-hover:scale-110 transition-transform">
                    S
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 group-hover:text-white block">Solflare</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWalletLogin('backpack')}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-center transition-all cursor-pointer group disabled:opacity-50"
                  title="Masuk dengan Backpack"
                >
                  <div className="w-5 h-5 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs mb-1 group-hover:scale-110 transition-transform">
                    B
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 group-hover:text-white block">Backpack</span>
                </button>
              </div>
            </div>

            {/* Standard Form Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-slate-900 px-3 text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                atau kredensial email {selectedRole}
              </span>
            </div>

            {/* Standard Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              
              {mode === 'signup' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {selectedRole === 'seller' ? 'Nama Toko / Usaha UMKM:' : selectedRole === 'admin' ? 'Nama Lengkap Otoritas Admin:' : 'Nama Lengkap Pembeli:'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={selectedRole === 'seller' ? 'Sentra Gadget Nusantara' : 'Nama Anda'}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Alamat Email ({selectedRole}):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Admin Root Passkey Requirement */}
              {selectedRole === 'admin' && (
                <div>
                  <label className="block text-indigo-300 font-medium mb-1 flex items-center justify-between">
                    <span>Root Multi-Sig Security Key:</span>
                    <span className="text-[10px] text-indigo-400 font-mono">Quorum 3/5 Required</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={adminSecurityKey}
                      onChange={(e) => setAdminSecurityKey(e.target.value)}
                      placeholder="AMIKOM-ROOT-MULTISIG-9988"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-indigo-500/40 rounded-lg text-indigo-300 font-mono focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">Kata Sandi</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                    >
                      Lupa sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi (Saat Sign Up / Daftar Baru) */}
              {mode === 'signup' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-medium">Konfirmasi Kata Sandi:</label>
                    {confirmPassword && (
                      <span className={`text-[10px] font-medium flex items-center gap-1 ${
                        password === confirmPassword ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {password === confirmPassword ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Sandi cocok</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3" />
                            <span>Belum cocok</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi Anda"
                      className={`w-full pl-9 pr-10 py-2 bg-slate-950 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-rose-500/60 focus:border-rose-500'
                          : confirmPassword && password === confirmPassword
                          ? 'border-emerald-500/60 focus:border-emerald-500'
                          : 'border-slate-800 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Frasa Anti-Phishing:</label>
                  <input
                    type="text"
                    required
                    value={securityPhrase}
                    onChange={(e) => setSecurityPhrase(e.target.value)}
                    placeholder="Frasa rahasia unik"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Ketentuan Layanan (Sign Up) / Remember Me (Sign In) */}
              {mode === 'signup' ? (
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
                    Saya menyetujui Ketentuan Layanan & Protokol Smart Contract EscrowChain.
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Ingat sesi saya di perangkat ini</span>
                  </label>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md disabled:opacity-50 mt-2 ${
                  selectedRole === 'admin'
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                    : selectedRole === 'seller'
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {isLoading 
                  ? 'Memvalidasi Kunci Solana...' 
                  : mode === 'signin' 
                  ? `Masuk ke Portal ${selectedRole === 'admin' ? 'Admin' : selectedRole === 'seller' ? 'Penjual' : 'Pembeli'} →` 
                  : `Daftar Akun ${selectedRole === 'admin' ? 'Admin' : selectedRole === 'seller' ? 'Penjual' : 'Pembeli'} →`}
              </button>
            </form>

          </div>

          {/* Bottom Switch Mode Link */}
          <div className="text-center text-xs text-slate-400">
            {mode === 'signin' ? (
              <p>
                Belum memiliki akun EscrowChain?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setConfirmPassword(password);
                  }}
                  className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                >
                  Daftar sekarang ({selectedRole})
                </button>
              </p>
            ) : (
              <p>
                Sudah memiliki akun?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                >
                  Masuk di sini ({selectedRole})
                </button>
              </p>
            )}
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="px-6 py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        EscrowChain Web3 · Rekening Bersama Terdesentralisasi Solana · Terpisah untuk Pembeli, Penjual, dan Admin Multi-Sig
      </footer>

    </div>
  );
};
