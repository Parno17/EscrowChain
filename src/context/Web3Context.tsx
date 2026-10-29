import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  EscrowOrder, 
  OrderStatus, 
  Web3Account, 
  EscrowTxEvent, 
  UserAuth, 
  ElectronicProduct,
  InitiatorType,
  TokenomicsMetric 
} from '../types/escrow';
import { 
  PRESET_ACCOUNTS, 
  INITIAL_ORDERS, 
  INITIAL_ELECTRONIC_PRODUCTS,
  SOLANA_PROGRAM_ID,
  SOLANA_CLUSTER,
  SOL_IDR_RATE,
  AMN_IDR_RATE,
  SOL_TO_AMN_RATE,
  SOLANA_GAS_FEE_SOL,
  ETH_EQUIVALENT_GAS_IDR,
  TOKENOMICS_INFO,
  DEFI_YIELD_VAULT_PDA
} from '../data/mockData';

interface Web3ContextType {
  orders: EscrowOrder[];
  products: ElectronicProduct[];
  activeAccount: Web3Account;
  allAccounts: Web3Account[];
  userAuth: UserAuth;
  tokenomics: TokenomicsMetric;
  isProtocolPaused: boolean;
  currentSlot: number;
  simulatedTimeOffsetMs: number;
  currentSimulatedTime: number;
  notification: { type: 'success' | 'error' | 'info'; message: string; txHash?: string } | null;
  
  // Auth & Account Management
  loginWithWallet: (walletType: 'phantom' | 'solflare' | 'backpack') => Promise<void>;
  loginWithMetaMask: (role?: 'buyer' | 'seller' | 'admin') => Promise<{ success: boolean; address?: string; error?: string }>;
  loginWithEmail: (email: string, name?: string, role?: 'buyer' | 'seller' | 'admin') => Promise<void>;
  registerWithEmail: (email: string, name: string, role: 'buyer' | 'seller' | 'admin', securityPhrase?: string) => Promise<void>;
  logout: () => void;
  setActiveAccount: (account: Web3Account) => void;
  updateSecurityPhrase: (newPhrase: string) => void;

  // Time & Simulation
  advanceSimulatedTime: (days: number) => void;
  resetSimulatedTime: () => void;
  dismissNotification: () => void;
  requestSolFaucet: (amountSol?: number) => void;
  requestAmnAirdrop: (amountAmn?: number) => void;

  // PENJUAL ACTIONS (Solana Seller)
  uploadProduct: (productData: Omit<ElectronicProduct, 'id' | 'sellerAddress' | 'sellerName' | 'isAvailable'>) => Promise<boolean>;
  updateProduct: (productId: string, updatedData: Partial<ElectronicProduct>) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  sellerConfirmOrder: (orderId: number) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  sellerReportUnavailable: (orderId: number, reason: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  markShipped: (orderId: number, courierTracking?: string, courierName?: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;

  // PEMBELI ACTIONS (Solana Buyer)
  buyProduct: (params: {
    productId: string;
    productName: string;
    variation: string;
    quantity: number;
    amountSol: number;
    sellerAddress: string;
    notes?: string;
  }) => Promise<{ success: boolean; orderId?: number; txHash?: string; error?: string }>;
  confirmOrderCompleted: (orderId: number) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  buyerRequestRefund: (orderId: number, reason: string, proofNote?: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  claimTimeoutRefund: (orderId: number) => Promise<{ success: boolean; txHash?: string; error?: string }>;

  // DEFI & TOKENOMICS AMN ACTIONS
  stakeAmnTokens: (amountAmn: number) => Promise<{ success: boolean; txHash?: string }>;
  unstakeAmnTokens: (amountAmn: number) => Promise<{ success: boolean; txHash?: string }>;
  swapTokens: (fromToken: 'SOL' | 'AMN' | 'USDC', toToken: 'SOL' | 'AMN' | 'USDC', amountFrom: number) => Promise<{ success: boolean; receivedAmount: number; txHash?: string }>;

  // ADMIN / GOVERNANCE ACTIONS (Multi-Sig, Circuit Breaker, DAO Tribunal)
  adminReleaseFundsToSeller: (orderId: number, adminNotes?: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  adminReleaseRefundToBuyer: (orderId: number, adminNotes?: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  adminTriggerBuybackBurn: (amountAmn: number) => Promise<{ success: boolean; txHash?: string }>;
  adminToggleCircuitBreaker: () => void;
  adminVoteDisputeTribunal: (orderId: number, judgeName: string, vote: 'release_to_seller' | 'refund_to_buyer') => Promise<{ success: boolean; txHash?: string }>;

  // Helper
  getOrderById: (id: number) => EscrowOrder | undefined;

  // Dual-Inisiasi & Diagram Sekuensial Actions
  createOrderAsBuyer: (params: {
    seller: string;
    desc: string;
    daysToDeadline: number;
    amountSol: number;
    productName: string;
    category: string;
  }) => Promise<{ success: boolean; orderId?: number; txHash?: string; error?: string }>;
  sellerCreateInvoice: (params: {
    buyer: string;
    desc: string;
    daysToDeadline: number;
    amountSol: number;
    productName: string;
    category: string;
  }) => Promise<{ success: boolean; orderId?: number; txHash?: string; error?: string }>;
  depositSolTokens: (orderId: number) => Promise<{ success: boolean; txHash?: string; error?: string }>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Helper generate Solana-style Base58 Transaction Signature
function generateSolanaTxSignature(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 88; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper generate Solana PDA Address
function generateSolanaPda(orderId: number): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let pda = 'PDA' + orderId;
  while (pda.length < 44) {
    pda += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pda;
}

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<EscrowOrder[]>(() => {
    const saved = localStorage.getItem('amanah_solana_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [products, setProducts] = useState<ElectronicProduct[]>(() => {
    const saved = localStorage.getItem('amanah_solana_products');
    return saved ? JSON.parse(saved) : INITIAL_ELECTRONIC_PRODUCTS;
  });

  const [allAccounts, setAllAccounts] = useState<Web3Account[]>(() => {
    const saved = localStorage.getItem('amanah_solana_accounts');
    return saved ? JSON.parse(saved) : PRESET_ACCOUNTS;
  });

  const [activeAccount, setActiveAccountState] = useState<Web3Account>(() => {
    const saved = localStorage.getItem('amanah_solana_active_account');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return PRESET_ACCOUNTS[0]; // Pembeli
  });

  const [tokenomics, setTokenomics] = useState<TokenomicsMetric>(() => {
    const saved = localStorage.getItem('amanah_tokenomics');
    return saved ? JSON.parse(saved) : TOKENOMICS_INFO;
  });

  const [isProtocolPaused, setIsProtocolPaused] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(289410291);
  const [simulatedTimeOffsetMs, setSimulatedTimeOffsetMs] = useState(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string; txHash?: string } | null>(null);

  const [userAuth, setUserAuth] = useState<UserAuth>({
    isLoggedIn: true,
    method: 'phantom',
    displayName: activeAccount.name,
    walletAddress: activeAccount.address,
    role: activeAccount.role,
    securityPhrase: activeAccount.securityPhrase,
    reputationScore: activeAccount.reputationScore,
    stakedAmn: activeAccount.stakedAmn,
    vipTier: 'Amanah VIP Gold'
  });

  // Keep local storage in sync
  useEffect(() => {
    localStorage.setItem('amanah_solana_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('amanah_solana_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('amanah_solana_accounts', JSON.stringify(allAccounts));
  }, [allAccounts]);

  useEffect(() => {
    localStorage.setItem('amanah_solana_active_account', JSON.stringify(activeAccount));
    setUserAuth(prev => ({
      ...prev,
      displayName: activeAccount.name,
      walletAddress: activeAccount.address,
      role: activeAccount.role,
      securityPhrase: activeAccount.securityPhrase,
      reputationScore: activeAccount.reputationScore,
      stakedAmn: activeAccount.stakedAmn
    }));
  }, [activeAccount]);

  useEffect(() => {
    localStorage.setItem('amanah_tokenomics', JSON.stringify(tokenomics));
  }, [tokenomics]);

  // Tick Solana slot counter periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlot(prev => prev + 2); // Solana ~400ms per slot
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentSimulatedTime = Date.now() + simulatedTimeOffsetMs;

  const showNotification = (type: 'success' | 'error' | 'info', message: string, txHash?: string) => {
    setNotification({ type, message, txHash });
    if (type === 'success') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.85 }
      });
    }
  };

  const dismissNotification = () => setNotification(null);

  const setActiveAccount = (account: Web3Account) => {
    setActiveAccountState(account);
    showNotification('info', `Beralih ke akun: ${account.name} (${account.label})`);
  };

  // Auth Methods
  const loginWithWallet = async (walletType: 'phantom' | 'solflare' | 'backpack') => {
    const target = allAccounts.find(a => a.authMethod === walletType) || allAccounts[0];
    setActiveAccountState(target);
    setUserAuth({
      isLoggedIn: true,
      method: walletType,
      displayName: target.name,
      walletAddress: target.address,
      role: target.role,
      securityPhrase: target.securityPhrase,
      reputationScore: target.reputationScore,
      stakedAmn: target.stakedAmn,
      vipTier: target.stakedAmn >= 5000 ? 'Amanah VIP Gold' : 'Standard'
    });
    showNotification('success', `Terhubung dengan dompet Solana ${walletType.toUpperCase()}! Alamat: ${target.address.slice(0, 8)}...`);
  };

  const loginWithMetaMask = async (role: 'buyer' | 'seller' | 'admin' = 'buyer'): Promise<{ success: boolean; address?: string; error?: string }> => {
    try {
      let ethAddress = '';
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            ethAddress = accounts[0];
          }
        } catch (err: any) {
          console.warn('MetaMask user interaction note:', err);
        }
      }

      if (!ethAddress) {
        // Fallback realistic Ethereum Sepolia testnet address for simulation
        ethAddress = role === 'admin'
          ? '0x12FrEskRoWvaULT999AmnhTreasuryX11111'
          : role === 'seller'
          ? '0x89DbKaG9T5xM8rQ2pL7nVsF4wE6kZ1cY3888pX9'
          : '0x7Z1uYm8T4K3qB6hP2wRk9vLaE8nDcX5jM3490zK1';
      }

      let existing = allAccounts.find(a => 
        a.address.toLowerCase() === ethAddress.toLowerCase() || 
        (a.authMethod === 'metamask' && a.role === role)
      );

      if (!existing) {
        existing = {
          address: ethAddress,
          label: role === 'buyer' ? 'Pembeli (MetaMask EVM)' : role === 'seller' ? 'Penjual (MetaMask UMKM)' : 'Admin (MetaMask Root)',
          role,
          name: role === 'buyer' ? 'MetaMask Buyer (EVM)' : role === 'seller' ? 'Sentra Gadget (MetaMask)' : 'M. Reza (Admin MetaMask)',
          email: `${role}.metamask@escrowchain.id`,
          authMethod: 'metamask',
          balanceSol: role === 'admin' ? 450.0 : role === 'seller' ? 38.25 : 14.50,
          balanceAmn: role === 'admin' ? 250000 : role === 'seller' ? 18500 : 4500,
          balanceUsdc: role === 'admin' ? 95000 : 4200,
          stakedAmn: role === 'admin' ? 85000 : 2500,
          avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${ethAddress}`,
          businessName: role === 'seller' ? 'Sentra Gadget UMKM Official' : role === 'admin' ? 'Otoritas Rekber Smart Contract' : 'Konsumen Terverifikasi MetaMask',
          reputationScore: 99,
          securityPhrase: 'MetaMask-Amanah-Shield-2026'
        };
        setAllAccounts(prev => [...prev, existing!]);
      } else {
        existing = { ...existing, role };
        setAllAccounts(prev => prev.map(a => a.address === existing!.address ? existing! : a));
      }

      setActiveAccountState(existing);
      setUserAuth({
        isLoggedIn: true,
        method: 'metamask',
        email: existing.email,
        displayName: existing.name,
        walletAddress: existing.address,
        role: existing.role,
        securityPhrase: existing.securityPhrase,
        reputationScore: existing.reputationScore,
        stakedAmn: existing.stakedAmn,
        vipTier: role === 'admin' ? 'Amanah VIP Gold' : 'Standard'
      });
      showNotification('success', `Berhasil masuk dengan MetaMask! Akun ${role.toUpperCase()}: ${ethAddress.slice(0, 6)}...${ethAddress.slice(-4)}`);
      return { success: true, address: ethAddress };
    } catch (err: any) {
      showNotification('error', 'Gagal menghubungkan dompet MetaMask: ' + (err?.message || 'Koneksi dibatalkan'));
      return { success: false, error: err?.message };
    }
  };

  const loginWithEmail = async (email: string, name?: string, role: 'buyer' | 'seller' | 'admin' = 'buyer') => {
    let existing = allAccounts.find(a => a.email?.toLowerCase() === email.toLowerCase());
    if (!existing) {
      const generatedAddress = (role === 'admin' ? 'Admn' : role === 'seller' ? 'Sell' : 'Buyr') + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10) + 'Sol';
      existing = {
        address: generatedAddress,
        label: role === 'buyer' ? 'Pembeli (Web2.5)' : role === 'seller' ? 'Penjual (UMKM)' : 'Admin (Vault & DAO)',
        role,
        name: name || (role === 'admin' ? 'Admin Protokol' : email.split('@')[0]),
        email,
        authMethod: 'google',
        balanceSol: role === 'admin' ? 450.0 : role === 'seller' ? 25.0 : 8.5,
        balanceAmn: role === 'admin' ? 250000 : role === 'seller' ? 12000 : 3500,
        balanceUsdc: role === 'admin' ? 95000 : 1500,
        stakedAmn: role === 'admin' ? 85000 : 2500,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
        businessName: role === 'seller' ? `${name || 'Sentra Gadget'} Official` : role === 'admin' ? 'Otoritas Rekber Smart Contract' : 'Konsumen Amanah',
        reputationScore: role === 'admin' ? 100 : 98,
        securityPhrase: 'Amanah-Solana-Shield-2026'
      };
      setAllAccounts(prev => [...prev, existing!]);
    } else if (role && existing.role !== role) {
      existing = { ...existing, role, label: role === 'buyer' ? 'Pembeli (Web2.5)' : role === 'seller' ? 'Penjual (UMKM)' : 'Admin (Vault & DAO)' };
      setAllAccounts(prev => prev.map(a => a.address === existing!.address ? existing! : a));
    }

    setActiveAccountState(existing);
    setUserAuth({
      isLoggedIn: true,
      method: 'email',
      email,
      displayName: existing.name,
      walletAddress: existing.address,
      role: existing.role,
      securityPhrase: existing.securityPhrase,
      reputationScore: existing.reputationScore,
      stakedAmn: existing.stakedAmn,
      vipTier: role === 'admin' ? 'Amanah VIP Gold' : 'Standard'
    });
    showNotification('success', `Berhasil masuk sebagai ${existing.name} (${existing.label}). Solana Keypair aktif.`);
  };

  const registerWithEmail = async (email: string, name: string, role: 'buyer' | 'seller' | 'admin', securityPhrase?: string) => {
    const generatedAddress = (role === 'admin' ? 'Admn' : role === 'seller' ? 'Sell' : 'Amnh') + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10) + 'Sol';
    const newAccount: Web3Account = {
      address: generatedAddress,
      label: role === 'buyer' ? 'Pembeli Terdaftar' : role === 'seller' ? 'Penjual UMKM Resmi' : 'Admin Protocol Terverifikasi',
      role,
      name,
      email,
      authMethod: 'passkey',
      balanceSol: role === 'admin' ? 450.0 : role === 'seller' ? 20.0 : 10.0,
      balanceAmn: role === 'admin' ? 250000 : role === 'seller' ? 10000 : 2000,
      balanceUsdc: role === 'admin' ? 95000 : 1000,
      stakedAmn: role === 'admin' ? 85000 : 1500,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
      businessName: role === 'seller' ? `${name} Official Store` : role === 'admin' ? 'Otoritas Rekber Smart Contract' : 'Konsumen Terdaftar',
      reputationScore: 98,
      securityPhrase: securityPhrase || 'Solana-Amanah-Proteksi-AntiPhishing'
    };
    setAllAccounts(prev => [...prev, newAccount]);
    setActiveAccountState(newAccount);
    setUserAuth({
      isLoggedIn: true,
      method: 'passkey',
      email,
      displayName: name,
      walletAddress: generatedAddress,
      role,
      securityPhrase: newAccount.securityPhrase,
      reputationScore: 98,
      stakedAmn: newAccount.stakedAmn,
      vipTier: role === 'admin' ? 'Amanah VIP Gold' : 'Standard'
    });
    showNotification('success', `Pendaftaran berhasil! Akun ${name} (${newAccount.label}) siap digunakan.`);
  };

  const logout = () => {
    setUserAuth({
      isLoggedIn: false,
      method: null,
      displayName: 'Tamu (Guest)',
      walletAddress: '',
      role: 'buyer'
    });
    localStorage.removeItem('amanah_solana_active_account');
    showNotification('info', 'Anda telah berhasil logout / keluar dari akun EscrowChain.');
  };

  const updateSecurityPhrase = (newPhrase: string) => {
    setActiveAccountState(prev => ({ ...prev, securityPhrase: newPhrase }));
    setUserAuth(prev => ({ ...prev, securityPhrase: newPhrase }));
    showNotification('success', 'Kalimat sandi anti-phishing berhasil diperbarui.');
  };

  const advanceSimulatedTime = (days: number) => {
    const addedMs = days * 86400000;
    setSimulatedTimeOffsetMs(prev => prev + addedMs);
    setCurrentSlot(prev => prev + days * 216000); // ~216,000 slots per day
    showNotification('info', `Waktu simulasi dimajukan +${days} hari. Deadline kontrak diperbarui.`);
  };

  const resetSimulatedTime = () => {
    setSimulatedTimeOffsetMs(0);
    showNotification('info', 'Waktu simulasi dikembalikan ke waktu nyata.');
  };

  const requestSolFaucet = (amountSol: number = 2.0) => {
    setActiveAccountState(prev => ({
      ...prev,
      balanceSol: +(prev.balanceSol + amountSol).toFixed(4)
    }));
    setAllAccounts(prev => prev.map(a => 
      a.address === activeAccount.address ? { ...a, balanceSol: +(a.balanceSol + amountSol).toFixed(4) } : a
    ));
    showNotification('success', `Berhasil meminta airdrop +${amountSol} SOL dari Solana Devnet Faucet!`);
  };

  const requestAmnAirdrop = (amountAmn: number = 500) => {
    setActiveAccountState(prev => ({
      ...prev,
      balanceAmn: prev.balanceAmn + amountAmn
    }));
    setAllAccounts(prev => prev.map(a => 
      a.address === activeAccount.address ? { ...a, balanceAmn: a.balanceAmn + amountAmn } : a
    ));
    showNotification('success', `Berhasil menerima +${amountAmn} AMN Loyalty Token!`);
  };

  // Helper
  const getOrderById = (id: number) => orders.find(o => o.id === id);

  // Penjual Upload Product
  const uploadProduct = async (productData: Omit<ElectronicProduct, 'id' | 'sellerAddress' | 'sellerName' | 'isAvailable'>): Promise<boolean> => {
    const newProduct: ElectronicProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      sellerAddress: activeAccount.address,
      sellerName: activeAccount.businessName || activeAccount.name,
      isAvailable: true
    };
    setProducts(prev => [newProduct, ...prev]);
    showNotification('success', `Produk '${newProduct.name}' berhasil diterbitkan di katalog Solana UMKM.`);
    return true;
  };

  // Penjual Edit Produk
  const updateProduct = async (productId: string, updatedData: Partial<ElectronicProduct>): Promise<boolean> => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, ...updatedData };
      }
      return p;
    }));
    showNotification('success', `Data produk berhasil diperbarui di etalase toko.`);
    return true;
  };

  // Penjual Hapus Produk
  const deleteProduct = async (productId: string): Promise<boolean> => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showNotification('info', `Produk berhasil dihapus dari etalase toko.`);
    return true;
  };

  // Pembeli Membeli Produk
  const buyProduct = async (params: {
    productId: string;
    productName: string;
    variation: string;
    quantity: number;
    amountSol: number;
    sellerAddress: string;
    notes?: string;
  }) => {
    if (isProtocolPaused) {
      showNotification('error', 'Transaksi ditolak: Protocol Circuit Breaker sedang aktif.');
      return { success: false, error: 'Circuit breaker active' };
    }

    if (activeAccount.balanceSol < params.amountSol) {
      showNotification('error', `Saldo SOL tidak cukup. Dibutuhkan ${params.amountSol} SOL, saldo saat ini ${activeAccount.balanceSol.toFixed(2)} SOL.`);
      return { success: false, error: 'Insufficient SOL' };
    }

    const orderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 101;
    const txHash = generateSolanaTxSignature();
    const pdaAddress = generateSolanaPda(orderId);
    const vaultPda = pdaAddress + 'Vault';

    const deadlineDays = 4;
    const deadlineTimestamp = currentSimulatedTime + deadlineDays * 86400000;
    const deadlineSlot = currentSlot + deadlineDays * 216000;
    const amountAmn = Math.round(params.amountSol * SOL_TO_AMN_RATE);
    const amountIdr = Math.round(params.amountSol * SOL_IDR_RATE);

    const newOrder: EscrowOrder = {
      id: orderId,
      initiator: 'buyer',
      buyer: activeAccount.address,
      seller: params.sellerAddress,
      arbiter: PRESET_ACCOUNTS[2].address, // Admin/DAO Treasury
      adminAddress: PRESET_ACCOUNTS[2].address,
      pdaAddress,
      vaultPda,
      amountSol: params.amountSol,
      amountAmn,
      amountIdr,
      gasFeeSol: SOLANA_GAS_FEE_SOL,
      gasSavedComparedToEthIdr: ETH_EQUIVALENT_GAS_IDR - Math.round(SOLANA_GAS_FEE_SOL * SOL_IDR_RATE),
      isDefiYieldActive: true,
      defiStrategy: 'Kamino SOL Yield',
      apyPercent: 6.8,
      yieldAccruedSol: 0,
      yieldAccruedAmn: 0,
      buyerYieldShare: 0,
      sellerYieldShare: 0,
      protocolBurnShare: 0,
      deadlineTimestamp,
      deadlineSlot,
      daysToDeadline: deadlineDays,
      autoRefundTriggerable: false,
      securityProofHash: 'sha256_' + Math.random().toString(36).substring(2, 18),
      antiPhishingVerified: true,
      status: OrderStatus.Funded,
      desc: `Pembelian ${params.productName} (${params.variation} x${params.quantity}) dengan perlindungan Solana Escrow PDA & DeFi Yield Streaming.`,
      productName: params.productName,
      category: 'Smartphone',
      selectedVariation: params.variation,
      quantity: params.quantity,
      adminHeldTokenStatus: 'HELD_IN_PDA',
      adminNotes: `Dana ${params.amountSol} SOL dikunci di PDA [b"escrow", ${orderId}]. Kamino Yield Vault aktif (6.8% APY).`,
      createdAt: currentSimulatedTime,
      txHashCreated: txHash,
      txHistory: [
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 12450,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'initialize_escrow_pda',
          from: activeAccount.address,
          to: pdaAddress,
          valueSol: params.amountSol,
          timestamp: currentSimulatedTime,
          statusFrom: OrderStatus.Draft,
          statusTo: OrderStatus.Funded,
          note: `Pembeli mendepositkan ${params.amountSol} SOL ke PDA Escrow. Gas fee 0.000005 SOL.`
        }
      ]
    };

    // Deduct SOL from buyer
    setActiveAccountState(prev => ({
      ...prev,
      balanceSol: +(prev.balanceSol - params.amountSol).toFixed(4)
    }));

    setOrders(prev => [newOrder, ...prev]);

    showNotification(
      'success',
      `Pesanan #${orderId} berhasil dibuat! ${params.amountSol} SOL dikunci di Solana PDA Vault. Biaya gas hanya Rp 12!`,
      txHash
    );

    return { success: true, orderId, txHash };
  };

  // Penjual Konfirmasi Pesanan
  const sellerConfirmOrder = async (orderId: number) => {
    const order = getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const txHash = generateSolanaTxSignature();
    const updatedOrder: EscrowOrder = {
      ...order,
      status: OrderStatus.ConfirmedBySeller,
      txHistory: [
        ...order.txHistory,
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 8900,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'seller_confirm_order',
          from: activeAccount.address,
          to: order.pdaAddress,
          valueSol: 0,
          timestamp: currentSimulatedTime,
          statusFrom: order.status,
          statusTo: OrderStatus.ConfirmedBySeller,
          note: 'Penjual memverifikasi stok dan menyiapkan barang pesanan.'
        }
      ]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification('success', `Pesanan #${orderId} dikonfirmasi penjual. Siap dikirim!`, txHash);
    return { success: true, txHash };
  };

  // Penjual Laporkan Barang Tidak Ada (Refund Otomatis ke Pembeli)
  const sellerReportUnavailable = async (orderId: number, reason: string) => {
    const order = getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const txHash = generateSolanaTxSignature();
    const updatedOrder: EscrowOrder = {
      ...order,
      status: OrderStatus.Refunded,
      outOfStockReason: reason,
      adminHeldTokenStatus: 'REFUNDED_TO_BUYER',
      txHistory: [
        ...order.txHistory,
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 11000,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'seller_report_unavailable',
          from: activeAccount.address,
          to: order.pdaAddress,
          valueSol: order.amountSol,
          timestamp: currentSimulatedTime,
          statusFrom: order.status,
          statusTo: OrderStatus.Refunded,
          note: `Penjual membatalkan: "${reason}". Dana ${order.amountSol} SOL dikembalikan ke pembeli.`
        }
      ]
    };

    // Return funds to buyer
    setAllAccounts(prev => prev.map(acc => {
      if (acc.address.toLowerCase() === order.buyer.toLowerCase()) {
        return { ...acc, balanceSol: +(acc.balanceSol + order.amountSol).toFixed(4) };
      }
      return acc;
    }));

    if (activeAccount.address.toLowerCase() === order.buyer.toLowerCase()) {
      setActiveAccountState(prev => ({ ...prev, balanceSol: +(prev.balanceSol + order.amountSol).toFixed(4) }));
    }

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification('info', `Barang tidak tersedia. ${order.amountSol} SOL langsung dikembalikan ke pembeli!`, txHash);
    return { success: true, txHash };
  };

  // Penjual Kirim Barang (Input Resi & Upload Bukti On-Chain)
  const markShipped = async (orderId: number, courierTracking: string = 'JNE-SOL-' + Math.floor(10000000 + Math.random() * 90000000), courierName: string = 'JNE Express Cargo') => {
    const order = getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const txHash = generateSolanaTxSignature();
    const proofHash = 'ipfs_bafy_' + Math.random().toString(36).substring(2, 20);

    const updatedOrder: EscrowOrder = {
      ...order,
      status: OrderStatus.Shipped,
      courierName,
      courierTracking,
      securityProofHash: proofHash,
      txHistory: [
        ...order.txHistory,
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 11200,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'mark_shipped_with_proof',
          from: activeAccount.address,
          to: order.pdaAddress,
          valueSol: 0,
          timestamp: currentSimulatedTime,
          statusFrom: order.status,
          statusTo: OrderStatus.Shipped,
          note: `Resi ${courierTracking} (${courierName}) dan bukti pengiriman tersimpan on-chain.`
        }
      ]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification('success', `Pesanan #${orderId} telah dikirim! Resi: ${courierTracking}`, txHash);
    return { success: true, txHash };
  };

  // Pembeli Konfirmasi Barang Diterima & Distribusi Hasil DeFi Yield
  const confirmOrderCompleted = async (orderId: number) => {
    const order = getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const txHash = generateSolanaTxSignature();

    // Hitung DeFi Yield yang terkumpul selama pengiriman
    // Formula: (amountSol * APY 6.8% * days / 365)
    const transitDays = Math.max(1, Math.round((currentSimulatedTime - order.createdAt) / 86400000));
    const yieldSol = +((order.amountSol * (order.apyPercent / 100) * (transitDays / 365))).toFixed(5);
    const yieldAmn = +(yieldSol * SOL_TO_AMN_RATE).toFixed(2);

    const buyerYieldShare = +(yieldAmn * 0.40).toFixed(2);   // 40% loyalty cashback
    const sellerYieldShare = +(yieldSol * 0.40).toFixed(5);  // 40% seller fulfillment bonus in SOL
    const burnAmnShare = +(yieldAmn * 0.20).toFixed(2);      // 20% burned protocol

    const updatedOrder: EscrowOrder = {
      ...order,
      status: OrderStatus.Completed,
      yieldAccruedSol: yieldSol,
      yieldAccruedAmn: yieldAmn,
      buyerYieldShare,
      sellerYieldShare: sellerYieldShare * SOL_TO_AMN_RATE,
      protocolBurnShare: burnAmnShare,
      adminHeldTokenStatus: 'RELEASED_TO_SELLER',
      adminReleasedAt: currentSimulatedTime,
      adminReleasedBy: activeAccount.address,
      txHistory: [
        ...order.txHistory,
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 19800,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'confirm_received_and_distribute_yield',
          from: activeAccount.address,
          to: order.pdaAddress,
          valueSol: order.amountSol,
          timestamp: currentSimulatedTime,
          statusFrom: order.status,
          statusTo: OrderStatus.Completed,
          note: `Pelepasan Sukses: ${order.amountSol} SOL pokok + ${sellerYieldShare} SOL bonus yield ke penjual. Pembeli dapat cashback ${buyerYieldShare} AMN. Dibakar ${burnAmnShare} AMN.`
        }
      ]
    };

    // Credit seller with SOL + yield bonus
    setAllAccounts(prev => prev.map(acc => {
      if (acc.address.toLowerCase() === order.seller.toLowerCase()) {
        return {
          ...acc,
          balanceSol: +(acc.balanceSol + order.amountSol + sellerYieldShare).toFixed(4),
          reputationScore: Math.min(100, acc.reputationScore + 1)
        };
      }
      if (acc.address.toLowerCase() === order.buyer.toLowerCase()) {
        return {
          ...acc,
          balanceAmn: +(acc.balanceAmn + buyerYieldShare).toFixed(2)
        };
      }
      return acc;
    }));

    if (activeAccount.address.toLowerCase() === order.seller.toLowerCase()) {
      setActiveAccountState(prev => ({
        ...prev,
        balanceSol: +(prev.balanceSol + order.amountSol + sellerYieldShare).toFixed(4)
      }));
    } else if (activeAccount.address.toLowerCase() === order.buyer.toLowerCase()) {
      setActiveAccountState(prev => ({
        ...prev,
        balanceAmn: +(prev.balanceAmn + buyerYieldShare).toFixed(2)
      }));
    }

    // Burn AMN in tokenomics
    setTokenomics(prev => ({
      ...prev,
      totalBurned: Math.round(prev.totalBurned + burnAmnShare),
      circulatingSupply: Math.round(prev.circulatingSupply - burnAmnShare)
    }));

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification(
      'success',
      `Pesanan #${orderId} Selesai! ${order.amountSol} SOL dilepas ke Penjual + Anda menerima cashback ${buyerYieldShare} AMN!`,
      txHash
    );

    return { success: true, txHash };
  };

  // Pembeli Ajukan Refund / Sengketa
  const buyerRequestRefund = async (orderId: number, reason: string, proofNote?: string) => {
    const order = getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const txHash = generateSolanaTxSignature();
    const updatedOrder: EscrowOrder = {
      ...order,
      status: OrderStatus.RefundRequested,
      refundReason: reason,
      refundProofNote: proofNote || 'Bukti video unboxing tersimpan di decentralized storage.',
      disputeReason: reason,
      txHistory: [
        ...order.txHistory,
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 14200,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'buyer_request_refund',
          from: activeAccount.address,
          to: order.pdaAddress,
          valueSol: 0,
          timestamp: currentSimulatedTime,
          statusFrom: order.status,
          statusTo: OrderStatus.RefundRequested,
          note: `Pembeli melaporkan barang tidak sesuai: "${reason}". Pengembalian dana memerlukan konfirmasi oleh Admin Rekber.`
        }
      ]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification('info', `Komplain barang tidak sesuai diajukan! Diperlukan konfirmasi oleh Admin untuk pengembalian dananya.`, txHash);
    return { success: true, txHash };
  };

  // Auto-Refund Deadline Timeout Protection
  const claimTimeoutRefund = async (orderId: number) => {
    const order = getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    if (currentSimulatedTime < order.deadlineTimestamp) {
      showNotification('error', `Batas waktu deadline belum tercapai. Sisa waktu masih aktif.`);
      return { success: false, error: 'Deadline not reached' };
    }

    if (order.status === OrderStatus.Shipped) {
      showNotification('error', 'Penjual sudah memasukkan resi pengiriman. Gunakan menu komplain sengketa.');
      return { success: false, error: 'Already shipped' };
    }

    const txHash = generateSolanaTxSignature();
    const updatedOrder: EscrowOrder = {
      ...order,
      status: OrderStatus.Refunded,
      adminHeldTokenStatus: 'REFUNDED_TO_BUYER',
      txHistory: [
        ...order.txHistory,
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 13500,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'claim_auto_refund_timeout',
          from: activeAccount.address,
          to: order.pdaAddress,
          valueSol: order.amountSol,
          timestamp: currentSimulatedTime,
          statusFrom: order.status,
          statusTo: OrderStatus.Refunded,
          note: `Proteksi Auto-Refund Solana: Batas waktu lewat tanpa pengiriman. ${order.amountSol} SOL kembali ke pembeli.`
        }
      ]
    };

    // Return funds
    setAllAccounts(prev => prev.map(acc => {
      if (acc.address.toLowerCase() === order.buyer.toLowerCase()) {
        return { ...acc, balanceSol: +(acc.balanceSol + order.amountSol).toFixed(4) };
      }
      return acc;
    }));

    if (activeAccount.address.toLowerCase() === order.buyer.toLowerCase()) {
      setActiveAccountState(prev => ({ ...prev, balanceSol: +(prev.balanceSol + order.amountSol).toFixed(4) }));
    }

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification('success', `Auto-Refund Berhasil! ${order.amountSol} SOL dikembalikan ke dompet pembeli secara otomatis.`, txHash);
    return { success: true, txHash };
  };

  // AMN Staking
  const stakeAmnTokens = async (amountAmn: number) => {
    if (activeAccount.balanceAmn < amountAmn) {
      showNotification('error', 'Saldo AMN tidak mencukupi untuk staking.');
      return { success: false };
    }

    const txHash = generateSolanaTxSignature();
    setActiveAccountState(prev => ({
      ...prev,
      balanceAmn: +(prev.balanceAmn - amountAmn).toFixed(2),
      stakedAmn: +(prev.stakedAmn + amountAmn).toFixed(2)
    }));

    setTokenomics(prev => ({
      ...prev,
      stakedSupply: prev.stakedSupply + amountAmn,
      circulatingSupply: prev.circulatingSupply - amountAmn
    }));

    showNotification('success', `Berhasil staking ${amountAmn} AMN! Anda kini menikmati diskon gas fee 50% & APR 11.2%!`, txHash);
    return { success: true, txHash };
  };

  const unstakeAmnTokens = async (amountAmn: number) => {
    if (activeAccount.stakedAmn < amountAmn) {
      showNotification('error', 'Jumlah staked AMN tidak mencukupi.');
      return { success: false };
    }

    const txHash = generateSolanaTxSignature();
    setActiveAccountState(prev => ({
      ...prev,
      balanceAmn: +(prev.balanceAmn + amountAmn).toFixed(2),
      stakedAmn: +(prev.stakedAmn - amountAmn).toFixed(2)
    }));

    setTokenomics(prev => ({
      ...prev,
      stakedSupply: prev.stakedSupply - amountAmn,
      circulatingSupply: prev.circulatingSupply + amountAmn
    }));

    showNotification('info', `Unstake ${amountAmn} AMN berhasil. Token kembali ke saldo aktif.`, txHash);
    return { success: true, txHash };
  };

  // Token Swap DEX
  const swapTokens = async (fromToken: 'SOL' | 'AMN' | 'USDC', toToken: 'SOL' | 'AMN' | 'USDC', amountFrom: number) => {
    if (fromToken === toToken) return { success: false, receivedAmount: 0 };

    let receivedAmount = 0;
    if (fromToken === 'SOL' && toToken === 'AMN') {
      receivedAmount = +(amountFrom * SOL_TO_AMN_RATE).toFixed(2);
      if (activeAccount.balanceSol < amountFrom) {
        showNotification('error', 'Saldo SOL tidak mencukupi.');
        return { success: false, receivedAmount: 0 };
      }
      setActiveAccountState(prev => ({
        ...prev,
        balanceSol: +(prev.balanceSol - amountFrom).toFixed(4),
        balanceAmn: +(prev.balanceAmn + receivedAmount).toFixed(2)
      }));
    } else if (fromToken === 'AMN' && toToken === 'SOL') {
      receivedAmount = +(amountFrom / SOL_TO_AMN_RATE).toFixed(4);
      if (activeAccount.balanceAmn < amountFrom) {
        showNotification('error', 'Saldo AMN tidak mencukupi.');
        return { success: false, receivedAmount: 0 };
      }
      setActiveAccountState(prev => ({
        ...prev,
        balanceAmn: +(prev.balanceAmn - amountFrom).toFixed(2),
        balanceSol: +(prev.balanceSol + receivedAmount).toFixed(4)
      }));
    } else if (fromToken === 'USDC' && toToken === 'AMN') {
      receivedAmount = +(amountFrom * (SOL_IDR_RATE / 16000 / (AMN_IDR_RATE / 16000))).toFixed(2);
      if (activeAccount.balanceUsdc < amountFrom) {
        showNotification('error', 'Saldo USDC tidak mencukupi.');
        return { success: false, receivedAmount: 0 };
      }
      setActiveAccountState(prev => ({
        ...prev,
        balanceUsdc: +(prev.balanceUsdc - amountFrom).toFixed(2),
        balanceAmn: +(prev.balanceAmn + receivedAmount).toFixed(2)
      }));
    }

    const txHash = generateSolanaTxSignature();
    showNotification('success', `Swap Berhasil! Ditukar ${amountFrom} ${fromToken} → ${receivedAmount} ${toToken}. Fee: 0.000005 SOL.`, txHash);
    return { success: true, receivedAmount, txHash };
  };

  // ADMIN ACTIONS
  const adminReleaseFundsToSeller = async (orderId: number, adminNotes?: string) => {
    const order = getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const txHash = generateSolanaTxSignature();
    const updatedOrder: EscrowOrder = {
      ...order,
      status: OrderStatus.Completed,
      adminHeldTokenStatus: 'RELEASED_TO_SELLER',
      adminNotes: adminNotes || 'Otoritas Admin Escrow melepas dana ke Penjual setelah pemeriksaan validasi.',
      adminReleasedAt: currentSimulatedTime,
      adminReleasedBy: activeAccount.address,
      txHistory: [
        ...order.txHistory,
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 18500,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'confirm_received_and_distribute_yield',
          from: activeAccount.address,
          to: order.pdaAddress,
          valueSol: order.amountSol,
          timestamp: currentSimulatedTime,
          statusFrom: order.status,
          statusTo: OrderStatus.Completed,
          note: `Admin Protocol melepas ${order.amountSol} SOL ke Penjual (${order.seller.slice(0, 8)}...).`
        }
      ]
    };

    setAllAccounts(prev => prev.map(acc => {
      if (acc.address.toLowerCase() === order.seller.toLowerCase()) {
        return { ...acc, balanceSol: +(acc.balanceSol + order.amountSol).toFixed(4) };
      }
      return acc;
    }));

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification('success', `Admin berhasil melepas dana ${order.amountSol} SOL ke Penjual!`, txHash);
    return { success: true, txHash };
  };

  const adminReleaseRefundToBuyer = async (orderId: number, adminNotes?: string) => {
    const order = getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const txHash = generateSolanaTxSignature();
    const updatedOrder: EscrowOrder = {
      ...order,
      status: OrderStatus.Refunded,
      adminHeldTokenStatus: 'REFUNDED_TO_BUYER',
      adminNotes: adminNotes || 'Otoritas Admin menyetujui refund 100% kembali ke Pembeli.',
      adminReleasedAt: currentSimulatedTime,
      adminReleasedBy: activeAccount.address,
      txHistory: [
        ...order.txHistory,
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 16500,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'claim_auto_refund_timeout',
          from: activeAccount.address,
          to: order.pdaAddress,
          valueSol: order.amountSol,
          timestamp: currentSimulatedTime,
          statusFrom: order.status,
          statusTo: OrderStatus.Refunded,
          note: `Admin Protocol menyetujui refund: ${order.amountSol} SOL dikembalikan ke Pembeli.`
        }
      ]
    };

    setAllAccounts(prev => prev.map(acc => {
      if (acc.address.toLowerCase() === order.buyer.toLowerCase()) {
        return { ...acc, balanceSol: +(acc.balanceSol + order.amountSol).toFixed(4) };
      }
      return acc;
    }));

    if (activeAccount.address.toLowerCase() === order.buyer.toLowerCase()) {
      setActiveAccountState(prev => ({ ...prev, balanceSol: +(prev.balanceSol + order.amountSol).toFixed(4) }));
    }

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification('success', `Admin mengonfirmasi pengembalian dana: ${order.amountSol} SOL berhasil di-refund ke dompet Pembeli!`, txHash);
    return { success: true, txHash };
  };

  const adminTriggerBuybackBurn = async (amountAmn: number) => {
    const txHash = generateSolanaTxSignature();
    setTokenomics(prev => ({
      ...prev,
      totalBurned: prev.totalBurned + amountAmn,
      circulatingSupply: prev.circulatingSupply - amountAmn,
      buybackPoolSol: +(prev.buybackPoolSol - (amountAmn / SOL_TO_AMN_RATE)).toFixed(2)
    }));
    showNotification('success', `Buyback & Burn On-Chain Berhasil! ${amountAmn.toLocaleString()} AMN dibakar permanen via Solana SPL Burn Instruction!`, txHash);
    return { success: true, txHash };
  };

  const adminToggleCircuitBreaker = () => {
    setIsProtocolPaused(prev => !prev);
    showNotification(
      !isProtocolPaused ? 'error' : 'success',
      !isProtocolPaused ? 'EMERGENCY: Circuit Breaker DIAKTIFKAN. Seluruh deposit Solana dibekukan sementara.' : 'Circuit Breaker DINONAKTIFKAN. Operasional normal dipulihkan.'
    );
  };

  const adminVoteDisputeTribunal = async (orderId: number, judgeName: string, vote: 'release_to_seller' | 'refund_to_buyer') => {
    const order = getOrderById(orderId);
    if (!order) return { success: false };

    const txHash = generateSolanaTxSignature();
    const existingVotes = order.tribunalVotes || [];
    const newVotes = [...existingVotes, { judge: judgeName, vote, timestamp: currentSimulatedTime }];

    // If quorum reached (>= 2 votes for same resolution)
    const sellerVotes = newVotes.filter(v => v.vote === 'release_to_seller').length;
    const buyerVotes = newVotes.filter(v => v.vote === 'refund_to_buyer').length;

    let updatedOrder: EscrowOrder = {
      ...order,
      tribunalVotes: newVotes
    };

    if (sellerVotes >= 2) {
      updatedOrder.status = OrderStatus.Completed;
      updatedOrder.adminHeldTokenStatus = 'RELEASED_TO_SELLER';
      updatedOrder.resolutionNotes = `Tribunal Multi-Sig memutuskan memenangkan Penjual (${sellerVotes} dari 3 suara).`;
      setAllAccounts(prev => prev.map(acc => {
        if (acc.address.toLowerCase() === order.seller.toLowerCase()) {
          return { ...acc, balanceSol: +(acc.balanceSol + order.amountSol).toFixed(4) };
        }
        return acc;
      }));
    } else if (buyerVotes >= 2) {
      updatedOrder.status = OrderStatus.Refunded;
      updatedOrder.adminHeldTokenStatus = 'REFUNDED_TO_BUYER';
      updatedOrder.resolutionNotes = `Tribunal Multi-Sig memutuskan memenangkan Pembeli (${buyerVotes} dari 3 suara).`;
      setAllAccounts(prev => prev.map(acc => {
        if (acc.address.toLowerCase() === order.buyer.toLowerCase()) {
          return { ...acc, balanceSol: +(acc.balanceSol + order.amountSol).toFixed(4) };
        }
        return acc;
      }));
    }

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification('success', `Suara validator '${judgeName}' tercatat di pengadilan multi-sig.`, txHash);
    return { success: true, txHash };
  };

  // Compatibility / Sequence Diagram methods
  const createOrderAsBuyer = async (params: {
    seller: string;
    desc: string;
    daysToDeadline: number;
    amountSol: number;
    productName: string;
    category: string;
  }) => {
    return buyProduct({
      productId: 'custom-buyer',
      productName: params.productName,
      variation: 'Custom Request',
      quantity: 1,
      amountSol: params.amountSol,
      sellerAddress: params.seller,
      notes: params.desc
    });
  };

  const sellerCreateInvoice = async (params: {
    buyer: string;
    desc: string;
    daysToDeadline: number;
    amountSol: number;
    productName: string;
    category: string;
  }) => {
    const orderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 101;
    const txHash = generateSolanaTxSignature();
    const pdaAddress = generateSolanaPda(orderId);

    const deadlineTimestamp = currentSimulatedTime + params.daysToDeadline * 86400000;
    const deadlineSlot = currentSlot + params.daysToDeadline * 216000;

    const newOrder: EscrowOrder = {
      id: orderId,
      initiator: 'seller',
      buyer: params.buyer,
      seller: activeAccount.address,
      arbiter: PRESET_ACCOUNTS[2].address,
      adminAddress: PRESET_ACCOUNTS[2].address,
      pdaAddress,
      vaultPda: pdaAddress + 'Vault',
      amountSol: params.amountSol,
      amountAmn: Math.round(params.amountSol * SOL_TO_AMN_RATE),
      amountIdr: Math.round(params.amountSol * SOL_IDR_RATE),
      gasFeeSol: SOLANA_GAS_FEE_SOL,
      gasSavedComparedToEthIdr: ETH_EQUIVALENT_GAS_IDR - 12,
      isDefiYieldActive: true,
      defiStrategy: 'Kamino SOL Yield',
      apyPercent: 6.8,
      yieldAccruedSol: 0,
      yieldAccruedAmn: 0,
      buyerYieldShare: 0,
      sellerYieldShare: 0,
      protocolBurnShare: 0,
      deadlineTimestamp,
      deadlineSlot,
      daysToDeadline: params.daysToDeadline,
      autoRefundTriggerable: false,
      antiPhishingVerified: true,
      status: OrderStatus.Draft, // Menunggu deposit pembeli
      desc: params.desc,
      productName: params.productName,
      category: params.category,
      quantity: 1,
      adminHeldTokenStatus: 'HELD_IN_PDA',
      createdAt: currentSimulatedTime,
      txHashCreated: txHash,
      txHistory: [
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 9400,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'initialize_escrow_pda',
          from: activeAccount.address,
          to: pdaAddress,
          valueSol: 0,
          timestamp: currentSimulatedTime,
          statusFrom: OrderStatus.Draft,
          statusTo: OrderStatus.Draft,
          note: `Penjual menerbitkan invoice on-chain #${orderId} sebesar ${params.amountSol} SOL.`
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    showNotification('success', `Invoice #${orderId} berhasil diterbitkan untuk pembeli!`, txHash);
    return { success: true, orderId, txHash };
  };

  const depositSolTokens = async (orderId: number) => {
    const order = getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    if (activeAccount.balanceSol < order.amountSol) {
      showNotification('error', `Saldo SOL (${activeAccount.balanceSol} SOL) tidak cukup.`);
      return { success: false, error: 'Insufficient balance' };
    }

    const txHash = generateSolanaTxSignature();
    const updatedOrder: EscrowOrder = {
      ...order,
      status: OrderStatus.Funded,
      txHistory: [
        ...order.txHistory,
        {
          txHash,
          slotNumber: currentSlot,
          computeUnitsUsed: 13000,
          feeSol: SOLANA_GAS_FEE_SOL,
          method: 'deposit_sol_with_yield',
          from: activeAccount.address,
          to: order.pdaAddress,
          valueSol: order.amountSol,
          timestamp: currentSimulatedTime,
          statusFrom: order.status,
          statusTo: OrderStatus.Funded,
          note: `Pembeli membayar ${order.amountSol} SOL ke PDA Escrow. Kamino Yield Pool aktif.`
        }
      ]
    };

    setActiveAccountState(prev => ({ ...prev, balanceSol: +(prev.balanceSol - order.amountSol).toFixed(4) }));
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    showNotification('success', `Deposit ${order.amountSol} SOL berhasil ke Solana Vault!`, txHash);
    return { success: true, txHash };
  };

  return (
    <Web3Context.Provider
      value={{
        orders,
        products,
        activeAccount,
        allAccounts,
        userAuth,
        tokenomics,
        isProtocolPaused,
        currentSlot,
        simulatedTimeOffsetMs,
        currentSimulatedTime,
        notification,
        loginWithWallet,
        loginWithMetaMask,
        loginWithEmail,
        registerWithEmail,
        logout,
        setActiveAccount,
        updateSecurityPhrase,
        advanceSimulatedTime,
        resetSimulatedTime,
        dismissNotification,
        requestSolFaucet,
        requestAmnAirdrop,
        uploadProduct,
        updateProduct,
        deleteProduct,
        sellerConfirmOrder,
        sellerReportUnavailable,
        markShipped,
        buyProduct,
        confirmOrderCompleted,
        buyerRequestRefund,
        claimTimeoutRefund,
        stakeAmnTokens,
        unstakeAmnTokens,
        swapTokens,
        adminReleaseFundsToSeller,
        adminReleaseRefundToBuyer,
        adminTriggerBuybackBurn,
        adminToggleCircuitBreaker,
        adminVoteDisputeTribunal,
        getOrderById,
        createOrderAsBuyer,
        sellerCreateInvoice,
        depositSolTokens
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
