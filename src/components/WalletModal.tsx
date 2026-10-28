import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Check, Wallet, LogOut, RefreshCw, PlusCircle, User, LogIn, KeyRound, Coins, ShieldCheck } from 'lucide-react';
import { SOL_IDR_RATE, AMN_IDR_RATE } from '../data/mockData';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLoginModal?: () => void;
  onOpenSecurityModal?: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpenLoginModal,
  onOpenSecurityModal 
}) => {
  const {
    allAccounts,
    activeAccount,
    setActiveAccount,
    userAuth,
    logout,
    loginWithWallet,
    loginWithMetaMask,
    requestSolFaucet,
    requestAmnAirdrop,
    simulatedTimeOffsetMs,
    advanceSimulatedTime,
    resetSimulatedTime
  } = useWeb3();

  if (!isOpen) return null;

  const isMetaMask = userAuth.method === 'metamask' || activeAccount.authMethod === 'metamask';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Current Auth Profile Card */}
        <div className="mb-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isMetaMask ? 'Dompet Web3 MetaMask Aktif' : 'Dompet Solana Web3 Aktif'}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${
              isMetaMask 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {isMetaMask ? '🦊 MetaMask (EVM/Sepolia)' : '◎ Solana Engine'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
              isMetaMask ? 'bg-amber-500/20 text-amber-400 text-lg' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isMetaMask ? '🦊' : '◎'}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{activeAccount.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {activeAccount.role === 'admin' ? 'Admin' : activeAccount.role === 'seller' ? 'Penjual' : 'Pembeli'}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {activeAccount.address.slice(0, 10)}...{activeAccount.address.slice(-6)}
              </div>
            </div>
          </div>

          {/* Balance Breakdown */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Saldo SOL:</span>
              <div className="text-emerald-400 font-bold text-sm">
                {activeAccount.balanceSol.toFixed(2)} SOL
              </div>
              <div className="text-[10px] text-slate-400">
                ≈ Rp {Math.round(activeAccount.balanceSol * SOL_IDR_RATE).toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Saldo Token AMN:</span>
              <div className="text-teal-400 font-bold text-sm">
                {activeAccount.balanceAmn.toLocaleString()} AMN
              </div>
              <div className="text-[10px] text-slate-400">
                Staked: {activeAccount.stakedAmn} AMN
              </div>
            </div>
          </div>

          {/* Anti-phishing phrase banner */}
          <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-Phishing:</span>
            </div>
            <span className="text-emerald-400 font-bold">"{activeAccount.securityPhrase}"</span>
          </div>
        </div>

        {/* Faucet Actions */}
        <div className="mb-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Devnet Testnet Faucets:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => requestSolFaucet(2.0)}
              className="py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>+2.0 SOL Faucet</span>
            </button>
            <button
              onClick={() => requestAmnAirdrop(500)}
              className="py-2 px-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+500 AMN Airdrop</span>
            </button>
          </div>
        </div>

        {/* Account Switcher */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Daftar Akun {activeAccount.role === 'admin' ? 'Admin' : activeAccount.role === 'seller' ? 'Penjual' : 'Pembeli'}:
          </span>
          <div className="space-y-1.5">
            {allAccounts
              .filter((acc) => {
                const currentRole = activeAccount.role || userAuth.role || 'buyer';
                if (currentRole === 'buyer') return acc.role === 'buyer';
                if (currentRole === 'seller') return acc.role === 'seller';
                if (currentRole === 'admin' || currentRole === 'arbiter') return acc.role === 'admin' || acc.role === 'arbiter';
                return acc.role === currentRole;
              })
              .map((acc) => {
              const isActive = activeAccount.address === acc.address;
              return (
                <button
                  key={acc.address}
                  onClick={() => setActiveAccount(acc)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs">
                    <div className="font-semibold text-white">{acc.name}</div>
                    <div className="text-[11px] text-slate-400">{acc.label}</div>
                  </div>
                  <div className="text-right text-xs font-mono">
                    <span className="text-emerald-400 font-bold">{acc.balanceSol.toFixed(2)} SOL</span>
                    <div className="text-[10px] text-slate-400">{acc.balanceAmn} AMN</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick MetaMask Connect Option */}
        <div className="mt-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-base">🦊</span>
            <div>
              <span className="text-white font-bold block">Masuk via MetaMask</span>
              <span className="text-[10px] text-amber-300">Otentikasi dengan browser wallet EVM / Sepolia</span>
            </div>
          </div>
          <button
            onClick={async () => {
              const targetRole = activeAccount.role === 'arbiter' ? 'admin' : (activeAccount.role || 'buyer');
              await loginWithMetaMask(targetRole);
              onClose();
            }}
            className="px-2.5 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Hubungkan →
          </button>
        </div>

        {/* Logout / Switch Wallet */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          {onOpenLoginModal && (
            <button
              onClick={() => {
                onClose();
                onOpenLoginModal();
              }}
              className="text-xs text-emerald-400 hover:underline cursor-pointer font-medium"
            >
              Ganti Akun / Dompet Lain
            </button>
          )}

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300 hover:text-rose-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Keluar Sesi (Logout)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
