import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { 
  ShieldCheck, 
  ChevronDown, 
  Coins, 
  Lock, 
  TrendingUp, 
  BookOpen, 
  FileCode, 
  ShieldAlert, 
  Home, 
  GraduationCap,
  LogIn,
  LogOut,
  Store,
  ShoppingBag,
  User,
  GitBranch,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { PRESET_ACCOUNTS } from '../data/mockData';

interface NavbarProps {
  activeTab: 'landing' | 'auth' | 'buyer' | 'seller' | 'admin' | 'defi' | 'sequence' | 'whitepaper' | 'audit';
  setActiveTab: (tab: 'landing' | 'auth' | 'buyer' | 'seller' | 'admin' | 'defi' | 'sequence' | 'whitepaper' | 'audit') => void;
  openCreateModal: () => void;
  openWalletModal: () => void;
  openSecurityModal: () => void;
  openAcademicReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openCreateModal,
  openWalletModal,
  openSecurityModal,
  openAcademicReport
}) => {
  const { activeAccount, userAuth, logout, setActiveAccount } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const currentRole = activeAccount.role || userAuth.role || 'buyer';
  const isMetaMask = userAuth.method === 'metamask' || activeAccount.authMethod === 'metamask';

  const handleSwitchRole = (role: 'buyer' | 'seller' | 'admin') => {
    const matched = PRESET_ACCOUNTS.find(a => a.role === role) || PRESET_ACCOUNTS[0];
    setActiveAccount(matched);
    if (role === 'buyer') setActiveTab('buyer');
    else if (role === 'seller') setActiveTab('seller');
    else if (role === 'admin') setActiveTab('admin');
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('auth');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Zone 1: Wordmark: EscrowChain */}
        <div 
          onClick={() => setActiveTab('landing')} 
          className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 cursor-pointer group"
          title="Kembali ke Beranda EscrowChain"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <ShieldCheck className="w-5 h-5 group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5 leading-tight">
              EscrowChain <span className="text-emerald-400 font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">Web3 Rekber</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links DITERAPKAN SESUAI PERAN AKTIF (BUYER / SELLER / ADMIN) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium">
          
          {/* TAB PORTAL KHUSUS PEMBELI (Hanya tampil saat peran Pembeli) */}
          {currentRole === 'buyer' && (
            <>
              <button
                onClick={() => setActiveTab('buyer')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'buyer' 
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal Pembeli</span>
              </button>

              <button
                onClick={() => setActiveTab('defi')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'defi' 
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>DeFi & Cashback</span>
              </button>

              <button
                onClick={() => setActiveTab('sequence')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'sequence' 
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5 text-teal-400" />
                <span>Alur Transaksi</span>
              </button>

              <button
                onClick={() => setActiveTab('whitepaper')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'whitepaper' 
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Whitepaper</span>
              </button>
            </>
          )}

          {/* TAB PORTAL KHUSUS PENJUAL (Hanya tampil saat peran Penjual) */}
          {currentRole === 'seller' && (
            <>
              <button
                onClick={() => setActiveTab('seller')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'seller' 
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 font-bold shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-teal-400" />
                <span>Portal Penjual UMKM</span>
              </button>

              <button
                onClick={() => setActiveTab('defi')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'defi' 
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                <span>Insentif Toko</span>
              </button>

              <button
                onClick={() => setActiveTab('sequence')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'sequence' 
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5 text-teal-400" />
                <span>Alur Pengiriman</span>
              </button>

              <button
                onClick={() => setActiveTab('whitepaper')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'whitepaper' 
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Whitepaper</span>
              </button>
            </>
          )}

          {/* TAB PORTAL KHUSUS ADMIN & ARBITER (Hanya tampil saat peran Admin) */}
          {(currentRole === 'admin' || currentRole === 'arbiter') && (
            <>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'admin' 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Portal Admin Multi-Sig</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'audit' 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Audit Kontrak</span>
              </button>

              <button
                onClick={() => setActiveTab('defi')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'defi' 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Treasury & Burn</span>
              </button>

              <button
                onClick={() => setActiveTab('sequence')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'sequence' 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                <span>Alur Rekber</span>
              </button>

              <button
                onClick={() => setActiveTab('whitepaper')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'whitepaper' 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Whitepaper</span>
              </button>
            </>
          )}

        </nav>

        {/* Zone 3: Actions, Wallet, Switch Role, & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* MetaMask Indicator Pill if connected via MetaMask */}
          {isMetaMask && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-sm" title="Terhubung melalui dompet MetaMask EVM">
              <span>🦊</span>
              <span>MetaMask</span>
            </div>
          )}

          {/* Interactive Role Badge with Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60'
                  : currentRole === 'seller'
                  ? 'bg-teal-950/70 border-teal-500/40 text-teal-300 hover:bg-teal-900/60'
                  : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
              }`}
              title="Akses peran Anda saat ini (Terkunci sesuai login)"
            >
              <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
              <span>
                {currentRole === 'admin' ? '🛡️ Admin Multi-Sig' : currentRole === 'seller' ? '🏪 Penjual UMKM' : '👤 Pembeli'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Role Dropdown */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2.5 z-50 text-xs animate-slide-up space-y-2">
                <div className="px-1 text-[10px] uppercase font-semibold text-slate-400">
                  Status Akses Peran:
                </div>
                
                <div className={`p-2 rounded-lg border font-semibold flex items-center justify-between ${
                  currentRole === 'admin'
                    ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                    : currentRole === 'seller'
                    ? 'bg-teal-500/15 border-teal-500/30 text-teal-300'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                }`}>
                  <span className="flex items-center gap-2">
                    {currentRole === 'admin' ? <Lock className="w-4 h-4 text-indigo-400" /> : currentRole === 'seller' ? <Store className="w-4 h-4 text-teal-400" /> : <ShoppingBag className="w-4 h-4 text-emerald-400" />}
                    <span>{currentRole === 'admin' ? 'Portal Admin Vault' : currentRole === 'seller' ? 'Portal Penjual UMKM' : 'Portal Pembeli'}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 font-bold">Aktif</span>
                </div>

                <div className="px-1 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                  Akses peran lain dikunci demi keamanan. Untuk beralih ke portal lain, silakan keluar dari akun saat ini.
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 text-rose-300 hover:bg-rose-500/15 border border-rose-500/30 font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Keluar & Ganti Peran</span>
                </button>
              </div>
            )}
          </div>

          {/* Account & Wallet Details */}
          <button
            onClick={openWalletModal}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-950/80 border border-slate-700/80 text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Kelola Akun & Saldo Web3"
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isMetaMask ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isMetaMask ? '🦊' : '◎'}
            </div>
            <span className="font-semibold text-white max-w-[80px] truncate hidden sm:inline">
              {activeAccount.name.split(' ')[0]}
            </span>
            <span className="text-emerald-400 font-mono font-bold tabular-nums">
              {activeAccount.balanceSol.toFixed(2)} SOL
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Academic Archive Shortcut */}
          <button
            onClick={openAcademicReport}
            className="hidden md:flex p-1.5 sm:p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Buka Dokumen Riset Kelompok 2 AMIKOM (PDF)"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Security Suite Shortcut */}
          <button
            onClick={openSecurityModal}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            title="Pusat Keamanan & Anti-Phishing Pengguna"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* TOMBOL LOGOUT (FITUR KELUAR) */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-100 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-rose-950/20"
            title="Keluar dari akun Anda (Logout)"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Keluar</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 space-y-2 text-xs animate-slide-up">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Menu Navigasi ({currentRole === 'admin' ? 'Admin' : currentRole === 'seller' ? 'Penjual' : 'Pembeli'}):
          </div>

          {currentRole === 'buyer' && (
            <>
              <button
                onClick={() => { setActiveTab('buyer'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Portal Pembeli</span>
              </button>
              <button
                onClick={() => { setActiveTab('defi'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>DeFi Cashback ($AMN)</span>
              </button>
              <button
                onClick={() => { setActiveTab('sequence'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center gap-2"
              >
                <GitBranch className="w-4 h-4 text-teal-400" />
                <span>Alur Transaksi</span>
              </button>
            </>
          )}

          {currentRole === 'seller' && (
            <>
              <button
                onClick={() => { setActiveTab('seller'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg bg-teal-500/15 text-teal-300 font-bold flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Portal Penjual</span>
              </button>
              <button
                onClick={() => { setActiveTab('defi'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <span>DeFi Insentif Toko ($AMN)</span>
              </button>
              <button
                onClick={() => { setActiveTab('sequence'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center gap-2"
              >
                <GitBranch className="w-4 h-4 text-teal-400" />
                <span>Alur Pengiriman</span>
              </button>
            </>
          )}

          {(currentRole === 'admin' || currentRole === 'arbiter') && (
            <>
              <button
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Portal Admin Multi-Sig</span>
              </button>
              <button
                onClick={() => { setActiveTab('audit'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center gap-2"
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>Audit Smart Contract</span>
              </button>
              <button
                onClick={() => { setActiveTab('defi'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Treasury & Burn ($AMN)</span>
              </button>
            </>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => { setActiveTab('whitepaper'); setMobileMenuOpen(false); }}
              className="py-1.5 px-2 text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Whitepaper</span>
            </button>
            <button
              onClick={handleLogout}
              className="py-1.5 px-3 rounded-lg bg-rose-500/10 text-rose-300 font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
