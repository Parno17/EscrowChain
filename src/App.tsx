import React, { useState } from 'react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { OrderCard } from './components/OrderCard';
import { OrderDetailModal } from './components/OrderDetailModal';
import { CreateOrderModal } from './components/CreateOrderModal';
import { WalletModal } from './components/WalletModal';
import { LoginModal } from './components/LoginModal';
import { BuyerPortal } from './components/BuyerPortal';
import { SellerPortal } from './components/SellerPortal';
import { AdminVaultPortal } from './components/AdminVaultPortal';
import { SequenceDiagramView } from './components/SequenceDiagramView';
import { AmanahDefiHub } from './components/AmanahDefiHub';
import { WhitepaperView } from './components/WhitepaperView';
import { SolanaAuditView } from './components/SolanaAuditView';
import { UserSecurityModal } from './components/UserSecurityModal';
import { AcademicReportModal } from './components/AcademicReportModal';
import { SolanaExplorerModal } from './components/SepoliaExplorerModal';
import { EscrowOrder, OrderStatus, InitiatorType } from './types/escrow';
import { SOL_IDR_RATE, AMN_IDR_RATE, PRESET_ACCOUNTS, SOLANA_PROGRAM_ID } from './data/mockData';
import { 
  ShieldCheck, 
  Wallet, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Plus, 
  ExternalLink, 
  X, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  Coins,
  GitBranch,
  LogIn,
  ShoppingBag,
  TrendingUp,
  Lock,
  KeyRound,
  FileCode,
  FileText,
  GraduationCap
} from 'lucide-react';

function DashboardContent() {
  const { 
    orders, 
    activeAccount, 
    setActiveAccount, 
    userAuth,
    notification, 
    dismissNotification, 
    requestSolFaucet,
    requestAmnAirdrop,
    simulatedTimeOffsetMs,
    advanceSimulatedTime,
    resetSimulatedTime
  } = useWeb3();

  // Active Tab: starts with 'landing' as requested
  const [activeTab, setActiveTab] = useState<
    'landing' | 'auth' | 'buyer' | 'seller' | 'admin' | 'defi' | 'sequence' | 'whitepaper' | 'audit'
  >('landing');

  // Initial mode for dedicated Auth page ('signin' or 'signup')
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  const [selectedOrder, setSelectedOrder] = useState<EscrowOrder | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
  const [explorerTxHash, setExplorerTxHash] = useState<string | null>(null);

  // Guard: If logged out and not on landing or auth, redirect to Auth
  React.useEffect(() => {
    if (!userAuth.isLoggedIn && activeTab !== 'landing' && activeTab !== 'auth') {
      setActiveTab('auth');
    }
  }, [userAuth.isLoggedIn, activeTab]);

  // Guard: Role-based Tab Access Separation (Pembeli hanya portal pembeli, Penjual hanya penjual, Admin hanya admin)
  React.useEffect(() => {
    if (userAuth.isLoggedIn) {
      const currentRole = activeAccount.role || userAuth.role || 'buyer';
      if (currentRole === 'buyer' && (activeTab === 'seller' || activeTab === 'admin' || activeTab === 'audit')) {
        setActiveTab('buyer');
      } else if (currentRole === 'seller' && (activeTab === 'buyer' || activeTab === 'admin' || activeTab === 'audit')) {
        setActiveTab('seller');
      } else if ((currentRole === 'admin' || currentRole === 'arbiter') && (activeTab === 'buyer' || activeTab === 'seller')) {
        setActiveTab('admin');
      }
    }
  }, [activeAccount.role, userAuth.role, userAuth.isLoggedIn, activeTab]);

  // If on Landing Page, render the marketing & showcase landing page with direct CTAs to Auth
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={(targetTab) => setActiveTab(targetTab || 'buyer')}
          onOpenAuth={(mode) => {
            setAuthInitialMode(mode || 'signin');
            setActiveTab('auth');
          }}
          onOpenWhitepaper={() => setActiveTab('whitepaper')}
          onOpenAcademicReport={() => setIsAcademicModalOpen(true)}
          onOpenAudit={() => setActiveTab('audit')}
        />

        {/* Academic Research Archive Modal */}
        <AcademicReportModal
          isOpen={isAcademicModalOpen}
          onClose={() => setIsAcademicModalOpen(false)}
        />
      </>
    );
  }

  // If on dedicated standalone Auth Page (Sign In & Sign Up like standard web apps)
  if (activeTab === 'auth') {
    return (
      <>
        <AuthPage
          initialMode={authInitialMode}
          onSuccess={(targetRole) => {
            if (targetRole === 'admin') setActiveTab('admin');
            else if (targetRole === 'seller') setActiveTab('seller');
            else setActiveTab('buyer');
          }}
          onBackToLanding={() => setActiveTab('landing')}
        />

        <AcademicReportModal
          isOpen={isAcademicModalOpen}
          onClose={() => setIsAcademicModalOpen(false)}
        />
      </>
    );
  }

  // If on Whitepaper view, render full-screen interactive whitepaper
  if (activeTab === 'whitepaper') {
    return (
      <>
        <WhitepaperView
          onBackToApp={() => setActiveTab('buyer')}
          onOpenAudit={() => setActiveTab('audit')}
          onOpenAcademicReport={() => setIsAcademicModalOpen(true)}
        />

        <AcademicReportModal
          isOpen={isAcademicModalOpen}
          onClose={() => setIsAcademicModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreateModal={() => setIsCreateModalOpen(true)}
        openWalletModal={() => setIsWalletModalOpen(true)}
        openSecurityModal={() => setIsSecurityModalOpen(true)}
        openAcademicReport={() => setIsAcademicModalOpen(true)}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-slide-up">
          <div
            className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : 'bg-indigo-950/90 border-indigo-500/40 text-indigo-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : notification.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs leading-relaxed">
              <p className="font-semibold text-white mb-0.5">
                {notification.type === 'success' ? 'Transaksi Solana Terkonfirmasi' : notification.type === 'error' ? 'Peringatan Kontrak / Revert' : 'Informasi Protokol Amanah'}
              </p>
              <p>{notification.message}</p>
              {notification.txHash && (
                <button
                  onClick={() => setExplorerTxHash(notification.txHash || null)}
                  className="mt-1 text-[11px] underline font-mono text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat di Solana Explorer ({notification.txHash.slice(0, 10)}...)</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={dismissNotification}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-5 space-y-6">
        
        {/* Quick Simulation Toolbar */}
        <section className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pemisah Akses Peran:
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                activeAccount.role === 'admin'
                  ? 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300'
                  : activeAccount.role === 'seller'
                  ? 'bg-teal-950/70 border-teal-500/40 text-teal-300'
                  : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
              }`}>
                {activeAccount.role === 'admin'
                  ? '🔒 Tab Terkunci: Hanya Fitur Admin Multi-Sig'
                  : activeAccount.role === 'seller'
                  ? '🏪 Tab Terkunci: Hanya Fitur Penjual UMKM'
                  : '🛒 Tab Terkunci: Hanya Fitur Pembeli'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              {PRESET_ACCOUNTS.slice(0, 3)
                .filter((acc) => {
                  const currentRole = activeAccount.role || userAuth.role || 'buyer';
                  if (currentRole === 'buyer') return acc.role === 'buyer';
                  if (currentRole === 'seller') return acc.role === 'seller';
                  if (currentRole === 'admin' || currentRole === 'arbiter') return acc.role === 'admin' || acc.role === 'arbiter';
                  return acc.role === currentRole;
                })
                .map((acc) => {
                  const isActive = activeAccount.address.toLowerCase() === acc.address.toLowerCase();
                  return (
                    <button
                      key={acc.address}
                      onClick={() => {
                        setActiveAccount(acc);
                        if (acc.role === 'buyer') setActiveTab('buyer');
                        else if (acc.role === 'seller') setActiveTab('seller');
                        else if (acc.role === 'admin' || acc.role === 'arbiter') setActiveTab('admin');
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? acc.role === 'admin' || acc.role === 'arbiter'
                            ? 'bg-indigo-600 text-white shadow-sm font-bold'
                            : acc.role === 'seller'
                            ? 'bg-teal-500 text-slate-950 shadow-sm font-bold'
                            : 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {acc.label}
                    </button>
                  );
                })}
            </div>
            <span className="text-xs text-slate-400 font-mono hidden xl:inline">
              {activeAccount.name} ({activeAccount.balanceSol.toFixed(2)} SOL · {activeAccount.balanceAmn} AMN)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Faucets */}
            <button
              onClick={() => requestSolFaucet(2.0)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
              title="Airdrop +2.0 SOL ke dompet aktif"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>+2.0 SOL</span>
            </button>

            <button
              onClick={() => requestAmnAirdrop(500)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-lg transition-colors cursor-pointer"
              title="Airdrop +500 AMN token ke dompet aktif"
            >
              <span>+500 AMN</span>
            </button>

            {/* Time Simulation */}
            {simulatedTimeOffsetMs > 0 ? (
              <button
                onClick={resetSimulatedTime}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
                title="Waktu dimajukan. Klik untuk reset."
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Reset Waktu</span>
              </button>
            ) : (
              <button
                onClick={() => advanceSimulatedTime(4)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Majukan waktu simulasi +4 hari untuk menguji proteksi deadline & auto-refund"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>+4 Hari (Deadline)</span>
              </button>
            )}

            {/* Security Suite Shortcut */}
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Pusat Keamanan & Anti-Phishing Pengguna"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </section>

        {/* TAB 1: PORTAL PEMBELI */}
        {activeTab === 'buyer' && (
          <BuyerPortal />
        )}

        {/* TAB 2: PORTAL PENJUAL */}
        {activeTab === 'seller' && (
          <SellerPortal />
        )}

        {/* TAB 3: AMANAH DEFI HUB ($AMN) */}
        {activeTab === 'defi' && (
          <AmanahDefiHub />
        )}

        {/* TAB 4: PORTAL ADMIN VAULT */}
        {activeTab === 'admin' && (
          <AdminVaultPortal />
        )}

        {/* TAB 5: DIAGRAM SEKUENSIAL */}
        {activeTab === 'sequence' && (
          <SequenceDiagramView onOpenOrderModal={() => setIsCreateModalOpen(true)} />
        )}

        {/* TAB 6: SMART CONTRACT ANCHOR AUDIT */}
        {activeTab === 'audit' && (
          <SolanaAuditView />
        )}

      </main>

      {/* Global Application Footer matching Landing Page */}
      <footer className="py-6 sm:py-8 bg-slate-950 text-slate-500 text-xs border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">EscrowChain Web3</span>
            <span>·</span>
            <span>Solana Anchor Rekening Bersama UMKM · Token Amanah ($AMN)</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-slate-400">
            <button
              onClick={() => setIsAcademicModalOpen(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Dokumen Riset Kelompok 2 (PDF)
            </button>
            <button
              onClick={() => setActiveTab('whitepaper')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Whitepaper
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Audit Kontrak
            </button>
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Keamanan & Anti-Phishing
            </button>
          </div>
        </div>
      </footer>

      {/* User Security Center Modal */}
      <UserSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Decoupled Academic Research Report Modal */}
      <AcademicReportModal
        isOpen={isAcademicModalOpen}
        onClose={() => setIsAcademicModalOpen(false)}
      />

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOpenExplorerTx={(txHash) => setExplorerTxHash(txHash)}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Wallet Management Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
      />

      {/* Login / Connect Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectRoleTab={(role) => {
          if (role === 'admin') setActiveTab('admin');
          else if (role === 'seller') setActiveTab('seller');
          else setActiveTab('buyer');
        }}
      />

      {/* Solana Explorer Modal */}
      <SolanaExplorerModal
        txHash={explorerTxHash}
        onClose={() => setExplorerTxHash(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <DashboardContent />
    </Web3Provider>
  );
}
